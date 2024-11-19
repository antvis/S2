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
  LAYOUT_SAMPLE_COUNT,
  type IconTheme,
  type MultiData,
  type ViewMeta,
} from '../common';
import { EXTRA_FIELD, LayoutWidthType, VALUE_FIELD } from '../common/constant';
import { CellType } from '../common/constant/interaction';
import { DebuggerUtil } from '../common/debug';
import type {
  CellCallbackParams,
  LayoutResult,
  SimpleData,
} from '../common/interface';
import type { Query } from '../data-set/interface';
import type { PivotDataSet } from '../data-set/pivot-data-set';
import { getValidFrozenOptionsForPivot, safeJsonParse } from '../utils';
import { getDataCellId } from '../utils/cell/data-cell';
import { getActionIconConfig } from '../utils/cell/header-cell';
import { findFieldCondition } from '../utils/condition/condition';
import { getHeaderTotalStatus } from '../utils/dataset/pivot-data-set';
import { getIndexRangeWithOffsets } from '../utils/facet';
import { getAllChildCells } from '../utils/get-all-child-cells';
import { floor } from '../utils/math';
import { getCellWidth } from '../utils/text';
import { FrozenFacet } from './frozen-facet';
import { CornerHeader, Frame } from './header';
import { buildHeaderHierarchy } from './layout/build-header-hierarchy';
import type { Hierarchy } from './layout/hierarchy';
import { layoutCoordinate } from './layout/layout-hooks';
import { Node } from './layout/node';

export class PivotFacet extends FrozenFacet {
  get rowCellTheme() {
    return this.spreadsheet.theme.rowCell!.cell;
  }

  protected override getRowCellInstance(...args: CellCallbackParams) {
    return this.spreadsheet.options.rowCell?.(...args) || new RowCell(...args);
  }

  protected override getColCellInstance(...args: CellCallbackParams) {
    return this.spreadsheet.options.colCell?.(...args) || new ColCell(...args);
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

  protected buildAllHeaderHierarchy() {
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

  private getDataQueryInfo(rowQuery: Query, colQuery: Query) {
    const { options, dataSet } = this.spreadsheet;
    const hideMeasure = options.style?.colCell?.hideValue ?? false;

    /**
     * 如果在非自定义目录情况下hide measure query中是没有度量信息的，所以需要自动补上
     * 存在一个场景的冲突，如果是多个度量，定位数据数据是无法知道哪一列代表什么
     * 因此默认只会去 第一个度量拼接query
     */
    const measureInfo = hideMeasure
      ? {
          [EXTRA_FIELD]: dataSet.fields.values?.[0],
        }
      : {};

    const dataQuery = merge({}, rowQuery, colQuery, measureInfo) as Query;
    const valueField = dataQuery[EXTRA_FIELD]!;

    return {
      dataQuery,
      valueField,
    };
  }

  /**
   * 根据行列索引获取单元格元数据
   */
  public getCellMeta(rowIndex: number = 0, colIndex: number = 0) {
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

    const totalStatus = getHeaderTotalStatus(row, col);
    const { dataQuery, valueField } = this.getDataQueryInfo(
      rowQuery!,
      colQuery!,
    );
    const data = (dataSet as PivotDataSet).getCellData({
      query: dataQuery,
      rowNode: row,
      isTotals,
      totalStatus,
    });

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
      query: {
        ...rowQuery,
        ...colQuery,
      },
      rowId: row.id,
      colId: col.id,
      id: getDataCellId(row.id, col.id),
    };

    return options.layoutCellMeta?.(cellMeta) ?? cellMeta;
  }

  protected getPreLevelSampleNode(colNode: Node, colsHierarchy: Hierarchy) {
    // 之前是采样每一级第一个节点, 现在 sampleNodesForAllLevels 是采样每一级高度最大的节点
    // 但是初始化布局时只有第一个节点有值, 所以这里需要适配下
    return colsHierarchy
      .getNodes(colNode.level - 1)
      .find((node) => !node.isTotals);
  }

  protected calculateHeaderNodesCoordinate(layoutResult: LayoutResult) {
    this.calculateRowNodesCoordinate(layoutResult);
    this.calculateColNodesCoordinate(layoutResult);
  }

  protected calculateColNodesCoordinate(layoutResult: LayoutResult) {
    const { colLeafNodes, colsHierarchy } = layoutResult;

    // 1. 计算叶子节点宽度
    this.calculateColLeafNodesWidth(layoutResult);
    // 2. 根据叶子节点宽度计算所有父级节点宽度和 x 坐标, 便于计算自动换行后节点的真实高度
    this.calculateColNodeWidthAndX(colLeafNodes);
    // 3. 计算每一层级的采样节点
    this.updateColsHierarchySampleMaxHeightNodes(colsHierarchy);
    // 4. 计算所有节点的高度
    this.calculateColNodesHeight(colsHierarchy);
    // 5. 如果存在自定义多级列头, 还需要更新某一层级的采样
    this.updateCustomFieldsSampleNodes(colsHierarchy);
    // 6. 补齐自定义列头节点缺失的高度
    this.adjustCustomColLeafNodesHeight({
      leafNodes: colLeafNodes,
      hierarchy: colsHierarchy,
    });
    // 7. 更新汇总节点坐标
    this.adjustColTotalNodesCoordinate(colsHierarchy);
  }

  protected calculateRowOffsets(): void {}

  protected adjustColTotalNodesCoordinate(colsHierarchy: Hierarchy) {
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

  protected calculateColLeafNodesWidth(layoutResult: LayoutResult) {
    const { rowLeafNodes, colLeafNodes, rowsHierarchy, colsHierarchy } =
      layoutResult;
    let preLeafNode = Node.blankNode();
    let currentColIndex = 0;

    colsHierarchy.getLeaves().forEach((currentNode) => {
      currentNode.colIndex = currentColIndex;
      currentColIndex++;
      currentNode.x = preLeafNode.x + preLeafNode.width;
      currentNode.width = this.getColLeafNodesWidth(
        currentNode,
        colLeafNodes,
        rowLeafNodes,
        rowsHierarchy.width,
      );
      colsHierarchy.width += currentNode.width;
      preLeafNode = currentNode;
    });
  }

  protected calculateColNodesHeight(colsHierarchy: Hierarchy) {
    const colNodes = colsHierarchy.getNodes();

    colNodes.forEach((currentNode) => {
      if (currentNode.level === 0) {
        currentNode.y = 0;
      } else {
        const preLevelSample = this.getPreLevelSampleNode(
          currentNode,
          colsHierarchy,
        );

        currentNode.y = preLevelSample?.y! + preLevelSample?.height! || 0;
      }

      // 数值置于行头时, 列头的总计即叶子节点, 此时应该用列高: https://github.com/antvis/S2/issues/1715
      const colNodeHeight = this.getColNodeHeight(
        currentNode,
        colsHierarchy,
        false,
      );

      currentNode.height =
        currentNode.isGrandTotals &&
        !currentNode.isTotalMeasure &&
        currentNode.isLeaf
          ? colsHierarchy.height
          : colNodeHeight;

      layoutCoordinate(this.spreadsheet, null, currentNode);
    });
  }

  // please read README-adjustTotalNodesCoordinate.md to understand this function
  protected getMultipleMap(
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
    const defaultDimensionGroup = isSubTotal
      ? totalConfig?.subTotalsGroupDimensions || []
      : totalConfig?.grandTotalsGroupDimensions || [];
    const dimensionGroup = !dataSet.isEmpty() ? defaultDimensionGroup : [];

    const multipleMap: number[] = Array.from({ length: maxLevel + 1 }, () => 1);

    for (let level = maxLevel; level > 0; level--) {
      const currentField = fields![level] as string;
      // 若不符合【分组维度包含此维度】或者【指标维度下多指标维度】，此表头单元格为空，将宽高合并到上级单元格
      const existValueField = currentField === EXTRA_FIELD && moreThanOneValue;

      if (!(dimensionGroup.includes(currentField) || existValueField)) {
        multipleMap[level - 1] += multipleMap[level];
        multipleMap[level] = 0;
      }
    }

    return multipleMap;
  }

  // please read README-adjustTotalNodesCoordinate.md to understand this function
  protected adjustTotalNodesCoordinate(params: {
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
  protected calculateColNodeWidthAndX(colLeafNodes: Node[]) {
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
        const parentNodeX = firstVisibleChildNode?.x || 0;
        // 父节点宽度 = 所有子节点宽度之和
        const parentNodeWidth = sumBy(parentNode.children, 'width');

        parentNode.x = parentNodeX;
        parentNode.width = parentNodeWidth;

        prevColParent = parentNode;
      }
    }
  }

  protected getColLeafNodesWidth(
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
    return this.getAdaptGridColWidth(colLeafNodes, colNode, rowHeaderWidth);
  }

  protected getRowNodeHeight(rowNode: Node): number {
    if (!rowNode) {
      return 0;
    }

    const { rowCell: rowCellStyle } = this.spreadsheet.options.style!;
    const defaultHeight = this.getRowCellHeight(rowNode);

    // 文本超过 1 行时再自适应单元格高度, 不然会频繁触发 GC, 导致性能降低: https://github.com/antvis/S2/issues/2693
    const isEnableHeightAdaptive =
      rowCellStyle?.maxLines! > 1 && rowCellStyle?.wordWrap;

    if (this.isCustomRowCellHeight(rowNode) || !isEnableHeightAdaptive) {
      return defaultHeight || 0;
    }

    return this.getNodeAdaptiveHeight(
      rowNode,
      this.textWrapTempRowCell,
      defaultHeight,
    );
  }

  /**
   * 获得图标区域预估宽度
   * 不考虑用户自定义的 displayCondition 条件
   * @param iconStyle 图标样式
   * @returns 宽度
   */
  protected getExpectedCellIconWidth(
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

      iconCount = customIcons?.icons.length || 0;
    }

    // calc width
    return iconCount
      ? iconCount * (iconStyle.size! + iconStyle.margin?.left!) +
          iconStyle.margin?.right!
      : 0;
  }

  protected calculateRowNodesAllLevelSampleNodes(layoutResult: LayoutResult) {
    const { rowsHierarchy, colLeafNodes } = layoutResult;
    const isTree = this.spreadsheet.isHierarchyTreeType();

    const sampleNodeByLevel = rowsHierarchy.sampleNodesForAllLevels || [];

    if (isTree) {
      rowsHierarchy.width = this.getTreeRowHeaderWidth();
    } else {
      sampleNodeByLevel.forEach((levelSample) => {
        levelSample.width = this.getGridRowNodesWidth(
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

    rowsHierarchy.rootNode.width = rowsHierarchy.width;
  }

  protected getRowLeafNodeHeight(rowLeafNode: Node) {
    const { rowCell: rowCellStyle } = this.spreadsheet.options.style!;
    const isEnableHeightAdaptive =
      rowCellStyle?.maxLines! > 1 && rowCellStyle?.wordWrap;

    const currentBranchNodeHeights = isEnableHeightAdaptive
      ? Node.getBranchNodes(rowLeafNode).map((rowNode) =>
          this.getRowNodeHeight(rowNode),
        )
      : [];

    const defaultHeight = this.getRowNodeHeight(rowLeafNode);
    // 父节点的高度是叶子节点的高度之和, 由于存在多行文本, 叶子节点的高度以当前路径下节点高度最大的为准: https://github.com/antvis/S2/issues/2678
    // 自定义高度除外: https://github.com/antvis/S2/issues/2594
    const nodeHeight = this.isCustomRowCellHeight(rowLeafNode)
      ? defaultHeight
      : max(currentBranchNodeHeights) ?? defaultHeight;

    return nodeHeight;
  }

  protected calculateRowNodesBBox(rowsHierarchy: Hierarchy) {
    const isTree = this.spreadsheet.isHierarchyTreeType();
    const sampleNodeByLevel = rowsHierarchy.sampleNodesForAllLevels || [];

    let preLeafNode = Node.blankNode();
    const rowNodes = rowsHierarchy.getNodes();

    rowNodes.forEach((currentNode) => {
      // 树状模式都按叶子处理节点
      const isLeaf = isTree || (!isTree && currentNode.isLeaf);

      // 1. 获取宽度, 便于多行文本计算高度
      if (isTree) {
        currentNode.width = this.getTreeRowHeaderWidth();
      } else {
        const levelSampleNode = sampleNodeByLevel[currentNode.level];

        currentNode.width = levelSampleNode?.width;
      }

      // 2. 计算叶子节点的高度和坐标
      if (isLeaf) {
        // 2.1. 普通树状结构, 叶子节点各占一行, 2.2. 自定义树状结构 (平铺模式)
        const rowIndex = (preLeafNode?.rowIndex ?? -1) + 1;
        // 文本超过 1 行时再自适应单元格高度, 不然会频繁触发 GC, 导致性能降低: https://github.com/antvis/S2/issues/2693

        currentNode.rowIndex ??= rowIndex;
        currentNode.y = preLeafNode.y + preLeafNode.height;
        currentNode.height = this.getRowLeafNodeHeight(currentNode);
        preLeafNode = currentNode;
        // mark row hierarchy's height
        rowsHierarchy.height += currentNode.height;
      }

      if (isTree || currentNode.level === 0) {
        currentNode.x = 0;
      } else {
        const preLevelSample = sampleNodeByLevel[currentNode.level - 1];

        currentNode.x = preLevelSample?.x + preLevelSample?.width;
      }

      layoutCoordinate(this.spreadsheet, currentNode, null);
    });
  }

  protected calculateRowNodesCoordinate(layoutResult: LayoutResult) {
    const { rowsHierarchy, rowLeafNodes } = layoutResult;
    const isTree = this.spreadsheet.isHierarchyTreeType();

    // 1、计算每一层级的采样节点
    this.calculateRowNodesAllLevelSampleNodes(layoutResult);

    // 2、计算节点的高度和 y (叶子节点)，x坐标和宽度 (所有节点)
    this.calculateRowNodesBBox(rowsHierarchy);

    if (!isTree) {
      // 3. 补齐自定义行头节点缺失的宽度;
      this.adjustCustomRowLeafNodesWidth({
        leafNodes: rowLeafNodes,
        hierarchy: rowsHierarchy,
      });
      // 4.根据叶子节点高度计算所有父级节点高度和 Y 坐标, 便于计算自动换行后节点的真实高度
      this.calculateRowNodeHeightAndY(rowLeafNodes);
      // 5. 更新汇总节点坐标
      this.adjustRowTotalNodesCoordinate(rowsHierarchy);
    }
  }

  protected adjustRowTotalNodesCoordinate(rowsHierarchy: Hierarchy) {
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

  /**
   * @description Auto calculate row no-leaf node's height and y coordinate
   * @param rowLeafNodes
   */
  protected calculateRowNodeHeightAndY(rowLeafNodes: Node[]) {
    // 3、in grid type, all no-leaf node's height, y are auto calculated
    let prevRowParent: Node | null = null;
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
   */
  protected getGridRowNodesWidth(node: Node, colLeafNodes: Node[]): number {
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
   * 计算树状模式等宽条件下的列宽
   */
  protected getAdaptTreeColWidth(
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

  protected getColLabelLength(col: Node, rowLeafNodes: Node[]) {
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
   * 计算平铺模式等宽条件下的列宽
   */
  protected getAdaptGridColWidth(
    colLeafNodes: Node[],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    colNode?: Node,
    rowHeaderWidth?: number,
  ) {
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
   */
  protected getTreeRowHeaderWidth(): number {
    const { rowCell } = this.spreadsheet.options.style!;

    // 1. 用户拖拽或手动指定的行头宽度优先级最高
    const customRowCellWidth = this.getCellCustomSize(null, rowCell?.width!);

    if (isNumber(customRowCellWidth)) {
      return customRowCellWidth;
    }

    // 2. 然后是计算 (+ icon province/city/level)
    const treeHeaderLabel = CornerHeader.getTreeCornerText(this.spreadsheet);

    const { bolderText: cornerCellTextStyle, icon: cornerIconStyle } =
      this.spreadsheet.theme.cornerCell!;

    /**
     * 初始化角头时，保证其在树形模式下不换行, 给与两个icon的宽度空余（tree icon 和 action icon），减少复杂的 action icon 判断
     * 额外增加 1，当内容和容器宽度恰好相等时会出现换行
     */
    const maxLabelWidth =
      this.measureTextWidth(treeHeaderLabel, cornerCellTextStyle, false) +
      cornerIconStyle.size * 2 +
      cornerIconStyle.margin?.left +
      cornerIconStyle.margin?.right +
      this.rowCellTheme.padding?.left +
      this.rowCellTheme.padding?.right;

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
   */
  protected getCompactGridRowNodeWidth(node: Node): number {
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
      this.measureTextWidth(maxLabel!, rowTextStyle) +
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
      this.measureTextWidth(fieldName, cornerTextStyle) +
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

  protected getCompactGridColNodeWidth(colNode: Node, rowLeafNodes: Node[]) {
    const {
      bolderText: colCellTextStyle,
      cell: colCellStyle,
      icon: colIconStyle,
    } = this.spreadsheet.theme.colCell!;
    const { text: dataCellTextStyle, icon: dataCellIconStyle } =
      this.spreadsheet.theme.dataCell;

    // leaf node width
    const cellFormatter = this.spreadsheet.dataSet.getFieldFormatter(
      colNode.field,
    );
    const leafNodeLabel = cellFormatter?.(colNode.value) ?? colNode.value;
    const colIconWidth = this.getExpectedCellIconWidth(
      CellType.COL_CELL,
      this.spreadsheet.isValueInCols() &&
        this.spreadsheet.options.showDefaultHeaderActionIcon!,
      colIconStyle!,
    );
    const leafNodeWidth =
      this.measureTextWidth(leafNodeLabel, colCellTextStyle) + colIconWidth;

    // 采样 50 个 label，逐个计算找出最长的 label
    let maxDataLabel = '';
    let maxDataLabelWidth = 0;
    let iconWidthOfMaxDataLabel = 0;

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
          const cellLabel = formattedValue;
          // 考虑字段标记 icon 的宽度: https://github.com/antvis/S2/pull/2673
          const { valueField } = this.getDataQueryInfo(
            rowNode.query!,
            colNode.query!,
          );
          const hasIcon = findFieldCondition(
            this.spreadsheet.options.conditions?.icon,
            valueField!,
          );
          const dataCellIconWidth = hasIcon
            ? dataCellIconStyle?.size +
              dataCellIconStyle?.margin?.left +
              dataCellIconStyle?.margin?.right
            : 0;
          const cellLabelWidth = this.measureTextWidth(
            cellLabel as string,
            dataCellTextStyle,
          );

          if (cellLabelWidth > maxDataLabelWidth) {
            maxDataLabel = cellLabel as string;
            maxDataLabelWidth = cellLabelWidth;
            iconWidthOfMaxDataLabel = dataCellIconWidth;
          }
        }
      }
    }

    const isLeafNodeWidthLonger = leafNodeWidth > maxDataLabelWidth;
    const maxLabel = isLeafNodeWidthLonger ? leafNodeLabel : maxDataLabel;
    const appendedWidth = isLeafNodeWidthLonger
      ? colIconWidth
      : iconWidthOfMaxDataLabel;

    DebuggerUtil.getInstance().logger(
      'Max Label In Col:',
      colNode.field,
      maxLabel,
      maxDataLabelWidth,
      iconWidthOfMaxDataLabel,
    );

    // 取列头/数值字体最大的文本宽度: https://github.com/antvis/S2/issues/2385
    const maxTextWidth = this.measureTextWidth(maxLabel, {
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
    const headerChildren = (this.getSeriesNumberHeader()?.children ||
      []) as SeriesNumberCell[];

    return getAllChildCells(headerChildren, SeriesNumberCell);
  }

  public getFrozenOptions() {
    if (!this.validFrozenOptions) {
      this.validFrozenOptions = getValidFrozenOptionsForPivot(
        super.getFrozenOptions(),
        this.spreadsheet.options,
      );
    }

    return this.validFrozenOptions;
  }

  public getContentWidth(): number {
    const { rowsHierarchy, colsHierarchy } = this.layoutResult;

    return (
      rowsHierarchy.width +
      colsHierarchy.width +
      Frame.getVerticalBorderWidth(this.spreadsheet)
    );
  }

  public getContentHeight(): number {
    const { rowsHierarchy, colsHierarchy } = this.layoutResult;

    return (
      rowsHierarchy.height +
      colsHierarchy.height +
      Frame.getHorizontalBorderWidth(this.spreadsheet)
    );
  }
}
