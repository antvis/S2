import { memoize, find, get, identity } from 'lodash';
import {
  Fields,
  Formatter,
  Meta,
  S2DataConfig,
  SortParams,
} from '../common/interface';
import { DataType, CellDataParams } from 'src/data-set/interface';
import { SpreadSheet } from 'src/sheet-type';

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
  public indexesData: [];

  // 高级排序, 组内排序
  public sortParams: SortParams;

  // 交叉表入口对象实例
  protected spreadsheet: SpreadSheet;

  public constructor(spreadsheet: SpreadSheet) {
    this.spreadsheet = spreadsheet;
  }

  /**
   * 查找字段信息
   */
  public getFieldMeta = memoize((field: string): Meta => {
    return find(this.meta, (m: Meta) => m.field === field);
  });

  /**
   * 获得字段名称
   * @param field
   */
  public getFieldName(field: string): string {
    return get(this.getFieldMeta(field), 'name', field);
  }

  /**
   * 获得字段名称
   * @param field
   */
  public getFieldFormatter(field: string): Formatter {
    return get(this.getFieldMeta(field), 'formatter', identity);
  }

  public setDataCfg(dataCfg: S2DataConfig) {
    this.getFieldMeta.cache.clear();
    const { fields, meta, data, totalData, sortParams } =
      this.processDataCfg(dataCfg);
    this.fields = fields;
    this.meta = meta;
    this.originData = data;
    this.totalData = totalData;
    this.sortParams = sortParams;
    this.indexesData = [];
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
   */
  public abstract getMultiData(
    query: DataType,
    isTotals?: boolean,
    isRow?: boolean,
  ): DataType[];
}
