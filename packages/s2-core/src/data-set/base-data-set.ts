import * as _ from 'lodash';
import {
  Fields,
  Formatter,
  Meta,
  S2DataConfig,
  SortParams, Total, Totals
} from "../common/interface";
import BaseSpreadSheet from '../sheet-type/base-spread-sheet';
import { EXTRA_FIELD } from '../common/constant';
import { DataType, PivotMeta } from "src/data-set/interface";
import { i18n } from "src/common/i18n";
export interface BaseParams {
  // 交叉表入口对象实例
  spreadsheet: BaseSpreadSheet;
}

export abstract class BaseDataSet<T extends BaseParams> {
  // 字段域信息
  public fields: Fields;

  // 字段元信息，包含有字段名、格式化等
  public meta: Meta[];

  // origin data
  public originData: DataType[];

  // multidimensional array to indexes data
  public indexesData: [];

  // 高级排序, 组内排序
  public sortParams: SortParams;

  // 交叉表入口对象实例
  protected spreadsheet: BaseSpreadSheet;

  protected rowPivotMeta: PivotMeta;

  protected colPivotMeta: PivotMeta;

  // sorted dimension values
  protected sortedDimensionValues: Map<string, Set<string>>;

  // un-sorted dimension values
  protected unSortedDimensionValues: Map<string, Set<string>>;

  protected constructor(params: T) {
    this.spreadsheet = params.spreadsheet;
  }

  /**
   * 查找字段信息
   */
  public getFieldMeta = _.memoize(
    (field: string): Meta => {
      return _.find(this.meta, (m: Meta) => m.field === field);
    },
  );

  /**
   * 获得字段名称
   * @param field
   */
  public getFieldName(field: string): string {
    return _.get(this.getFieldMeta(field), 'name', field);
  }

  /**
   * 获得字段名称
   * @param field
   */
  public getFieldFormatter(field: string): Formatter {
    return _.get(this.getFieldMeta(field), 'formatter', _.identity);
  }

  /**
   * get total's config by dimension id
   * @param dimension unique dimension id
   */
  public getTotalsConfig(
    dimension: string,
  ): Partial<Totals['row']> {
    const { totals } = this.spreadsheet.options;
    const { rows } = this.fields;
    const totalConfig = _.get(totals, _.includes(rows, dimension) ? 'row' : 'col', {}) as Total;
    const showSubTotals = totalConfig.showSubTotals
      ? _.includes(totalConfig.subTotalsDimensions, dimension)
      : false;
    return {
      showSubTotals,
      showGrandTotals: totalConfig.showGrandTotals,
      reverseLayout: totalConfig.reverseLayout,
      reverseSubLayout: totalConfig.reverseSubLayout,
      label: totalConfig.label || i18n('总计'),
      subLabel: totalConfig.subLabel || i18n('小计'),
    };
  }

  /**
   * When data related config changed, we need
   * 1、re-process config
   * 2、re-transform origin data
   * 3、sort and other things
   * @param dataCfg
   */
  public setDataCfg(dataCfg: S2DataConfig) {
    this.initConfig(dataCfg);
    this.transformIndexesData();
    // TODO remove this function and unSortedDimensionValues/sortedDimensionValues
    //  when sortParams be reconstructed
    this.handleDimensionValuesSort();
  }

  public getSortedDimensionValues(field: string, query?: DataType): string[] {
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

  initConfig = (dataCfg: S2DataConfig) => {
    this.getFieldMeta.cache.clear();
    const { fields, meta, data, sortParams } = this.preProcess(dataCfg);

    this.fields = fields;
    this.meta = meta;
    this.originData = data;
    this.sortParams = sortParams;

    this.unSortedDimensionValues = new Map();
    this.sortedDimensionValues = new Map();
    this.indexesData = [];
    this.rowPivotMeta = new Map();
    this.colPivotMeta = new Map();
  }

  /**
   * Transform origin data to indexed data
   */
  transformIndexesData = () => {
    const { rows, columns, values } = this.fields;
    for (const data of this.originData) {
      const rowDimensionValues = this.transformDimensionsValues(data, rows);
      const colDimensionValues = this.transformDimensionsValues(data, columns);
      // this.transformDimensionsValues(data, values);
      const path = this.getDataPath(rowDimensionValues, colDimensionValues);
      if (_.size(path) === 0) {
        path.push(0);
      }
      console.log('path:', path, data);
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


  public getData(query: DataType): DataType[] {
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
    const colDimensionValues = getDimensionValues(
      columns.filter((v) => v !== EXTRA_FIELD),
      query,
    );
    const path = this.getDataPath(
      rowDimensionValues,
      colDimensionValues,
      false,
    );
    let data = _.size(path) ? _.get(this.indexesData, path) : this.indexesData;
    if (!_.isArray(data)) {
      data = [data];
    }
    console.log('path------:', path, data);
    return _.compact(_.flattenDeep(data));
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
      _.each(dimensionValues, (value) => {
        if (!currentMeta.has(value)) {
          if (firstCreate) {
            currentMeta.set(value, {
              level: currentMeta.size,
              children: new Map(),
            });
          } else {
            return path;
          }
        }
        const meta = currentMeta.get(value);
        path.push(meta.level);
        currentMeta = meta.children;
      });
      return path;
    };
    const rowPath = getPath(firstCreate, rowDimensionValues);
    const colPath = getPath(firstCreate, colDimensionValues, false);
    const result = rowPath.concat(...colPath);
    return result;
  };

  /**
   * Pre handle S2 DataConfig info
   */
  protected abstract preProcess(dataCfg: S2DataConfig): S2DataConfig;
}
