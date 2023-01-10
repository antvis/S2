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
  isArray,
  isEmpty,
  isNumber,
  isUndefined,
  map,
  uniq,
  unset,
} from 'lodash';
import {
  EXTRA_FIELD,
  NODE_ID_SEPARATOR,
  TOTAL_VALUE,
  MULTI_VALUE,
  VALUE_FIELD,
} from '../common/constant';
import { DebuggerUtil, DEBUG_TRANSFORM_DATA } from '../common/debug';
import { i18n } from '../common/i18n';
import type {
  CustomHeaderFields,
  FlattingIndexesData,
  Formatter,
  Meta,
  PartDrillDownDataCache,
  PartDrillDownFieldInLevel,
  RawData,
  S2DataConfig,
  TotalsStatus,
  ViewMeta,
} from '../common/interface';
import { Node } from '../facet/layout/node';
import {
  filterTotal,
  flattenIndexesData,
  getAggregationAndCalcFuncByQuery,
  getListBySorted,
  getTotalSelection,
} from '../utils/data-set-operate';
import {
  deleteMetaById,
  filterExtraDimension,
  getDataPath,
  getDimensionsWithoutPathPre,
  shouldQueryMultiData,
  transformDimensionsValues,
  transformIndexesData,
} from '../utils/dataset/pivot-data-set';
import { calcActionByType } from '../utils/number-calculate';
import { handleSortAction } from '../utils/sort-action';
import { DataSelectType } from '../common/constant/total';
import { CellData } from './cell-data';
import { BaseDataSet } from './base-data-set';
import type {
  CellDataParams,
  PivotMeta,
  Query,
  SortedDimensionValues,
  TotalSelection,
  TotalSelectionsOfMultiData,
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

    DebuggerUtil.getInstance().debugCallback(DEBUG_TRANSFORM_DATA, () => {
      const { rows, columns, values } = this.fields;
      const { indexesData } = transformIndexesData({
        rows,
        columns,
        values,
        originData: this.originData,
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
    drillDownData: RawData[],
    rowNode: Node,
  ) {
    const { columns, values } = this.fields;
    const currentRowFields = Node.getFieldPath(rowNode, true);
    const nextRowFields = [...currentRowFields, extraRowField];
    const store = this.spreadsheet.store;

    // 2. 检查该节点是否已经存在下钻维度
    const rowNodeId = rowNode?.id;
    const idPathMap = store.get('drillDownIdPathMap') ?? new Map();

    if (idPathMap.has(rowNodeId)) {
      // the current node has a drill-down field, clean it
      forEach(idPathMap.get(rowNodeId), (path) => {
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
      columns,
      values,
      originData: drillDownData,
      indexesData: this.indexesData,
      sortedDimensionValues: this.sortedDimensionValues,
      rowPivotMeta: this.rowPivotMeta,
      colPivotMeta: this.colPivotMeta,
    });

    this.indexesData = indexesData;
    this.rowPivotMeta = rowPivotMeta!;
    this.colPivotMeta = colPivotMeta!;
    this.sortedDimensionValues = sortedDimensionValues;

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

    const newMeta: Meta[] = this.processMeta(meta);

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

  public processMeta(meta: Meta[]) {
    const valueFormatter = (value: string) => {
      const currentMeta = find(meta, ({ field }: Meta) => field === value);

      return get(currentMeta, 'name', value);
    };

    // 虚拟列字段，为文本分类字段
    const extraFieldName =
      this.spreadsheet?.options?.cornerExtraFieldText || i18n('数值');

    const extraFieldMeta: Meta = {
      field: EXTRA_FIELD,
      name: extraFieldName,
      formatter: (value: string) => valueFormatter(value),
    } as Meta;

    return [...meta, extraFieldMeta];
  }

  public getDimensionValues(field: string, query?: Query): string[] {
    const { rows = [], columns = [] } = this.fields || {};
    let meta: PivotMeta = new Map();
    let dimensions: CustomHeaderFields = [];

    if (includes(rows, field)) {
      meta = this.rowPivotMeta;
      dimensions = rows;
    } else if (includes(columns, field)) {
      meta = this.colPivotMeta;
      dimensions = columns as string[];
    }

    if (!isEmpty(query)) {
      let sortedMeta: string[] = [];
      const dimensionValuePath = [];

      for (const dimension of dimensions) {
        const value: string = get(query, dimension as string);

        dimensionValuePath.push(`${value}`);
        const cacheKey = dimensionValuePath.join(`${NODE_ID_SEPARATOR}`);

        if (meta.has(value) && !isUndefined(value)) {
          const childField = meta.get(value)?.childField;

          meta = meta.get(value)!.children;
          if (
            find(this.sortParams, (item) => item.sortFieldId === childField) &&
            this.sortedDimensionValues[childField!]
          ) {
            const dimensionValues = this.sortedDimensionValues[
              childField!
            ]?.filter((item) => item?.includes(cacheKey));

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

  getTotalValue(query: Query) {
    const { aggregation, calcFunc } =
      getAggregationAndCalcFuncByQuery(
        this.getTotalStatus(query) as TotalsStatus,
        this.spreadsheet.options?.totals!,
      ) || {};

    const calcAction = calcActionByType[aggregation!];

    // 前端计算汇总值
    if (calcAction || !!calcFunc) {
      const data = this.getMultiData(query);
      let totalValue: number | null = null;

      if (calcFunc) {
        totalValue = calcFunc(query, data);
      } else if (calcAction) {
        totalValue = calcAction(data, VALUE_FIELD)!;
      }

      return new CellData(
        { ...query, [query[EXTRA_FIELD]]: totalValue },
        query[EXTRA_FIELD],
      );
    }
  }

  public getCellData(params: CellDataParams) {
    const { query = {}, rowNode, isTotals = false } = params || {};

    const { rows: originRows, columns } = this.fields;
    let rows = originRows;
    const drillDownIdPathMap =
      this.spreadsheet?.store.get('drillDownIdPathMap');

    /*
     * 判断当前是否为下钻节点
     * 需检查 rowNode.id 是否属于下钻根节点(drillDownIdPathMap.keys)的下属节点
     */
    const isDrillDown = Array.from(drillDownIdPathMap?.keys() ?? []).some(
      (parentPath) => rowNode?.id.startsWith(parentPath),
    );

    // 如果是下钻结点，小计行维度在 originRows 中并不存在
    if (!isTotals || isDrillDown) {
      rows = Node.getFieldPath(rowNode!, isDrillDown) ?? originRows;
    }

    const rowDimensionValues = transformDimensionsValues(
      query,
      rows as string[],
    );
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

    const rawData = get(this.indexesData, path);

    if (rawData) {
      // 如果已经有数据则取已有数据
      return new CellData(rawData, query[EXTRA_FIELD]);
    }

    if (isTotals) {
      return this.getTotalValue(query);
    }
  }

  public getTotalStatus = (query: Query) => {
    const { columns, rows } = this.fields;
    const isTotals = (dimensions: string[], isSubTotal?: boolean) => {
      if (isSubTotal) {
        const firstDimension = find(dimensions, (item) => !has(query, item));

        return firstDimension && firstDimension !== first(dimensions);
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

  protected getMultiDataQueryPath(query: Query, drillDownFields?: string[]) {
    const { rows = [], columns = [] } = this.fields;
    const totalRows = !isEmpty(drillDownFields)
      ? uniq(rows.concat(drillDownFields!))
      : rows;

    const rowDimensionValues = transformDimensionsValues(
      query,
      totalRows as string[],
      MULTI_VALUE,
    );

    const colDimensionValues = transformDimensionsValues(
      query,
      columns as string[],
      MULTI_VALUE,
    );

    const path: (string | number)[] = getDataPath({
      rowDimensionValues,
      colDimensionValues,
      rowPivotMeta: this.rowPivotMeta,
      colPivotMeta: this.colPivotMeta,
    });

    return { path, rows: totalRows, columns };
  }

  protected getQueryExtraFields(query: Query) {
    const { values } = this.fields;

    return query[EXTRA_FIELD] ? [query[EXTRA_FIELD]] : values;
  }

  protected getTotalSelectionByDimensions(
    rows: string[],
    columns: string[],
    totals?: TotalSelectionsOfMultiData,
  ) {
    const getTotalSelectTypes = (
      dimensions: string[],
      totalSelection?: TotalSelection,
    ) => {
      const { grandTotalOnly, subTotalOnly, totalDimensions } =
        totalSelection || ({} as TotalSelection);

      return filterExtraDimension(dimensions).map((dimension, idx) => {
        let type = DataSelectType.DetailOnly;

        if (
          totalDimensions === true ||
          includes(totalDimensions as string[], dimension)
        ) {
          type = DataSelectType.All;
        }

        // 如果当前可以选择总计/小计数据，则进一步根据 grandTotalOnly 以及 subTotalOnly 收缩范围
        if (
          type === DataSelectType.All &&
          ((idx === 0 && grandTotalOnly) || (idx !== 0 && subTotalOnly))
        ) {
          type = DataSelectType.TotalOnly;
        }

        return type;
      });
    };

    totals = getTotalSelection(totals);

    const rowSelectTypes = getTotalSelectTypes(rows, totals?.row);
    const columnSelectTypes = getTotalSelectTypes(columns, totals?.column);

    return rowSelectTypes.concat(columnSelectTypes);
  }

  public getMultiData(
    query: Query = {},
    totals?: TotalSelectionsOfMultiData,
    drillDownFields?: string[],
  ) {
    const { path, rows, columns } = this.getMultiDataQueryPath(
      query,
      drillDownFields,
    );

    const selectTypes = this.getTotalSelectionByDimensions(
      rows as string[],
      columns as string[],
      totals,
    );

    let hadMultiField = false;
    let result: FlattingIndexesData = this.indexesData;

    /*
     * TODO: 原本的展开逻辑在有下钻的情况下,应该是有问题的,
     * 因为下钻数据是放在原本的明细数据里面, 在对象里面添加了 1,2,3 这样的属性值来储存下钻数据
     * 由于对下钻整体的逻辑还不是很清楚，这里只是对原来的逻辑进行效率优化
     * 后续如果需要进行下钻优化，这里也需要同时处理
     */
    for (let i = 0; i < path.length; i++) {
      const current = path[i];

      if (hadMultiField) {
        if (shouldQueryMultiData(current)) {
          result = flattenIndexesData(
            result,
            selectTypes[i],
          ) as FlattingIndexesData;
        } else {
          result = map(result!, (item) => get(item, current));
        }
      } else if (shouldQueryMultiData(current)) {
        hadMultiField = true;
        result = [result] as FlattingIndexesData;
        i--;
      } else {
        result = get(result, current);
      }
    }

    // 如果每一个维度都是被指定好的，那么最终获取的数据就是单个的
    if (!isArray(result)) {
      result = [result];
    }

    const extraFields = this.getQueryExtraFields(query)!;

    return flatMap(compact(result as RawData[]), (item) =>
      CellData.getCellDataList(item, extraFields),
    );
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
}
