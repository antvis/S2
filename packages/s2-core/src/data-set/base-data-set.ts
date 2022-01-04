import {
  compact,
  find,
  get,
  identity,
  isNil,
  map,
  max,
  memoize,
  min,
} from 'lodash';
import {
  Fields,
  FilterParam,
  Formatter,
  Meta,
  S2DataConfig,
  SortParams,
} from '../common/interface';
import { ValueRange } from './../common/interface/condition';
import { CellDataParams, DataType } from '@/data-set/interface';
import { SpreadSheet } from '@/sheet-type';
import {
  getValueRangeState,
  setValueRangeState,
} from '@/utils/condition/state-controller';

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
  public indexesData: DataType[][] | DataType[];

  // 高级排序, 组内排序
  public sortParams: SortParams;

  public filterParams: FilterParam[];

  // 透视表入口对象实例
  protected spreadsheet: SpreadSheet;

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
    this.indexesData = [];
  }

  public getDisplayDataSet() {
    return this.displayData;
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
  public abstract getDimensionValues(field: string, query?: DataType): string[];

  /**
   * In most cases, this function to get the specific
   * cross data cell data
   * @param params
   */
  public abstract getCellData(params: CellDataParams): DataType;

  /**
   * To get a row or column cells data;
   * if query is empty, return all data
   * @param query
   * @param isTotals
   * @param isRow
   * @param drillDownFields
   */
  public abstract getMultiData(
    query: DataType,
    isTotals?: boolean,
    isRow?: boolean,
    drillDownFields?: string[],
  ): DataType[];

  public moreThanOneValue() {
    return this.fields?.values?.length > 1;
  }
}
