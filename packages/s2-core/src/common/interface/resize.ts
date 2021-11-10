import { Style } from './basic';
import { ResizeArea } from './theme';
import { S2Event } from '@/common/constant/events/basic';
import {
  ResizeAreaEffect,
  ResizeDirectionType,
} from '@/common/constant/resize';

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
}

export interface ResizeDetail {
  eventType: ResizeEvent;
  style?: Style;
  seriesNumberWidth?: number;
}

export interface ResizeInfo {
  theme: ResizeArea;
  isResizeArea?: boolean;
  type: ResizeDirectionType;
  /** 改动影响区域 */
  effect: ResizeAreaEffect;
  /** 字段id */
  id?: string;
  offsetX: number;
  offsetY: number;
  width: number;
  height: number;
  size: number;
}
