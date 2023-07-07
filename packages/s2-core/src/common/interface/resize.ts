import type { S2Event } from '../../common/constant/events/basic';
import type {
  ResizeAreaEffect,
  ResizeDirectionType,
  ResizeType,
} from '../../common/constant/resize';
import type { Node } from '../../facet/layout/node';
import type { Style, ViewMeta } from './basic';
import type { S2CellType } from './interaction';
import type { ResizeArea } from './theme';

export type ResizeGuideLinePath = [operation: 'M' | 'L', x: number, y: number];

export type ResizeEvent =
  | S2Event.LAYOUT_RESIZE
  | S2Event.LAYOUT_RESIZE_SERIES_WIDTH
  | S2Event.LAYOUT_RESIZE_ROW_WIDTH
  | S2Event.LAYOUT_RESIZE_COL_WIDTH
  | S2Event.LAYOUT_RESIZE_ROW_HEIGHT
  | S2Event.LAYOUT_RESIZE_COL_HEIGHT
  | S2Event.LAYOUT_RESIZE_TREE_WIDTH;

export interface ResizeGuideLinePosition {
  start: {
    x: number;
    y: number;
  };
  end: {
    x: number;
    y: number;
  };
}

export interface ResizePosition {
  offsetX?: number;
  offsetY?: number;
  clientX?: number;
  clientY?: number;
}

export interface ResizeDetail {
  eventType: ResizeEvent;
  style?: Style;
  seriesNumberWidth?: number;
}

export interface ResizeParams {
  info: ResizeInfo;
  style: Style;
}

export interface ResizeInfo {
  theme: ResizeArea;
  type: ResizeDirectionType;
  offsetX: number;
  offsetY: number;
  width: number;
  height: number;
  size: number;
  /** 改动影响区域 */
  effect: ResizeAreaEffect;
  isResizeArea?: boolean;
  /** 字段id */
  id?: string;
  /** 当前拖拽热区对应的节点信息 */
  meta: Node | ViewMeta;
  /** 拖拽后的宽度 */
  resizedWidth?: number;
  /** 拖拽后的高度 */
  resizedHeight?: number;
}

export interface ResizeInteractionOptions {
  rowCellVertical?: boolean; // 行头垂直方向resize -> 针对行头叶子节点
  cornerCellHorizontal?: boolean; // 角头水平方向resize -> 针对角头CornerNodeType为Series和Row
  colCellHorizontal?: boolean; // 列头水平方向resize -> 针对列头叶子节点
  colCellVertical?: boolean; // 列头垂直方向resize -> 针对列头各层级节点
  rowResizeType?: ResizeType; // 行高调整时，影响当前行还是全部行
  // 是否允许调整, 返回 false 时拖拽的宽高无效
  disable?: (resizeInfo: ResizeInfo) => boolean;
  // 是否显示热区
  visible?: (cell: S2CellType) => boolean;
}
