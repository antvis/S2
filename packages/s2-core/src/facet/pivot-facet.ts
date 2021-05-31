import { LayoutResult, ViewMeta } from "src/common/interface";
import {
  EXTRA_FIELD,
  KEY_COL_NODE_BORDER_REACHED,
  KEY_ROW_NODE_BORDER_REACHED,
  VALUE_FIELD
} from "src/common/constant";
import * as _ from "lodash";
import { BaseFacet } from "src/facet/index";
import processDefaultColWidthByType from "src/facet/layout/util/process-default-col-width-by-type";
import processRowNodesCoordinate from "src/facet/layout/util/process-row-nodes-coordinate";
import processColNodesCoordinate from "src/facet/layout/util/process-col-nodes-coordinate";
import { buildHeaderHierarchy } from "src/facet/layout/build-header-hierarchy";

export class PivotFacet extends BaseFacet {

  protected doLayout(): LayoutResult {
    // 1、layout all nodes in rowHeader and colHeader
    const { leafNodes: rowLeafNodes, hierarchy: rowsHierarchy } = buildHeaderHierarchy({
      isRowHeader: true,
      facetCfg: this.cfg,
    });
    const { leafNodes: colLeafNodes, hierarchy: colsHierarchy } = buildHeaderHierarchy({
      isRowHeader: false,
      facetCfg: this.cfg,
    });

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
    const dataSet = this.cfg.dataSet;
    const values = dataSet.fields.values;
    const ss = this.spreadsheet;

    function getViewMeta(rowIndex: number, colIndex: number): ViewMeta {
      const i = rowIndex || 0;
      const j = colIndex || 0;
      const row = rowLeafNodes[i];
      const col = colLeafNodes[j];
      if (!row || !col) {
        return null;
      }
      const rowQuery = row.query;
      const colQuery = col.query;
      const dataQuery = _.merge({}, rowQuery, colQuery);
      let data = dataSet.getCellData(dataQuery);
      data = _.get(data, "0");
      // data.isTotals = row.isTotals || col.isTotalMeasure;
      let valueField = '';
      let fieldValue = null;
      // TODO fix me
      if (!_.isEmpty(data)) {
        if (_.has(data, EXTRA_FIELD) || _.has(data, VALUE_FIELD)) {
          valueField = _.get(data, [EXTRA_FIELD], '');
          fieldValue = _.get(data, [VALUE_FIELD], null);
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
        isTotals: row.isTotals || row.isTotalMeasure || col.isTotals || col.isTotalMeasure,
        valueField,
        fieldValue,
        rowQuery,
        colQuery,
        rowId: row.id,
        colId: col.id,
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
