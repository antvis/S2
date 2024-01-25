import type { EXTRA_FIELD, MiniChartType, VALUE_FIELD } from '../constant';
import type { Fields, FilterParam, Meta, SortParams } from './basic';

export interface BaseChartData {
  /**
   * 类型
   */
  type: MiniChartType;

  /**
   * 数据
   */
  data: RawData[];

  /**
   * 坐标轴数据
   */
  encode?: {
    x: keyof RawData;
    y: keyof RawData;
  };

  [key: string]: unknown;
}

/* 子弹图数据结构 */
export interface BulletValue {
  /**
   * 类型
   */
  type: MiniChartType.Bullet;

  /**
   * 当前值
   */
  measure: number | string;

  /**
   * 目标值
   */
  target: number | string;
  [key: string]: unknown;
}

export type MiniChartData = BaseChartData | BulletValue;

/**
 * 单个单元格, 显示一组数据
 * 适用于 (网格分析表, 趋势分析表) 和其他自定义场景
  {
    label: '余额女',
    values: [
      ['最近7天登端天数', 1, 3423423, 323],
      ['自然月新登用户数', 1, 3423423, 323],
      ['最近7天登端天数', 1, 3423423, 323],
      ['自然月新登用户数', 1, 3423423, 323],
    ],
  }
 */

export interface MultiData<T = SimpleData[][] | MiniChartData> {
  /** 数值 */
  values: T;
  /** 原始值 */
  originalValues?: T;
  /** 单元格标题 */
  label?: string;
  [key: string]: unknown;
}

export type SimpleData = string | number | null;

export type DataItem =
  | SimpleData
  | MultiData
  | Record<string, unknown>
  | undefined
  | null;

export type RawData = Record<string, DataItem>;

export type ExtraData = {
  [EXTRA_FIELD]: string;
  [VALUE_FIELD]: string | DataItem;
};

export type Data = RawData & ExtraData;

export interface CustomTreeNode {
  /**
   * 字段唯一标识
   */
  field: string;
  /**
   * 标题
   */
  title?: string;
  /**
   * 是否收起（默认都展开）
   */
  collapsed?: boolean;
  /**
   * 字段描述
   */
  description?: string;
  /**
   * 子节点
   */
  children?: CustomTreeNode[];
}

export interface S2DataConfig {
  /**
   * 原始明细数据
   */
  data: RawData[];
  /**
   * 维度字段
   */
  fields: Fields;
  /**
   * 字段元数据
   */
  meta?: Meta[];
  /**
   * 排序配置
   */
  sortParams?: SortParams;
  /**
   * 筛选配置
   */
  filterParams?: FilterParam[];
  [key: string]: unknown;
}
