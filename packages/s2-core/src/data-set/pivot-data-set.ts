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
  merge,
  reduce,
  set,
  uniq,
  values,
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
import {
  CellDataParams,
  DataType,
  PivotMeta,
} from '@/data-set/interface';
import { handleSortAction } from '@/utils/sort-action';
import { 
  transformIndexesData,
  getDataPath,
} from '@/utils/dataset/pivot-data-set';

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
        sortedDimensionValues: this.sortedDimensionValues,
        rowPivotMeta: this.rowPivotMeta,
        colPivotMeta: this.colPivotMeta
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
    const { columns } = this.fields;
    const rows = Node.getFieldPath(rowNode);
    const store = this.spreadsheet.store;
    // 1、通过values在data中注入额外的维度信息
    const values = this.fields.values;
    for (const drillDownDatum of drillDownData) {
      for (const value of values) {
        merge(drillDownDatum, {
          [EXTRA_FIELD]: value,
          [VALUE_FIELD]: drillDownDatum[value],
        });
      }
    }
    // 2、转换数据
    const { paths: drillDownDataPaths } = transformIndexesData({
      rows: [...rows, extraRowField],
      columns,
      originData: drillDownData,
      sortedDimensionValues: this.sortedDimensionValues,
      rowPivotMeta: this.rowPivotMeta,
      colPivotMeta: this.colPivotMeta,
    });
    // 3、record data paths by nodeId
    const rowNodeId = rowNode.id;
    const idPathMap = store.get('drillDownIdPathMap') ?? new Map();
    if (idPathMap.has(rowNodeId)) {
      // the current node has a drill-down field, clean it and add new one
      idPathMap
        .get(rowNodeId)
        .map((path) => set(this.indexesData, path, undefined));
    }
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
    if (rowNodeId) {
      idPathMap
        .get(rowNodeId)
        .map((path) => set(this.indexesData, path, undefined));
      idPathMap.delete(rowNodeId);
    } else {
      flatten(Array.from(idPathMap.values()))?.map((path) =>
        set(this.indexesData, path, undefined),
      );
      idPathMap.clear();
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

  getQueryDimValues = (dimensions: string[], query: DataType): string[] => {
    return reduce(
      dimensions,
      (res: string[], dimension: string) => {
        // push undefined when not exist
        res.push(query[dimension]);
        return res;
      },
      [],
    );
  };

  public getCellData(params: CellDataParams): DataType {
    const { query, rowNode, isTotals = false } = params || {};

    const { columns, rows: originRows } = this.fields;
    let rows = originRows;
    if (!isTotals) {
      rows = Node.getFieldPath(rowNode) ?? originRows;
    }
    const rowDimensionValues = this.getQueryDimValues(rows, query);
    const colDimensionValues = this.getQueryDimValues(columns, query);
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
    let currentData = this.indexesData;

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
    const rowDimensionValues = this.getQueryDimValues(rows, query);
    const colDimensionValues = this.getQueryDimValues(columns, query);
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
