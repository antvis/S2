import * as _ from 'lodash';
import { EXTRA_FIELD, VALUE_FIELD } from '../../common/constant';
import { DetailDataSet, DetailPivot } from '../../data-set';
import { SpreadsheetFacet } from '../index';
import { LayoutResult, ViewMeta } from '../../common/interface';
import { Hierarchy } from './hierarchy';
import { Layout } from './index';
import { Node } from './node';
import { processColsList, processRowsList } from './util';
import { ColsResult } from './util/process-cols';
import { RowsResult } from './util/process-rows';
import { DEFAULT_FACET_CFG as DefaultCfg } from './default-facet-cfg';

/**
 * ListSheet's Layout class
 */
export class DetailLayout extends Layout {
  constructor(facet: SpreadsheetFacet) {
    super(facet);
    this.facet = facet;
    this.cfg = facet.cfg;
  }

  public doLayout(): LayoutResult {
    this.processDefaultColWidth();
    const { rowLeafNodes, rowsHierarchy } = this.getRows();
    const { colLeafNodes, colsHierarchy } = this.getCols(rowsHierarchy);
    // for empty node
    if (rowLeafNodes.length === 0) {
      const node = Node.rootNode();
      node.x = 0;
      node.y = 0;
      node.height = 32;
      node.width = 60;
      rowLeafNodes.push(node);
    }

    const dataSet = this.dataSet;

    function getViewMeta(rowIndex: number, colIndex: number): ViewMeta {
      const i = rowIndex || 0;
      const j = colIndex || 0;
      const row = rowLeafNodes[i];
      const col = colLeafNodes[j];
      if (!row || !col) {
        return null;
      }
      const { y, height } = rowLeafNodes[i];
      const { x, width } = colLeafNodes[j];

      const dataQuery = {
        // 第几行, 列维度值
        ['rowIndex']: i,
        ['colField']: col.key,
      };
      // make return value structure look like normal layout
      const data = dataSet.pivot.getRecords(dataQuery);
      return {
        x,
        y,
        width,
        height,
        data,
        rowIndex: i,
        colIndex: j,
        valueField: _.get(data, [0, EXTRA_FIELD], 0),
        fieldValue: _.get(data, [0, VALUE_FIELD], ''),
      } as ViewMeta;
    }

    const ss = this.facet.spreadsheet;
    const layoutResult = {
      colNodes: colsHierarchy.getNodes(),
      colsHierarchy,
      rowNodes: rowsHierarchy.getNodes(),
      rowsHierarchy,
      getViewMeta,
      rowLeafNodes,
      colLeafNodes,
      spreadsheet: ss,
    } as LayoutResult;
    const callback = this.cfg?.layoutResult;
    return callback ? callback(layoutResult) : layoutResult;
  }

  protected getRows(): RowsResult {
    // TODO 为冻结行头预留接口, 否则默认全部当列渲染 这个有个问题就是当冻结行头=0列的时候
    const rows = this.rows;
    return processRowsList(
      this.pivot as DetailPivot,
      this.cfg,
      rows,
      this.facet,
    );
  }

  protected getCols(rowsHierarchy: Hierarchy): ColsResult {
    if (!_.isArray(this.values)) {
      return;
    }
    const cols = this.values;
    return processColsList(
      this.facet,
      this.cfg,
      cols,
      this.dataSet as DetailDataSet,
      rowsHierarchy,
    );
  }

  private processDefaultColWidth() {
    if (!_.isArray(this.values)) {
      return;
    }
    const rows = this.rows;
    const cols = this.values; // list-sheet don't have direct cols
    const { rowCfg, cellCfg } = this.facet.cfg;
    const defaultCellWidth = DefaultCfg.cellCfg.width;
    let colWidth = defaultCellWidth;
    const colSize = Math.max(1, rows.length + cols.length);
    const canvasW = this.facet.getCanvasHW().width;
    if (this.facet.cfg.spreadsheet.isColAdaptive()) {
      // list-sheet's col width
      // width = DEFAULT_PADDING + realWidth + DEFAULT_PADDING + ICON_RADIUS * 2 + DEFAULT_PADDING
      const realWidth = Math.floor(canvasW / colSize);
      colWidth = Math.max(defaultCellWidth, realWidth);
    } else {
      colWidth = -1;
    }
    // reset rowHeader,colHeader cell width
    rowCfg.width = colWidth;
    cellCfg.width = colWidth;
  }
}
