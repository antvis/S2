import { LayoutResult, ViewMeta } from 'src/common/interface';
import {
  EXTRA_FIELD,
  ICON_RADIUS,
  KEY_COL_NODE_BORDER_REACHED,
  KEY_ROW_NODE_BORDER_REACHED,
  VALUE_FIELD,
} from 'src/common/constant';
import * as _ from 'lodash';
import { BaseFacet } from 'src/facet/index';
import { buildHeaderHierarchy } from 'src/facet/layout/build-header-hierarchy';
import { Node } from 'src/facet/layout/node';
import { measureTextWidth, measureTextWidthRoughly } from 'src/utils/text';
import { Hierarchy } from 'src/facet/layout/hierarchy';
import { DebuggerUtil } from 'src/common/debug';
import { layoutNodes } from '@/facet/layout/layout-hooks';

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
      const dataQuery = _.merge({}, rowQuery, colQuery);
      const data = dataSet.getCellData(dataQuery);
      let valueField;
      let fieldValue = null;
      if (!_.isEmpty(data)) {
        valueField = _.get(data, [EXTRA_FIELD], '');
        fieldValue = _.get(data, [VALUE_FIELD], null);
      } else {
        valueField = _.get(dataQuery, [EXTRA_FIELD], '');
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
    const callback = this.cfg?.layoutResult;
    return callback ? callback(layoutResult) : layoutResult;
  }

  // TODO cell sticky border event
  protected fireReachBorderEvent(scrollX: number, scrollY: number) {
    const colNode = this.spreadsheet
      .getColumnNodes()
      .find(
        (value) =>
          _.includes(this.getScrollColField(), value.field) &&
          scrollX > value.x &&
          scrollX < value.x + value.width,
      );
    const rowNode = this.spreadsheet
      .getRowNodes()
      .find(
        (value) =>
          _.includes(this.getScrollRowField(), value.field) &&
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
        _.merge({}, reachedBorderId, {
          colId: colNode.id,
        }),
      );
      this.spreadsheet.emit(KEY_COL_NODE_BORDER_REACHED, colNode);
    }
    if (rowNode && reachedBorderId.rowId !== rowNode.id) {
      this.spreadsheet.store.set(
        'lastReachedBorderId',
        _.merge({}, reachedBorderId, {
          rowId: rowNode.id,
        }),
      );
      this.spreadsheet.emit(KEY_ROW_NODE_BORDER_REACHED, rowNode);
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
    let preLeafNode = Node.blankNode();
    const allNodes = colsHierarchy.getNodes();
    for (const levelSample of colsHierarchy.sampleNodesForAllLevels) {
      levelSample.height = this.getColNodeHeight(levelSample);
      colsHierarchy.height += levelSample.height;
    }
    for (let i = 0; i < allNodes.length; i++) {
      const currentNode = allNodes[i];
      if (currentNode.isLeaf) {
        currentNode.colIndex = i;
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
      layoutNodes(this.cfg, null, currentNode);
    }
    this.autoCalculateColNodeWidthAndX(colLeafNodes);
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
          .reduce((sum, current) => {
            return sum + current;
          });
        prevColParent = parent;
      }
    }
  }

  private calculateColLeafNodesWidth(col: Node): number {
    const { cellCfg, colCfg, dataSet, spreadsheet } = this.cfg;
    // 0e48088b-8bb3-48ac-ae8e-8ab08af46a7b:[DAY]:[RC]:[VALUE] 这样的id get 直接获取不到
    // current.width =  get(colCfg, `widthByFieldValue.${current.value}`, current.width);
    const userDragWidth = _.get(
      _.get(colCfg, 'widthByFieldValue'),
      `${col.value}`,
      col.width,
    );
    let colWidth;
    if (userDragWidth) {
      colWidth = userDragWidth;
    } else if (cellCfg.width === -1) {
      // compat
      const datas = dataSet.getMultiData(
        col.query,
        col.isTotals || col.isTotalMeasure,
      );
      const colLabel = col.label;
      // assume there are no derived values in current cols
      const allLabels = datas
        .map((data) => `${data[VALUE_FIELD]}`)
        ?.slice(0, 50);
      allLabels.push(colLabel);
      const maxLabel = _.maxBy(allLabels, (label) =>
        measureTextWidthRoughly(label),
      );
      const textStyle = spreadsheet.theme.colHeader.bolderText;
      DebuggerUtil.getInstance().logger(
        'Max Label In Col:',
        col.field,
        maxLabel,
      );
      colWidth =
        measureTextWidth(maxLabel, textStyle) +
        cellCfg.padding[1] +
        cellCfg.padding[3];
    } else {
      // adaptive
      colWidth = cellCfg.width;
    }
    // TODO derived values in same cell
    return colWidth;
  }

  private getColNodeHeight(col: Node) {
    const { colCfg } = this.cfg;
    const userDragWidth = _.get(colCfg, `heightByField.${col.key}`);
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
    for (const levelSample of rowsHierarchy.sampleNodesForAllLevels) {
      levelSample.width = this.calculateRowLeafNodesWidth(levelSample);
      if (isTree) {
        rowsHierarchy.width = levelSample.width;
      } else {
        rowsHierarchy.width += levelSample.width;
      }
    }

    // 2、calculate node's height（leaf nodes）, width(all nodes), y coordinate
    let preLeafNode = Node.blankNode();
    const allNodes = rowsHierarchy.getNodes();
    for (let i = 0; i < allNodes.length; i++) {
      const currentNode = allNodes[i];
      // in tree type, all nodes treat as leaf
      const isLeaf = isTree || (!isTree && currentNode.isLeaf);
      if (isLeaf) {
        // leaf node
        currentNode.colIndex = i;
        currentNode.y = preLeafNode.y + preLeafNode.height;
        currentNode.height =
          cellCfg.height + cellCfg.padding[0] + cellCfg.padding[2];
        preLeafNode = currentNode;
        // mark row hierarchy's height
        rowsHierarchy.height += currentNode.height;
      }

      if (isTree) {
        currentNode.x = 0;
      } else if (currentNode.level === 0) {
        currentNode.x = 0;
      } else {
        const preLevelSample = rowsHierarchy.sampleNodesForAllLevels.find(
          (n) => n.level === currentNode.level - 1,
        );
        currentNode.x = preLevelSample.x + preLevelSample.width;
      }
      currentNode.width = this.calculateRowLeafNodesWidth(currentNode);
      layoutNodes(this.cfg, currentNode, null);
    }
    if (!isTree) {
      this.autoCalculateRowNodeHeightAndY(rowLeafNodes);
    }
  }

  /**
   * Auto Auto Auto row no-leaf node's height and y coordinate
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
          .reduce((sum, current) => {
            return sum + current;
          });
        prevRowParent = parent;
      }
    }
  }

  private calculateRowLeafNodesWidth(node: Node): number {
    const { dataSet, rowCfg, cellCfg, spreadsheet } = this.cfg;
    if (spreadsheet.isHierarchyTreeType()) {
      // all node's width is the same
      return this.getTreeRowHeaderWidth();
    }
    const userDragWidth = _.get(rowCfg, `widthByField.${node.key}`);
    if (userDragWidth) {
      return userDragWidth;
    }
    if (rowCfg.width === -1) {
      // compat => find current column node's max text label
      const { field } = node;
      // row nodes max label
      const dimValues = dataSet.getDimensionValues(node.field)?.slice(0, 50);
      const maxLabel = _.maxBy(dimValues, (v) => `${v}`.length);
      // field name
      const fieldName = dataSet.getFieldName(field);
      const measureText =
        measureTextWidthRoughly(maxLabel) > measureTextWidthRoughly(fieldName)
          ? maxLabel
          : fieldName;
      const textStyle = spreadsheet.theme.rowHeader.bolderText;
      DebuggerUtil.getInstance().logger(
        'Max Label In Row:',
        field,
        measureText,
      );
      return (
        measureTextWidth(measureText, textStyle) +
        cellCfg.padding[1] +
        cellCfg.padding[3]
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
      // compat cell width
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
    const textStyle = this.spreadsheet.theme.rowHeader.bolderText;
    // TODO icon radius and padding things
    const maxLabelWidth =
      measureTextWidth(treeHeaderLabel, textStyle) +
      ICON_RADIUS * 2 +
      cellCfg.padding[1] +
      cellCfg.padding[3];
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
    return (canvasW - rowHeaderWidth) / colSize;
  }

  private getScrollColField(): string[] {
    return _.get(this.spreadsheet, 'options.scrollReachNodeField.colField', []);
  }

  private getScrollRowField(): string[] {
    return _.get(this.spreadsheet, 'options.scrollReachNodeField.rowField', []);
  }
}
