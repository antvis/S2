import { Formatter, SortParam } from '../../common/interface';
import { Hierarchy } from '../layout/hierarchy';
import { SpreadSheet } from 'src/sheet-type';

export interface CornerData {
  x: number;
  y: number;
  width: number;
  height: number;
  /** 字段展示 */
  label: string;
  /** 字段id */
  field: string;
}

export interface Cfg {
  // 布局数据
  data: Hierarchy[] | CornerData[];

  // 绘制起点
  position: {
    x: number;
    y: number;
  };

  // 组件宽高
  width: number;
  height: number;

  // 视窗宽高
  viewportWidth: number;
  viewportHeight: number;

  // 滚动距离
  offset?: number;
  scrollX?: number;
  hScrollX?: number;

  // 角边宽度
  cornerWidth?: number;

  // 布局方式，tree 或 grid
  hierarchyType?: string;

  // 枚举值的别名格式化，目前仅仅用于列头的虚拟列字段，后续可扩展
  formatter?: (f: string) => Formatter;

  /** 列维度字段 */
  cols?: string[];

  // 点击需要跳转链接的字段
  linkFieldIds?: string[];

  // 有行号时，行号这一列的宽度
  seriesNumberWidth?: number;

  // 排序参数，目前只有列头上会传入
  sortParam?: SortParam;

  // 是否配置了rowHeader滚动条包含
  scrollContainsRowHeader?: boolean;

  spreadsheet?: SpreadSheet;
}

export interface ResizeInfo {
  isResizeArea: boolean;
  class: 'resize-trigger';
  /**
   * col是改变列配置，即改变宽度
   * row是改变行配置，即改变高度
   */
  type: 'row' | 'col';
  /** 改动区域 */
  affect: 'field' | 'cell' | 'tree';
  /** 字段id */
  id: string;
  /** 维值，用于指定该维值对应的配置 */
  caption: string;
  offsetX: number;
  offsetY: number;
  width: number;
  height: number;
}
