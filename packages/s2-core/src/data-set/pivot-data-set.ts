import {
  compact,
  concat,
  difference,
  each,
  every,
  filter,
  find,
  first,
  forEach,
  get,
  has,
  includes,
  isEmpty,
  isNumber,
  isUndefined,
  keys,
  some,
  uniq,
  unset,
  values,
} from 'lodash';
import type { CellMeta } from '../common';
import {
  EXTRA_FIELD,
  ID_SEPARATOR,
  TOTAL_VALUE,
  VALUE_FIELD,
} from '../common/constant';
import { DebuggerUtil, DEBUG_TRANSFORM_DATA } from '../common/debug';
import { i18n } from '../common/i18n';
import type {
  Formatter,
  Meta,
  PartDrillDownDataCache,
  PartDrillDownFieldInLevel,
  RowData,
  S2DataConfig,
  ViewMeta,
} from '../common/interface';
import { Node } from '../facet/layout/node';
import {
  filterTotal,
  flatten as customFlatten,
  flattenDeep as customFlattenDeep,
  getAggregationAndCalcFuncByQuery,
  getFieldKeysByDimensionValues,
  getListBySorted,
  isEveryUndefined,
  splitTotal,
} from '../utils/data-set-operate';
import {
  deleteMetaById,
  getDataPath,
  getDimensionsWithoutPathPre,
  transformDimensionsValues,
  transformIndexesData,
} from '../utils/dataset/pivot-data-set';
import { DataHandler } from '../utils/dataset/proxy-handler';
import { calcActionByType } from '../utils/number-calculate';
import { handleSortAction } from '../utils/sort-action';
import { BaseDataSet } from './base-data-set';
import type {
  CellDataParams,
  CheckAccordQueryParams,
  DataType,
  PivotMeta,
  Query,
  SortedDimensionValues,
  TotalStatus,
} from './interface';

export class PivotDataSet extends BaseDataSet {
  // row dimension values pivot structure
  public rowPivotMeta: PivotMeta;

  // col dimension value pivot structure
  public colPivotMeta: PivotMeta;

  // sorted dimension values
  public sortedDimensionValues: SortedDimensionValues;

  /**
   * When data related config changed, we need
   * 1、re-process config
   * 2、re-transform origin data
   * 3、sort and other things
   * @param dataCfg
   */
  public setDataCfg(dataCfg: S2DataConfig) {
    super.setDataCfg(dataCfg);
    this.sortedDimensionValues = {};
    this.rowPivotMeta = new Map();
    this.colPivotMeta = new Map();
    // total data in raw data scene.
    this.totalData = []
      .concat(splitTotal(dataCfg.data, dataCfg.fields))
      .concat(this.totalData);
    DebuggerUtil.getInstance().debugCallback(DEBUG_TRANSFORM_DATA, () => {
      const { rows, columns, values } = this.fields;
      const { indexesData } = transformIndexesData({
        rows,
        columns: columns as string[],
        values,
        originData: this.originData,
        totalData: this.totalData,
        indexesData: this.indexesData,
        sortedDimensionValues: this.sortedDimensionValues,
        rowPivotMeta: this.rowPivotMeta,
        colPivotMeta: this.colPivotMeta,
      });
      this.indexesData = indexesData;
    });

    this.handleDimensionValuesSort();
  }

  /**
   * Provide a way to append some drill-down data in indexesData
   * @param extraRowField
   * @param drillDownData
   * @param rowNode
   */
  public transformDrillDownData(
    extraRowField: string,
    drillDownData: DataType[],
    rowNode: Node,
  ) {
    const { columns, values } = this.fields;
    const currentRowFields = Node.getFieldPath(rowNode, true);
    const nextRowFields = [...currentRowFields, extraRowField];
    const store = this.spreadsheet.store;

    // 1、通过values在data中注入额外的维度信息，并分离`明细数据`&`汇总数据`

    const totalData = splitTotal(drillDownData, {
      rows: nextRowFields,
      columns: this.fields.columns,
    });
    const originData = difference(drillDownData, totalData);

    // 2. 检查该节点是否已经存在下钻维度
    const rowNodeId = rowNode?.id;
    const idPathMap = store.get('drillDownIdPathMap') ?? new Map();
    if (idPathMap.has(rowNodeId)) {
      // the current node has a drill-down field, clean it
      forEach(idPathMap.get(rowNodeId), (path: number[]) => {
        unset(this.indexesData, path);
      });
      deleteMetaById(this.rowPivotMeta, rowNodeId);
    }

    // 3、转换数据
    const {
      paths: drillDownDataPaths,
      indexesData,
      rowPivotMeta,
      colPivotMeta,
      sortedDimensionValues,
    } = transformIndexesData({
      rows: nextRowFields,
      columns: columns as string[],
      values,
      originData,
      totalData,
      indexesData: this.indexesData,
      sortedDimensionValues: this.sortedDimensionValues,
      rowPivotMeta: this.rowPivotMeta,
      colPivotMeta: this.colPivotMeta,
    });
    this.indexesData = indexesData;
    this.rowPivotMeta = rowPivotMeta;
    this.colPivotMeta = colPivotMeta;
    this.sortedDimensionValues = sortedDimensionValues;

    // 4、record data paths by nodeId
    // set new drill-down data path
    idPathMap.set(rowNodeId, drillDownDataPaths);
    store.set('drillDownIdPathMap', idPathMap);
  }

  /**
   * Clear drill down data by rowNodeId
   * rowNodeId is undefined => clear all
   * @param rowNodeId
   */
  public clearDrillDownData(rowNodeId?: string) {
    const store = this.spreadsheet.store;
    const idPathMap = store.get('drillDownIdPathMap');
    if (!idPathMap) {
      return;
    }
    const drillDownDataCache = store.get(
      'drillDownDataCache',
      [],
    ) as PartDrillDownDataCache[];

    if (rowNodeId) {
      // 1. 删除 indexesData 当前下钻层级对应数据
      const currentIdPathMap = idPathMap.get(rowNodeId);
      if (currentIdPathMap) {
        forEach(currentIdPathMap, (path) => {
          unset(this.indexesData, path);
        });
      }
      // 2. 删除 rowPivotMeta 当前下钻层级对应 meta 信息
      deleteMetaById(this.rowPivotMeta, rowNodeId);

      // 3. 删除下钻缓存路径
      idPathMap.delete(rowNodeId);

      // 4. 过滤清除的下钻缓存
      const restDataCache = filter(drillDownDataCache, (cache) =>
        idPathMap.has(cache?.rowId),
      );
      store.set('drillDownDataCache', restDataCache);

      // 5. 过滤清除的下钻层级
      const restDrillLevels = restDataCache.map((cache) => cache?.drillLevel);
      const drillDownFieldInLevel = store.get(
        'drillDownFieldInLevel',
        [],
      ) as PartDrillDownFieldInLevel[];
      const restFieldInLevel = drillDownFieldInLevel.filter((filed) =>
        includes(restDrillLevels, filed?.drillLevel),
      );

      store.set('drillDownFieldInLevel', restFieldInLevel);
    } else {
      idPathMap.clear();
      // 需要对应清空所有下钻后的dataCfg信息
      // 因此如果缓存有下钻前原始dataCfg，需要清空所有的下钻数据
      const originalDataCfg = this.spreadsheet.store.get('originalDataCfg');
      if (!isEmpty(originalDataCfg)) {
        this.spreadsheet.setDataCfg(originalDataCfg);
      }

      // 清空所有的下钻信息
      this.spreadsheet.store.set('drillItemsNum', -1);
      this.spreadsheet.store.set('drillDownDataCache', []);
      this.spreadsheet.store.set('drillDownFieldInLevel', []);
    }

    store.set('drillDownIdPathMap', idPathMap);
  }

  /**
   * 排序优先级：
   * 1、sortParams里的条件优先级高于原始数据
   * 2、sortParams多个item：按照顺序优先级，排在后面的优先级高
   * 3、item中多个条件：sortByField > sortFunc > sortBy > sortMethod
   */
  handleDimensionValuesSort = () => {
    each(this.sortParams, (item) => {
      const { sortFieldId, sortByMeasure } = item;
      // 万物排序的前提
      if (!sortFieldId) {
        return;
      }
      const originValues = [...(this.sortedDimensionValues[sortFieldId] || [])];
      const result = handleSortAction({
        dataSet: this,
        sortParam: item,
        originValues,
        isSortByMeasure: !isEmpty(sortByMeasure),
      });
      this.sortedDimensionValues[sortFieldId] = result;
    });
  };

  public processDataCfg(dataCfg: S2DataConfig): S2DataConfig {
    const { data, meta = [], fields, sortParams = [], totalData } = dataCfg;
    const { columns, rows, values, valueInCols, customValueOrder } = fields;
    let newColumns = columns;
    let newRows = rows;
    if (valueInCols) {
      newColumns = this.isCustomMeasuresPosition(customValueOrder)
        ? this.handleCustomMeasuresOrder(
            customValueOrder,
            newColumns as string[],
          )
        : uniq([...columns, EXTRA_FIELD]);
    } else {
      newRows = this.isCustomMeasuresPosition(customValueOrder)
        ? this.handleCustomMeasuresOrder(customValueOrder, newRows)
        : uniq([...rows, EXTRA_FIELD]);
    }

    const newMeta: Meta[] = this.processMeta(meta, i18n('数值'));

    return {
      data,
      totalData,
      meta: newMeta,
      fields: {
        ...fields,
        rows: newRows,
        columns: newColumns,
        values,
      },
      sortParams,
    };
  }

  public getDimensionsByField(field: string): string[] {
    const { rows = [], columns = [] } = this.fields || {};
    if (includes(rows, field)) {
      return rows;
    }
    if (includes(columns, field)) {
      return columns as string[];
    }
    return [];
  }

  // rows :['province','city','type']
  // query: ['浙江省',undefined] => return: ['文具','家具']
  public getTotalDimensionValues(field: string, query?: Query): string[] {
    const dimensions = this.getDimensionsByField(field);
    const allCurrentFieldDimensionValues = (
      this.sortedDimensionValues[field] || []
    ).filter((dimValue) =>
      this.checkAccordQueryWithDimensionValue({
        dimensionValues: dimValue,
        query,
        dimensions,
        field,
      }),
    );
    return filterTotal(
      uniq(getDimensionsWithoutPathPre([...allCurrentFieldDimensionValues])),
    );
  }

  public getDimensionValues(field: string, query?: Query): string[] {
    const { rows = [], columns = [] } = this.fields || {};
    let meta: PivotMeta = new Map();
    let dimensions: string[] = [];
    if (includes(rows, field)) {
      meta = this.rowPivotMeta;
      dimensions = rows;
    } else if (includes(columns, field)) {
      meta = this.colPivotMeta;
      dimensions = columns as string[];
    }
    if (!isEmpty(query)) {
      let sortedMeta = [];
      const dimensionValuePath = [];
      for (const dimension of dimensions) {
        const value = get(query, dimension);
        dimensionValuePath.push(`${value}`);
        const cacheKey = dimensionValuePath.join(`${ID_SEPARATOR}`);
        if (meta.has(value) && !isUndefined(value)) {
          const childField = meta.get(value)?.childField;
          meta = meta.get(value).children;
          if (
            find(this.sortParams, (item) => item.sortFieldId === childField) &&
            this.sortedDimensionValues[childField]
          ) {
            const dimensionValues = this.sortedDimensionValues[
              childField
            ]?.filter((item) => item?.startsWith(cacheKey));
            sortedMeta = getDimensionsWithoutPathPre([...dimensionValues]);
          } else {
            sortedMeta = [...meta.keys()];
          }
        }
      }
      if (isEmpty(sortedMeta)) {
        return [];
      }
      return filterTotal(getListBySorted([...meta.keys()], sortedMeta));
    }

    if (this.sortedDimensionValues[field]) {
      return filterTotal(
        getDimensionsWithoutPathPre([...this.sortedDimensionValues[field]]),
      );
    }

    return filterTotal([...meta.keys()]);
  }

  getTotalValue(query: Query, totalStatus?: TotalStatus) {
    const effectiveStatus = some(totalStatus);
    const status = effectiveStatus ? totalStatus : this.getTotalStatus(query);
    const { aggregation, calcFunc } =
      getAggregationAndCalcFuncByQuery(
        status,
        this.spreadsheet.options?.totals,
      ) || {};
    const calcAction = calcActionByType[aggregation];

    // 前端计算汇总值
    if (calcAction || calcFunc) {
      const data = this.getMultiData(query);
      let totalValue: number;
      if (calcFunc) {
        totalValue = calcFunc(query, data);
      } else if (calcAction) {
        totalValue = calcAction(data, VALUE_FIELD);
      }

      return {
        ...query,
        [VALUE_FIELD]: totalValue,
        [query[EXTRA_FIELD]]: totalValue,
      };
    }
  }

  public getCellData(params: CellDataParams): DataType {
    const { query = {}, rowNode, isTotals = false, totalStatus } = params || {};

    const { rows: originRows, columns } = this.fields;
    let rows = originRows;
    const drillDownIdPathMap =
      this.spreadsheet?.store.get('drillDownIdPathMap');

    // 判断当前是否为下钻节点
    // 需检查 rowNode.id 是否属于下钻根节点(drillDownIdPathMap.keys)的下属节点
    const isDrillDown = Array.from(drillDownIdPathMap?.keys() ?? []).some(
      (parentPath) => rowNode.id.startsWith(parentPath),
    );

    // 如果是下钻结点，小计行维度在 originRows 中并不存在
    if (!isTotals || isDrillDown) {
      rows = Node.getFieldPath(rowNode, isDrillDown) ?? originRows;
    }

    const rowDimensionValues = transformDimensionsValues(query, rows);
    const colDimensionValues = transformDimensionsValues(
      query,
      columns as string[],
    );
    const path = getDataPath({
      rowDimensionValues,
      colDimensionValues,
      rowPivotMeta: this.rowPivotMeta,
      colPivotMeta: this.colPivotMeta,
    });
    const data = get(this.indexesData, path);
    if (data) {
      // 如果已经有数据则取已有数据
      return DataHandler.createProxyData(data, query[EXTRA_FIELD]);
    }

    if (isTotals) {
      return this.getTotalValue(query, totalStatus);
    }
  }

  getCustomData = (path: number[]) => {
    let hadUndefined = false;
    let currentData: DataType | DataType[] | DataType[][] = this.indexesData;

    for (let i = 0; i < path.length; i++) {
      const current = path[i];
      if (hadUndefined) {
        if (isUndefined(current)) {
          currentData = customFlatten(currentData) as [];
        } else {
          currentData = values(currentData)?.map(
            (d) => d && get(d, current),
          ) as [];
        }
      } else if (isUndefined(current)) {
        hadUndefined = true;
      } else {
        currentData = currentData?.[current];
      }
    }

    return currentData;
  };

  public getTotalStatus = (query: Query) => {
    const { columns, rows } = this.fields;
    const isTotals = (dimensions: string[], isSubTotal?: boolean) => {
      if (isSubTotal) {
        const firstDimension = find(dimensions, (item) => !has(query, item));
        return firstDimension && firstDimension !== first(dimensions);
      }
      return every(dimensions, (item) => !has(query, item));
    };
    const getDimensions = (dimensions: string[], hasExtra: boolean) => {
      return hasExtra
        ? dimensions.filter((item) => item !== EXTRA_FIELD)
        : dimensions;
    };

    return {
      isRowTotal: isTotals(
        getDimensions(rows, !this.spreadsheet.isValueInCols()),
      ),
      isRowSubTotal: isTotals(rows, true),
      isColTotal: isTotals(
        getDimensions(columns as string[], this.spreadsheet.isValueInCols()),
      ),
      isColSubTotal: isTotals(columns as string[], true),
    };
  };

  /**
   * 检查是否属于需要填充中间汇总维度的场景
   * [undefined , '杭州市' , undefined , 'number'] => true
   * ['浙江省' , '杭州市' , undefined , 'number'] => true
   */
  checkExistDimensionGroup(query: Query): boolean {
    const { rows, columns } = this.fields;
    const check = (dimensions: string[]) => {
      let existDimensionValue = false;
      for (let i = dimensions.length; i > 0; i--) {
        const key = dimensions[i - 1];
        if (keys(query).includes(key)) {
          if (key !== EXTRA_FIELD) {
            existDimensionValue = true;
          }
        } else if (existDimensionValue) {
          return true;
        }
      }
      return false;
    };
    return check(rows) || check(columns as string[]);
  }

  /**
   * 检查 DimensionValue 是否符合 query 条件
   * dimensions = ['province','city']
   * query = [province: '杭州市', type: '文具']
   * field = 'sub_type'
   * DimensionValue: 浙江省[&]杭州市[&]家具[&]桌子 => true
   * DimensionValue: 四川省[&]成都市[&]文具[&]笔 => false
   */
  checkAccordQueryWithDimensionValue(params: CheckAccordQueryParams): boolean {
    const { dimensionValues, query, dimensions, field } = params;
    for (const [index, dimension] of dimensions.entries()) {
      const queryValue = get(query, dimension);
      if (queryValue) {
        const arrTypeValue = dimensionValues.split(ID_SEPARATOR);
        const dimensionValue = arrTypeValue[index];
        if (dimensionValue !== queryValue) {
          return false;
        }
      }
      if (field === dimension) {
        break;
      }
    }
    return true;
  }

  /**
   * 补足分组汇总场景的前置 undefined
   * {undefined,'可乐','undefined','price'}
   * => [
   *      {'可口公司','可乐','undefined','price'}，
   *      {'百事公司','可乐','undefined','price'},
   *    ]
   */
  getTotalGroupQueries(dimensions: string[], originQuery: Query) {
    let queries = [originQuery];
    let existDimensionGroupKey = null;
    for (let i = dimensions.length - 1; i >= 0; i--) {
      const key = dimensions[i];
      if (keys(originQuery).includes(key)) {
        if (key !== EXTRA_FIELD) {
          existDimensionGroupKey = key;
        }
      } else if (existDimensionGroupKey) {
        const allCurrentFieldDimensionValues =
          this.sortedDimensionValues[existDimensionGroupKey];
        let res = [];
        for (const query of queries) {
          const resKeys = [];
          for (const dimValue of allCurrentFieldDimensionValues) {
            if (
              this.checkAccordQueryWithDimensionValue({
                dimensionValues: dimValue,
                query,
                dimensions,
                field: existDimensionGroupKey,
              })
            ) {
              const arrTypeValue = dimValue.split(ID_SEPARATOR);
              const currentKey = arrTypeValue[i];
              if (currentKey !== 'undefined') {
                resKeys.push(currentKey);
              }
            }
          }
          const queryList = uniq(resKeys).map((v) => {
            return { ...query, [key]: v };
          });
          res = concat(res, queryList);
        }
        queries = res;
        existDimensionGroupKey = key;
      }
    }
    return queries;
  }

  // 有中间维度汇总的分组场景，将有中间 undefined 值的 query 处理为一组合法 query 后查询数据再合并
  private getGroupTotalMultiData(
    totalRows: string[],
    originQuery: Query,
  ): DataType[] {
    const { rows, columns } = this.fields;
    let result = [];
    const rowTotalGroupQueries = this.getTotalGroupQueries(
      totalRows,
      originQuery,
    );
    let totalGroupQueries = [];
    for (const query of rowTotalGroupQueries) {
      totalGroupQueries = concat(
        totalGroupQueries,
        this.getTotalGroupQueries(columns as string[], query),
      );
    }

    for (const query of totalGroupQueries) {
      const rowDimensionValues = transformDimensionsValues(query, totalRows);
      const colDimensionValues = transformDimensionsValues(
        query,
        columns as string[],
      );
      const path = getDataPath({
        rowDimensionValues,
        colDimensionValues,
        rowPivotMeta: this.rowPivotMeta,
        colPivotMeta: this.colPivotMeta,
      });
      const currentData = this.getCustomData(path);
      result = concat(result, compact(customFlatten(currentData)));
    }
    return result;
  }

  public getMultiData(
    query: Query,
    isTotals?: boolean,
    isRow?: boolean,
    drillDownFields: string[] = [],
    includeTotalData?: boolean,
  ): DataType[] {
    if (isEmpty(query)) {
      return compact(customFlattenDeep(this.indexesData));
    }
    const { rows, columns, values } = this.fields;
    const totalRows = !isEmpty(drillDownFields)
      ? rows.concat(drillDownFields)
      : rows;
    // existDimensionGroup：当 undefined 维度后面有非 undefined，为维度分组场景，将非 undefined 维度前的维度填充为所有可能的维度值。
    // 如 [undefined , '杭州市' , undefined , 'number']
    const existDimensionGroup =
      !includeTotalData && this.checkExistDimensionGroup(query);
    let result = [];
    if (existDimensionGroup) {
      result = this.getGroupTotalMultiData(totalRows, query);
    } else {
      const rowDimensionValues = transformDimensionsValues(query, totalRows);
      const colDimensionValues = transformDimensionsValues(
        query,
        columns as string[],
      );
      const path = getDataPath({
        rowDimensionValues,
        colDimensionValues,
        rowPivotMeta: this.rowPivotMeta,
        colPivotMeta: this.colPivotMeta,
      });
      const currentData = this.getCustomData(path);
      result = compact(customFlatten(currentData));
      if (isTotals) {
        // 总计/小计（行/列）
        // need filter extra data
        // grand total =>  {$$extra$$: 'price'}
        // sub total => {$$extra$$: 'price', category: 'xxxx'}
        // [undefined, undefined, "price"] => [category]
        let fieldKeys = [];
        const rowKeys = getFieldKeysByDimensionValues(rowDimensionValues, rows);
        const colKeys = getFieldKeysByDimensionValues(
          colDimensionValues,
          columns as string[],
        );
        if (isRow) {
          // 行总计
          fieldKeys = rowKeys;
        } else {
          // 只有一个值，此时为列总计
          const isCol = keys(query)?.length === 1 && has(query, EXTRA_FIELD);

          if (isCol) {
            fieldKeys = colKeys;
          } else {
            const getTotalStatus = (dimensions: string[]) => {
              return isEveryUndefined(
                dimensions?.filter((item) => !values?.includes(item)),
              );
            };
            const isRowTotal = getTotalStatus(colDimensionValues);
            const isColTotal = getTotalStatus(rowDimensionValues);

            if (isRowTotal) {
              // 行小计
              fieldKeys = rowKeys;
            } else if (isColTotal) {
              // 列小计
              fieldKeys = colKeys;
            } else {
              // 行小计+列 or 列小计+行
              fieldKeys = [...rowKeys, ...colKeys];
            }
          }
        }
        result = result.filter(
          (r) =>
            !fieldKeys?.find(
              (item) => item !== EXTRA_FIELD && keys(r)?.includes(item),
            ),
        );
      }
    }
    return result || [];
  }

  public getFieldFormatter(field: string, cellMeta?: ViewMeta): Formatter {
    // 兼容总计小计场景
    if (field === TOTAL_VALUE) {
      return this.getFieldFormatterForTotalValue(cellMeta);
    }
    return super.getFieldFormatter(field);
  }

  private getFieldFormatterForTotalValue(cellMeta?: ViewMeta) {
    let valueField: string;
    // 当数据置于行头时，小计总计列尝试去找对应的指标
    if (!this.spreadsheet.isValueInCols() && cellMeta) {
      valueField = get(cellMeta.rowQuery, EXTRA_FIELD);
    }

    // 如果没有找到对应指标，则默认取第一个维度
    valueField = valueField ?? get(this.fields.values, 0);

    return super.getFieldFormatter(valueField);
  }

  /**
   * 自定义度量组位置值
   * @param customValueOrder 用户配置度量组位置，从 0 开始
   * @param fields Rows || Columns
   */
  private handleCustomMeasuresOrder(
    customValueOrder: number,
    fields: string[],
  ) {
    const newFields = uniq([...fields]);
    if (fields.length >= customValueOrder) {
      newFields.splice(customValueOrder, 0, EXTRA_FIELD);
      return newFields;
    }
    // 当用户配置的度量组位置大于等于度量组数量时，默认放在最后
    return [...newFields, EXTRA_FIELD];
  }

  // 是否开启自定义度量组位置值
  private isCustomMeasuresPosition(customValueOrder?: number) {
    return isNumber(customValueOrder);
  }

  public getRowData(cell: CellMeta): RowData {
    return this.getMultiData(cell.rowQuery);
  }
}
