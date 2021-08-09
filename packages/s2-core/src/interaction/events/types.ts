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

  GLOBAL_CLEAR_INTERACTION_STYLE_EFFECT = 'global:clear-interaction-style-effect',
}

export enum OriginEventType {
  MOUSE_DOWN = 'mousedown',
  MOUSE_MOVE = 'mousemove',
  MOUSE_UP = 'mouseup',
  KEY_DOWN = 'keydown',
  KEY_UP = 'keyup',
}

export enum DefaultInterceptEventType {
  HOVER = 'hover',
  CLICK = 'click',
}

export type DefaultInterceptEvent =
  | DefaultInterceptEventType.HOVER
  | DefaultInterceptEventType.CLICK;
