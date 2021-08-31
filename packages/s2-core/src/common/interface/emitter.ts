import {
  InteractionNames,
  KEY_AFTER_COLLAPSE_ROWS,
  KEY_AFTER_HEADER_LAYOUT,
  KEY_CELL_SCROLL,
  KEY_COLLAPSE_ROWS,
  KEY_COLLAPSE_TREE_ROWS,
  KEY_COL_NODE_BORDER_REACHED,
  KEY_JUMP_HREF,
  KEY_PAGINATION,
  KEY_ROW_NODE_BORDER_REACHED,
  KEY_TREE_ROWS_COLLAPSE_ALL,
  ResizeEventType,
  S2Event,
  SortMethodType,
} from '@/common/constant';

import { Event as CanvasEvent } from '@antv/g-canvas';
import { CellScrollPosition, Data, LayoutResult, Style, ViewMeta } from '.';
import { Node } from '@/facet/layout/node';
import { DataItem } from '@/.';

type CollapsedRowsType = {
  collapsedRows: Record<string, boolean> & {
    [x: number]: any;
  };
};

type SortParams = {
  sortKey: string;
  sortMethod: SortMethodType;
  compareFunc?: (data: Data) => DataItem;
};

type CanvasEventHandler = (event: CanvasEvent) => void;

type KeyboardEventHandler = (event: KeyboardEvent) => void;

type EventHandler = (event: MouseEvent) => void;

type ResizeHandler = (style: Style) => void;

export interface EmitterType {
  [S2Event.GLOBAL_COPIED]: (data: string) => void;

  [S2Event.RANGE_SORT]: (info: SortParams) => void;
  [S2Event.RANGE_SORTING]: (info: SortParams) => void;
  [S2Event.RANGE_SORTED]: (rangeData: Data[]) => void;

  [S2Event.RANGE_FILTER]: (key: string, filterList: DataItem[]) => void;
  [S2Event.RANGE_FILTERING]: (
    filterList: DataItem[],
    allList: DataItem[],
  ) => void;
  [S2Event.RANGE_FILTERED]: (allList: DataItem[], data: Data[]) => void;

  [S2Event.GLOBAL_KEYBOARD_DOWN]: KeyboardEventHandler;
  [S2Event.GLOBAL_KEYBOARD_UP]: KeyboardEventHandler;
  [S2Event.GLOBAL_MOUSE_UP]: EventHandler;
  [S2Event.GLOBAL_RESIZE_MOUSE_DOWN]: CanvasEventHandler;
  [S2Event.GLOBAL_RESIZE_MOUSE_UP]: CanvasEventHandler;
  [S2Event.GLOBAL_RESIZE_MOUSE_MOVE]: CanvasEventHandler;

  [S2Event.DATA_CELL_MOUSE_DOWN]: CanvasEventHandler;
  [S2Event.ROW_CELL_MOUSE_DOWN]: CanvasEventHandler;
  [S2Event.COL_CELL_MOUSE_DOWN]: CanvasEventHandler;
  [S2Event.CORNER_CELL_MOUSE_DOWN]: CanvasEventHandler;
  [S2Event.MERGED_CELLS_MOUSE_DOWN]: CanvasEventHandler;

  [S2Event.DATA_CELL_MOUSE_MOVE]: CanvasEventHandler;
  [S2Event.ROW_CELL_MOUSE_MOVE]: CanvasEventHandler;
  [S2Event.COL_CELL_MOUSE_MOVE]: CanvasEventHandler;
  [S2Event.CORNER_CELL_MOUSE_MOVE]: CanvasEventHandler;
  [S2Event.MERGED_ELLS_MOUSE_MOVE]: CanvasEventHandler;

  [S2Event.DATA_CELL_HOVER]: CanvasEventHandler;
  [S2Event.ROW_CELL_HOVER]: CanvasEventHandler;
  [S2Event.COL_CELL_HOVER]: CanvasEventHandler;
  [S2Event.CORNER_CELL_HOVER]: CanvasEventHandler;
  [S2Event.MERGED_CELLS_HOVER]: CanvasEventHandler;
  [S2Event.DATA_CELL_CLICK]: CanvasEventHandler;
  [S2Event.ROW_CELL_CLICK]: CanvasEventHandler;
  [S2Event.COL_CELL_CLICK]: CanvasEventHandler;
  [S2Event.CORNER_CELL_CLICK]: CanvasEventHandler;
  [S2Event.MERGED_CELLS_CLICK]: CanvasEventHandler;
  [S2Event.DATA_CELL_MOUSE_UP]: CanvasEventHandler;
  [S2Event.ROW_CELL_MOUSE_UP]: CanvasEventHandler;
  [S2Event.COL_CELL_MOUSE_UP]: CanvasEventHandler;
  [S2Event.CORNER_CELL_MOUSE_UP]: CanvasEventHandler;
  [S2Event.MERGED_CELLS_MOUSE_UP]: CanvasEventHandler;

  [S2Event.GLOBAL_CLEAR_INTERACTION_STYLE_EFFECT]: () => void;

  [KEY_COLLAPSE_TREE_ROWS]: (data: {
    id: string;
    isCollapsed: boolean;
    node: Node;
  }) => void;

  [KEY_COLLAPSE_ROWS]: (data: CollapsedRowsType) => void;
  [KEY_AFTER_COLLAPSE_ROWS]: (data: CollapsedRowsType) => void;
  [KEY_TREE_ROWS_COLLAPSE_ALL]: (hierarchyCollapse: boolean) => void;
  [KEY_PAGINATION]: (data: {
    pageSize: number;
    pageCount: number;
    total: number;
    current: number;
  }) => void;
  [KEY_AFTER_HEADER_LAYOUT]: (data: LayoutResult) => void;
  [KEY_CELL_SCROLL]: (data: CellScrollPosition) => void;
  [KEY_COL_NODE_BORDER_REACHED]: (data: Node) => void;
  [KEY_ROW_NODE_BORDER_REACHED]: (data: Node) => void;
  [KEY_JUMP_HREF]: (data: { key: string; record: Data }) => void;

  [InteractionNames.TREND_ICON_CLICK]: (data: ViewMeta) => void;

  [ResizeEventType.ROW_W]: ResizeHandler;
  [ResizeEventType.ROW_H]: ResizeHandler;
  [ResizeEventType.COL_W]: ResizeHandler;
  [ResizeEventType.COL_H]: ResizeHandler;
  [ResizeEventType.TREE_W]: ResizeHandler;
}
