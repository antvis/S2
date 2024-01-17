import {
  compact,
  each,
  every,
  filter,
  find,
  first,
  flatMap,
  forEach,
  get,
  has,
  includes,
  indexOf,
  isArray,
  isEmpty,
  isNumber,
  map,
  some,
  uniq,
  unset,
  type PropertyPath,
  omit,
} from 'lodash';
import {
  QueryDataType,
  type CellMeta,
  type CustomHeaderFields,
  type Data,
} from '../common';
import {
  EXTRA_FIELD,
  MULTI_VALUE,
  TOTAL_VALUE,
  VALUE_FIELD,
} from '../common/constant';
import { DEBUG_TRANSFORM_DATA, DebuggerUtil } from '../common/debug';
import { i18n } from '../common/i18n';
import type {
  Formatter,
  Meta,
  PartDrillDownDataCache,
  PartDrillDownFieldInLevel,
  RawData,
  S2DataConfig,
  ViewMeta,
} from '../common/interface';
import { Node } from '../facet/layout/node';
import { getAggregationAndCalcFuncByQuery } from '../utils/data-set-operate';
import {
  deleteMetaById,
  filterExtraDimension,
  flattenIndexesData,
  getDataPath,
  getDataPathPrefix,
  getExistValues,
  getFlattenDimensionValues,
  getSatisfiedPivotMetaValues,
  isMultiValue,
  transformDimensionsValues,
  transformIndexesData,
  type TransformResult,
} from '../utils/dataset/pivot-data-set';
import { calcActionByType } from '../utils/number-calculate';
import { getSortedPivotMeta, handleSortAction } from '../utils/sort-action';
import { BaseDataSet } from './base-data-set';
import { CellData } from './cell-data';
import type {
  GetCellDataParams,
  GetCellMultiDataParams,
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

  getExistValuesByDataItem(data: RawData, values: string[]) {
    return getExistValues(data, values);
  }

  /**
   * When data related config changed, we need
   * 1、re-process config
   * 2、re-transform origin data
   * 3、sort and other things
   * @param dataCfg
   */
  public setDataCfg(dataCfg: S2DataConfig) {
    super.setDataCfg(dataCfg);
    const { rows } = this.fields;

    this.sortedDimensionValues = {};
    this.rowPivotMeta = new Map();
    this.colPivotMeta = new Map();
    this.transformIndexesData(this.originData, rows as string[]);
    this.handleDimensionValuesSort();
  }

  public transformIndexesData(
    data: RawData[],
    rows: string[],
  ): TransformResult {
    const { columns, values, valueInCols } = this.fields;

    let result!: TransformResult;

    DebuggerUtil.getInstance().debugCallback(DEBUG_TRANSFORM_DATA, () => {
      result = transformIndexesData({
        rows: rows as string[],
        columns: columns as string[],
        values: values!,
        valueInCols: valueInCols!,
        data,
        indexesData: this.indexesData,
        sortedDimensionValues: this.sortedDimensionValues,
        rowPivotMeta: this.rowPivotMeta,
        colPivotMeta: this.colPivotMeta,
        getExistValuesByDataItem: this.getExistValuesByDataItem,
      });
      this.indexesData = result.indexesData;
      this.rowPivotMeta = result.rowPivotMeta;
      this.colPivotMeta = result.colPivotMeta;
      this.sortedDimensionValues = result.sortedDimensionValues;
    });

    return result;
  }

  /**
   * Provide a way to append some drill-down data in indexesData
   * @param extraRowField
   * @param drillDownData
   * @param rowNode
   */
  public transformDrillDownData(
    extraRowField: string,
    drillDownData: RawData[],
    rowNode: Node,
  ) {
    const currentRowFields = Node.getFieldPath(rowNode, true);
    const nextRowFields = [...currentRowFields, extraRowField];
    const store = this.spreadsheet.store;

    // 2. 检查该节点是否已经存在下钻维度
    const rowNodeId = rowNode?.id;
    const idPathMap = store.get('drillDownIdPathMap') ?? new Map();

    if (idPathMap.has(rowNodeId)) {
      // the current node has a drill-down field, clean it
      forEach(idPathMap.get(rowNodeId), (path) => {
        unset(this.indexesData, path as unknown as PropertyPath);
      });
      deleteMetaById(this.rowPivotMeta, rowNodeId);
    }

    // 3、转换数据
    const { paths: drillDownDataPaths } = this.transformIndexesData(
      drillDownData,
      nextRowFields,
    );

    /*
     * 4、record data paths by nodeId
     * set new drill-down data path
     */
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
      return false;
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
          unset(this.indexesData, path as unknown as PropertyPath);
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

      /*
       * 需要对应清空所有下钻后的dataCfg信息
       * 因此如果缓存有下钻前原始dataCfg，需要清空所有的下钻数据
       */
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

    return true;
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
      this.handlePivotMetaSort(sortFieldId, result);
    });
  };

  protected handlePivotMetaSort(
    sortFieldId: string,
    sortedDimensionValues: string[],
  ) {
    const { rows, columns } = this.fields;

    if (includes(rows, sortFieldId)) {
      this.rowPivotMeta = getSortedPivotMeta({
        pivotMeta: this.rowPivotMeta,
        dimensions: rows as string[],
        sortFieldId,
        sortedDimensionValues,
      });
    } else if (includes(columns, sortFieldId)) {
      this.colPivotMeta = getSortedPivotMeta({
        pivotMeta: this.colPivotMeta,
        dimensions: columns as string[],
        sortFieldId,
        sortedDimensionValues,
      });
    }
  }

  public processDataCfg(dataCfg: S2DataConfig): S2DataConfig {
    const { data, meta = [], fields, sortParams = [] } = dataCfg;
    const {
      columns = [],
      rows = [],
      values,
      valueInCols,
      customValueOrder,
    } = fields;

    let newColumns = columns;
    let newRows = rows;

    if (valueInCols) {
      newColumns = this.isCustomMeasuresPosition(customValueOrder)
        ? this.handleCustomMeasuresOrder(customValueOrder!, newColumns)
        : uniq([...columns, EXTRA_FIELD]);
    } else {
      newRows = this.isCustomMeasuresPosition(customValueOrder)
        ? this.handleCustomMeasuresOrder(customValueOrder!, newRows)
        : uniq([...rows, EXTRA_FIELD]);
    }

    const newMeta: Meta[] = this.processMeta(meta, i18n('数值'));

    return {
      data,
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

  protected getFieldsAndPivotMetaByField(field: string) {
    const { rows = [], columns = [] } = this.fields || {};

    if (rows.includes(field)) {
      return {
        dimensions: rows as string[],
        pivotMeta: this.rowPivotMeta,
      };
    }

    if (columns.includes(field)) {
      return {
        dimensions: columns as string[],
        pivotMeta: this.colPivotMeta,
      };
    }

    return {};
  }

  public getDimensionValues(field: string, query: Query = {}): string[] {
    const { pivotMeta, dimensions } = this.getFieldsAndPivotMetaByField(field);

    if (!pivotMeta || !dimensions) {
      return [];
    }

    const dimensionValues = transformDimensionsValues(
      query,
      dimensions,
      MULTI_VALUE,
    );

    const values = getSatisfiedPivotMetaValues({
      pivotMeta,
      dimensionValues,
      fields: dimensions,
      fieldIdx: indexOf(dimensions, field),
      queryType: QueryDataType.DetailOnly,
      sortedDimensionValues: this.sortedDimensionValues,
    });

    return uniq(values.map((v) => v.value));
  }

  getTotalValue(query: Query, totalStatus?: TotalStatus) {
    const effectiveStatus = some(totalStatus);
    const status = effectiveStatus ? totalStatus! : this.getTotalStatus(query);
    const { aggregation, calcFunc } =
      getAggregationAndCalcFuncByQuery(
        status,
        this.spreadsheet.options?.totals,
      ) || {};

    const calcAction = calcActionByType[aggregation!];

    // 前端计算汇总值
    if (calcAction || !!calcFunc) {
      const data = this.getCellMultiData({
        query,
        queryType: QueryDataType.DetailOnly,
      });
      let totalValue: number | null = null;

      if (calcFunc) {
        totalValue = calcFunc(query, data);
      } else if (calcAction) {
        totalValue = calcAction(data, VALUE_FIELD)!;
      }

      return CellData.getCellData(
        { ...omit(query, [EXTRA_FIELD]), [query[EXTRA_FIELD]]: totalValue },
        query[EXTRA_FIELD],
      );
    }
  }

  public getCellData(params: GetCellDataParams) {
    const { query = {}, rowNode, isTotals = false, totalStatus } = params || {};

    const { rows: originRows, columns } = this.fields;
    let rows = originRows as string[];
    const drillDownIdPathMap =
      this.spreadsheet?.store.get('drillDownIdPathMap');

    /*
     * 判断当前是否为下钻节点
     * 需检查 rowNode.id 是否属于下钻根节点(drillDownIdPathMap.keys)的下属节点
     */
    const isDrillDown = Array.from(drillDownIdPathMap?.keys() ?? []).some(
      (parentPath) => rowNode?.id.startsWith(parentPath),
    );

    // 如果是下钻结点，行维度在 originRows 中并不存在
    if (rowNode && isDrillDown) {
      rows =
        Node.getFieldPath(rowNode, isDrillDown) ?? (originRows as string[]);
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
      rowFields: rows as string[],
      colFields: columns as string[],
      prefix: getDataPathPrefix(rows as string[], columns as string[]),
    });

    const rawData = get(this.indexesData, path as PropertyPath);

    if (rawData) {
      // 如果已经有数据则取已有数据
      return CellData.getCellData(rawData, query[EXTRA_FIELD]);
    }

    if (isTotals) {
      return this.getTotalValue(query, totalStatus);
    }
  }

  public getTotalStatus = (query: Query) => {
    const { columns, rows } = this.fields;
    const isTotals = (dimensions: string[], isSubTotal?: boolean) => {
      if (isSubTotal) {
        const firstDimension = find(dimensions, (item) => !has(query, item));

        return !!(firstDimension && firstDimension !== first(dimensions));
      }

      return every(dimensions, (item) => !has(query, item));
    };

    return {
      isRowTotal: isTotals(filterExtraDimension(rows as string[])),
      isRowSubTotal: isTotals(rows as string[], true),
      isColTotal: isTotals(filterExtraDimension(columns as string[])),
      isColSubTotal: isTotals(columns as string[], true),
    };
  };

  protected getQueryExtraFields(query: Query): string[] {
    const { values = [] } = this.fields;
    const extra = query[EXTRA_FIELD];

    if (extra) {
      return includes(values, extra) ? [extra] : [];
    }

    return values;
  }

  public getCellMultiData(params: GetCellMultiDataParams) {
    const {
      query = {},
      queryType = QueryDataType.All,
      drillDownFields = [],
    } = params || {};

    if (isEmpty(query)) {
      // 如果查询的 query 为空，这样的场景其实没有意义，如果用户想获取全量数据，可以直接从 data 中获取
      // eslint-disable-next-line no-console
      console.warn(
        `query: ${query} shouldn't be empty, you can get all data from dataCfg if you're intended.\n you should use { EXTRA_FIELD: xxx} as least if you want query all specific value data`,
      );
    }

    const { rows, columns } = this.fields;
    const totalRows: string[] = !isEmpty(drillDownFields)
      ? (rows as string[]).concat(drillDownFields!)
      : (rows as string[]);

    const rowDimensionValues = transformDimensionsValues(
      query,
      totalRows,
      MULTI_VALUE,
    );
    const colDimensionValues = transformDimensionsValues(
      query,
      columns as string[],
      MULTI_VALUE,
    );

    const { rowQueries, colQueries } = getFlattenDimensionValues({
      rowDimensionValues,
      colDimensionValues,
      rowPivotMeta: this.rowPivotMeta,
      colPivotMeta: this.colPivotMeta,
      rowFields: totalRows,
      colFields: columns as string[],
      sortedDimensionValues: this.sortedDimensionValues,
      queryType,
    });

    const prefix = getDataPathPrefix(totalRows, columns as string[]);
    const all: RawData[] = [];

    for (const rowQuery of rowQueries) {
      for (const colQuery of colQueries) {
        const path = getDataPath({
          rowDimensionValues: rowQuery,
          colDimensionValues: colQuery,
          rowPivotMeta: this.rowPivotMeta,
          colPivotMeta: this.colPivotMeta,
          rowFields: totalRows,
          colFields: columns as string[],
          prefix,
        });

        let hadMultiField = false;
        let result: any = this.indexesData;

        for (let i = 0; i < path.length; i++) {
          const current = path[i];

          if (hadMultiField) {
            if (isMultiValue(current)) {
              result = flattenIndexesData(result, queryType);
            } else {
              result = compact(
                map(result, (item) => item?.[current as string | number]),
              );
            }
          } else if (isMultiValue(current)) {
            hadMultiField = true;
            result = compact([result]);
            i--;
          } else {
            result = result?.[current as string | number];
          }
        }
        // 如果每一个维度都是被指定好的，那么最终获取的数据就是单个的
        if (isArray(result)) {
          all.push(...(result as Data[]));
        } else if (result) {
          all.push(result);
        }
      }
    }

    const extraFields = this.getQueryExtraFields(query);

    // 多个 extra field 有时对应的同一个对象，需要进行去重
    return flatMap(uniq(all), (item) => {
      return item ? CellData.getCellDataList(item, extraFields) : [];
    });
  }

  public getFieldFormatter(field: string, cellMeta?: ViewMeta): Formatter {
    // 兼容总计小计场景
    if (field === TOTAL_VALUE) {
      return this.getFieldFormatterForTotalValue(cellMeta);
    }

    return super.getFieldFormatter(field);
  }

  private getFieldFormatterForTotalValue(cellMeta?: ViewMeta) {
    let valueField = '';

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
    fields: CustomHeaderFields,
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

  public getRowData(cellMeta: CellMeta) {
    return this.getCellMultiData({ query: cellMeta.rowQuery! });
  }
}
