import type { Node } from '../../facet/layout/node';
import type { LayoutWidthType } from './basic';
import type { DeviceType } from './s2Options';

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
   * 树状结构下行头宽度
   */
  treeWidth?: number;
  /**
   * 树状结构下的全局收起展开属性，对应角头收起展开按钮
   */
  hierarchyCollapse?: boolean;
  /**
   * 树状结构下，行头默认展开到第几层 (从 0 开始)
   */
  expandDepth?: number | null;
  /**
   * 树状结构下，行头展开节点
   */
  collapsedRows?: Record<string, boolean> | null;
}

export interface ColCellStyle extends BaseCellStyle {
  /**
   * 是否隐藏数值列 (只有一个数值时生效)
   */
  hideMeasureColumn?: boolean;
}

export interface S2Style {
  /**
   * 布局类型
   */
  layoutWidthType?: LayoutWidthType;
  /**
   * 树状结构下，列头展开节点
   */
  collapsedCols?: Record<string, boolean>;
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
  /**
   * @deprecated 设备类型 use options.device instead
   */
  device?: DeviceType; // 设备，pc || mobile
}
