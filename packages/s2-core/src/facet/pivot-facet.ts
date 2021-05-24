import { LayoutResult, ViewMeta } from "src/common/interface";
import {
  EXTRA_FIELD,
  KEY_COL_NODE_BORDER_REACHED,
  KEY_ROW_NODE_BORDER_REACHED,
  VALUE_FIELD
} from "src/common/constant";
import * as _ from "lodash";
import { BaseFacet } from "src/facet/index";
import { getDimsConditionByNode, processCols, processRows } from "src/facet/layout/util";
import processDefaultColWidthByType from "src/facet/layout/util/process-default-col-width-by-type";
import processRowNodesCoordinate from "src/facet/layout/util/process-row-nodes-coordinate";
import processColNodesCoordinate from "src/facet/layout/util/process-col-nodes-coordinate";

export class PivotFacet extends BaseFacet {

  protected doLayout(): LayoutResult {
    // 1、layout all nodes in rowHeader and colHeader
    const { rowLeafNodes, rowsHierarchy } = processRows(this);
    const { colLeafNodes, colsHierarchy } = processCols(this);

    // 2、handle col width first by type(spreadsheet or list-sheet | (tree or grid))
    processDefaultColWidthByType(this, colsHierarchy);

    // 3、calculate all nodes coordinate
    processRowNodesCoordinate(
      this,
      rowsHierarchy,
      rowLeafNodes,
    );
    processColNodesCoordinate(
      colLeafNodes,
      rowsHierarchy,
      colsHierarchy,
      this,
    );
    // 处理行头中的叶子节点，计算出高度不为0的叶子的节点的rowIndex
    let index = 0;
    rowLeafNodes.forEach((value) => {
      if (value.height !== 0) {
        // eslint-disable-next-line no-param-reassign
        value.rowIndexHeightExist = index;
        index += 1;
      }
    });
    const dataSet = this.cfg.dataSet;
    const ss = this.spreadsheet;

    function getViewMeta(rowIndex: number, colIndex: number): ViewMeta {
      const i = rowIndex || 0;
      const j = colIndex || 0;
      const row = rowLeafNodes[i];
      const col = colLeafNodes[j];
      if (!row || !col) {
        return null;
      }
      // 高度等于0 直接返回空，不创建任何的cell和数据计算
      if (row.isHide()) {
        return null;
      }
      // 树状表格没有小计行，需要判断该单元格是否展示聚合数据
      const rowTotalsConfig = ss.getTotalsConfig(row.key);
      const colTotalsConfig = ss.getTotalsConfig(col.key);
      // 是否是树状布局
      const isInTree = ss.isHierarchyTreeType();
      // 是否是父节点对应的单元格
      // 收起时，判断是否是叶子节点；展开时判断是否有
      const isParentInTree = !row.isLeaf;
      // 父节点是否需要展示小计 -- tree mode don't need subTotals
      const isSubTotalsInTree =
        isInTree && rowTotalsConfig.showSubTotals && isParentInTree;
      // check if the node is totals(grandTotal or subTotal)
      const isTotals: boolean =
        isSubTotalsInTree || row.isTotals || col.isTotals;
      // grand totals node
      const isGrandTotals = row.isGrandTotals || col.isGrandTotals;
      const isSubTotals = row.isSubTotals || col.isSubTotals;
      const isValueInColsTotal = !ss.options.valueInCols && col.isGrandTotals;
      // isSubTotalsInTree use to get the whole path of node by force
      const rowQuery = getDimsConditionByNode(row, isSubTotalsInTree);
      // 数值挂行头且有列总计的特殊情况，需要强制返回node路径
      const colQuery = getDimsConditionByNode(col, isValueInColsTotal);
      const dataQuery = isValueInColsTotal
        ? _.merge({}, rowQuery)
        : _.merge({}, rowQuery, colQuery);

      const test = dataSet.getCellData(dataQuery);
      console.log(`${i}-${j}`, dataQuery, test);
      const data = test;

      // mark grand totals node in origin data obj
      _.each(data, (d) => {
        // eslint-disable-next-line no-param-reassign
        d.isGrandTotals = isGrandTotals;
        // eslint-disable-next-line no-param-reassign
        d.isSubTotals = isSubTotals || isSubTotalsInTree;
      });
      let valueField = '';
      let fieldValue = null;
      const realData = _.get(data, [0], {});
      if (!_.isEmpty(realData)) {
        if (_.has(realData, EXTRA_FIELD) || _.has(realData, VALUE_FIELD)) {
          valueField = _.get(realData, [EXTRA_FIELD], '');
          fieldValue = _.get(realData, [VALUE_FIELD], null);
        }
      } else {
        // 数据查询为空，需要默认带上可能存在的valueField
        valueField = _.get(dataQuery, [EXTRA_FIELD], '');
      }
      return {
        spreadsheet: ss,
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
        rowIndexHeightExist: row.rowIndexHeightExist,
      } as ViewMeta;
    }

    const layoutResult = {
      colNodes: colsHierarchy.getNodes(),
      colsHierarchy,
      rowNodes: rowsHierarchy.getNodes(),
      rowsHierarchy,
      rowLeafNodes,
      colLeafNodes,
      getViewMeta,
      spreadsheet: ss,
    } as LayoutResult;
    const callback = this.cfg?.layoutResult;
    return callback ? callback(layoutResult) : layoutResult;
  }

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

  private getScrollColField(): string[] {
    return _.get(this.spreadsheet, 'options.scrollReachNodeField.colField', []);
  }

  private getScrollRowField(): string[] {
    return _.get(this.spreadsheet, 'options.scrollReachNodeField.rowField', []);
  }
}
