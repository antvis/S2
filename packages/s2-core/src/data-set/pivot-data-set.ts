import { BaseDataSet } from 'src/data-set/base-data-set';
import {
  DataPathParams,
  DataType,
  PivotMeta,
  CellDataParams,
} from 'src/data-set/interface';
import { Meta, S2DataConfig, Data } from 'src/common/interface';
import { i18n } from 'src/common/i18n';
import { EXTRA_FIELD, VALUE_FIELD } from 'src/common/constant';
import {
  map,
  find,
  isEmpty,
  each,
  set,
  isUndefined,
  uniq,
  compact,
  get,
  includes,
  reduce,
  merge,
  flatten,
  keys,
  values,
  has,
} from 'lodash';
import { DEBUG_TRANSFORM_DATA, DebuggerUtil } from 'src/common/debug';
import { Node } from '@/facet/layout/node';
import { handleSortAction } from 'src/utils/sort-action';
import {
  getIntersections,
  filterUndefined,
  flattenDeep as customFlattenDeep,
  flatten as customFlatten,
  isEveryUndefined,
  getFieldKeysByDimensionValues,
} from '@/utils/data-set-operate';

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
    this.indexesData = [];
    this.rowPivotMeta = new Map();
    this.colPivotMeta = new Map();
    DebuggerUtil.getInstance().debugCallback(DEBUG_TRANSFORM_DATA, () => {
      const { rows, columns } = this.fields;
      this.transformIndexesData(rows, columns, this.originData, this.totalData);
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
    const drillDownDataPaths = this.transformIndexesData(
      [...rows, extraRowField],
      columns,
      drillDownData,
    );
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
   * Transform origin data to indexed data
   */
  transformIndexesData = (
    rows: string[],
    columns: string[],
    originData: DataType[],
    totalData: DataType[] = [],
  ): number[][] => {
    const paths = [];
    for (const data of [...originData, ...totalData]) {
      const rowDimensionValues = this.transformDimensionsValues(data, rows);
      const colDimensionValues = this.transformDimensionsValues(data, columns);
      const path = this.getDataPath({
        rowDimensionValues,
        colDimensionValues,
        isFirstCreate: true,
        careUndefined: totalData?.length > 0,
        rowFields: rows,
        colFields: columns,
      });
      paths.push(path);
      set(this.indexesData, path, data);
    }

    return paths;
  };

  /**
   * Transform a origin single data to dimension values
   * {
   *  price: 16,
   *  province: '辽宁省',
   *  city: '芜湖市',
   *  category: '家具',
   *  subCategory: '椅子',
   * }
   * => dimensions [province, city]
   * return [辽宁省, 芜湖市]
   *
   * @param record
   * @param dimensions
   */
  transformDimensionsValues = (
    record: DataType,
    dimensions: string[],
  ): string[] => {
    return map(dimensions, (dimension) => {
      const dimensionValue = record[dimension];
      if (!this.sortedDimensionValues.has(dimension)) {
        this.sortedDimensionValues.set(dimension, new Set());
      }
      const values = this.sortedDimensionValues.get(dimension);
      values.add(record[dimension]);

      return dimensionValue;
    });
  };

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
        new Set([...result, ...originValues]),
      );
    });
  };

  /**
   * Transform a single data to path
   * {
   * $$VALUE$$: 15
   * $$EXTRA$$: 'price'
   * "price": 15,
   * "province": "辽宁省",
   * "city": "达州市",
   * "category": "家具",
   * "subCategory": "椅子"
   * }
   * rows: [province, city]
   * columns: [category, subCategory, $$EXTRA$$]
   *
   * =>
   * rowDimensionValues = [辽宁省, 达州市]
   * colDimensionValues = [家具, 椅子, price]
   *
   * @param params
   */
  getDataPath = (params: DataPathParams): number[] => {
    const {
      rowDimensionValues,
      colDimensionValues,
      careUndefined,
      isFirstCreate,
      rowFields,
      colFields,
    } = params;
    // 根据行、列维度值生成对应的 path路径，有两个情况
    // 如果是汇总格子：path = [0,undefined, 0] path中会存在undefined的值（这里在indexesData里面会映射）
    // 如果是明细格子: path = [0,0,0] 全数字，无undefined存在
    const getPath = (dimensionValues: string[], isRow = true): number[] => {
      let currentMeta = isRow ? this.rowPivotMeta : this.colPivotMeta;
      const fields = isRow ? rowFields : colFields;
      const path = [];
      for (let i = 0; i < dimensionValues.length; i++) {
        const value = dimensionValues[i];
        if (!currentMeta.has(value)) {
          if (isFirstCreate) {
            currentMeta.set(value, {
              level: currentMeta.size,
              children: new Map(),
            });
          } else {
            const meta = currentMeta.get(value);
            if (meta) {
              path.push(meta.level);
            }
            if (!careUndefined) {
              break;
            }
          }
        }
        const meta = currentMeta.get(value);
        if (isUndefined(value) && careUndefined) {
          path.push(value);
        } else {
          path.push(meta?.level);
        }
        if (meta) {
          if (isFirstCreate) {
            // mark the child field
            meta.childField = fields?.[i + 1];
          }
          currentMeta = meta?.children;
        }
      }
      return path;
    };

    const rowPath = getPath(rowDimensionValues);
    const colPath = getPath(colDimensionValues, false);
    const result = rowPath.concat(...colPath);

    return result;
  };

  public processDataCfg(dataCfg: S2DataConfig): S2DataConfig {
    const {
      data,
      meta = [],
      fields,
      sortParams = [],
      totalData,
      standardData,
    } = dataCfg;
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
        formatter: (value: string) => valueFormatter(value), // 格式化
      } as Meta,
    ];

    // 目前源数据的是按照之前数据的现状（一条数据不是代表一个格子），处理的模板
    // 按values平铺展开data, 添加extraKey，冗余数据的量随着values增加而
    // 增加，而且双层循环的效率也随着而降低效率
    const multiValueTransform = (originData: Data[]) => {
      const transformedData = [];
      originData?.forEach((datum) => {
        if (!isEmpty(values)) {
          values.forEach((vi) => {
            transformedData.push({
              ...datum,
              [EXTRA_FIELD]: vi,
              [VALUE_FIELD]: datum[vi],
            });
          });
        } else {
          transformedData.push(datum);
        }
      });
      return transformedData;
    };

    // 标准的数据中，一条数据代表一个格子；不存在一条数据中多个value的情况
    const standardTransform = (originData: Data[]) => {
      return originData.map((datum) => {
        const valueKey = find(keys(datum), (k) => includes(values, k));
        return {
          ...datum,
          [EXTRA_FIELD]: valueKey,
          [VALUE_FIELD]: datum[valueKey],
        };
      });
    };

    const transformer = standardData ? standardTransform : multiValueTransform;
    const newData = transformer(data);
    const newTotalData = transformer(totalData);

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
    let meta: PivotMeta;
    let dimensions: string[];
    if (includes(rows, field)) {
      meta = this.rowPivotMeta;
      dimensions = rows;
    } else {
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
      if (sortedMeta?.length > 0) {
        return filterUndefined(getIntersections(sortedMeta, [...meta.keys()]));
      }

      return filterUndefined([...meta.keys()]);
    }

    if (this.sortedDimensionValues.has(field)) {
      return filterUndefined(
          [...this.sortedDimensionValues.get(field)]
      );
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
    const path = this.getDataPath({
      rowDimensionValues,
      colDimensionValues,
      careUndefined: isTotals,
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
    const path = this.getDataPath({
      rowDimensionValues,
      colDimensionValues,
      careUndefined: true,
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
