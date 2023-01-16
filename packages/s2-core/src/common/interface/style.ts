import type { Node } from '../../facet/layout/node';
import type { LayoutWidthType } from './basic';

export type CellCustomSize =
  | null
  | undefined
  | number
  | ((node: Node | null) => number | null);

export interface BaseCellStyle {
  /**
   * 自定义宽度
   * 1. [静态数值] width: 100
   * 2. [动态计算] width: (node) => 100
   */
  width?: CellCustomSize;
  /**
   * 自定义高度
   * 1. [静态数值] height: 100
   * 2. [动态计算] height: (node) => 100
   */
  height?: CellCustomSize;
  /**
   * 自定义指定的单元格宽度
   * 1. 根据 field { city: 20, type: 100 }
   * 2. 根据 单元格 ID { 'root[&]杭州市': 20, 'root[&]类别': 100 }
   */
  widthByField?: Record<string, number> | null;
  /**
   * 自定义指定的单元格高度
   * 1. 根据 field { city: 20, type: 100 }
   * 2. 根据 单元格 ID { 'root[&]杭州市': 20, 'root[&]类别': 100 }
   */
  heightByField?: Record<string, number> | null;
}

export interface DataCellStyle {
  width?: number;
  height?: number;
  /**
   * 多列数值配置
   */
  valuesCfg?: {
    // 原始值字段
    originalValueField?: string;
    // 每一列数值占单元格宽度百分比 Map
    widthPercent?: number[];
    // 是否显示原始值
    showOriginalValue?: boolean;
  };
}

export interface RowCellStyle extends BaseCellStyle {
  /**
   * 是否展示树状分层下的层级占位点
   */
  showTreeLeafNodeAlignDot?: boolean;
  /**
   * 收起所有 (对应角头收起展开按钮)
   */
  collapseAll?: boolean | null;
  /**
   * 折叠节点
   * 优先级大于 collapseAll 和 expandDepth
   * id 级别: { ['root[&]浙江省']: true, ['root[&]河南省']: false } 即 只有 浙江省 对应的节点才会被折叠
   * field 级别: { city: true, type: false } : 即 所有 city 对应的维值都会被折叠
   */
  collapseFields?: Record<string, boolean> | null;
  /**
   * 行头默认展开到第几层 (从 0 开始)
   */
  expandDepth?: number | null;
}

export interface ColCellStyle extends BaseCellStyle {
  /**
   * 数值挂列头时, 是否隐藏数值 (即 s2DataConfig.fields.values 只有一个数值时生效)
   */
  hideValue?: boolean;
}

export interface S2Style {
  /**
   * 布局类型
   */
  layoutWidthType?: LayoutWidthType;
  /**
   * 数值单元格配置
   */
  dataCell?: DataCellStyle | null;
  /**
   * 列头单元格配置
   */
  colCell?: ColCellStyle | null;
  /**
   * 行头单元格配置
   */
  rowCell?: RowCellStyle | null;
}
