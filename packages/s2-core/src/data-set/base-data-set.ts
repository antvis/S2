import * as _ from 'lodash';
import {
  Aggregation,
  Data,
  Fields,
  Formatter,
  Meta,
  S2DataConfig,
  SortParams,
} from '../common/interface';
import { Pivot } from './pivot';
import BaseSpreadSheet from '../sheet-type/base-spread-sheet';
import { EXTRA_FIELD, TOTAL_VALUE, VALUE_FIELD } from '../common/constant';
interface CellOption {
  row: {
    isGrandTotals: boolean;
    isSubTotals: boolean;
    isTotals: boolean;
    // in row this is cell's colQuery
    otherQuery?: Record<string, any>;
    isCollapsedHasTotals?: boolean;
  };
  col: {
    isGrandTotals: boolean;
    isSubTotals: boolean;
    isTotals: boolean;
    // in col this is cell's rowQuery
    otherQuery?: Record<string, any>;
    isCollapsedHasTotals?: boolean;
  };
}
export interface BaseParams {
  // 交叉表入口对象实例
  spreadsheet: BaseSpreadSheet;
}

export abstract class BaseDataSet<T extends BaseParams> {
  // 字段域信息
  public fields: Fields;

  // 字段元信息，包含有字段名、格式化等
  public meta: Meta[];

  // 明细数据
  public data: Data[];

  // 高级排序, 组内排序
  public sortParams: SortParams;

  // pivot 数据实例
  public pivot: Pivot;

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

  /** 返回pivot实例 */
  public getPivot(): Pivot {
    return this.pivot;
  }

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
   * 重新设置数据配置，重新 load 数据
   * @param dataCfg
   */
  public setDataCfg(dataCfg: S2DataConfig) {
    // 每次重新设置数据的时候，需要清空缓存
    this.getFieldMeta.cache.clear();

    const { fields, meta, data, sortParams } = this.preProcess(dataCfg);

    this.fields = fields;
    this.meta = meta;
    this.data = data;
    this.sortParams = sortParams;

    // 训练数据
    this.pivot = this.createPivot();
  }

  /**
   * Get a data record by query and cellOption, the main priority
   * 1、first, handle custom node's cell
   *    ① custom row node's cell exclude column node's cell
   *    ② column node's cell
   * 2、second, handle collapsed node's cell
   * column > row
   * if the collapsed node has subTotals config, the cell will be treated as subTotals
   * otherwise, keep cell blank(because there are no record matched)
   * 2、third, handle totals node's cell
   *    ① row totals's cell exclude column totals's cell
   *    ② column totals's cell
   *
   * @param query obtains rowQuery and colQuery, use in normal cell
   * @param cellOption use in totals,custom,collapse cell
   */
  public getData(query: Record<string, any>, cellOption?: CellOption) {
    return this.pivot.getRecords(query);
  }

  /**
   * 预处理数据
   */
  protected abstract preProcess(dataCfg: S2DataConfig): S2DataConfig;

  protected createPivot() {
    // 创建 pivot 需要的数据源实例
    const { rows, columns, values } = this.fields;
    let newValues;
    if (_.isArray(values)) {
      newValues = values;
    } else {
      newValues = [_.last(values.fields)];
    }

    return new Pivot({
      cols: columns,
      rows,
      data: this.data,
      values: newValues,
      sortParams: this.sortParams,
      spreadsheet: this.spreadsheet,
    });
  }
}
