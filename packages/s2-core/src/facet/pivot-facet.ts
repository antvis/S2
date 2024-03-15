import { Group, Rect, type LineStyleProps } from '@antv/g';
import {
  filter,
  forEach,
  get,
  isArray,
  isEmpty,
  isNumber,
  keys,
  last,
  map,
  max,
  maxBy,
  merge,
  reduce,
  size,
  sumBy,
} from 'lodash';
import { ColCell, RowCell, SeriesNumberCell } from '../cell';
import {
  DEFAULT_TREE_ROW_CELL_WIDTH,
  FRONT_GROUND_GROUP_FROZEN_Z_INDEX,
  FrozenGroupType,
  KEY_GROUP_FROZEN_SPLIT_LINE,
  LAYOUT_SAMPLE_COUNT,
  SPLIT_LINE_WIDTH,
  type IconTheme,
  type MultiData,
  type ViewMeta,
} from '../common';
import { EXTRA_FIELD, LayoutWidthType, VALUE_FIELD } from '../common/constant';
import { CellType } from '../common/constant/interaction';
import { DebuggerUtil } from '../common/debug';
import type { LayoutResult, SimpleData } from '../common/interface';
import type { PivotDataSet } from '../data-set/pivot-data-set';
import { renderLine, safeJsonParse } from '../utils';
import { getDataCellId } from '../utils/cell/data-cell';
import { getActionIconConfig } from '../utils/cell/header-cell';
import { getIndexRangeWithOffsets } from '../utils/facet';
import { getRowsForGrid } from '../utils/grid';
import { floor } from '../utils/math';
import { getCellWidth } from '../utils/text';
import { FrozenFacet } from './frozen-facet';
import { Frame } from './header';
import { buildHeaderHierarchy } from './layout/build-header-hierarchy';
import type { Hierarchy } from './layout/hierarchy';
import { layoutCoordinate } from './layout/layout-hooks';
import { Node } from './layout/node';
import { getFrozenRowCfgPivot } from './utils';

export class PivotFacet extends FrozenFacet {
  get rowCellTheme() {
    return this.spreadsheet.theme.rowCell!.cell;
  }

  protected doLayout(): LayoutResult {
    const { rowLeafNodes, colLeafNodes, rowsHierarchy, colsHierarchy } =
      this.buildAllHeaderHierarchy();

    this.calculateHeaderNodesCoordinate({
      rowLeafNodes,
      rowsHierarchy,
      colLeafNodes,
      colsHierarchy,
    } as LayoutResult);

    return {
      colNodes: colsHierarchy.getNodes(),
      colsHierarchy,
      rowNodes: rowsHierarchy.getNodes(),
      rowsHierarchy,
      rowLeafNodes,
      colLeafNodes,
    };
  }

  private buildAllHeaderHierarchy() {
    const { leafNodes: rowLeafNodes, hierarchy: rowsHierarchy } =
      buildHeaderHierarchy({
        isRowHeader: true,
        spreadsheet: this.spreadsheet,
      });
    const { leafNodes: colLeafNodes, hierarchy: colsHierarchy } =
      buildHeaderHierarchy({
        isRowHeader: false,
        spreadsheet: this.spreadsheet,
      });

    return {
      rowLeafNodes,
      colLeafNodes,
      rowsHierarchy,
      colsHierarchy,
    };
  }

  /**
   * 根据行列索引获取单元格元数据
   */
  public getCellMeta(rowIndex = 0, colIndex = 0) {
    const { options, dataSet } = this.spreadsheet;
    const { rowLeafNodes, colLeafNodes } = this.getLayoutResult();
    const row = rowLeafNodes[rowIndex];
    const col = colLeafNodes[colIndex];

    if (!row || !col) {
      return null;
    }

    const rowQuery = row.query;
    const colQuery = col.query;
    const isTotals =
      row.isTotals || row.isTotalMeasure || col.isTotals || col.isTotalMeasure;

    const hideMeasure = options.style?.colCell?.hideValue ?? false;

    /*
     * 如果在非自定义目录情况下hide measure query中是没有度量信息的，所以需要自动补上
     * 存在一个场景的冲突，如果是多个度量，定位数据数据是无法知道哪一列代表什么
     * 因此默认只会去 第一个度量拼接query
     */
    const measureInfo = hideMeasure
      ? {
          [EXTRA_FIELD]: dataSet.fields.values?.[0],
        }
      : {};
    const dataQuery = merge({}, rowQuery, colQuery, measureInfo);
    const data = dataSet.getCellData({
      query: dataQuery,
      rowNode: row,
      isTotals,
    });

    const valueField = dataQuery[EXTRA_FIELD]!;
    const fieldValue = get(data, VALUE_FIELD, null);

    const cellMeta: ViewMeta = {
      spreadsheet: this.spreadsheet,
      x: col.x,
      y: row.y,
      width: col.width,
      height: row.height,
      data,
      rowIndex,
      colIndex,
      isTotals,
      valueField,
      fieldValue,
      rowQuery,
      colQuery,
      rowId: row.id,
      colId: col.id,
      id: getDataCellId(row.id, col.id),
    };

    return options.layoutCellMeta?.(cellMeta) ?? cellMeta;
  }

  private getPreLevelSampleNode(colNode: Node, colsHierarchy: Hierarchy) {
    // 之前是采样每一级第一个节点, 现在 sampleNodesForAllLevels 是采样每一级高度最大的节点
    // 但是初始化布局时只有第一个节点有值, 所以这里需要适配下
    return colsHierarchy
      .getNodes(colNode.level - 1)
      .find((node) => !node.isTotals);
  }

  private calculateHeaderNodesCoordinate(layoutResult: LayoutResult) {
    this.calculateRowNodesCoordinate(layoutResult);
    this.calculateColNodesCoordinate(layoutResult);
  }

  /**
   * Calculate all col header related coordinate
   * height, width, x, y
   * colsHierarchy's height
   * colsHierarchy's width
   */
  private calculateColNodesCoordinate(layoutResult: LayoutResult) {
    const { rowLeafNodes, colLeafNodes, rowsHierarchy, colsHierarchy } =
      layoutResult;

    this.updateColsHierarchySampleMaxHeightNodes(colsHierarchy);

    let preLeafNode = Node.blankNode();
    let currentColIndex = 0;

    const colNodes = colsHierarchy.getNodes();

    colNodes.forEach((currentNode) => {
      if (currentNode.isLeaf) {
        currentNode.colIndex = currentColIndex;
        currentColIndex += 1;
        currentNode.x = preLeafNode.x + preLeafNode.width;
        currentNode.width = this.calculateColLeafNodesWidth(
          currentNode,
          colLeafNodes,
          rowLeafNodes,
          rowsHierarchy.width,
        );
        colsHierarchy.width += currentNode.width;
        preLeafNode = currentNode;
      }

      if (currentNode.level === 0) {
        currentNode.y = 0;
      } else {
        const preLevelSample = this.getPreLevelSampleNode(
          currentNode,
          colsHierarchy,
        );

        currentNode.y = preLevelSample?.y! + preLevelSample?.height! ?? 0;
      }

      // 数值置于行头时, 列头的总计即叶子节点, 此时应该用列高: https://github.com/antvis/S2/issues/1715
      const colNodeHeight = this.getColNodeHeight(currentNode, colsHierarchy);

      currentNode.height =
        currentNode.isGrandTotals &&
        !currentNode.isTotalMeasure &&
        currentNode.isLeaf
          ? colsHierarchy.height
          : colNodeHeight;

      layoutCoordinate(this.spreadsheet, null, currentNode);
    });

    this.updateCustomFieldsSampleNodes(colsHierarchy);
    this.adjustColLeafNodesHeight({
      leafNodes: colLeafNodes,
      hierarchy: colsHierarchy,
    });
    this.autoCalculateColNodeWidthAndX(colLeafNodes);

    if (!isEmpty(this.spreadsheet.options.totals?.col)) {
      this.adjustTotalNodesCoordinate({
        hierarchy: colsHierarchy,
        isRowHeader: false,
        isSubTotal: true,
      });
      this.adjustTotalNodesCoordinate({
        hierarchy: colsHierarchy,
        isRowHeader: false,
        isSubTotal: false,
      });
    }
  }

  // please read README-adjustTotalNodesCoordinate.md to understand this function
  private getMultipleMap(
    hierarchy: Hierarchy,
    isRowHeader?: boolean,
    isSubTotal?: boolean,
  ) {
    const { maxLevel } = hierarchy;
    const dataSet = this.spreadsheet.dataSet;
    const { totals } = this.spreadsheet.options;
    const moreThanOneValue = dataSet.moreThanOneValue();
    const { rows, columns } = dataSet.fields;
    const fields = isRowHeader ? rows : columns;
    const totalConfig = isRowHeader ? totals!.row : totals!.col;
    const dimensionGroup = isSubTotal
      ? totalConfig?.subTotalsGroupDimensions || []
      : totalConfig?.grandTotalsGroupDimensions || [];
    const multipleMap: number[] = Array.from({ length: maxLevel + 1 }, () => 1);

    for (let level = maxLevel; level > 0; level--) {
      const currentField = fields![level] as string;
      // 若不符合【分组维度包含此维度】或【者指标维度下非单指标维度】，此表头单元格为空，将宽高合并到上级单元格
      const existValueField = currentField === EXTRA_FIELD && moreThanOneValue;

      if (!(dimensionGroup.includes(currentField) || existValueField)) {
        multipleMap[level - 1] += multipleMap[level];
        multipleMap[level] = 0;
      }
    }

    return multipleMap;
  }

  // please read README-adjustTotalNodesCoordinate.md to understand this function
  private adjustTotalNodesCoordinate(params: {
    hierarchy: Hierarchy;
    isRowHeader?: boolean;
    isSubTotal?: boolean;
  }) {
    const { hierarchy, isRowHeader, isSubTotal } = params;
    const multipleMap = this.getMultipleMap(hierarchy, isRowHeader, isSubTotal);
    const totalNodes = filter(hierarchy.getNodes(), (node: Node) =>
      isSubTotal ? node.isSubTotals : node.isGrandTotals,
    ) as Node[];
    const key = isRowHeader ? 'width' : 'height';

    forEach(totalNodes, (node: Node) => {
      let multiple = multipleMap[node.level];

      // 小计根节点若为 0，则改为最近上级倍数 - level 差
      if (!multiple && isSubTotal) {
        let lowerLevelIndex = 1;

        while (multiple < 1) {
          multiple =
            multipleMap[node.level - lowerLevelIndex] - lowerLevelIndex;
          lowerLevelIndex++;
        }
      }

      let res = 0;

      for (let i = 0; i < multiple; i++) {
        res += get(
          hierarchy.sampleNodesForAllLevels?.find(
            (sampleNode) => sampleNode.level === node.level + i,
          ),
          [key],
          0,
        );
      }
      node[key] = res;
    });
  }

  /**
   * Auto column no-leaf node's width and x coordinate
   * @param colLeafNodes
   */
  private autoCalculateColNodeWidthAndX(colLeafNodes: Node[]) {
    let prevColParent: Node | null = null;
    let i = 0;

    const leafNodes = colLeafNodes.slice(0);

    while (i < leafNodes.length) {
      const node = leafNodes[i++];
      const parentNode = node?.parent;

      if (prevColParent !== parentNode && parentNode) {
        leafNodes.push(parentNode);

        const firstVisibleChildNode = parentNode.children?.find(
          (childNode) => childNode.width,
        );
        // 父节点 x 坐标 = 第一个未隐藏的子节点的 x 坐标
        const parentNodeX = firstVisibleChildNode?.x ?? 0;
        // 父节点宽度 = 所有子节点宽度之和
        const parentNodeWidth = sumBy(parentNode.children, 'width');

        parentNode.x = parentNodeX;
        parentNode.width = parentNodeWidth;

        prevColParent = parentNode;
      }
    }
  }

  private calculateColLeafNodesWidth(
    colNode: Node,
    colLeafNodes: Node[],
    rowLeafNodes: Node[],
    rowHeaderWidth: number,
  ): number {
    const { colCell } = this.spreadsheet.options.style!;

    const cellDraggedWidth = this.getColCellDraggedWidth(colNode);

    // 1. 拖拽后的宽度优先级最高
    if (isNumber(cellDraggedWidth)) {
      return cellDraggedWidth;
    }

    // 2. 其次是自定义, 返回 null 则使用默认宽度
    const cellCustomWidth = this.getCellCustomSize(colNode, colCell?.width!);

    if (isNumber(cellCustomWidth)) {
      return cellCustomWidth;
    }

    // 3. 紧凑布局
    if (this.spreadsheet.getLayoutWidthType() === LayoutWidthType.Compact) {
      return this.getCompactGridColNodeWidth(colNode, rowLeafNodes);
    }

    /**
     * 4. 自适应 adaptive
     * 4.1 树状自定义
     */
    if (this.spreadsheet.isHierarchyTreeType()) {
      return this.getAdaptTreeColWidth(colNode, colLeafNodes, rowLeafNodes);
    }

    // 4.2 网格自定义
    return this.getAdaptGridColWidth(colLeafNodes, rowHeaderWidth);
  }

  private getRowNodeHeight(rowNode: Node): number {
    const rowCell = new RowCell(rowNode, this.spreadsheet, {
      shallowRender: true,
    });
    const defaultHeight = this.getRowCellHeight(rowNode);

    return this.getCellAdaptiveHeight(rowCell, defaultHeight);
  }

  protected getColNodeHeight(colNode: Node, colsHierarchy: Hierarchy): number {
    if (!colNode) {
      return 0;
    }

    const colCell = new ColCell(colNode, this.spreadsheet, {
      shallowRender: true,
    });

    const defaultHeight = this.getDefaultColNodeHeight(colNode, colsHierarchy);

    return this.getCellAdaptiveHeight(colCell, defaultHeight);
  }

  /**
   * 获得图标区域预估宽度
   * 不考虑用户自定义的 displayCondition 条件
   * @param iconStyle 图标样式
   * @returns 宽度
   */
  private getExpectedCellIconWidth(
    cellType: CellType,
    useDefaultIcon: boolean,
    iconStyle: IconTheme,
  ): number {
    // count icons
    let iconCount = 0;

    if (useDefaultIcon) {
      iconCount = 1;
    } else {
      const actionIcons = map(
        this.spreadsheet.options.headerActionIcons,
        (iconCfg) => {
          return {
            ...iconCfg,
            // ignore condition func when layout calc
            displayCondition: () => true,
          };
        },
      );
      const customIcons = getActionIconConfig(
        actionIcons,
        null as unknown as Node,
        cellType,
      );

      iconCount = customIcons?.icons.length ?? 0;
    }

    // calc width
    return iconCount
      ? iconCount * (iconStyle.size! + iconStyle.margin?.left!) +
          iconStyle.margin?.right!
      : 0;
  }

  /**
   * Calculate all row header related coordinate
   * height, width, x, y
   * rowHierarchy's height
   * rowHierarchy's width
   */
  private calculateRowNodesCoordinate(layoutResult: LayoutResult) {
    const { rowsHierarchy, rowLeafNodes, colLeafNodes } = layoutResult;
    const isTree = this.spreadsheet.isHierarchyTreeType();

    const sampleNodeByLevel = rowsHierarchy.sampleNodesForAllLevels || [];

    // 1、calculate first node's width in every level
    if (isTree) {
      rowsHierarchy.width = this.getTreeRowHeaderWidth();
    } else {
      sampleNodeByLevel.forEach((levelSample) => {
        levelSample.width = this.calculateGridRowNodesWidth(
          levelSample,
          colLeafNodes,
        );
        rowsHierarchy.width += levelSample.width;
        const preLevelSample = sampleNodeByLevel[levelSample.level - 1] ?? {
          x: 0,
          width: 0,
        };

        levelSample.x = preLevelSample?.x + preLevelSample?.width;
      });
    }

    // 2、calculate node's height & y（leaf nodes）, x-coordinate & width(all nodes), height & y (not-leaf),
    let preLeafNode = Node.blankNode();
    const allNodes = rowsHierarchy.getNodes();

    for (let i = 0; i < allNodes.length; i++) {
      const currentNode = allNodes[i];
      // in tree type, all nodes treat as leaf
      const isLeaf = isTree || (!isTree && currentNode.isLeaf);

      if (isLeaf) {
        // 1. 普通树状结构, 叶子节点各占一行, 2. 自定义树状结构 (平铺模式)
        const rowIndex = (preLeafNode?.rowIndex ?? -1) + 1;
        const currentBranchNodeHeights = Node.getBranchNodes(currentNode).map(
          (rowNode) => this.getRowNodeHeight(rowNode),
        );
        // 父节点的高度是叶子节点的高度之和, 由于存在多行文本, 叶子节点的高度以当前路径下节点高度最大的为准
        const nodeHeight =
          max(currentBranchNodeHeights) || this.getRowNodeHeight(currentNode);

        currentNode.rowIndex ??= rowIndex;
        currentNode.colIndex ??= i;
        currentNode.y = preLeafNode.y + preLeafNode.height;
        currentNode.height = nodeHeight;
        preLeafNode = currentNode;
        // mark row hierarchy's height
        rowsHierarchy.height += currentNode.height;
      }

      // calc node.x
      if (isTree || currentNode.level === 0) {
        currentNode.x = 0;
      } else {
        const preLevelSample = sampleNodeByLevel[currentNode.level - 1];

        currentNode.x = preLevelSample?.x + preLevelSample?.width;
      }

      // calc node.width
      if (isTree) {
        currentNode.width = this.getTreeRowHeaderWidth();
      } else {
        // same level -> same width
        const levelSampleNode = sampleNodeByLevel[currentNode.level];

        currentNode.width = levelSampleNode?.width;
      }

      layoutCoordinate(this.spreadsheet, currentNode, null);
    }
    if (!isTree) {
      this.adjustRowLeafNodesWidth({
        leafNodes: rowLeafNodes,
        hierarchy: rowsHierarchy,
      });
      this.autoCalculateRowNodeHeightAndY(rowLeafNodes);
      if (!isEmpty(this.spreadsheet.options.totals?.row)) {
        this.adjustTotalNodesCoordinate({
          hierarchy: rowsHierarchy,
          isRowHeader: true,
          isSubTotal: false,
        });
        this.adjustTotalNodesCoordinate({
          hierarchy: rowsHierarchy,
          isRowHeader: true,
          isSubTotal: true,
        });
      }
    }
  }

  /**
   * @description Auto calculate row no-leaf node's height and y coordinate
   * @param rowLeafNodes
   */
  private autoCalculateRowNodeHeightAndY(rowLeafNodes: Node[]) {
    // 3、in grid type, all no-leaf node's height, y are auto calculated
    let prevRowParent = null;
    let i = 0;
    const leafNodes = rowLeafNodes.slice(0);

    while (i < leafNodes.length) {
      const node = leafNodes[i++];
      const parent = node?.parent;

      if (prevRowParent !== parent && parent) {
        leafNodes.push(parent);
        // 父节点 y 坐标 = 第一个未隐藏的子节点的 y 坐标
        parent.y = parent.children[0].y;
        // 父节点高度 = 所有子节点高度之和
        parent.height = sumBy(parent.children, 'height');
        prevRowParent = parent;
      }
    }
  }

  /**
   * 计算 grid 模式下 node 宽度
   * @param node
   * @returns
   */
  private calculateGridRowNodesWidth(node: Node, colLeafNodes: Node[]): number {
    const { rowCell } = this.spreadsheet.options.style!;

    const cellDraggedWidth = this.getRowCellDraggedWidth(node);

    if (isNumber(cellDraggedWidth)) {
      return cellDraggedWidth;
    }

    const cellCustomWidth = this.getCellCustomSize(node, rowCell?.width!);

    if (isNumber(cellCustomWidth)) {
      return cellCustomWidth;
    }

    if (this.spreadsheet.getLayoutWidthType() !== LayoutWidthType.Adaptive) {
      // compact or colAdaptive
      return this.getCompactGridRowNodeWidth(node);
    }

    // adaptive
    return this.getAdaptGridColWidth(colLeafNodes);
  }

  /**
   *  计算树状模式等宽条件下的列宽
   * @returns number
   */
  private getAdaptTreeColWidth(
    col: Node,
    colLeafNodes: Node[],
    rowLeafNodes: Node[],
  ): number {
    // tree row width = [config width, canvas / 2]
    const canvasW = this.getCanvasSize().width;
    const availableWidth =
      canvasW -
      this.getSeriesNumberWidth() -
      Frame.getVerticalBorderWidth(this.spreadsheet);
    const rowHeaderWidth = Math.min(
      availableWidth / 2,
      this.getTreeRowHeaderWidth(),
    );
    // calculate col width
    const colSize = Math.max(1, colLeafNodes.length);
    const { dataCell } = this.spreadsheet.options.style!;

    return Math.max(
      getCellWidth(dataCell!, this.getColLabelLength(col, rowLeafNodes)),
      floor((availableWidth - rowHeaderWidth) / colSize),
    );
  }

  private getColLabelLength(col: Node, rowLeafNodes: Node[]) {
    // 如果 label 字段形如 "["xx","xxx"]"，直接获取其长度
    const labels = safeJsonParse<string[]>(col?.value);

    if (isArray(labels)) {
      return labels.length;
    }

    // 采样前 50，根据指标个数获取单元格列宽
    let maxLength = 1;

    for (let index = 0; index < LAYOUT_SAMPLE_COUNT; index++) {
      const rowNode = rowLeafNodes[index];

      if (!rowNode) {
        // 抽样个数大于叶子节点个数
        return maxLength;
      }

      const cellData = this.spreadsheet.dataSet.getCellData({
        query: {
          ...col.query,
          ...rowNode.query,
        },
        rowNode,
        isTotals:
          col.isTotals ||
          col.isTotalMeasure ||
          rowNode.isTotals ||
          rowNode.isTotalMeasure,
      });

      const cellDataKeys = keys(cellData);

      for (let j = 0; j < cellDataKeys.length; j++) {
        const dataValue: MultiData = get(cellData, cellDataKeys[j]);

        const valueSize = size(get(dataValue?.values as SimpleData[][], '0'));

        if (valueSize > maxLength) {
          // greater length
          maxLength = valueSize;
        }
      }
    }

    return maxLength;
  }

  /**
   *  计算平铺模式等宽条件下的列宽
   * @returns number
   */
  private getAdaptGridColWidth(colLeafNodes: Node[], rowHeaderWidth?: number) {
    const { rows = [] } = this.spreadsheet.dataSet.fields;
    const { dataCell } = this.spreadsheet.options.style!;
    const rowHeaderColSize = rows.length;
    const colHeaderColSize = colLeafNodes.length;
    const { width } = this.getCanvasSize();
    const availableWidth =
      width -
      this.getSeriesNumberWidth() -
      Frame.getVerticalBorderWidth(this.spreadsheet);

    const colSize = Math.max(1, rowHeaderColSize + colHeaderColSize);

    if (!rowHeaderWidth) {
      return Math.max(getCellWidth(dataCell!), floor(availableWidth / colSize));
    }

    return Math.max(
      getCellWidth(dataCell!),
      floor((availableWidth - rowHeaderWidth) / colHeaderColSize),
    );
  }

  /**
   * 计算树状结构行头宽度
   * @returns number
   */
  private getTreeRowHeaderWidth(): number {
    const { rowCell } = this.spreadsheet.options.style!;
    const { rows = [] } = this.spreadsheet.dataSet.fields;

    // 1. 用户拖拽或手动指定的行头宽度优先级最高
    const customRowCellWidth = this.getCellCustomSize(null, rowCell?.width!);

    if (isNumber(customRowCellWidth)) {
      return customRowCellWidth;
    }

    // 2. 然后是计算 (+ icon province/city/level)
    const treeHeaderLabel = rows
      .map((field) => this.spreadsheet.dataSet.getFieldName(field))
      .join('/');

    const { bolderText: cornerCellTextStyle, icon: cornerIconStyle } =
      this.spreadsheet.theme.cornerCell!;

    /**
     * 初始化角头时，保证其在树形模式下不换行, 给与两个icon的宽度空余（tree icon 和 action icon），减少复杂的 action icon 判断
     * 额外增加 1，当内容和容器宽度恰好相等时会出现换行
     */
    const maxLabelWidth =
      this.spreadsheet.measureTextWidth(treeHeaderLabel, cornerCellTextStyle) +
      cornerIconStyle.size * 2 +
      cornerIconStyle.margin?.left +
      cornerIconStyle.margin?.right +
      this.rowCellTheme.padding?.left +
      this.rowCellTheme.padding?.right +
      1;

    const width = Math.max(
      customRowCellWidth ?? DEFAULT_TREE_ROW_CELL_WIDTH,
      maxLabelWidth,
    );

    return Number.isNaN(width) ? DEFAULT_TREE_ROW_CELL_WIDTH : width;
  }

  /**
   * 计算 compact 模式下 node 宽度
   *
   * |   fieldName  |
   *  _______________
   * | label - icon  | <- node
   * | label - icon  |
   * | label - icon  |
   *
   * @param node 目标节点
   * @returns 宽度
   */
  private getCompactGridRowNodeWidth(node: Node): number {
    const {
      bolderText: rowTextStyle,
      icon: rowIconStyle,
      cell: rowCellStyle,
    } = this.spreadsheet.theme.rowCell!;
    const {
      bolderText: cornerTextStyle,
      icon: cornerIconStyle,
      cell: cornerCellStyle,
    } = this.spreadsheet.theme.cornerCell!;
    const { field, isLeaf } = node;

    // calc rowNode width
    const rowIconWidth = this.getExpectedCellIconWidth(
      CellType.ROW_CELL,
      !this.spreadsheet.isValueInCols() &&
        isLeaf &&
        this.spreadsheet.options.showDefaultHeaderActionIcon!,
      rowIconStyle!,
    );
    const allLabels = this.spreadsheet.dataSet
      .getDimensionValues(field)
      ?.slice(0, LAYOUT_SAMPLE_COUNT)
      .map(
        (dimValue) =>
          this.spreadsheet.dataSet.getFieldFormatter(field)?.(dimValue) ??
          dimValue,
      );
    const maxLabel = maxBy(allLabels, (label) => `${label}`.length);
    const rowNodeWidth =
      this.spreadsheet.measureTextWidth(maxLabel, rowTextStyle) +
      rowIconWidth +
      rowCellStyle!.padding!.left! +
      rowCellStyle!.padding!.right! +
      rowCellStyle!.verticalBorderWidth!;

    // calc corner fieldNameNodeWidth
    const fieldName = this.spreadsheet.dataSet.getFieldName(field);
    const cornerIconWidth = this.getExpectedCellIconWidth(
      CellType.CORNER_CELL,
      false,
      cornerIconStyle!,
    );
    const fieldNameNodeWidth =
      this.spreadsheet.measureTextWidth(fieldName, cornerTextStyle) +
      cornerIconWidth +
      cornerCellStyle!.padding!.left! +
      cornerCellStyle!.padding!.right!;

    DebuggerUtil.getInstance().logger(
      'Max Label In Row:',
      field,
      rowNodeWidth > fieldNameNodeWidth ? maxLabel : fieldName,
    );

    return Math.max(rowNodeWidth, fieldNameNodeWidth);
  }

  private getCompactGridColNodeWidth(colNode: Node, rowLeafNodes: Node[]) {
    const {
      bolderText: colCellTextStyle,
      cell: colCellStyle,
      icon: colIconStyle,
    } = this.spreadsheet.theme.colCell!;
    const { text: dataCellTextStyle } = this.spreadsheet.theme.dataCell;

    // leaf node rough width
    const cellFormatter = this.spreadsheet.dataSet.getFieldFormatter(
      colNode.field,
    );
    const leafNodeLabel = cellFormatter?.(colNode.value) ?? colNode.value;
    const iconWidth = this.getExpectedCellIconWidth(
      CellType.COL_CELL,
      this.spreadsheet.isValueInCols() &&
        this.spreadsheet.options.showDefaultHeaderActionIcon!,
      colIconStyle!,
    );
    const leafNodeRoughWidth =
      this.spreadsheet.measureTextWidthRoughly(leafNodeLabel) + iconWidth;

    // 采样 50 个 label，逐个计算找出最长的 label
    let maxDataLabel = '';
    let maxDataLabelWidth = 0;

    for (let index = 0; index < LAYOUT_SAMPLE_COUNT; index++) {
      const rowNode = rowLeafNodes[index];

      if (rowNode) {
        const cellData = (this.spreadsheet.dataSet as PivotDataSet).getCellData(
          {
            query: { ...colNode.query, ...rowNode.query },
            rowNode,
            isTotals:
              colNode.isTotals ||
              colNode.isTotalMeasure ||
              rowNode.isTotals ||
              rowNode.isTotalMeasure,
          },
        );

        if (cellData) {
          // 总小计格子不一定有数据
          const valueData = cellData?.[VALUE_FIELD];
          const formattedValue =
            this.spreadsheet.dataSet.getFieldFormatter(cellData[EXTRA_FIELD])?.(
              valueData,
            ) ?? valueData;
          const cellLabel = `${formattedValue}`;
          const cellLabelWidth =
            this.spreadsheet.measureTextWidthRoughly(cellLabel);

          if (cellLabelWidth > maxDataLabelWidth) {
            maxDataLabel = cellLabel;
            maxDataLabelWidth = cellLabelWidth;
          }
        }
      }
    }

    // compare result
    const isLeafNodeWidthLonger = leafNodeRoughWidth > maxDataLabelWidth;
    const maxLabel = isLeafNodeWidthLonger ? leafNodeLabel : maxDataLabel;
    const appendedWidth = isLeafNodeWidthLonger ? iconWidth : 0;

    DebuggerUtil.getInstance().logger(
      'Max Label In Col:',
      colNode.field,
      maxLabel,
      maxDataLabelWidth,
    );

    // 取列头/数值字体最大的文本宽度 https://github.com/antvis/S2/issues/2385
    const maxTextWidth = this.spreadsheet.measureTextWidth(maxLabel, {
      ...colCellTextStyle,
      fontSize: Math.max(dataCellTextStyle.fontSize, colCellTextStyle.fontSize),
    });

    return (
      maxTextWidth +
      colCellStyle!.padding!.left! +
      colCellStyle!.padding!.right! +
      colCellStyle!.verticalBorderWidth! * 2 +
      appendedWidth
    );
  }

  public getViewCellHeights() {
    const rowLeafNodes = this.getRowLeafNodes();

    const heights = reduce(
      rowLeafNodes,
      (result: number[], node: Node) => {
        const currentNodeHeight = last(result) || 0;

        result.push(currentNodeHeight + node.height);

        return result;
      },
      [0],
    );

    return {
      getTotalHeight: () => last(heights) || 0,
      getCellOffsetY: (index: number) => heights[index] || 0,
      // 多了一个数据 [0]
      getTotalLength: () => heights.length - 1,
      getIndexRange: (minHeight: number, maxHeight: number) =>
        getIndexRangeWithOffsets(heights, minHeight, maxHeight),
    };
  }

  /**
   * 获取序号单元格
   * @description 对于透视表, 序号属于 RowCell
   */
  public getSeriesNumberCells(): SeriesNumberCell[] {
    return filter(
      this.getSeriesNumberHeader()?.children,
      (element: SeriesNumberCell) => element instanceof SeriesNumberCell,
    ) as unknown[] as SeriesNumberCell[];
  }

  protected updateFrozenGroupGrid(): void {
    [FrozenGroupType.FROZEN_ROW].forEach((key) => {
      if (!this.frozenGroupInfo[key].range) {
        return;
      }

      let cols: number[] = [];
      let rows: number[] = [];

      if (key.toLowerCase().includes('row')) {
        const [rowMin, rowMax] = this.frozenGroupInfo[key].range || [];

        cols = this.gridInfo.cols;
        rows = getRowsForGrid(rowMin, rowMax, this.viewCellHeights);
      }

      this[`${key}Group`].updateGrid(
        {
          cols,
          rows,
        },
        `${key}Group`,
      );
    });
  }

  protected getFrozenOptions() {
    return getFrozenRowCfgPivot(
      this.spreadsheet.options,
      this.layoutResult.rowNodes,
    );
  }

  public enableFrozenFirstRow(): boolean {
    return !!this.getFrozenOptions().rowCount;
  }

  protected renderFrozenGroupSplitLine = (scrollX: number, scrollY: number) => {
    this.foregroundGroup.getElementById(KEY_GROUP_FROZEN_SPLIT_LINE)?.remove();
    if (this.enableFrozenFirstRow()) {
      // 在分页条件下需要额外处理 Y 轴滚动值
      const relativeScrollY = floor(scrollY - this.getPaginationScrollY());
      const splitLineGroup = this.foregroundGroup.appendChild(
        new Group({
          id: KEY_GROUP_FROZEN_SPLIT_LINE,
          style: {
            zIndex: FRONT_GROUND_GROUP_FROZEN_Z_INDEX,
          },
        }),
      );

      const { splitLine } = this.spreadsheet.theme;

      const horizontalBorderStyle: Partial<LineStyleProps> = {
        lineWidth: SPLIT_LINE_WIDTH,
        stroke: splitLine?.horizontalBorderColor,
        opacity: splitLine?.horizontalBorderColorOpacity,
      };

      const cellRange = this.getCellRange();
      const y =
        this.panelBBox.y +
        this.getTotalHeightForRange(cellRange.start, cellRange.start);
      const width =
        this.cornerBBox.width +
        Frame.getVerticalBorderWidth(this.spreadsheet) +
        this.panelBBox.viewportWidth;

      renderLine(splitLineGroup, {
        ...horizontalBorderStyle,
        x1: 0,
        x2: width,
        y1: y,
        y2: y,
      });

      if (splitLine!.showShadow && relativeScrollY > 0) {
        splitLineGroup.appendChild(
          new Rect({
            style: {
              x: 0,
              y,
              width,
              height: splitLine?.shadowWidth!,
              fill: this.getShadowFill(90),
            },
          }),
        );
      }
    }
  };
}
