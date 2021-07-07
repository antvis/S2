import * as _ from 'lodash';
import {
  Fields,
  Formatter,
  Meta,
  S2DataConfig,
  SortParams,
} from '../common/interface';
import { DataType } from 'src/data-set/interface';
import { SpreadSheet } from 'src/sheet-type';
import { Node } from '@/facet/layout/node';

export abstract class BaseDataSet {
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
  protected spreadsheet: SpreadSheet;

  public constructor(spreadsheet: SpreadSheet) {
    this.spreadsheet = spreadsheet;
  }

  /**
   * 查找字段信息
   */
  public getFieldMeta = _.memoize((field: string): Meta => {
    return _.find(this.meta, (m: Meta) => m.field === field);
  });

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

  public setDataCfg(dataCfg: S2DataConfig) {
    this.getFieldMeta.cache.clear();
    const { fields, meta, data, sortParams } = this.processDataCfg(dataCfg);
    this.fields = fields;
    this.meta = meta;
    this.originData = data;
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
   * @param query
   * @param rowNode
   */
  public abstract getCellData(query: DataType, rowNode?: Node): DataType;

  /**
   * To get a row or column cells data;
   * if query is empty, return all data
   * @param query
   * @param isTotals
   */
  public abstract getMultiData(query: DataType, isTotals?: boolean): DataType[];
}
