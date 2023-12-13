import {
  compact,
  find,
  get,
  identity,
  isEmpty,
  isNil,
  map,
  max,
  memoize,
  min,
} from 'lodash';
import type { Indexes } from '../utils/indexes';
import type { CellMeta, Data, RowData, ViewMeta } from '../common';
import type {
  Fields,
  FilterParam,
  Formatter,
  Meta,
  S2DataConfig,
  SortParams,
} from '../common/interface';
import type { ValueRange } from '../common/interface/condition';
import type { SpreadSheet } from '../sheet-type';
import {
  getValueRangeState,
  setValueRangeState,
} from '../utils/condition/state-controller';
import { generateExtraFieldMeta } from '../utils/dataset/pivot-data-set';
import type { CellDataParams, DataType, MultiDataParams, Query } from './index';

export abstract class BaseDataSet {
  // 字段域信息
  public fields: Fields;

  // 字段元信息，包含有字段名、格式化等
  public meta: Meta[];

  // origin data
  public originData: DataType[];

  // total data
  public totalData: DataType[];

  // multidimensional array to indexes data
  public indexesData: Record<string, DataType[][] | DataType[]>;

  // 高级排序, 组内排序
  public sortParams: SortParams;

  public filterParams: FilterParam[];

  // 透视表入口对象实例
  public spreadsheet: SpreadSheet;

  public constructor(spreadsheet: SpreadSheet) {
    this.spreadsheet = spreadsheet;
  }

  protected displayData: DataType[];

  /**
   * 查找字段信息
   */
  public getFieldMeta = memoize((field: string, meta?: Meta[]): Meta => {
    return find(this.meta || meta, (m: Meta) => m.field === field);
  });

  /**
   * 获得字段名称
   * @param field
   */
  public getFieldName(field: string): string {
    return get(this.getFieldMeta(field, this.meta), 'name', field);
  }

  /**
   * 获得字段格式方法
   * @param field
   */
  public getFieldFormatter(field: string): Formatter {
    return get(this.getFieldMeta(field, this.meta), 'formatter', identity);
  }

  /**
   * 获得字段描述
   * @param field
   */
  public getFieldDescription(field: string): string {
    return get(this.getFieldMeta(field, this.meta), 'description');
  }

  public setDataCfg(dataCfg: S2DataConfig) {
    this.getFieldMeta.cache.clear();
    const { fields, meta, data, totalData, sortParams, filterParams } =
      this.processDataCfg(dataCfg);
    this.fields = fields;
    this.meta = meta;
    this.originData = data;
    this.totalData = totalData;
    this.sortParams = sortParams;
    this.filterParams = filterParams;
    this.displayData = this.originData;
    this.indexesData = {};
  }

  public processMeta(meta: Meta[] = [], defaultExtraFieldText: string) {
    return [
      ...meta,
      generateExtraFieldMeta(
        meta,
        this.spreadsheet?.options?.cornerExtraFieldText,
        defaultExtraFieldText,
      ),
    ];
  }

  public getDisplayDataSet() {
    return this.displayData;
  }

  public isEmpty() {
    return isEmpty(this.getDisplayDataSet());
  }

  // https://github.com/antvis/S2/issues/2255
  public getEmptyViewIndexes(): Indexes {
    return [];
  }

  public getValueRangeByField(field: string): ValueRange {
    const cacheRange = getValueRangeState(this.spreadsheet, field);
    if (cacheRange) {
      return cacheRange;
    }
    const fieldValues = compact(
      map(this.originData, (item) => {
        const value = item[field] as string;
        return isNil(value) ? null : Number.parseFloat(value);
      }),
    );
    const range = {
      maxValue: max(fieldValues),
      minValue: min(fieldValues),
    };
    setValueRangeState(this.spreadsheet, {
      [field]: range,
    });
    return range;
  }

  /** ******************NEED IMPLEMENT BY USER CASE************************ */

  /**
   * Try to process dataConfig in different mode
   * @param dataCfg
   */
  public abstract processDataCfg(dataCfg: S2DataConfig): S2DataConfig;

  /**
   * 1、query !== null
   * province  city => field
   *   辽宁省
   *          达州市
   *          芜湖市
   *  field = province
   *  query = {province: '辽宁省'}
   *  => [达州市,芜湖市]
   *
   *  2、query = null
   *  query param is not necessary, when just
   *  get some field's all dimension values
   *
   * @param field current dimensions
   * @param query dimension value query
   */
  public abstract getDimensionValues(field: string, query?: Query): string[];

  /**
   * In most cases, this function to get the specific
   * cross data cell data
   * @param params
   */
  public abstract getCellData(params: CellDataParams): DataType;

  /**
   * 获取符合 query 的所有单元格数据，如果 query 为空，返回空数组
   * @param query
   * @param params 默认获取符合 query 的所有数据，包括小计总计等汇总数据；
   *               如果只希望获取明细数据，请使用 { queryType: QueryDataType.DetailOnly }
   */
  public abstract getMultiData(query: Query, params?: MultiDataParams): Data[];

  public moreThanOneValue() {
    return this.fields?.values?.length > 1;
  }

  /**
   * get a row cells data including cell
   */
  public abstract getRowData(cellMeta: CellMeta | ViewMeta | Node): RowData;
}
