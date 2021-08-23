export { InteractionEvent } from './interaction';

// event keys
export const KEY_LIST_SORT = 'spreadsheet:list-sort';
export const KEY_COLLAPSE_TREE_ROWS = 'spreadsheet:collapsed-tree-rows';
export const KEY_JUMP_HREF = 'spreadsheet:jump-href';
export const KEY_AFTER_HEADER_LAYOUT = 'spreadsheet:after-header-layout';
export const KEY_COL_NODE_BORDER_REACHED =
  'spreadsheet:col-node-border-reached';
export const KEY_ROW_NODE_BORDER_REACHED =
  'spreadsheet:row-node-border-reached';
export const KEY_TREE_ROWS_COLLAPSE_ALL = 'spreadsheet:toggle-collapse-all';
export const KEY_CELL_SCROLL = 'spreadsheet:cell-scroll';
export const KEY_PAGINATION = 'spreadsheet:pagination';

// x-report to ss
export const KEY_UPDATE_PROPS = 'spreadsheet-update-props';
export const KEY_COLLAPSE_ROWS = 'spreadsheet:collapsed-rows';
export const KEY_AFTER_COLLAPSE_ROWS = 'spreadsheet:after-collapsed-rows';

export enum ResizeEventType {
  ROW_W = 'spreadsheet:change-row-header-width',
  COL_W = 'spreadsheet:change-column-header-width',
  ROW_H = 'spreadsheet:change-row-header-height',
  COL_H = 'spreadsheet:change-column-header-height',
  TREE_W = 'spreadsheet:change-tree-width',
}

export enum S2Event {
  COL_CELL_CLICK = 'col-cell:click',
  ROW_CELL_CLICK = 'row-cell:click',
  DATA_CELL_CLICK = 'data-cell:click',
  CORNER_CELL_CLICK = 'corner-cell:click',
  MERGED_CELLS_CLICK = 'merged-cells:click',

  COL_CELL_HOVER = 'col-cell:hover',
  ROW_CELL_HOVER = 'row-cell:hover',
  DATA_CELL_HOVER = 'data-cell:hover',
  CORNER_CELL_HOVER = 'corner-cell:hover',
  MERGED_CELLS_HOVER = 'merged-cells:hover',

  COL_CELL_MOUSE_DOWN = 'col-cell:mouse-down',
  ROW_CELL_MOUSE_DOWN = 'row-cell:mouse-down',
  DATA_CELL_MOUSE_DOWN = 'data-cell:mouse-down',
  CORNER_CELL_MOUSE_DOWN = 'corner-cell:mouse-down',
  MERGED_CELLS_MOUSE_DOWN = 'merged-cells:mouse-down',

  COL_CELL_MOUSE_UP = 'col-cell:mouse-up',
  ROW_CELL_MOUSE_UP = 'row-cell:mouse-up',
  DATA_CELL_MOUSE_UP = 'data-cell:mouse-up',
  CORNER_CELL_MOUSE_UP = 'corner-cell:mouse-up',
  MERGED_CELLS_MOUSE_UP = 'merged-cells:mouse-up',

  COL_CELL_MOUSE_MOVE = 'col-cell:mouse-move',
  ROW_CELL_MOUSE_MOVE = 'row-cell:mouse-move',
  DATA_CELL_MOUSE_MOVE = 'data-cell:mouse-move',
  CORNER_CELL_MOUSE_MOVE = 'corner-cell:mouse-move',
  MERGED_ELLS_MOUSE_MOVE = 'merged-cells:mouse-move',

  GLOBAL_RESIZE_MOUSE_DOWN = 'global:resize:mouse-down',
  GLOBAL_RESIZE_MOUSE_MOVE = 'global:resize:mouse-move',
  GLOBAL_RESIZE_MOUSE_UP = 'global:resize-mouse-up',

  GLOBAL_KEYBOARD_DOWN = 'global:keyboard-down',
  GLOBAL_KEYBOARD_UP = 'global:keyboard-up',
  GLOBAL_COPIED = 'global:copied',
  GLOBAL_MOUSE_UP = 'global:mouse-up',

  GLOBAL_CLEAR_INTERACTION_STYLE_EFFECT = 'global:clear-interaction-style-effect',
}

export enum OriginEventType {
  MOUSE_DOWN = 'mousedown',
  MOUSE_MOVE = 'mousemove',
  MOUSE_UP = 'mouseup',
  KEY_DOWN = 'keydown',
  KEY_UP = 'keyup',
  CLICK = 'click',
}

export enum InterceptEventType {
  HOVER = 'hover',
  CLICK = 'click',
}

export type InterceptEvent =
  | InterceptEventType.HOVER
  | InterceptEventType.CLICK;
