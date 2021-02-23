import * as _ from 'lodash';
import { SpreadsheetFacet } from '..';
import { BaseDataSet, Pivot } from '../../data-set';
import { EXTRA_FIELD, VALUE_FIELD } from '../../common/constant';
import {
  DrillDownDataCache,
  LayoutResult,
  SpreadsheetFacetCfg,
  StrategyValue,
  ViewMeta,
} from '../../common/interface';
import { Hierarchy } from './hierarchy';
import { getDimsConditionByNode, processCols, processRows } from './util';
import processColNodesCoordinate from './util/process-col-nodes-coordinate';
import { ColsResult } from './util/process-cols';
import processDefaultColWidthByType from './util/process-default-col-width-by-type';
import processRowNodesCoordinate from './util/process-row-nodes-coordinate';
import { RowsResult } from './util/process-rows';
import { BaseParams } from '../../data-set/base-data-set';

/**
 * SpreadSheet's Layout class
 */
export class Layout {
  public facet: SpreadsheetFacet;

  public cfg: SpreadsheetFacetCfg;

  public dataSet: BaseDataSet<BaseParams>;

  public pivot: Pivot;

  public hierarchyType: string;

  public cols: string[];

  public rows: string[];

  public values: string[] | StrategyValue;

  constructor(facet: SpreadsheetFacet) {
    this.facet = facet;
    this.dataSet = facet.getDataset();
    this.pivot = this.dataSet.getPivot();
    this.cfg = facet.cfg;
    this.cols = this.cfg.cols;
    this.rows = this.cfg.rows;
    this.values = this.cfg.values;
    this.hierarchyType = this.cfg.hierarchyType;
  }

  public doLayout(): LayoutResult {
    // 1、layout all nodes in rowHeader and colHeader
    const { rowLeafNodes, rowsHierarchy } = this.getRows();
    const { colLeafNodes, colsHierarchy } = this.getCols(rowsHierarchy);

    // 2、handle col width first by type(spreadsheet or list-sheet | (tree or grid))
    processDefaultColWidthByType(this.facet, this.pivot, colsHierarchy);
    // 3、calculate all nodes coordinate
    processRowNodesCoordinate(
      this.cfg,
      this.facet,
      rowsHierarchy,
      rowLeafNodes,
    );
    processColNodesCoordinate(
      colLeafNodes,
      rowsHierarchy,
      colsHierarchy,
      this.cfg,
      this.facet,
    );

    // 处理行头中的叶子节点，计算出高度不为0的叶子的节点的rowIndex
    let index = 0;
    rowLeafNodes.forEach((value) => {
      if (value.height !== 0) {
        // eslint-disable-next-line no-param-reassign
        value.rowIndexHeightExist = index;
        index++;
      }
    });
    const dataSet = this.dataSet;
    const ss = this.facet.spreadsheet;

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
      const rowTotalsConfig = dataSet.pivot.getTotalsConfig(row.key);
      const colTotalsConfig = dataSet.pivot.getTotalsConfig(col.key);
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

      let data = [];
      if (isInTree && isParentInTree) {
        // tree mode & collapse
        // 父节点
        if (rowTotalsConfig.showSubTotals) {
          data = dataSet.getData(dataQuery, {
            row: {
              isTotals: true,
              isGrandTotals: row.isGrandTotals,
              isSubTotals: true,
            },
            col: {
              isTotals: col.isTotals,
              isGrandTotals: col.isGrandTotals,
              isSubTotals: col.isSubTotals,
            },
          });
        } else {
          // 是🌲状且不需要展示小计行，需要有两个处理场景
          // 1. 该row id下有下钻维度，则这行显示原始的值(不按小计处理)
          // 2. 没有下钻维度，由于没有配小计 显示为 -
          const drillDownDataCache = ss.store.get(
            'drillDownDataCache',
            [],
          ) as DrillDownDataCache[];
          const cache = drillDownDataCache.find((dc) => dc.rowId === row.id);
          if (cache) {
            data = dataSet.getData(dataQuery);
          } else {
            data = [];
          }
        }
      } else {
        data = dataSet.getData(dataQuery, {
          row: {
            isTotals: row.isTotals,
            isGrandTotals: row.isGrandTotals,
            isSubTotals: row.isSubTotals,
            otherQuery: colQuery,
            isCollapsedHasTotals:
              rowTotalsConfig.showSubTotals && row.isCollapsed,
          },
          col: {
            isTotals: col.isTotals,
            isGrandTotals: col.isGrandTotals,
            isSubTotals: col.isSubTotals,
            otherQuery: rowQuery,
            isCollapsedHasTotals:
              colTotalsConfig.showSubTotals && col.isCollapsed,
          },
        });
      }

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

  protected getCols(rowsHierarchy: Hierarchy): ColsResult {
    return processCols(this.pivot, this.cfg, this.cols);
  }

  protected getRows(): RowsResult {
    return processRows(this.pivot, this.cfg, this.rows, this.facet);
  }
}
