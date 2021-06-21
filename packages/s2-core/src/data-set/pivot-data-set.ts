import { BaseDataSet } from 'src/data-set';
import { DataPathParams, DataType, PivotMeta } from 'src/data-set/interface';
import { DerivedValue, Meta, S2DataConfig } from 'src/common/interface';
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
  flattenDeep,
  get,
  includes,
  filter,
  reduce,
  merge,
  flatten,
  has,
} from 'lodash';
import { DEBUG_TRANSFORM_DATA, DebuggerUtil } from 'src/common/debug';
import { Node } from '@/facet/layout/node';
import { sortAction } from 'src/utils/sort-action';

export class PivotDataSet extends BaseDataSet {
  // row dimension values pivot structure
  public rowPivotMeta: PivotMeta;

  // col dimension value pivot structure
  public colPivotMeta: PivotMeta;

  // sorted dimension values
  protected sortedDimensionValues: Map<string, Set<string>>;

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
      this.transformIndexesData(rows, columns, this.originData);
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
  ): number[][] => {
    const paths = [];
    for (const data of originData) {
      const rowDimensionValues = this.transformDimensionsValues(data, rows);
      const colDimensionValues = this.transformDimensionsValues(data, columns);
      const path = this.getDataPath({
        rowDimensionValues,
        colDimensionValues,
        isFirstCreate: true,
        rowFields: rows,
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
      let values = this.sortedDimensionValues.get(dimension);
      values.add(record[dimension]);

      return dimensionValue;
    });
  };

  handleDimensionValuesSort = () => {
    const { values } = this.fields;
    each(this.sortParams || [], (item) => {
      const { sortFieldId, sortBy, sortMethod, sortByField, query, sortFunc } =
        item || {};
      const sortMap = this.sortedDimensionValues.get(sortFieldId);
      let sorted = Array.from(sortMap.keys());
      // 根据其他字段排序（组内排序）
      if (sortByField) {
        let currentData = this.getMultiData(query) || [];
        if (values.includes(sortByField)) {
          currentData = currentData.filter(
            (i) => i[EXTRA_FIELD] === sortByField,
          );
        }
        // 自定义方法
        if (sortFunc) {
          sorted = sortFunc({ data: currentData, ...item }) || sorted;
        } else if (sortMethod) {
          sorted = sortAction(currentData, sortMethod, sortByField)?.map(
            (item) => item[sortFieldId],
          );
        }
      } else if (sortFunc) {
        sorted = sortFunc({ data: sorted, ...item }) || sorted;
      } else if (sortBy) {
        // 自定义列表
        sorted = sortBy;
      } else if (sortMethod) {
        // 升/降序
        sorted = sortAction(sorted, sortMethod) as string[];
      }
      this.sortedDimensionValues.set(sortFieldId, new Set(sorted));
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
    } = params;
    const getPath = (dimensionValues: string[], isRow = true): number[] => {
      let currentMeta = isRow ? this.rowPivotMeta : this.colPivotMeta;
      const fields = isRow ? rowFields : [];
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
            // the most case happened in total cell
            const meta = currentMeta.get(value);
            if (meta) {
              path.push(meta.level);
            }
          }
        }
        const meta = currentMeta.get(value);
        if (isUndefined(value) && careUndefined) {
          path.push(value);
        } else {
          path.push(meta.level);
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

  /**
   * Trans
   * @param values
   * @param derivedValues
   */
  getValues = (values: string[], derivedValues: DerivedValue[]) => {
    const tempValue = [];
    each(values, (v) => {
      const findOne = find(derivedValues, (dv) => dv.valueField === v);
      tempValue.push(v);
      if (findOne) {
        // derived value exist
        const dvs = findOne.derivedValueField;
        tempValue.push(...dvs);
      }
    });
    return tempValue;
  };

  public processDataCfg(dataCfg: S2DataConfig): S2DataConfig {
    const { data, meta = [], fields, sortParams = [] } = dataCfg;
    const { columns, rows, values, derivedValues, valueInCols } = fields;

    let newColumns = columns;
    let newRows = rows;
    let newValues = values;
    if (valueInCols) {
      // value in cols
      newColumns = uniq([...columns, EXTRA_FIELD]);
      newValues = this.getValues(values, derivedValues);
    } else {
      // value in rows
      newRows = [...rows, EXTRA_FIELD];
    }

    // meta 中添加新的字段信息（度量别名设置）
    const enumAlias = new Map<string, string>();
    each(newValues, (value: string) => {
      const m = find(meta, (mt: Meta) => mt.field === value);
      enumAlias.set(value, get(m, 'name', value));
    });

    const newMeta = [
      ...meta,
      // 虚拟列字段，为文本分类字段
      {
        field: EXTRA_FIELD,
        name: i18n('数值'),
        formatter: (v) => enumAlias.get(v), // 格式化
      } as Meta,
    ];

    // transform values to EXTRA_FIELD key
    const newData = [];
    for (const datum of data) {
      if (!isEmpty(newValues)) {
        each(newValues, (value: string) => {
          newData.push({
            ...datum,
            [EXTRA_FIELD]: value, // getFieldName(row, meta), // 替换为字段名称
            [VALUE_FIELD]: datum[value],
          });
        });
      } else {
        newData.push({
          ...datum,
        });
      }
    }

    // 返回新的结构
    return {
      data: newData,
      meta: newMeta,
      fields: {
        ...fields,
        rows: newRows,
        columns: newColumns,
        values: newValues,
      },
      sortParams,
    };
  }

  getIntersections = (arr1: string[], arr2: string[]) => {
    return arr1.filter((item) => arr2.includes(item));
  };

  public getDimensionValues(field: string, query?: DataType): string[] {
    const { rows, columns } = this.fields;
    const filterUndefined = (values: string[]) => {
      return filter(values, (t) => !isUndefined(t));
    };
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
      for (const dimension of dimensions) {
        const value = get(query, dimension);
        if (meta.has(value) && !isUndefined(value)) {
          meta = meta.get(value).children;
        }
      }
    }

    if (this.sortedDimensionValues.has(field)) {
      return filterUndefined(
        this.getIntersections(
          [...this.sortedDimensionValues.get(field)],
          [...meta.keys()],
        ),
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

  public getCellData(query: DataType, rowNode?: Node): DataType {
    const { columns, rows: originRows } = this.fields;
    const rows = Node.getFieldPath(rowNode) ?? originRows;
    const rowDimensionValues = this.getQueryDimValues(rows, query);
    const colDimensionValues = this.getQueryDimValues(columns, query);
    const path = this.getDataPath({ rowDimensionValues, colDimensionValues });
    const data = get(this.indexesData, path);
    // DebuggerUtil.getInstance().logger('get cell data:', path, data);
    return data;
  }

  public getMultiData(query: DataType, isTotals?: boolean): DataType[] {
    if (isEmpty(query)) {
      return compact(flattenDeep(this.indexesData));
    }
    // TODO adapt drill down scene
    const { rows, columns, valueInCols } = this.fields;
    const rowDimensionValues = this.getQueryDimValues(rows, query);
    const colDimensionValues = this.getQueryDimValues(columns, query);
    const path = this.getDataPath({
      rowDimensionValues,
      colDimensionValues,
      careUndefined: true,
    });
    let hadUndefined = false;
    let currentData = this.indexesData;

    for (let i = 0; i < path.length; i++) {
      const current = path[i];
      if (hadUndefined) {
        if (isUndefined(current)) {
          currentData = flatten(currentData) as [];
        } else {
          currentData = currentData
            .map((d) => d[current])
            .filter((d) => !isUndefined(d)) as [];
        }
      } else if (isUndefined(current)) {
        hadUndefined = true;
      } else {
        currentData = currentData?.[current];
      }
    }
    let result = compact(flattenDeep(currentData));
    if (isTotals) {
      // need filter extra data
      if (valueInCols) {
        // grand total =>  {$$extra$$: 'price'}
        // sub total => {$$extra$$: 'price', category: 'xxxx'}
        // [undefined, undefined, "price"] => [category]
        const firstColFieldIndex = colDimensionValues.indexOf(undefined);
        let columnField;
        if (firstColFieldIndex !== -1) {
          columnField = columns[firstColFieldIndex];
          result = result.filter((r) => !has(r, columnField));
        }
      }
    }

    return result;
  }
}
