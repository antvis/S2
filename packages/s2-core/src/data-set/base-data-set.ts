import * as _ from 'lodash';
import {
  Fields,
  Formatter,
  Meta,
  S2DataConfig,
  SortParams,
} from "../common/interface";
import BaseSpreadSheet from '../sheet-type/base-spread-sheet';
import { BaseDataSetParams, DataType } from "src/data-set/interface";

export abstract class BaseDataSet<T extends BaseDataSetParams> {
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

  public setDataCfg(dataCfg: S2DataConfig) {
    this.getFieldMeta.cache.clear();
    const { fields, meta, data, sortParams } = this.processDataCfg(dataCfg);
    this.fields = fields;
    this.meta = meta;
    this.originData = data;
    this.sortParams = sortParams;
    this.indexesData = [];
  }

  /********************NEED IMPLEMENT BY USER CASE*************************/

  public abstract processDataCfg(dataCfg: S2DataConfig): S2DataConfig;

  public abstract getDimensionValues(field: string, query?: DataType): string[];

  public abstract getCellData(query: DataType): DataType[];

  // TODO delete this when facet done
  public abstract getTotalsConfig(field: string);
}
