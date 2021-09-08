import {
  findIndex,
  get,
  includes,
  isEmpty,
  last,
  maxBy,
  merge,
  reduce,
  forEach,
  find,
  filter,
} from 'lodash';
import {
  EXTRA_FIELD,
  ICON_RADIUS,
  S2Event,
  VALUE_FIELD,
} from 'src/common/constant';
import { DebuggerUtil } from 'src/common/debug';
import { LayoutResult, ViewMeta } from 'src/common/interface';
import { BaseFacet } from 'src/facet/index';
import { buildHeaderHierarchy } from 'src/facet/layout/build-header-hierarchy';
import { Hierarchy } from 'src/facet/layout/hierarchy';
import { Node } from 'src/facet/layout/node';
import { measureTextWidth, measureTextWidthRoughly } from 'src/utils/text';
import { handleDataItem } from '@/utils/cell/data-cell';
import {
  layoutCoordinate,
  layoutDataPosition,
} from '@/facet/layout/layout-hooks';

export class PivotFacet extends BaseFacet {
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
    const getCellMeta = (rowIndex: number, colIndex: number): ViewMeta => {
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
        spreadsheet.facet.cfg.colCfg.hideMeasureColumn ?? false;
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
    this.calculateColWidth(colLeafNodes);
    this.calculateRowNodesCoordinate(rowLeafNodes, rowsHierarchy);
    this.calculateColNodesCoordinate(colLeafNodes, colsHierarchy);
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
        currentNode.width = this.calculateColLeafNodesWidth(currentNode);
        colsHierarchy.width += currentNode.width;
        preLeafNode = currentNode;
      }

      if (currentNode.level === 0) {
        currentNode.y = 0;
      } else {
        const preLevelSample = colsHierarchy.sampleNodesForAllLevels.find(
          (n) => n.level === currentNode.level - 1,
        );
        currentNode.y = preLevelSample.y + preLevelSample.height;
      }
      currentNode.height = this.getColNodeHeight(currentNode);
      layoutCoordinate(this.cfg, null, currentNode);
    }
    this.autoCalculateColNodeWidthAndX(colLeafNodes);
    if (!isEmpty(spreadsheet.options.totals)) {
      this.adustTotalNodesCoordinate(colsHierarchy);
    }
    // 当只有一个指标的时候，需要填充小计格子大小
    if (!this.cfg.dataSet.moreThanOneValue()) {
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
          .reduce((sum, current) => sum + current);
        prevColParent = parent;
      }
    }
  }

  private calculateColLeafNodesWidth(col: Node): number {
    const { cellCfg, colCfg, dataSet, spreadsheet, filterDisplayDataItem } =
      this.cfg;
    // 0e48088b-8bb3-48ac-ae8e-8ab08af46a7b:[DAY]:[RC]:[VALUE] 这样的id get 直接获取不到
    // current.width =  get(colCfg, `widthByFieldValue.${current.value}`, current.width);
    const userDragWidth = get(
      get(colCfg, 'widthByFieldValue'),
      `${col.value}`,
      col.width,
    );
    let colWidth;
    if (userDragWidth) {
      colWidth = userDragWidth;
    } else if (cellCfg.width === -1) {
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
      const textStyle = spreadsheet.theme.colCell.bolderText;
      DebuggerUtil.getInstance().logger(
        'Max Label In Col:',
        col.field,
        maxLabel,
      );
      colWidth =
        measureTextWidth(maxLabel, textStyle) +
        cellCfg.padding?.left +
        cellCfg.padding?.right;
    } else {
      // adaptive
      colWidth = cellCfg.width;
    }
    // TODO derived values in same cell
    return colWidth;
  }

  private getColNodeHeight(col: Node) {
    const { colCfg } = this.cfg;
    const userDragWidth = get(colCfg, `heightByField.${col.key}`);
    return userDragWidth || colCfg.height;
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
  ) {
    const { cellCfg, spreadsheet } = this.cfg;
    const isTree = spreadsheet.isHierarchyTreeType();

    // 1、calculate first node's width in every level
    if (isTree) {
      rowsHierarchy.width = this.getTreeRowHeaderWidth();
    } else {
      for (const levelSample of rowsHierarchy.sampleNodesForAllLevels) {
        levelSample.width = this.calculateRowLeafNodesWidth(levelSample);
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
          cellCfg.height + cellCfg.padding?.top + cellCfg.padding?.bottom;
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
      currentNode.width = this.calculateRowLeafNodesWidth(currentNode);
      layoutCoordinate(this.cfg, currentNode, null);
    }
    if (!isTree) {
      this.autoCalculateRowNodeHeightAndY(rowLeafNodes);
      if (!isEmpty(spreadsheet.options.totals)) {
        this.adustTotalNodesCoordinate(rowsHierarchy, true);
      }
      // 当只有一个指标的时候，需要填充小计格子大小
      if (!this.cfg.dataSet.moreThanOneValue()) {
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
          .reduce((sum, current) => sum + current);
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
    // const totalLevel = isEmpty(grandTotalChildren) ? 0 : 1;
    if (isRowHeader) {
      // 填充行总单元格宽度
      grandTotalNode.width = hierarchy.sampleNodesForAllLevels
        .map((value) => value.width)
        .reduce((sum, current) => sum + current);
      // 调整其叶子结点位置
      forEach(grandTotalChildren, (node: Node) => {
        node.x = hierarchy.getNodes(maxLevel)[0].x;
      });
    } else {
      // 填充列总单元格宽度
      grandTotalNode.height = hierarchy.sampleNodesForAllLevels
        .map((value) => value.height)
        .reduce((sum, current) => sum + current);
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
    forEach(subTotalNodes, (subTotalNode: Node) => {
      if (isEmpty(subTotalNode.children)) {
        if (isRowHeader) {
          subTotalNode.width = hierarchy.sampleNodesForAllLevels
            .filter((node: Node) => node.level >= subTotalNode.level)
            .map((value) => value.width)
            .reduce((sum, current) => sum + current);
        } else {
          subTotalNode.height = hierarchy.sampleNodesForAllLevels
            .filter((node: Node) => node.level >= subTotalNode.level)
            .map((value) => value.height)
            .reduce((sum, current) => sum + current);
        }
      }
    });
  }

  private calculateRowLeafNodesWidth(node: Node): number {
    const { dataSet, rowCfg, cellCfg, spreadsheet } = this.cfg;
    if (spreadsheet.isHierarchyTreeType()) {
      // all node's width is the same
      return this.getTreeRowHeaderWidth();
    }
    const userDragWidth = get(rowCfg, `widthByField.${node.key}`);
    if (userDragWidth) {
      return userDragWidth;
    }
    if (rowCfg.width === -1) {
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
      DebuggerUtil.getInstance().logger(
        'Max Label In Row:',
        field,
        measureText,
      );
      return (
        measureTextWidth(measureText, textStyle) +
        cellCfg.padding?.left +
        cellCfg.padding?.right
      );
    }
    // adaptive
    return rowCfg.width;
  }

  /**
   * Determine col cell width(include columns in rowHeader and colHeader)
   * 1.colCfg.colWidthType = adaptive
   * col width auto fit canvas width
   *
   * 2.colCfg.colWidthType = compat
   * col width determined by col info(label's max width in current column)
   *
   * colWidth will be specific value or -1
   * where -1 represent compat width
   *
   * rowHeader's column width be determined by rowCfg.width or rowCfg.treeRowsWidth
   * colHeader's column width be determined by cellCfg.width
   * @param colLeafNodes
   */
  private calculateColWidth(colLeafNodes: Node[]) {
    const { rowCfg, cellCfg } = this.cfg;
    let colWidth;
    if (this.spreadsheet.isColAdaptive()) {
      // auto fit canvas width
      if (this.spreadsheet.isHierarchyTreeType()) {
        // row header tree type, colW = (canvasW - treeWidth) / colSize
        colWidth = this.getColWidthAdaptTree(colLeafNodes);
      } else {
        // grid type
        colWidth = this.getColWidthAdaptGrid(colLeafNodes);
      }
    } else {
      // compact cell width
      colWidth = -1;
    }
    // row width use rowCfg.width as width
    rowCfg.width = colWidth;
    // col leaf nodes use cellCfg.width as width
    cellCfg.width = colWidth;
  }

  private getColWidthAdaptGrid(colLeafNodes: Node[]) {
    // canvasW / (rowHeader's col size + colHeader's col size) = [celCfg.width, canvasW]
    const { rows, cellCfg } = this.cfg;
    const rowHeaderColSize = rows.length;
    const colHeaderColSize = colLeafNodes.length;
    const canvasW = this.getCanvasHW().width;
    const size = Math.max(1, rowHeaderColSize + colHeaderColSize);
    return Math.max(cellCfg.width, canvasW / size);
  }

  private getTreeRowHeaderWidth(): number {
    const { rows, dataSet, rowCfg, cellCfg, treeRowsWidth } = this.cfg;
    // user drag happened
    if (rowCfg.treeRowsWidth) {
      return rowCfg.treeRowsWidth;
    }
    // + province/city/level
    const treeHeaderLabel = rows
      .map((key: string): string => dataSet.getFieldName(key))
      .join('/');
    const textStyle = this.spreadsheet.theme.rowCell.bolderText;
    // TODO icon radius and padding things
    const maxLabelWidth =
      measureTextWidth(treeHeaderLabel, textStyle) +
      ICON_RADIUS * 2 +
      cellCfg.padding?.left +
      cellCfg.padding?.right;
    const width = Math.max(treeRowsWidth, maxLabelWidth);
    // NOTE: mark as user drag to calculate only one time
    rowCfg.treeRowsWidth = width;
    return width;
  }

  private getColWidthAdaptTree(colLeafNodes: Node[]): number {
    // tree row width = [config width, canvas / 2]
    const canvasW = this.getCanvasHW().width;
    const rowHeaderWidth = Math.min(canvasW / 2, this.getTreeRowHeaderWidth());
    // calculate col width
    const colSize = Math.max(1, colLeafNodes.length);
    const { cellCfg } = this.cfg;
    return Math.max(cellCfg.width, (canvasW - rowHeaderWidth) / colSize);
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

      getCellHeight: (index: number) => {
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
