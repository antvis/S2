import type {
  Fields,
  FilterParam,
  Meta,
  SortParams,
} from '../../common/interface';

/* 子弹图数据结构 */
export interface BulletValue {
  // 当前指标
  measure: number | string;
  // 目标值
  target: number | string;
  [key: string]: unknown;
}

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
export interface MultiData<T = (string | number)[][]> {
  values: T;
  originalValues?: T;
  // the title of one cell of the gridAnalysisSheet
  label?: string;
  [key: string]: unknown;
}

export type SimpleDataItem = string | number;

export type DataItem<T = (string | number)[][]> = SimpleDataItem | MultiData<T>;

export type Data<T = (string | number)[][]> = Record<string, DataItem<T>>;

export interface CustomTreeItem {
  key: string;
  title: string;
  // 是否收起（默认都展开）
  collapsed?: boolean;
  description?: string;
  children?: CustomTreeItem[];
}

export interface S2DataConfig {
  // origin detail data
  data: Data[];
  // total data(grandTotal, subTotal)
  totalData?: Data[];
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
