import type { TextStyleProps } from '@antv/g';
import type { Node } from '../../facet/layout/node';
import type { LayoutWidthType } from '../constant';

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

export interface CellTextWordWrapStyle
  extends Pick<TextStyleProps, 'wordWrap' | 'maxLines' | 'textOverflow'> {}

export interface DataCellStyle extends CellTextWordWrapStyle {
  /**
   * 宽度
   */
  width?: number;

  /**
   * 高度
   */
  height?: number;

  /**
   * 多列数值配置
   */
  valuesCfg?: {
    /**
     * 原始数据字段，用于原始数据导出和 tooltip 展示
     */
    originalValueField?: string;

    /**
     * 每一列数值占单元格宽度百分比
     * @example [0.1, 0.3, 0.6]
     */
    widthPercent?: number[];

    /**
     * 是否显示原始值 (tooltip 中显示)
     */
    showOriginalValue?: boolean;
  };
}

export interface RowCellStyle extends BaseCellStyle, CellTextWordWrapStyle {
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

export interface ColCellStyle extends BaseCellStyle, CellTextWordWrapStyle {
  /**
   * 数值挂列头时, 是否隐藏数值 (即 s2DataConfig.fields.values 只有一个数值时生效)
   */
  hideValue?: boolean;
}

export interface CornerCellStyle extends CellTextWordWrapStyle {}

export interface SeriesNumberCellStyle extends CellTextWordWrapStyle {}

export interface MergedCellStyle extends CellTextWordWrapStyle {}

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

  /**
   * 角头单元格配置
   */
  cornerCell?: CornerCellStyle | null;

  /**
   * 合并单元格配置
   */
  mergedCell?: MergedCellStyle | null;

  /**
   * 序号单元格配置
   */
  seriesNumberCell?: SeriesNumberCellStyle | null;
}
