import { BaseDataSet } from 'src/data-set';
import { DataPathParams, DataType, PivotMeta } from 'src/data-set/interface';
import { DerivedValue, Meta, S2DataConfig } from 'src/common/interface';
import { i18n } from 'src/common/i18n';
import { EXTRA_FIELD, VALUE_FIELD } from 'src/common/constant';
import _ from 'lodash';
import { DEBUG_TRANSFORM_DATA, DebuggerUtil } from 'src/common/debug';
import { Node } from '@/facet/layout/node';

export class PivotDataSet extends BaseDataSet {
  // row dimension values pivot structure
  public rowPivotMeta: PivotMeta;

  // col dimension value pivot structure
  public colPivotMeta: PivotMeta;

  // sorted dimension values
  protected sortedDimensionValues: Map<string, Set<string>>;

  // un-sorted dimension values
  protected unSortedDimensionValues: Map<string, Set<string>>;

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
    this.unSortedDimensionValues = new Map();
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
        _.merge(drillDownDatum, {
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
        .map((path) => _.set(this.indexesData, path, undefined));
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
        .map((path) => _.set(this.indexesData, path, undefined));
      idPathMap.delete(rowNodeId);
    } else {
      _.flatten(Array.from(idPathMap.values()))?.map((path) =>
        _.set(this.indexesData, path, undefined),
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
      // this.transformDimensionsValues(data, values);
      const path = this.getDataPath({
        rowDimensionValues,
        colDimensionValues,
        isFirstCreate: true,
        rowFields: rows,
      });
      paths.push(path);
      // console.log('path:', path, data);
      _.set(this.indexesData, path, data);
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
    return _.map(dimensions, (dimension) => {
      const dimensionValue = record[dimension];
      if (!this.unSortedDimensionValues.has(dimension)) {
        this.unSortedDimensionValues.set(dimension, new Set());
      }
      const values = this.unSortedDimensionValues.get(dimension);
      values.add(this.getSortIndex(dimension, record));
      return dimensionValue;
    });
  };

  // TODO remove this when sortParams be constructed
  getSortIndex = (key: string, record: DataType): string => {
    const sortParam = _.find(this.sortParams, ['sortFieldId', key]);
    if (sortParam) {
      if (!_.isEmpty(sortParam.sortBy)) {
        // return indexOf(sortParam.sortBy, record[key]);
        return record[key];
      }
      if (sortParam.sortByField) {
        // 数值也转为文本，便于后续统一排序
        return `${record[sortParam.sortByField]}`;
      }
    }
    return record[key];
  };

  handleDimensionValuesSort = () => {
    const { rows, columns } = this.fields;
    const dimensions = rows.concat(columns);
    _.each(dimensions, (dimension) => {
      const sortParam = _.find(this.sortParams, ['sortFieldId', dimension]);
      const sortMap = this.unSortedDimensionValues.get(dimension);
      // 无数据时，只有维度配置，但没有具体维值，需要容错
      if (sortParam && sortMap) {
        const sortAction = (arr: string[], defaultMultiple = 1) => {
          arr?.sort((a: string, b: string) => {
            if (_.isNumber(a[1]) && _.isNumber(b[1])) {
              // 数值比较，解决 '2' > '11' 场景
              return (a[1] - b[1]) * defaultMultiple;
            }
            if (a[1] && b[1]) {
              // 数据健全兼容，用户数据不全时，能够展示.
              return (
                a[1].toString().localeCompare(b[1].toString(), 'zh') *
                defaultMultiple
              );
            }
            return defaultMultiple;
          });
        };
        const sorted = Array.from(sortMap.keys());
        if (sortParam.sortBy && sortParam?.sortFieldId === EXTRA_FIELD) {
          sortAction(sorted);
        } else if (sortParam.sortMethod) {
          const multiple = sortParam.sortMethod === 'ASC' ? 1 : -1;
          sortAction(sorted, multiple);
        }
        this.sortedDimensionValues.set(dimension, new Set(sorted));
      } else if (sortMap) {
        this.sortedDimensionValues.set(dimension, sortMap);
      }
    });
    this.unSortedDimensionValues.clear();
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
            break;
          }
        }
        const meta = currentMeta.get(value);
        if (isFirstCreate) {
          // mark the child field
          meta.childField = fields?.[i + 1];
        }
        if (_.isUndefined(value) && careUndefined) {
          path.push(value);
        } else {
          path.push(meta.level);
        }
        currentMeta = meta.children;
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
    _.each(values, (v) => {
      const findOne = _.find(derivedValues, (dv) => dv.valueField === v);
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
    let newSortParams: S2DataConfig['sortParams'] = sortParams;
    let newValues = values;
    if (valueInCols) {
      // value in cols
      newColumns = _.uniq([...columns, EXTRA_FIELD]);
      newValues = this.getValues(values, derivedValues);
    } else {
      // value in rows
      newRows = [...rows, EXTRA_FIELD];
    }
    // 新增的字段按照值域字段顺序排序
    newSortParams = sortParams.concat({
      sortFieldId: EXTRA_FIELD,
      sortBy: newValues,
    });

    // meta 中添加新的字段信息（度量别名设置）
    const enumAlias = new Map<string, string>();
    _.each(newValues, (value: string) => {
      const m = _.find(meta, (mt: Meta) => mt.field === value);
      enumAlias.set(value, _.get(m, 'name', value));
    });

    const newMeta = [
      ...meta,
      // 虚拟列字段，为文本分类字段
      {
        field: EXTRA_FIELD,
        name: i18n('数值'),
        formatter: (v: string) => enumAlias.get(v), // 格式化
      } as Meta,
    ];

    // transform values to EXTRA_FIELD key
    const newData = [];
    for (const datum of data) {
      if (!_.isEmpty(newValues)) {
        _.each(newValues, (value: string) => {
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
      sortParams: newSortParams,
    };
  }

  public getDimensionValues(field: string, query?: DataType): string[] {
    const { rows, columns } = this.fields;
    const filterUndefined = (values: string[]) => {
      return _.filter(values, (t) => !_.isUndefined(t));
    };
    let meta: PivotMeta;
    let dimensions: string[];
    if (_.includes(rows, field)) {
      meta = this.rowPivotMeta;
      dimensions = rows;
    } else {
      meta = this.colPivotMeta;
      dimensions = columns;
    }
    if (!_.isEmpty(query)) {
      for (const dimension of dimensions) {
        const value = _.get(query, dimension);
        if (meta.has(value) && !_.isUndefined(value)) {
          meta = meta.get(value).children;
        }
      }
      // TODO sort dimension values
      return filterUndefined(Array.from(meta.keys()));
    }
    return filterUndefined(Array.from(this.sortedDimensionValues.get(field)));
  }

  getQueryDimValues = (dimensions: string[], query: DataType): string[] => {
    return _.reduce(
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
    const newRows = Node.getFieldPath(rowNode);
    const rows = _.isEmpty(newRows) ? originRows : newRows;
    const rowDimensionValues = this.getQueryDimValues(rows, query);
    const colDimensionValues = this.getQueryDimValues(columns, query);
    const path = this.getDataPath({ rowDimensionValues, colDimensionValues });
    const data = _.get(this.indexesData, path);
    // DebuggerUtil.getInstance().logger('get cell data:', path, data);
    return data;
  }

  public getMultiData(query: DataType, isTotals?: boolean): DataType[] {
    if (_.isEmpty(query)) {
      return _.compact(_.flattenDeep(this.indexesData));
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
        if (_.isUndefined(current)) {
          currentData = _.flatten(currentData) as [];
        } else {
          currentData = currentData
            .map((d) => d[current])
            .filter((d) => !_.isUndefined(d)) as [];
        }
      } else if (_.isUndefined(current)) {
        hadUndefined = true;
      } else {
        currentData = currentData?.[current];
      }
    }
    let result = _.compact(_.flattenDeep(currentData));
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
          result = result.filter((r) => !_.has(r, columnField));
        }
      }
    }
    return result;
  }
}
