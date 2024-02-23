import {
  compact,
  find,
  get,
  identity,
  isEmpty,
  isNil,
  isString,
  map,
  max,
  memoize,
  min,
} from 'lodash';
import type { CellMeta, CustomHeaderField, ViewMeta } from '../common';
import { CellType } from '../common';
import type {
  Fields,
  FilterParam,
  Formatter,
  Meta,
  RawData,
  S2CellType,
  S2DataConfig,
  SimpleData,
  SortParams,
  ViewMetaData,
} from '../common/interface';
import type { ValueRange } from '../common/interface/condition';
import type { Node } from '../facet/layout/node';
import type { SpreadSheet } from '../sheet-type';
import {
  getValueRangeState,
  setValueRangeState,
} from '../utils/condition/state-controller';
import { generateExtraFieldMeta } from '../utils/dataset/pivot-data-set';
import type { Indexes } from '../utils/indexes';
import type { GetCellDataParams, Query } from './interface';
import type { GetCellMultiDataParams } from './index';

export abstract class BaseDataSet {
  /**
   * 字段信息
   */
  public fields: Fields;

  /**
   * 字段元信息，包含有字段名、格式化、描述等
   */
  public meta: Meta[];

  /**
   * 原始数据
   */
  public originData: RawData[];

  /**
   * 索引数据
   */
  public indexesData: Record<string, RawData[][] | RawData[]>;

  /**
   * 高级排序, 组内排序
   */
  public sortParams: SortParams | undefined;

  /**
   * 筛选配置
   */
  public filterParams: FilterParam[] | undefined;

  /**
   * 表格实例
   */
  public spreadsheet: SpreadSheet;

  /**
   * 展示数据
   */
  protected displayData: RawData[];

  /**
   * 单元格所对应格式化后的值（用于编辑表）
   */
  public displayFormattedValueMap = new Map<string, string>();

  public constructor(spreadsheet: SpreadSheet) {
    this.spreadsheet = spreadsheet;
  }

  /**
   * 获取字段
   */
  private getField = (field: CustomHeaderField): string => {
    const realField = isString(field) ? field : field?.field;

    return realField || (field as string);
  };

  /**
   * 获取字段信息
   */
  public getFieldMeta = memoize(
    (field: CustomHeaderField, meta?: Meta[]): Meta | undefined => {
      const realField = this.getField(field);

      return find(this.meta || meta, { field: realField });
    },
  );

  /**
   * 获取字段名称
   * @param field
   */
  public getFieldName(field: CustomHeaderField, defaultValue?: string): string {
    const realField = this.getField(field);
    // 兼容自定义行列头场景
    const headerNode = this.spreadsheet?.facet
      ?.getHeaderNodes()
      .find((node) => {
        return node.field === realField && node?.extra?.isCustomNode;
      });
    const realDefaultValue =
      headerNode?.value ||
      (isString(field) ? field : field?.title) ||
      (field as string);

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
  public getCustomRowFieldName(
    cell: S2CellType<ViewMeta | Node>,
  ): string | undefined {
    if (!cell) {
      return;
    }

    const meta = cell.getMeta?.();

    // 数值单元格, 根据 rowIndex 匹配所对应的行头单元格名字
    if (cell.cellType === CellType.DATA_CELL) {
      const rowNode = this.spreadsheet.facet.getRowNodeByIndex(meta?.rowIndex);

      return (
        rowNode?.value || this.getFieldName(rowNode?.field as CustomHeaderField)
      );
    }

    // 行/列头单元格, 取节点本身标题
    return (
      (meta as Node)?.value ||
      this.getFieldName(meta?.field as CustomHeaderField)
    );
  }

  /**
   * 获取自定义单元格字段描述
   * @param cell
   */
  public getCustomFieldDescription = (
    cell: S2CellType<ViewMeta | Node>,
  ): string | undefined => {
    if (!cell) {
      return;
    }

    const meta = cell.getMeta?.();

    if (meta?.isTotals) {
      return;
    }

    // 数值单元格
    if (cell.cellType === CellType.DATA_CELL) {
      const currentMeta = find(meta?.spreadsheet.dataCfg.meta, {
        field: meta?.field || meta?.value || meta?.valueField,
      });

      return this.getFieldDescription(currentMeta?.field as CustomHeaderField);
    }

    // 行/列头单元格, 取节点本身描述
    return (
      (meta?.extra as Record<string, any>)?.['description'] ||
      this.getFieldDescription(meta?.field as CustomHeaderField)
    );
  };

  /**
   * 获得字段格式方法
   * @param field
   */
  public getFieldFormatter(field: CustomHeaderField): Formatter {
    const realField = this.getField(field);

    return get(this.getFieldMeta(realField, this.meta), 'formatter', identity);
  }

  /**
   * 获得字段描述
   * @param field
   */
  public getFieldDescription(field: CustomHeaderField): string | undefined {
    const realField = this.getField(field);

    return get(this.getFieldMeta(realField, this.meta), 'description');
  }

  /**
   * 设置数据配置
   * @param dataCfg
   */
  public setDataCfg(dataCfg: S2DataConfig) {
    this.getFieldMeta?.cache?.clear?.();
    const { fields, meta, data, sortParams, filterParams } =
      this.processDataCfg(dataCfg);

    this.fields = fields;
    this.meta = meta!;
    this.originData = data;
    this.sortParams = sortParams;
    this.filterParams = filterParams;
    this.displayData = this.originData;
    this.indexesData = {};
  }

  /**
   * 添加 (角头/数值虚拟字段) 格式化信息
   */
  public processMeta(meta: Meta[] = [], defaultExtraFieldText: string): Meta[] {
    const newMeta: Meta[] = [
      ...meta,
      generateExtraFieldMeta(
        meta,
        this.spreadsheet?.options?.cornerExtraFieldText,
        defaultExtraFieldText,
      ),
    ];

    return newMeta;
  }

  public getDisplayDataSet() {
    return this.displayData || [];
  }

  public isEmpty() {
    return isEmpty(this.getDisplayDataSet());
  }

  // https://github.com/antvis/S2/issues/2255
  public getEmptyViewIndexes(): Indexes {
    return [] as unknown as Indexes;
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
   * 获取指定字段下的维值
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
   * @param field
   * @param query
   */
  public abstract getDimensionValues(field: string, query?: Query): string[];

  /**
   * 获取单个的单元格数据
   */
  public abstract getCellData(
    params: GetCellDataParams,
  ): ViewMetaData | SimpleData | undefined;

  /**
   * 获取批量的单元格数据
   * 如果 query 为空, 则返回全量数据
   * @description 默认获取符合 query 的所有数据，包括小计总计等汇总数据；
   * 如果只希望获取明细数据，请使用 { queryType: QueryDataType.DetailOnly }
   */
  public abstract getCellMultiData(
    params: GetCellMultiDataParams,
  ): ViewMetaData[];

  /**
   * 是否超过 1 个数值
   */
  public moreThanOneValue() {
    return this.fields?.values?.length! > 1;
  }

  /**
   * 查询当前整行数据
   */
  public abstract getRowData(
    cellMeta: CellMeta | ViewMeta | Node,
  ): ViewMetaData[] | ViewMetaData;
}
