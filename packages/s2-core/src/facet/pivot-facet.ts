import {
  find,
  findIndex,
  forEach,
  get,
  includes,
  isEmpty,
  last,
  maxBy,
  merge,
  reduce,
} from 'lodash';
import { BaseFacet } from 'src/facet/base-facet';
import { getDataCellId } from 'src/utils/cell/data-cell';
import {
  EXTRA_FIELD,
  LAYOUT_WIDTH_TYPES,
  S2Event,
  VALUE_FIELD,
} from '@/common/constant';
import { DebuggerUtil } from '@/common/debug';
import { LayoutResult, ViewMeta } from '@/common/interface';
import { buildHeaderHierarchy } from '@/facet/layout/build-header-hierarchy';
import { Hierarchy } from '@/facet/layout/hierarchy';
import {
  layoutCoordinate,
  layoutDataPosition,
} from '@/facet/layout/layout-hooks';
import { Node } from '@/facet/layout/node';
import { handleDataItem } from '@/utils/cell/data-cell';
import { measureTextWidth, measureTextWidthRoughly } from '@/utils/text';
import { getSubTotalNodeWidthOrHeightByLevel } from '@/utils/facet';

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
      const hideMeasure =
        get(spreadsheet, 'facet.cfg.colCfg.hideMeasureColumn') ?? false;
      // 如果hide measure query中是没有度量信息的，所以需要自动补上
      // 存在一个场景的冲突，如果是多个度量，定位数据数据是无法知道哪一列代表什么
      // 因此默认只会去 第一个度量拼接query
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
      let valueField;
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

    const layoutResult = {
      colNodes: colsHierarchy.getNodes(),
      colsHierarchy,
      rowNodes: rowsHierarchy.getNodes(),
      rowsHierarchy,
      rowLeafNodes,
      colLeafNodes,
      getCellMeta,
      spreadsheet,
    } as LayoutResult;
    return layoutDataPosition(this.cfg, layoutResult);
  }

  // TODO cell sticky border event
  protected fireReachBorderEvent(scrollX: number, scrollY: number) {
    const colNode = this.spreadsheet
      .getColumnNodes()
      .find(
        (value) =>
          includes(this.getScrollColField(), value.field) &&
          scrollX > value.x &&
          scrollX < value.x + value.width,
      );
    const rowNode = this.spreadsheet
      .getRowNodes()
      .find(
        (value) =>
          includes(this.getScrollRowField(), value.field) &&
          scrollY > value.y &&
          scrollY < value.y + value.height,
      );
    const reachedBorderId = this.spreadsheet.store.get('lastReachedBorderId', {
      rowId: '',
      colId: '',
    });
    if (colNode && reachedBorderId.colId !== colNode.id) {
      this.spreadsheet.store.set(
        'lastReachedBorderId',
        merge({}, reachedBorderId, {
          colId: colNode.id,
        }),
      );
      this.spreadsheet.emit(S2Event.LAYOUT_COL_NODE_BORDER_REACHED, colNode);
    }
    if (rowNode && reachedBorderId.rowId !== rowNode.id) {
      this.spreadsheet.store.set(
        'lastReachedBorderId',
        merge({}, reachedBorderId, {
          rowId: rowNode.id,
        }),
      );
      this.spreadsheet.emit(S2Event.LAYOUT_ROW_NODE_BORDER_REACHED, rowNode);
    }
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
   */
  private calculateColNodesCoordinate(
    colLeafNodes: Node[],
    colsHierarchy: Hierarchy,
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
      this.adustTotalNodesCoordinate(colsHierarchy);
      this.adjustSubTotalNodesCoordinate(colsHierarchy);
    }
  }

  /**
   * Auto Auto Auto column no-leaf node's width and x coordinate
   * @param colLeafNodes
   */
  private autoCalculateColNodeWidthAndX(colLeafNodes: Node[]) {
    let prevColParent = null;
    const leafNodes = colLeafNodes.slice(0);
    while (leafNodes.length) {
      const node = leafNodes.shift();
      const parent = node.parent;
      if (prevColParent !== parent && parent) {
        leafNodes.push(parent);
        // parent's x = first child's x
        parent.x = parent.children[0].x;
        // parent's width = all children's width
        parent.width = parent.children
          .map((value: Node) => value.width)
          .reduce((sum, current) => sum + current, 0);
        prevColParent = parent;
      }
    }
  }

  private calculateColLeafNodesWidth(
    col: Node,
    colLeafNodes: Node[],
    rowHeaderWidth: number,
  ): number {
    const { colCfg, dataSet, filterDisplayDataItem } = this.cfg;
    // current.width =  get(colCfg, `widthByFieldValue.${current.value}`, current.width);
    const userDragWidth = get(
      get(colCfg, 'widthByFieldValue'),
      `${col.value}`,
      col.width,
    );
    let colWidth: number;
    if (userDragWidth) {
      return userDragWidth;
    }
    if (this.spreadsheet.getLayoutWidthType() === LAYOUT_WIDTH_TYPES.Compact) {
      // compat
      const multiData = dataSet.getMultiData(
        col.query,
        col.isTotals || col.isTotalMeasure,
      );
      const colLabel = col.label;
      // will deal with real width calculation in multiple values render pr
      const allLabels = multiData
        .map((data) => `${handleDataItem(data, filterDisplayDataItem)}`)
        ?.slice(0, 50);
      allLabels.push(colLabel);
      const maxLabel = maxBy(allLabels, (label) =>
        measureTextWidthRoughly(label),
      );
      const { bolderText: colCellTextStyle, cell: colCellStyle } =
        this.spreadsheet.theme.colCell;
      DebuggerUtil.getInstance().logger(
        'Max Label In Col:',
        col.field,
        maxLabel,
      );
      colWidth =
        measureTextWidth(maxLabel, colCellTextStyle) +
        colCellStyle.padding?.left +
        colCellStyle.padding?.right;
      return colWidth;
    }
    // adaptive
    if (this.spreadsheet.isHierarchyTreeType()) {
      return this.getAdaptTreeColWidth(colLeafNodes);
    }
    return this.getAdaptGridColWidth(colLeafNodes, rowHeaderWidth);
  }

  private getColNodeHeight(col: Node) {
    const { colCfg } = this.cfg;
    const userDraggedHeight = get(colCfg, `heightByField.${col.key}`);
    return userDraggedHeight || colCfg.height;
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

    // 1、calculate first node's width in every level
    if (isTree) {
      rowsHierarchy.width = this.getTreeRowHeaderWidth();
    } else {
      for (const levelSample of rowsHierarchy.sampleNodesForAllLevels) {
        levelSample.width = this.calculateRowLeafNodesWidth(
          levelSample,
          colLeafNodes,
        );
        rowsHierarchy.width += levelSample.width;
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
          cellCfg.height +
          this.rowCellTheme.padding?.top +
          this.rowCellTheme.padding?.bottom;
        preLeafNode = currentNode;
        // mark row hierarchy's height
        rowsHierarchy.height += currentNode.height;
      }

      if (isTree || currentNode.level === 0) {
        currentNode.x = 0;
      } else {
        const preLevelSample = rowsHierarchy.sampleNodesForAllLevels.find(
          (n) => n.level === currentNode.level - 1,
        );
        currentNode.x = preLevelSample?.x + preLevelSample?.width;
      }
      currentNode.width = this.calculateRowLeafNodesWidth(
        currentNode,
        colLeafNodes,
      );
      layoutCoordinate(this.cfg, currentNode, null);
    }
    if (!isTree) {
      this.autoCalculateRowNodeHeightAndY(rowLeafNodes);
      if (!isEmpty(spreadsheet.options.totals?.row)) {
        this.adustTotalNodesCoordinate(rowsHierarchy, true);
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
  private adustTotalNodesCoordinate(
    hierarchy: Hierarchy,
    isRowHeader?: boolean,
  ) {
    const { maxLevel } = hierarchy;
    const grandTotalNode = find(
      hierarchy.getNodes(0),
      (node: Node) => node.isGrandTotals,
    );
    if (!(grandTotalNode instanceof Node)) return;
    const grandTotalChildren = grandTotalNode.children;
    // 总计节点层级 (有且有两级)
    if (isRowHeader) {
      // 填充行总单元格宽度
      grandTotalNode.width = hierarchy.width;
      // 调整其叶子结点位置
      forEach(grandTotalChildren, (node: Node) => {
        node.x = hierarchy.getNodes(maxLevel)[0].x;
      });
    } else if (
      maxLevel > 1 ||
      (maxLevel <= 1 && !this.cfg.dataSet.moreThanOneValue())
    ) {
      // 只有当列头总层级大于1级或列头为1级单指标时总计格高度才需要填充
      // 填充列总单元格高度
      grandTotalNode.height = hierarchy.height;
      // 调整其叶子结点位置
      forEach(grandTotalChildren, (node: Node) => {
        node.y = hierarchy.getNodes(maxLevel)[0].y;
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

    if (isEmpty(subTotalNodes)) return;
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
        subTotalNode.height = getSubTotalNodeWidthOrHeightByLevel(
          hierarchy.sampleNodesForAllLevels,
          subTotalNode.level,
          'height',
        );
        // 调整其叶子结点位置
        forEach(subTotalNodeChildren, (node: Node) => {
          node.y = hierarchy.getNodes(maxLevel)[0].y;
        });
      }
    });
  }

  /**
   * 计算行叶子节点宽度
   * @param node
   * @returns
   */
  private calculateRowLeafNodesWidth(node: Node, colLeafNodes: Node[]): number {
    const { rowCfg, spreadsheet } = this.cfg;
    if (spreadsheet.isHierarchyTreeType()) {
      // all node's width is the same
      return this.getTreeRowHeaderWidth();
    }
    const userDragWidth = get(rowCfg, `widthByField.${node.key}`);
    if (userDragWidth) {
      return userDragWidth;
    }
    if (spreadsheet.getLayoutWidthType() !== LAYOUT_WIDTH_TYPES.Adaptive) {
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
  private getAdaptTreeColWidth(colLeafNodes: Node[]): number {
    // tree row width = [config width, canvas / 2]
    const canvasW = this.getCanvasHW().width;
    const rowHeaderWidth = Math.min(canvasW / 2, this.getTreeRowHeaderWidth());
    // calculate col width
    const colSize = Math.max(1, colLeafNodes.length);
    const { cellCfg } = this.cfg;
    return Math.max(cellCfg.width, (canvasW - rowHeaderWidth) / colSize);
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
    const size = Math.max(1, rowHeaderColSize + colHeaderColSize);
    if (!rowHeaderWidth) {
      // canvasW / (rowHeader's col size + colHeader's col size) = [celCfg.width, canvasW]
      return Math.max(cellCfg.width, canvasW / size);
    }
    // (canvasW - rowHeaderW) / (colHeader's col size) = [celCfg.width, canvasW]
    return Math.max(
      cellCfg.width,
      (canvasW - rowHeaderWidth) / colHeaderColSize,
    );
  }

  /**
   * 计算树状结构行头宽度
   * @returns number
   */
  private getTreeRowHeaderWidth(): number {
    const { rows, dataSet, rowCfg, treeRowsWidth } = this.cfg;
    // user drag happened
    if (rowCfg.treeRowsWidth) {
      return rowCfg.treeRowsWidth;
    }
    // + province/city/level
    const treeHeaderLabel = rows
      .map((key: string): string => dataSet.getFieldName(key))
      .join('/');
    const { bolderText: cornerCellTextStyle, icon: cornerIconStyle } =
      this.spreadsheet.theme.cornerCell;
    // 初始化角头时，保证其在树形模式下不换行，给与两个icon的宽度空余（tree icon 和 action icon），减少复杂的 action icon 判断
    const maxLabelWidth =
      measureTextWidth(treeHeaderLabel, cornerCellTextStyle) +
      cornerIconStyle.size * 2 +
      cornerIconStyle.margin?.left +
      cornerIconStyle.margin?.right +
      this.rowCellTheme.padding?.left +
      this.rowCellTheme.padding?.right;

    const width = Math.max(treeRowsWidth, maxLabelWidth);
    // NOTE: mark as user drag to calculate only one time
    rowCfg.treeRowsWidth = width;
    return width;
  }

  private getCompactGridRowWidth(node: Node): number {
    const { dataSet, spreadsheet } = this.cfg;
    // compat => find current column node's max text label
    const { field } = node;
    // row nodes max label
    const dimValues = dataSet.getDimensionValues(node.field)?.slice(0, 50);
    const maxLabel = maxBy(dimValues, (v) => `${v}`.length);
    // field name
    const fieldName = dataSet.getFieldName(field);
    const measureText =
      measureTextWidthRoughly(maxLabel) > measureTextWidthRoughly(fieldName)
        ? maxLabel
        : fieldName;
    const textStyle = spreadsheet.theme.rowCell.bolderText;
    DebuggerUtil.getInstance().logger('Max Label In Row:', field, measureText);
    return (
      measureTextWidth(measureText, textStyle) +
      this.rowCellTheme.padding?.left +
      this.rowCellTheme.padding?.right
    );
  }

  private getScrollColField(): string[] {
    return get(this.spreadsheet, 'options.scrollReachNodeField.colField', []);
  }

  private getScrollRowField(): string[] {
    return get(this.spreadsheet, 'options.scrollReachNodeField.rowField', []);
  }

  protected getViewCellHeights(layoutResult: LayoutResult) {
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
        return heights.length;
      },

      getIndexRange: (minHeight: number, maxHeight: number) => {
        let yMin = findIndex(
          heights,
          (height: number, idx: number) => {
            const y = minHeight;
            return y >= height && y < heights[idx + 1];
          },
          0,
        );

        yMin = Math.max(yMin, 0);

        let yMax = findIndex(
          heights,
          (height: number, idx: number) => {
            const y = maxHeight;
            return y >= height && y < heights[idx + 1];
          },
          yMin,
        );
        yMax = Math.min(yMax === -1 ? Infinity : yMax, heights.length - 2);

        return {
          start: yMin,
          end: yMax,
        };
      },
    };
  }
}
