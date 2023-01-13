import {
  find,
  forEach,
  get,
  isArray,
  isEmpty,
  isNumber,
  keys,
  last,
  map,
  maxBy,
  merge,
  reduce,
  size,
  sumBy,
} from 'lodash';
import {
  DEFAULT_TREE_ROW_WIDTH,
  LAYOUT_SAMPLE_COUNT,
  type IconTheme,
  type MultiData,
} from '../common';
import { EXTRA_FIELD, LayoutWidthTypes, VALUE_FIELD } from '../common/constant';
import { CellTypes } from '../common/constant/interaction';
import { DebuggerUtil } from '../common/debug';
import type { LayoutResult, ViewMeta } from '../common/interface';
import { getDataCellId, handleDataItem } from '../utils/cell/data-cell';
import { getActionIconConfig } from '../utils/cell/header-cell';
import {
  getIndexRangeWithOffsets,
  getSubTotalNodeWidthOrHeightByLevel,
} from '../utils/facet';
import { getCellWidth, safeJsonParse } from '../utils/text';
import { BaseFacet } from './base-facet';
import { buildHeaderHierarchy } from './layout/build-header-hierarchy';
import type { Hierarchy } from './layout/hierarchy';
import { layoutCoordinate, layoutDataPosition } from './layout/layout-hooks';
import { Node } from './layout/node';

export class PivotFacet extends BaseFacet {
  get rowCellTheme() {
    return this.spreadsheet.theme.rowCell.cell;
  }

  protected doLayout(): LayoutResult {
    // 1、layout all nodes in rowHeader and colHeader
    const { leafNodes: rowLeafNodes, hierarchy: rowsHierarchy } =
      buildHeaderHierarchy({
        isRowHeader: true,
        facetCfg: this.cfg,
      });
    const { leafNodes: colLeafNodes, hierarchy: colsHierarchy } =
      buildHeaderHierarchy({
        isRowHeader: false,
        facetCfg: this.cfg,
      });

    // 2、calculate all related nodes coordinate
    this.calculateNodesCoordinate(
      rowLeafNodes,
      rowsHierarchy,
      colLeafNodes,
      colsHierarchy,
    );
    const { dataSet, spreadsheet } = this.cfg;

    const getCellMeta = (rowIndex?: number, colIndex?: number): ViewMeta => {
      const i = rowIndex || 0;
      const j = colIndex || 0;
      const row = rowLeafNodes[i];
      const col = colLeafNodes[j];
      if (!row || !col) {
        return null;
      }
      const rowQuery = row.query;
      const colQuery = col.query;
      const isTotals =
        row.isTotals ||
        row.isTotalMeasure ||
        col.isTotals ||
        col.isTotalMeasure;
      const { hierarchyType } = spreadsheet.options;
      const hideMeasure =
        get(spreadsheet, 'facet.cfg.colCfg.hideMeasureColumn') ?? false;
      // 如果在非自定义目录情况下hide measure query中是没有度量信息的，所以需要自动补上
      // 存在一个场景的冲突，如果是多个度量，定位数据数据是无法知道哪一列代表什么
      // 因此默认只会去 第一个度量拼接query
      const measureInfo =
        hideMeasure && hierarchyType !== 'customTree'
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
      let valueField: string;
      let fieldValue = null;
      if (!isEmpty(data)) {
        valueField = get(data, [EXTRA_FIELD], '');
        fieldValue = get(data, [VALUE_FIELD], null);
        if (isTotals) {
          valueField = get(dataQuery, [EXTRA_FIELD], '');
          fieldValue = get(data, valueField, null);
        }
      } else {
        valueField = get(dataQuery, [EXTRA_FIELD], '');
      }

      return {
        spreadsheet,
        x: col.x,
        y: row.y,
        width: col.width,
        height: row.height,
        data,
        rowIndex: i,
        colIndex: j,
        isTotals,
        valueField,
        fieldValue,
        rowQuery,
        colQuery,
        rowId: row.id,
        colId: col.id,
        id: getDataCellId(row.id, col.id),
      } as ViewMeta;
    };

    const layoutResult: LayoutResult = {
      colNodes: colsHierarchy.getNodes(),
      colsHierarchy,
      rowNodes: rowsHierarchy.getNodes(),
      rowsHierarchy,
      rowLeafNodes,
      colLeafNodes,
      getCellMeta,
      spreadsheet,
    };

    return layoutDataPosition(this.cfg, layoutResult);
  }

  private calculateNodesCoordinate(
    rowLeafNodes: Node[],
    rowsHierarchy: Hierarchy,
    colLeafNodes: Node[],
    colsHierarchy: Hierarchy,
  ) {
    this.calculateRowNodesCoordinate(rowLeafNodes, rowsHierarchy, colLeafNodes);
    this.calculateColNodesCoordinate(
      colLeafNodes,
      colsHierarchy,
      rowLeafNodes,
      rowsHierarchy.width,
    );
  }

  /**
   * Calculate all col header related coordinate
   * height, width, x, y
   * colsHierarchy's height
   * colsHierarchy's width
   * @param colLeafNodes
   * @param colsHierarchy
   * @param rowLeafNodes
   * @param rowHeaderWidth
   */
  private calculateColNodesCoordinate(
    colLeafNodes: Node[],
    colsHierarchy: Hierarchy,
    rowLeafNodes: Node[],
    rowHeaderWidth: number,
  ) {
    const { spreadsheet } = this.cfg;
    let preLeafNode = Node.blankNode();
    const allNodes = colsHierarchy.getNodes();
    for (const levelSample of colsHierarchy.sampleNodesForAllLevels) {
      levelSample.height = this.getColNodeHeight(levelSample);
      colsHierarchy.height += levelSample.height;
    }
    let currentCollIndex = 0;
    for (let i = 0; i < allNodes.length; i++) {
      const currentNode = allNodes[i];
      if (currentNode.isLeaf) {
        currentNode.colIndex = currentCollIndex;
        currentCollIndex += 1;
        currentNode.x = preLeafNode.x + preLeafNode.width;
        currentNode.width = this.calculateColLeafNodesWidth(
          currentNode,
          colLeafNodes,
          rowLeafNodes,
          rowHeaderWidth,
        );
        colsHierarchy.width += currentNode.width;
        preLeafNode = currentNode;
      }

      if (currentNode.level === 0) {
        currentNode.y = 0;
      } else {
        const preLevelSample = colsHierarchy.sampleNodesForAllLevels.find(
          (n) => n.level === currentNode.level - 1,
        );
        currentNode.y = preLevelSample?.y + preLevelSample?.height ?? 0;
      }
      currentNode.height = this.getColNodeHeight(currentNode);
      layoutCoordinate(this.cfg, null, currentNode);
    }
    this.autoCalculateColNodeWidthAndX(colLeafNodes);
    if (!isEmpty(spreadsheet.options.totals?.col)) {
      this.adjustTotalNodesCoordinate(colsHierarchy);
      this.adjustSubTotalNodesCoordinate(colsHierarchy);
    }
  }

  /**
   * Auto Auto Auto column no-leaf node's width and x coordinate
   * @param colLeafNodes
   */
  private autoCalculateColNodeWidthAndX(colLeafNodes: Node[]) {
    let prevColParent: Node = null;
    const leafNodes = colLeafNodes.slice(0);

    while (leafNodes.length) {
      const node = leafNodes.shift();
      const parentNode = node.parent;
      if (prevColParent !== parentNode && parentNode) {
        leafNodes.push(parentNode);

        const firstVisibleChildNode = parentNode.children?.find(
          (childNode) => !childNode.hiddenChildNodeInfo,
        );
        // 父节点 x 坐标 = 第一个未隐藏的子节点的 x 坐标
        const parentNodeX = firstVisibleChildNode?.x;
        // 父节点宽度 = 所有子节点宽度之和
        const parentNodeWidth = sumBy(parentNode.children, 'width');

        parentNode.x = parentNodeX;
        parentNode.width = parentNodeWidth;

        prevColParent = parentNode;
      }
    }
  }

  private calculateColLeafNodesWidth(
    col: Node,
    colLeafNodes: Node[],
    rowLeafNodes: Node[],
    rowHeaderWidth: number,
  ): number {
    const { colCfg, dataSet, filterDisplayDataItem } = this.cfg;
    const cellDraggedWidth = this.getCellDraggedWidth(col);

    // 1. 拖拽后的宽度优先级最高
    if (isNumber(cellDraggedWidth)) {
      return cellDraggedWidth;
    }

    // 2. 其次是自定义, 返回 null 则使用默认宽度
    const cellCustomWidth = this.getCellCustomWidth(col, colCfg?.width);
    if (isNumber(cellCustomWidth)) {
      return cellCustomWidth;
    }

    // 3. 紧凑布局
    if (this.spreadsheet.getLayoutWidthType() === LayoutWidthTypes.Compact) {
      const {
        bolderText: colCellTextStyle,
        cell: colCellStyle,
        icon: colIconStyle,
      } = this.spreadsheet.theme.colCell;

      // leaf node rough width
      const cellFormatter = this.spreadsheet.dataSet.getFieldFormatter(
        col.field,
      );
      const leafNodeLabel = cellFormatter?.(col.value) ?? col.label;
      const iconWidth = this.getExpectedCellIconWidth(
        CellTypes.COL_CELL,
        this.spreadsheet.isValueInCols() &&
          this.spreadsheet.options.showDefaultHeaderActionIcon,
        colIconStyle,
      );
      const leafNodeRoughWidth =
        this.spreadsheet.measureTextWidthRoughly(leafNodeLabel) + iconWidth;

      // 采样 50 个 label，逐个计算找出最长的 label
      let maxDataLabel: string;
      let maxDataLabelWidth = 0;
      for (let index = 0; index < LAYOUT_SAMPLE_COUNT; index++) {
        const rowNode = rowLeafNodes[index];
        if (rowNode) {
          const cellData = dataSet.getCellData({
            query: { ...col.query, ...rowNode.query },
            rowNode,
            isTotals:
              col.isTotals ||
              col.isTotalMeasure ||
              rowNode.isTotals ||
              rowNode.isTotalMeasure,
          });

          if (cellData) {
            // 总小计格子不一定有数据
            const valueData = handleDataItem(cellData, filterDisplayDataItem);
            const formattedValue =
              this.spreadsheet.dataSet.getFieldFormatter(
                cellData[EXTRA_FIELD],
              )?.(valueData) ?? valueData;
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
        col.field,
        maxLabel,
      );

      return (
        this.spreadsheet.measureTextWidth(maxLabel, colCellTextStyle) +
        colCellStyle.padding?.left +
        colCellStyle.padding?.right +
        appendedWidth
      );
    }

    // 4. 自适应 adaptive
    // 4.1 树状自定义
    if (this.spreadsheet.isHierarchyTreeType()) {
      return this.getAdaptTreeColWidth(col, colLeafNodes, rowLeafNodes);
    }
    // 4.2 网格自定义
    return this.getAdaptGridColWidth(colLeafNodes, rowHeaderWidth);
  }

  private getColNodeHeight(col: Node) {
    const { colCfg } = this.cfg;
    const userDraggedHeight = get(colCfg, `heightByField.${col.key}`);
    return userDraggedHeight ?? colCfg?.height;
  }

  /**
   * 获得图标区域预估宽度
   * 不考虑用户自定义的 displayCondition 条件
   * @param iconStyle 图标样式
   * @returns 宽度
   */
  private getExpectedCellIconWidth(
    cellType: CellTypes,
    useDefaultIcon: boolean,
    iconStyle: IconTheme,
  ): number {
    // count icons
    let iconCount = 0;
    if (useDefaultIcon) {
      iconCount = 1;
    } else {
      const customIcons = getActionIconConfig(
        map(this.spreadsheet.options.headerActionIcons, (iconCfg) => ({
          ...iconCfg,
          // ignore condition func when layout calc
          displayCondition: () => true,
        })),
        null,
        cellType,
      );

      iconCount = customIcons?.iconNames.length ?? 0;
    }

    // calc width
    return iconCount
      ? iconCount * (iconStyle.size + iconStyle.margin.left) +
          iconStyle.margin.right
      : 0;
  }

  /**
   * Calculate all row header related coordinate
   * height, width, x, y
   * rowHierarchy's height
   * rowHierarchy's width
   * @param rowLeafNodes
   * @param rowsHierarchy
   */
  private calculateRowNodesCoordinate(
    rowLeafNodes: Node[],
    rowsHierarchy: Hierarchy,
    colLeafNodes: Node[],
  ) {
    const { cellCfg, spreadsheet } = this.cfg;
    const isTree = spreadsheet.isHierarchyTreeType();
    const heightByField = get(
      spreadsheet,
      'options.style.rowCfg.heightByField',
      {},
    );

    const sampleNodeByLevel = rowsHierarchy.sampleNodesForAllLevels ?? [];

    // 1、calculate first node's width in every level
    if (isTree) {
      rowsHierarchy.width = this.getTreeRowHeaderWidth();
    } else {
      for (const levelSample of rowsHierarchy.sampleNodesForAllLevels) {
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
      }
    }

    // 2、calculate node's height & y（leaf nodes）, x-coordinate & width(all nodes), height & y (not-leaf),
    let preLeafNode = Node.blankNode();
    const allNodes = rowsHierarchy.getNodes();

    for (let i = 0; i < allNodes.length; i++) {
      const currentNode = allNodes[i];
      // in tree type, all nodes treat as leaf
      const isLeaf = isTree || (!isTree && currentNode.isLeaf);
      if (isLeaf) {
        // leaf node
        currentNode.rowIndex ??= i;
        currentNode.colIndex ??= i;
        currentNode.y = preLeafNode.y + preLeafNode.height;
        currentNode.height =
          (heightByField?.[currentNode.id] ?? cellCfg?.height) +
          this.rowCellTheme.padding?.top +
          this.rowCellTheme.padding?.bottom;
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

      layoutCoordinate(this.cfg, currentNode, null);
    }
    if (!isTree) {
      this.autoCalculateRowNodeHeightAndY(rowLeafNodes);
      if (!isEmpty(spreadsheet.options.totals?.row)) {
        this.adjustTotalNodesCoordinate(rowsHierarchy, true);
        this.adjustSubTotalNodesCoordinate(rowsHierarchy, true);
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
    const leafNodes = rowLeafNodes.slice(0);
    while (leafNodes.length) {
      const node = leafNodes.shift();
      const parent = node.parent;
      if (prevRowParent !== parent && parent) {
        leafNodes.push(parent);
        // parent's y = first child's y
        parent.y = parent.children[0].y;
        // parent's height = all children's height
        parent.height = parent.children
          .map((value) => value.height)
          .reduce((sum, current) => sum + current, 0);
        prevRowParent = parent;
      }
    }
  }

  /**
   * @description adjust the coordinate of total nodes and their children
   * @param hierarchy Hierarchy
   * @param isRowHeader boolean
   */
  private adjustTotalNodesCoordinate(
    hierarchy: Hierarchy,
    isRowHeader?: boolean,
  ) {
    const moreThanOneValue = this.cfg.dataSet.moreThanOneValue();
    const { maxLevel } = hierarchy;
    const grandTotalNode = find(
      hierarchy.getNodes(0),
      (node: Node) => node.isGrandTotals,
    );
    if (!(grandTotalNode instanceof Node)) {
      return;
    }
    const grandTotalChildren = grandTotalNode.children;
    // 总计节点层级 (有且有两级)
    if (isRowHeader) {
      // 填充行总单元格宽度
      grandTotalNode.width = hierarchy.width;
      // 调整其叶子结点位置
      forEach(grandTotalChildren, (node: Node) => {
        node.x = hierarchy.getNodes(maxLevel)[0].x;
      });
    } else if (maxLevel > 1 || (maxLevel <= 1 && !moreThanOneValue)) {
      // 只有当列头总层级大于1级或列头为1级单指标时总计格高度才需要填充
      // 填充列总计单元格高度
      const grandTotalChildrenHeight = grandTotalChildren?.[0]?.height ?? 0;
      grandTotalNode.height = hierarchy.height - grandTotalChildrenHeight;
      // 调整其叶子结点位置, 以非小计行为准
      const positionY = find(
        hierarchy.getNodes(maxLevel),
        (node: Node) => !node.isTotalMeasure,
      )?.y;
      forEach(grandTotalChildren, (node: Node) => {
        node.y = positionY;
      });
    }
  }

  /**
   * @description adust the coordinate of subTotal nodes when there is just one value
   * @param hierarchy Hierarchy
   * @param isRowHeader boolean
   */
  private adjustSubTotalNodesCoordinate(
    hierarchy: Hierarchy,
    isRowHeader?: boolean,
  ) {
    const subTotalNodes = hierarchy
      .getNodes()
      .filter((node: Node) => node.isSubTotals);

    if (isEmpty(subTotalNodes)) {
      return;
    }
    const { maxLevel } = hierarchy;
    forEach(subTotalNodes, (subTotalNode: Node) => {
      const subTotalNodeChildren = subTotalNode.children;
      if (isRowHeader) {
        // 填充行总单元格宽度
        subTotalNode.width = getSubTotalNodeWidthOrHeightByLevel(
          hierarchy.sampleNodesForAllLevels,
          subTotalNode.level,
          'width',
        );

        // 调整其叶子结点位置
        forEach(subTotalNodeChildren, (node: Node) => {
          node.x = hierarchy.getNodes(maxLevel)[0].x;
        });
      } else {
        // 填充列总单元格高度
        const totalHeight = getSubTotalNodeWidthOrHeightByLevel(
          hierarchy.sampleNodesForAllLevels,
          subTotalNode.level,
          'height',
        );
        const subTotalNodeChildrenHeight =
          subTotalNodeChildren?.[0]?.height ?? 0;
        subTotalNode.height = totalHeight - subTotalNodeChildrenHeight;
        // 调整其叶子结点位置,以非小计单元格为准
        forEach(subTotalNodeChildren, (node: Node) => {
          node.y = hierarchy.getNodes(maxLevel)[0].y;
        });
        // 调整其叶子结点位置, 以非小计行为准
        const positionY = find(
          hierarchy.getNodes(maxLevel),
          (node: Node) => !node.isTotalMeasure,
        )?.y;
        forEach(subTotalNodeChildren, (node: Node) => {
          node.y = positionY;
        });
      }
    });
  }

  /**
   * 计算 grid 模式下 node 宽度
   * @param node
   * @returns
   */
  private calculateGridRowNodesWidth(node: Node, colLeafNodes: Node[]): number {
    const { rowCfg, spreadsheet } = this.cfg;

    const cellDraggedWidth = get(rowCfg, `widthByField.${node.key}`);

    if (isNumber(cellDraggedWidth)) {
      return cellDraggedWidth;
    }

    const cellCustomWidth = this.getCellCustomWidth(node, rowCfg?.width);
    if (isNumber(cellCustomWidth)) {
      return cellCustomWidth;
    }

    if (spreadsheet.getLayoutWidthType() !== LayoutWidthTypes.Adaptive) {
      // compact or colAdaptive
      return this.getCompactGridRowWidth(node);
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
    const canvasW = this.getCanvasHW().width;
    const availableWidth = canvasW - this.getSeriesNumberWidth();
    const rowHeaderWidth = Math.min(
      availableWidth / 2,
      this.getTreeRowHeaderWidth(),
    );
    // calculate col width
    const colSize = Math.max(1, colLeafNodes.length);
    const { cellCfg } = this.cfg;
    return Math.max(
      getCellWidth(cellCfg, this.getColLabelLength(col, rowLeafNodes)),
      (availableWidth - rowHeaderWidth) / colSize,
    );
  }

  private getColLabelLength(col: Node, rowLeafNodes: Node[]) {
    // 如果 label 字段形如 "["xx","xxx"]"，直接获取其长度
    const labels = safeJsonParse(col?.value);
    if (isArray(labels)) {
      return labels.length;
    }

    // 采样前50，根据指标个数获取单元格列宽
    let maxLength = 1;
    for (let index = 0; index < LAYOUT_SAMPLE_COUNT; index++) {
      const rowNode = rowLeafNodes[index];
      if (!rowNode) {
        // 抽样个数大于叶子节点个数
        return maxLength;
      }

      const cellData = this.cfg.dataSet.getCellData({
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
        const dataValue: MultiData = cellData[cellDataKeys[j]];

        const valueSize = size(dataValue?.values?.[0]);
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
    const { rows, cellCfg } = this.cfg;
    const rowHeaderColSize = rows.length;
    const colHeaderColSize = colLeafNodes.length;
    const canvasW = this.getCanvasHW().width;
    const availableWidth = canvasW - this.getSeriesNumberWidth();

    const size = Math.max(1, rowHeaderColSize + colHeaderColSize);
    if (!rowHeaderWidth) {
      return Math.max(getCellWidth(cellCfg), availableWidth / size);
    }

    return Math.max(
      getCellWidth(cellCfg),
      (availableWidth - rowHeaderWidth) / colHeaderColSize,
    );
  }

  /**
   * 计算树状结构行头宽度
   * @returns number
   */
  private getTreeRowHeaderWidth(): number {
    const { rows, dataSet, rowCfg, treeRowsWidth } = this.cfg;

    // 1. 用户拖拽或手动指定的行头宽度优先级最高
    // TODO: 由于历史原因, 存在两个行头宽度, (1. style.rowCfg.treeRowsWidth  2.style.treeRowsWidth) 暂时保持兼容
    const currentTreeRowsWidth = treeRowsWidth ?? rowCfg?.treeRowsWidth;
    if (currentTreeRowsWidth) {
      return currentTreeRowsWidth;
    }

    // 2. 其次是自定义
    const customRowWidth = this.getCellCustomWidth(null, rowCfg?.width);
    if (customRowWidth) {
      return customRowWidth;
    }

    // 3. 然后是计算 (+ icon province/city/level)
    const treeHeaderLabel = rows
      .map((key: string): string => dataSet.getFieldName(key))
      .join('/');
    const { bolderText: cornerCellTextStyle, icon: cornerIconStyle } =
      this.spreadsheet.theme.cornerCell;
    // 初始化角头时，保证其在树形模式下不换行，给与两个icon的宽度空余（tree icon 和 action icon），减少复杂的 action icon 判断
    const maxLabelWidth =
      this.spreadsheet.measureTextWidth(treeHeaderLabel, cornerCellTextStyle) +
      cornerIconStyle.size * 2 +
      cornerIconStyle.margin?.left +
      cornerIconStyle.margin?.right +
      this.rowCellTheme.padding?.left +
      this.rowCellTheme.padding?.right;

    return Math.max(
      currentTreeRowsWidth ?? DEFAULT_TREE_ROW_WIDTH,
      maxLabelWidth,
    );
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
  private getCompactGridRowWidth(node: Node): number {
    const { dataSet, spreadsheet } = this.cfg;
    const {
      bolderText: rowTextStyle,
      icon: rowIconStyle,
      cell: rowCellStyle,
    } = spreadsheet.theme.rowCell;
    const {
      bolderText: cornerTextStyle,
      icon: cornerIconStyle,
      cell: cornerCellStyle,
    } = spreadsheet.theme.cornerCell;
    const { field, isLeaf } = node;

    // calc rowNode width
    const rowIconWidth = this.getExpectedCellIconWidth(
      CellTypes.ROW_CELL,
      !spreadsheet.isValueInCols() &&
        isLeaf &&
        spreadsheet.options.showDefaultHeaderActionIcon,
      rowIconStyle,
    );
    const allLabels = dataSet
      .getDimensionValues(field)
      ?.slice(0, LAYOUT_SAMPLE_COUNT)
      .map(
        (dimValue) =>
          this.spreadsheet.dataSet.getFieldFormatter(field)?.(dimValue) ??
          dimValue,
      );
    const maxLabel = maxBy(allLabels, (label) => `${label}`.length);
    const rowNodeWidth =
      spreadsheet.measureTextWidth(maxLabel, rowTextStyle) +
      rowIconWidth +
      rowCellStyle.padding.left +
      rowCellStyle.padding.right;

    // calc corner fieldNameNodeWidth
    const fieldName = dataSet.getFieldName(field);
    const cornerIconWidth = this.getExpectedCellIconWidth(
      CellTypes.CORNER_CELL,
      false,
      cornerIconStyle,
    );
    const fieldNameNodeWidth =
      spreadsheet.measureTextWidth(fieldName, cornerTextStyle) +
      cornerIconWidth +
      cornerCellStyle.padding.left +
      cornerCellStyle.padding.right;

    DebuggerUtil.getInstance().logger(
      'Max Label In Row:',
      field,
      rowNodeWidth > fieldNameNodeWidth ? maxLabel : fieldName,
    );

    // return max
    return Math.max(rowNodeWidth, fieldNameNodeWidth);
  }

  public getViewCellHeights(layoutResult: LayoutResult) {
    const { rowLeafNodes } = layoutResult;

    const heights = reduce(
      rowLeafNodes,
      (result: number[], node: Node) => {
        result.push(last(result) + node.height);
        return result;
      },
      [0],
    );

    return {
      getTotalHeight: () => {
        return last(heights);
      },

      getCellOffsetY: (index: number) => {
        return heights[index];
      },

      getTotalLength: () => {
        // 多了一个数据 [0]
        return heights.length - 1;
      },

      getIndexRange: (minHeight: number, maxHeight: number) => {
        return getIndexRangeWithOffsets(heights, minHeight, maxHeight);
      },
    };
  }
}
