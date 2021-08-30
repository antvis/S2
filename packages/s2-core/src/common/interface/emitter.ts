import {
  KEY_AFTER_COLLAPSE_ROWS,
  KEY_COLLAPSE_ROWS,
  KEY_COLLAPSE_TREE_ROWS,
  KEY_LIST_SORT,
  KEY_TREE_ROWS_COLLAPSE_ALL,
  S2Event,
  SortMethodType,
} from '../constant';

import { Event as CanvasEvent } from '@antv/g-canvas';

type CollapsedRowsType = {
  collapsedRows: Record<string, boolean> & {
    [x: number]: any;
  };
};

export interface EmitterType {
  [S2Event.GLOBAL_COPIED]: (data) => void;

  [S2Event.RANGE_SORTING]: (info: {
    sortKey: string;
    sortMethod: SortMethodType;
    compareFunc: (a, b) => boolean;
  }) => void;

  [S2Event.GLOBAL_KEYBOARD_DOWN]: (event: KeyboardEvent) => void;

  [S2Event.GLOBAL_KEYBOARD_UP]: (event: KeyboardEvent) => void;
  [S2Event.GLOBAL_MOUSE_UP]: (event: KeyboardEvent) => void;

  [S2Event.GLOBAL_RESIZE_MOUSE_DOWN]: (event: CanvasEvent) => void;
  [S2Event.DATA_CELL_MOUSE_DOWN]: (event: CanvasEvent) => void;
  [S2Event.ROW_CELL_MOUSE_DOWN]: (event: CanvasEvent) => void;
  [S2Event.COL_CELL_MOUSE_DOWN]: (event: CanvasEvent) => void;
  [S2Event.CORNER_CELL_MOUSE_DOWN]: (event: CanvasEvent) => void;
  [S2Event.MERGED_CELLS_MOUSE_DOWN]: (event: CanvasEvent) => void;

  [S2Event.GLOBAL_RESIZE_MOUSE_MOVE]: (event: CanvasEvent) => void;
  [S2Event.DATA_CELL_MOUSE_MOVE]: (event: CanvasEvent) => void;
  [S2Event.ROW_CELL_MOUSE_MOVE]: (event: CanvasEvent) => void;
  [S2Event.COL_CELL_MOUSE_MOVE]: (event: CanvasEvent) => void;
  [S2Event.CORNER_CELL_MOUSE_MOVE]: (event: CanvasEvent) => void;
  [S2Event.MERGED_ELLS_MOUSE_MOVE]: (event: CanvasEvent) => void;

  [S2Event.DATA_CELL_HOVER]: (event: CanvasEvent) => void;
  [S2Event.ROW_CELL_HOVER]: (event: CanvasEvent) => void;
  [S2Event.COL_CELL_HOVER]: (event: CanvasEvent) => void;
  [S2Event.CORNER_CELL_HOVER]: (event: CanvasEvent) => void;
  [S2Event.MERGED_CELLS_HOVER]: (event: CanvasEvent) => void;
  [S2Event.GLOBAL_RESIZE_MOUSE_UP]: (event: CanvasEvent) => void;
  [S2Event.DATA_CELL_CLICK]: (event: CanvasEvent) => void;
  [S2Event.ROW_CELL_CLICK]: (event: CanvasEvent) => void;
  [S2Event.COL_CELL_CLICK]: (event: CanvasEvent) => void;
  [S2Event.CORNER_CELL_CLICK]: (event: CanvasEvent) => void;
  [S2Event.MERGED_CELLS_CLICK]: (event: CanvasEvent) => void;
  [S2Event.DATA_CELL_MOUSE_UP]: (event: CanvasEvent) => void;
  [S2Event.ROW_CELL_MOUSE_UP]: (event: CanvasEvent) => void;
  [S2Event.COL_CELL_MOUSE_UP]: (event: CanvasEvent) => void;
  [S2Event.CORNER_CELL_MOUSE_UP]: (event: CanvasEvent) => void;
  [S2Event.MERGED_CELLS_MOUSE_UP]: (event: CanvasEvent) => void;

  [S2Event.GLOBAL_CLEAR_INTERACTION_STYLE_EFFECT]: null;

  [KEY_LIST_SORT]: ({ sortKey: string, sortMethod: SortMethodType }) => void;

  [KEY_COLLAPSE_TREE_ROWS]: ({
    id: string,
    isCollapsed: boolean,
    node: Node,
  }) => void;

  [KEY_COLLAPSE_ROWS]: (data: CollapsedRowsType) => void;
  [KEY_AFTER_COLLAPSE_ROWS]: (data: CollapsedRowsType) => void;
  [KEY_TREE_ROWS_COLLAPSE_ALL]: (hierarchyCollapse: boolean) => void;
}
