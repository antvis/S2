import {
  compact,
  find,
  get,
  identity,
  isNil,
  isString,
  map,
  max,
  memoize,
  min,
} from 'lodash';
import type {
  Data,
  Fields,
  FilterParam,
  Formatter,
  Meta,
  S2CellType,
  ViewMeta,
  RawData,
  S2DataConfig,
  SortParams,
  ViewMetaData,
} from '../common/interface';
import type { Node } from '../facet/layout/node';
import type { ValueRange } from '../common/interface/condition';
import type { SpreadSheet } from '../sheet-type';
import {
  getValueRangeState,
  setValueRangeState,
} from '../utils/condition/state-controller';
import { CellTypes, type CustomTreeNode } from '../common';
import type { Query, TotalSelectionsOfMultiData } from './interface';
import type { CellData } from './cell-data';
import type { CellDataParams } from './index';

export abstract class BaseDataSet {
  // 字段域信息
  public fields: Fields;

  // 字段元信息，包含有字段名、格式化等
  public meta: Meta[];

  // origin data
  public originData: RawData[];

  // multidimensional array to indexes data
  public indexesData: RawData[][] | RawData[];

  // 高级排序, 组内排序
  public sortParams: SortParams;

  public filterParams: FilterParam[];

  // 透视表入口对象实例
  protected spreadsheet: SpreadSheet;

  public constructor(spreadsheet: SpreadSheet) {
    this.spreadsheet = spreadsheet;
  }

  protected displayData: RawData[];

  /**
   * 获取字段信息
   */
  public getFieldMeta = memoize(
    (field: string | CustomTreeNode, meta?: Meta[]): Meta => {
      const realField = isString(field) ? field : field?.key;
      return find(this.meta || meta, { field: realField });
    },
  );

  /**
   * 获取字段名称
   * @param field
   */
  public getFieldName(
    field: string | CustomTreeNode,
    defaultValue?: string,
  ): string {
    const realField = isString(field) ? field : field?.key;
    const realDefaultValue = isString(field) ? undefined : field?.title;

    return get(
      this.getFieldMeta(realField, this.meta),
      'name',
      defaultValue ?? realDefaultValue,
    );
  }

  /**
   * 获取自定义单元格字段名称
   * @param cell
   */
  public getCustomRowFieldName(cell: S2CellType<ViewMeta | Node>): string {
    if (!cell) {
      return;
    }
    const meta = cell.getMeta?.();

    // 数值单元格, 根据 rowIndex 匹配所对应的行头单元格名字
    if (cell.cellType === CellTypes.DATA_CELL) {
      const row = find(this.spreadsheet.getRowNodes(), {
        rowIndex: meta?.rowIndex,
      });
      return row?.label || this.getFieldName(row?.field);
    }

    // 行/列头单元格, 取节点本身标题
    return meta?.label || this.getFieldName(meta.field);
  }

  /**
   * 获取自定义单元格字段描述
   * @param cell
   */
  public getCustomFieldDescription = (
    cell: S2CellType<ViewMeta | Node>,
  ): string => {
    if (!cell) {
      return;
    }

    const meta = cell.getMeta?.();
    if (meta.isTotals) {
      return;
    }

    // 数值单元格
    if (cell.cellType === CellTypes.DATA_CELL) {
      const currentMeta = find(meta.spreadsheet.dataCfg.meta, {
        field: meta.field || meta.value || meta.valueField,
      });
      return this.getFieldDescription(currentMeta?.field);
    }

    // 行/列头单元格, 取节点本身描述
    return meta?.extra?.description || this.getFieldDescription(meta?.field);
  };

  /**
   * 获得字段格式方法
   * @param field
   */
  public getFieldFormatter(field: string | CustomTreeNode): Formatter {
    const realField = isString(field) ? field : field?.key;
    return get(this.getFieldMeta(realField, this.meta), 'formatter', identity);
  }

  /**
   * 获得字段描述
   * @param field
   */
  public getFieldDescription(field: string | CustomTreeNode): string {
    const realField = isString(field) ? field : field?.key;
    return get(this.getFieldMeta(realField, this.meta), 'description');
  }

  public setDataCfg(dataCfg: S2DataConfig) {
    this.getFieldMeta.cache.clear();
    const { fields, meta, data, sortParams, filterParams } =
      this.processDataCfg(dataCfg);
    this.fields = fields;
    this.meta = meta;
    this.originData = data;
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
  public abstract getDimensionValues(field: string, query?: Query): string[];

  /**
   * In most cases, this function to get the specific
   * cross data cell data
   * @param params
   */
  public abstract getCellData(params: CellDataParams): ViewMetaData | undefined;

  /**
   * To get a row or column cells data;
   * if query is empty, return all data
   * @param query
   * @param isTotals
   * @param isRow
   * @param drillDownFields
   */
  public abstract getMultiData(
    query: Query,
    totals?: TotalSelectionsOfMultiData,
    drillDownFields?: string[],
  ): Data[] | CellData[];

  public moreThanOneValue() {
    return this.fields?.values?.length > 1;
  }
}
