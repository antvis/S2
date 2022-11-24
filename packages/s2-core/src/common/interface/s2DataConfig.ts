import type {
  EXTRA_FIELD,
  MiniChartTypes,
  VALUE_FIELD,
} from '../constant/basic';
import type { Fields, FilterParam, Meta, SortParams } from './basic';

export interface BaseChartData {
  type: MiniChartTypes;
  data: RawData[];
  encode?: {
    x: keyof RawData;
    y: keyof RawData;
  };
}

/* 子弹图数据结构 */
export interface BulletValue {
  type: MiniChartTypes.Bullet;
  // 当前指标
  measure: number | string;
  // 目标值
  target: number | string;
  [key: string]: unknown;
}

export type MiniChartData = BaseChartData | BulletValue;

/** use for gridAnalysisSheet
 *  eg. { label: '余额女',
        values: [
          ['最近7天登端天数', 1, 3423423, 323],
          ['自然月新登用户数', 1, 3423423, 323],
          ['最近7天登端天数', 1, 3423423, 323],
          ['自然月新登用户数', 1, 3423423, 323],
        ],
      }
 */
export interface MultiData<T = SimpleData[][] | MiniChartData> {
  values: T;
  originalValues?: T;
  // the title of one cell of the gridAnalysisSheet
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

export type Data = (RawData & ExtraData) | undefined;

export interface CustomTreeNode {
  key: string;
  title: string;
  // 是否收起（默认都展开）
  collapsed?: boolean;
  description?: string;
  children?: CustomTreeNode[];
}

export interface S2DataConfig {
  // origin detail data
  data: RawData[];
  // data keys for render row,columns,values etc
  fields: Fields;
  // data keys meta info
  meta?: Meta[];
  // field sort info
  sortParams?: SortParams;
  // field filer params
  filterParams?: FilterParam[];
  // extra config
  [key: string]: unknown;
}

export type FlattingIndexesData = RawData[][] | RawData[] | RawData;
