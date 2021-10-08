import {
  compact,
  each,
  find,
  flatten,
  get,
  has,
  includes,
  isEmpty,
  isUndefined,
  keys,
  set,
  uniq,
  values,
  map,
  cloneDeep,
  filter,
  forEach,
  unset,
} from 'lodash';
import { Node } from '@/facet/layout/node';
import {
  filterUndefined,
  flatten as customFlatten,
  flattenDeep as customFlattenDeep,
  getFieldKeysByDimensionValues,
  getIntersections,
  isEveryUndefined,
  splitTotal,
  isTotalData,
} from '@/utils/data-set-operate';
import { EXTRA_FIELD, VALUE_FIELD } from '@/common/constant';
import { DebuggerUtil, DEBUG_TRANSFORM_DATA } from '@/common/debug';
import { i18n } from '@/common/i18n';
import { Data, Meta, S2DataConfig } from '@/common/interface';
import { BaseDataSet } from '@/data-set/base-data-set';
import { CellDataParams, DataType, PivotMeta } from '@/data-set/interface';
import { handleSortAction } from '@/utils/sort-action';
import {
  transformIndexesData,
  getDataPath,
  getQueryDimValues,
  deleteMetaById,
} from '@/utils/dataset/pivot-data-set';
import {
  PartDrillDownDataCache,
  PartDrillDownFieldInLevel,
} from '@/components/sheets/interface';

export class PivotDataSet extends BaseDataSet {
  // row dimension values pivot structure
  public rowPivotMeta: PivotMeta;

  // col dimension value pivot structure
  public colPivotMeta: PivotMeta;

  // sorted dimension values
  public sortedDimensionValues: Map<string, Set<string>>;

  // each path items max index
  protected pathIndexMax = [];

  /**
   * When data related config changed, we need
   * 1、re-process config
   * 2、re-transform origin data
   * 3、sort and other things
   * @param dataCfg
   */
  public setDataCfg(dataCfg: S2DataConfig) {
    super.setDataCfg(dataCfg);
    this.sortedDimensionValues = new Map();
    this.rowPivotMeta = new Map();
    this.colPivotMeta = new Map();
    // total data in raw data scene.
    this.totalData = []
      .concat(splitTotal(dataCfg.data, dataCfg.fields))
      .concat(this.totalData);
    DebuggerUtil.getInstance().debugCallback(DEBUG_TRANSFORM_DATA, () => {
      const { rows, columns } = this.fields;
      const { indexesData } = transformIndexesData({
        rows,
        columns,
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
    const { columns, values: dataValues } = this.fields;
    const rows = Node.getFieldPath(rowNode, true);
    const store = this.spreadsheet.store;

    // 1、通过values在data中注入额外的维度信息
    // TODO 定value位置
    drillDownData = map(drillDownData, (datum) => {
      const valueKey = find(keys(datum), (k) => includes(dataValues, k));
      return {
        ...datum,
        [EXTRA_FIELD]: valueKey,
        [VALUE_FIELD]: datum[valueKey],
      };
    });

    // 2. 检查该节点是否已经存在下钻维度
    const rowNodeId = rowNode.id;
    const idPathMap = store.get('drillDownIdPathMap') ?? new Map();
    if (idPathMap.has(rowNodeId)) {
      // the current node has a drill-down field, clean it
      forEach(idPathMap.get(rowNodeId), (path: []) => {
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
      rows: [...rows, extraRowField],
      columns,
      originData: drillDownData,
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
      if (!sortFieldId) return;
      const originValues = [
        ...this.sortedDimensionValues.get(sortFieldId)?.keys(),
      ];
      const result = handleSortAction({
        dataSet: this,
        sortParam: item,
        originValues,
        isSortByMeasure: !isEmpty(sortByMeasure),
      });
      this.sortedDimensionValues.set(
        sortFieldId,
        new Set([...result, ...originValues]), // 这里是控制顺序的，优先result
      );
    });
  };

  public processDataCfg(dataCfg: S2DataConfig): S2DataConfig {
    const { data, meta = [], fields, sortParams = [], totalData } = dataCfg;
    const { columns, rows, values, valueInCols } = fields;

    const newColumns = valueInCols ? uniq([...columns, EXTRA_FIELD]) : columns;
    const newRows = !valueInCols ? uniq([...rows, EXTRA_FIELD]) : rows;

    const valueFormatter = (value: string) => {
      const findOne = find(meta, (mt: Meta) => mt.field === value);
      return get(findOne, 'name', value);
    };

    const newMeta = [
      ...meta,
      // 虚拟列字段，为文本分类字段
      {
        field: EXTRA_FIELD,
        name: i18n('数值'),
        formatter: (value: string) => valueFormatter(value),
      } as Meta,
    ];

    // 标准的数据中，一条数据代表一个格子；不存在一条数据中多个value的情况
    // 对标准数据的转换效率表示怀疑，以前哦豁说双重for循环导致耗时，现在这种难道不等于是三重循环吗 -> map + find + includes？
    const standardTransform = (originData: Data[]) => {
      return map(originData, (datum) => {
        const valueKey = find(keys(datum), (k) => includes(values, k));
        return {
          ...datum,
          [EXTRA_FIELD]: valueKey,
          [VALUE_FIELD]: datum[valueKey],
        };
      });
    };

    const newData = standardTransform(data);
    const newTotalData = standardTransform(totalData);

    // 返回新的结构
    return {
      data: newData,
      meta: newMeta,
      fields: {
        ...fields,
        rows: newRows,
        columns: newColumns,
        values,
      },
      totalData: newTotalData,
      sortParams,
    };
  }

  public getDimensionValues(field: string, query?: DataType): string[] {
    const { rows, columns } = this.fields;
    let meta: PivotMeta = new Map();
    let dimensions: string[] = [];
    if (includes(rows, field)) {
      meta = this.rowPivotMeta;
      dimensions = rows;
    } else if (includes(columns, field)) {
      meta = this.colPivotMeta;
      dimensions = columns;
    }
    if (!isEmpty(query)) {
      let sortedMeta = [];
      for (const dimension of dimensions) {
        const value = get(query, dimension);
        if (meta.has(value) && !isUndefined(value)) {
          const childField = meta.get(value)?.childField;
          meta = meta.get(value).children;
          if (this.sortedDimensionValues.has(childField)) {
            sortedMeta = [...this.sortedDimensionValues.get(childField)];
          }
        }
      }
      return filterUndefined(getIntersections(sortedMeta, [...meta.keys()]));
    }

    if (this.sortedDimensionValues.has(field)) {
      return filterUndefined([...this.sortedDimensionValues.get(field)]);
    }
    return filterUndefined([...meta.keys()]);
  }

  public getCellData(params: CellDataParams): DataType {
    const { query, rowNode, isTotals = false } = params || {};

    const { columns, rows: originRows } = this.fields;
    let rows = originRows;
    const isDrillDown = !isEmpty(
      get(this, 'spreadsheet?.store.drillDownIdPathMap'),
    );

    // 如果是下钻结点，小计行维度在 originRows 中并不存在
    if (!isTotals || isDrillDown) {
      rows = Node.getFieldPath(rowNode, isDrillDown) ?? originRows;
    }
    const rowDimensionValues = getQueryDimValues(rows, query);
    const colDimensionValues = getQueryDimValues(columns, query);
    const path = getDataPath({
      rowDimensionValues,
      colDimensionValues,
      careUndefined:
        isTotals || isTotalData([].concat(originRows).concat(columns), query),
      rowPivotMeta: this.rowPivotMeta,
      colPivotMeta: this.colPivotMeta,
    });
    const data = get(this.indexesData, path);

    return data;
  }

  getCustomData = (path: number[]) => {
    let hadUndefined = false;
    let currentData: DataType | DataType[] | DataType[][] = cloneDeep(
      this.indexesData,
    );

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

  public getMultiData(
    query: DataType,
    isTotals?: boolean,
    isRow?: boolean,
  ): DataType[] {
    if (isEmpty(query)) {
      return compact(customFlattenDeep(this.indexesData));
    }
    const { rows, columns, values: valueList } = this.fields;
    const rowDimensionValues = getQueryDimValues(rows, query);
    const colDimensionValues = getQueryDimValues(columns, query);
    const path = getDataPath({
      rowDimensionValues,
      colDimensionValues,
      careUndefined: true,
      rowPivotMeta: this.rowPivotMeta,
      colPivotMeta: this.colPivotMeta,
    });
    const currentData = this.getCustomData(path);
    let result = compact(customFlatten(currentData));
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
        columns,
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
              dimensions?.filter((item) => !valueList?.includes(item)),
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

    return result || [];
  }
}
