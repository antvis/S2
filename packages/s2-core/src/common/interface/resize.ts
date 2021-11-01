import { Style } from './basic';
import { ResizeArea } from './theme';
import { S2Event } from '@/common/constant/events/basic';

export type ResizeGuideLinePath = ['M' | 'L', number, number];

export type ResizeEvent =
  | S2Event.LAYOUT_RESIZE
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
}

export interface ResizeDetail {
  eventType: ResizeEvent;
  style: Style;
}

export interface ResizeInfo {
  theme: ResizeArea;
  isResizeArea?: boolean;
  /**
   * col是改变列配置，即改变宽度
   * row是改变行配置，即改变高度
   */
  type: 'row' | 'col';
  /** 改动区域 */
  effect: 'field' | 'cell' | 'tree';
  /** 字段id */
  id?: string;
  /** 维值，用于指定该维值对应的配置 */
  caption?: string;
  offsetX: number;
  offsetY: number;
  width: number;
  height: number;
}
