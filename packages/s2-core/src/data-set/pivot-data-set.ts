import { BaseDataSet } from "src/data-set";
import { DataType, PivotMeta } from "src/data-set/interface";
import { DerivedValue, Meta, S2DataConfig, Total, Totals } from "src/common/interface";
import { i18n } from "src/common/i18n";
import { EXTRA_FIELD, TOTAL_VALUE, VALUE_FIELD } from "src/common/constant";
import { auto } from "src/utils/formatter";
import * as _ from "lodash";
import { DEBUG_TRANSFORM_DATA, DebuggerUtil } from "src/common/debug";

export class PivotDataSet extends BaseDataSet {
  // row dimension values pivot structure
  public rowPivotMeta: PivotMeta;

  // col dimension value pivot structure
  public colPivotMeta: PivotMeta;

  // sorted dimension values
  protected sortedDimensionValues: Map<string, Set<string>>;

  // un-sorted dimension values
  protected unSortedDimensionValues: Map<string, Set<string>>;

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
      this.transformIndexesData();
    });
    // TODO remove this function and unSortedDimensionValues/sortedDimensionValues
    //  when sortParams be reconstructed
    this.handleDimensionValuesSort();
  }

  /**
   * Transform origin data to indexed data
   */
  transformIndexesData = () => {
    const { rows, columns, values } = this.fields;
    // const realRows = _.filter(rows, r => r != EXTRA_FIELD);
    // const realColumns = _.filter(columns, r => r != EXTRA_FIELD).concat(EXTRA_FIELD);
    for (const data of this.originData) {
      const rowDimensionValues = this.transformDimensionsValues(data, rows);
      const colDimensionValues = this.transformDimensionsValues(data, columns);
      // this.transformDimensionsValues(data, values);
      const path = this.getDataPath(rowDimensionValues, colDimensionValues);
      if (_.size(path) === 0) {
        path.push(0);
      }
      // console.log('path:', path, data);
      _.set(this.indexesData, path, data);
    }
  }

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
  transformDimensionsValues = (record: DataType, dimensions: string[]): string[] => {
    return _.map(dimensions, (dimension) => {
      const dimensionValue = record[dimension];
      if (!this.unSortedDimensionValues.has(dimension)) {
        this.unSortedDimensionValues.set(dimension, new Set());
      }
      const values = this.unSortedDimensionValues.get(dimension);
      values.add(this.getSortIndex(dimension, record));
      return dimensionValue;
    });
  }

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
  }

  handleDimensionValuesSort = () => {
    const { rows, columns, values } = this.fields;
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
  }

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
   * @param rowDimensionValues data's row dimension values
   * @param colDimensionValues data's column dimension values
   * @param firstCreate first create meta info
   */
  getDataPath = (
    rowDimensionValues: string[],
    colDimensionValues: string[],
    firstCreate = true,
  ): number[] => {
    const getPath = (
      firstCreate: boolean,
      dimensionValues: string[],
      isRow = true,
    ): number[] => {
      let currentMeta = isRow ? this.rowPivotMeta : this.colPivotMeta;
      const path = [];
      for (const value of dimensionValues) {
        if (!currentMeta.has(value)) {
          if (firstCreate) {
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
        path.push(meta.level);
        currentMeta = meta.children;
      }
      return path;
    };
    const rowPath = getPath(firstCreate, rowDimensionValues);
    const colPath = getPath(firstCreate, colDimensionValues, false);
    const result = rowPath.concat(...colPath);
    return result;
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
      // 总计存在时可能导致数据重复
      newColumns = _.uniq([...columns, EXTRA_FIELD]);
      /*
       * 普通模式下，值挂在列时，需要将衍生指标作为新的列来渲染
       * 分两个情况
       * 1、全部平铺，就所有衍生指标展开显示
       * [主指标1，衍生指标11，衍生指标12 - 主指标2，衍生指标21，衍生指标22]
       * 2、仅展示部分衍生指标（displayDerivedValueField），其他的以...显示
       */
      if (_.isArray(values)) {
        newValues = this.handleValues(values, derivedValues);
      }
    } else {
      // value in rows
      // TODO 值挂在行头时，衍生指标是按决策显示的方式显示在单元格中
      newRows = [...rows, EXTRA_FIELD];
    }
    // 新增的字段按照值域字段顺序排序
    if (_.isArray(newValues)) {
      newSortParams = sortParams.concat({
        sortFieldId: EXTRA_FIELD,
        sortBy: newValues,
      });
    }

    // 3、meta 中添加新的字段信息（度量别名设置）
    const enumAlias = new Map<string, string>();

    _.each(newValues, (value: string) => {
      // tslint:disable-next-line:no-shadowed-variable
      const m = _.find(meta, (mt: Meta) => mt.field === value);
      enumAlias.set(value, _.get(m, 'name', value));
    });

    const newMeta = [
      ...meta,
      // 虚拟列字段，为文本分类字段，格式化为字段值的别名
      {
        field: EXTRA_FIELD,
        name: i18n('数值'),
        formatter: (v) => enumAlias.get(v), // 格式化
      } as Meta,
      // 小计字段，为数值连续字段，格式化为自动数值格式化
      {
        field: TOTAL_VALUE,
        name: i18n('小计'),
        formatter: (v) => auto(v),
      } as Meta,
    ];

    // 4. 数据按照 newValues 字段扩展成 newColumnName 字段
    // 将原一条数据，转化成 newValues.length 条数据
    const newData = [];
    // eslint-disable-next-line no-restricted-syntax
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
    }
    // TODO sort dimension values
    return filterUndefined(Array.from(meta.keys()));
  }

  public getCellData(query: DataType): DataType[] {
    const { rows, columns, values } = this.fields;
    const getDimensionValues = (dimensions: string[], query: DataType): string[] => {
      return _.reduce(
        dimensions,
        (res: string[], dimension: string) => {
          // push undefined when not exist
          res.push(query[dimension]);
          return res;
        },
        [],
      );
    }
    const rowDimensionValues = getDimensionValues(rows, query);
    const colDimensionValues = getDimensionValues(columns, query);
    const path = this.getDataPath(
      rowDimensionValues,
      colDimensionValues,
      false,
    );

    let data = _.size(path) ? _.get(this.indexesData, path) : {};
    if (!_.isArray(data)) {
      data = [data];
    }
    DebuggerUtil.getInstance().logger("get data:", path, data);
    return _.compact(_.flattenDeep(data));
  }

  handleValues = (values: string[], derivedValues: DerivedValue[]) => {
    const tempValue = [];
    _.each(values, (v) => {
      const findOne = _.find(derivedValues, (dv) => dv.valueField === v);
      if (findOne) {
        // 值存在衍生值，添加值和所有衍生值,或者第一个衍生值
        tempValue.push(v);
        // 全部展示衍生值 -- 跟进需要展示的衍生指标来决定添加多少列
        // 优先展示部分衍生值（如果有） -- 优先值
        const dvs = findOne.displayDerivedValueField;
        tempValue.push(...dvs);
      } else {
        // 值不存在衍生值，只需要添加值
        tempValue.push(v);
      }
    });
    return tempValue;
  };

}
