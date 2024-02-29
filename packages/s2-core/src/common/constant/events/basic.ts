export enum S2Event {
  /** ================ Row Cell ================  */
  ROW_CELL_HOVER = 'row-cell:hover',
  ROW_CELL_CLICK = 'row-cell:click',
  ROW_CELL_DOUBLE_CLICK = 'row-cell:double-click',
  ROW_CELL_CONTEXT_MENU = 'row-cell:context-menu',
  ROW_CELL_MOUSE_DOWN = 'row-cell:mouse-down',
  ROW_CELL_MOUSE_UP = 'row-cell:mouse-up',
  ROW_CELL_MOUSE_MOVE = 'row-cell:mouse-move',
  ROW_CELL_SCROLL = 'row-cell:scroll',
  ROW_CELL_BRUSH_SELECTION = 'row-cell:brush-selection',
  ROW_CELL_COLLAPSED = 'row-cell:collapsed',
  ROW_CELL_ALL_COLLAPSED = 'row-cell:all-collapsed',
  ROW_CELL_RENDER = 'row-cell:render',

  // 内部用来通信的 event
  ROW_CELL_COLLAPSED__PRIVATE = 'row-cell:collapsed__private',
  ROW_CELL_ALL_COLLAPSED__PRIVATE = 'row-cell:all-collapsed__private',

  /** ================ Col Cell ================  */
  COL_CELL_HOVER = 'col-cell:hover',
  COL_CELL_CLICK = 'col-cell:click',
  COL_CELL_DOUBLE_CLICK = 'col-cell:double-click',
  COL_CELL_CONTEXT_MENU = 'col-cell:context-menu',
  COL_CELL_MOUSE_DOWN = 'col-cell:mouse-down',
  COL_CELL_MOUSE_UP = 'col-cell:mouse-up',
  COL_CELL_MOUSE_MOVE = 'col-cell:mouse-move',
  COL_CELL_BRUSH_SELECTION = 'col-cell:brush-selection',
  COL_CELL_EXPANDED = 'col-cell:expanded',
  COL_CELL_HIDDEN = 'col-cell:hidden',
  COL_CELL_RENDER = 'col-cell:render',

  /** ================ Data Cell ================  */
  DATA_CELL_HOVER = 'data-cell:hover',
  DATA_CELL_CLICK = 'data-cell:click',
  DATA_CELL_DOUBLE_CLICK = 'data-cell:double-click',
  DATA_CELL_CONTEXT_MENU = 'data-cell:context-menu',
  DATA_CELL_MOUSE_UP = 'data-cell:mouse-up',
  DATA_CELL_MOUSE_DOWN = 'data-cell:mouse-down',
  DATA_CELL_MOUSE_MOVE = 'data-cell:mouse-move',
  DATA_CELL_BRUSH_SELECTION = 'data-cell:brush-selection',
  DATA_CELL_SELECT_MOVE = 'data-cell:select-move',
  DATA_CELL_RENDER = 'data-cell:render',

  /** ================ Corner Cell ================  */
  CORNER_CELL_HOVER = 'corner-cell:hover',
  CORNER_CELL_CLICK = 'corner-cell:click',
  CORNER_CELL_DOUBLE_CLICK = 'corner-cell:double-click',
  CORNER_CELL_CONTEXT_MENU = 'corner-cell:context-menu',
  CORNER_CELL_MOUSE_DOWN = 'corner-cell:mouse-down',
  CORNER_CELL_MOUSE_UP = 'corner-cell:mouse-up',
  CORNER_CELL_MOUSE_MOVE = 'corner-cell:mouse-move',
  CORNER_CELL_RENDER = 'corner-cell:render',

  /** ================ Merged Cells ================  */
  MERGED_CELLS_HOVER = 'merged-cells:hover',
  MERGED_CELLS_CLICK = 'merged-cells:click',
  MERGED_CELLS_DOUBLE_CLICK = 'merged-cells:double-click',
  MERGED_CELLS_CONTEXT_MENU = 'merged-cells:context-menu',
  MERGED_CELLS_MOUSE_DOWN = 'merged-cells:mouse-down',
  MERGED_CELLS_MOUSE_UP = 'merged-cells:mouse-up',
  MERGED_CELLS_MOUSE_MOVE = 'merged-cells:mouse-move',
  MERGED_CELLS_RENDER = 'merged-cells:render',

  /** ================ SeriesNumber Cell ================  */
  SERIES_NUMBER_CELL_RENDER = 'series-number-cell:render',

  /** ================ Sort ================  */
  RANGE_SORT = 'sort:range-sort',
  RANGE_SORTED = 'sort:range-sorted',

  /** ================ Table Filter ================  */
  RANGE_FILTER = 'filter:range-filter',
  RANGE_FILTERED = 'filter:range-filtered',

  /** ================ Table Layout ================  */
  LAYOUT_AFTER_HEADER_LAYOUT = 'layout:after-header-layout',
  LAYOUT_CELL_RENDER = 'layout:cell-render',
  LAYOUT_PAGINATION = 'layout:pagination',
  LAYOUT_AFTER_REAL_DATA_CELL_RENDER = 'layout:after-real-data-cell-render',
  LAYOUT_AFTER_RENDER = 'layout:after-render',
  LAYOUT_BEFORE_RENDER = 'layout:before-render',
  LAYOUT_DESTROY = 'layout:destroy',

  /** ================ Table Layout Resize ================  */
  LAYOUT_RESIZE = 'layout:resize',
  LAYOUT_RESIZE_SERIES_WIDTH = 'layout:resize-series-width',
  LAYOUT_RESIZE_ROW_WIDTH = 'layout:resize-row-width',
  LAYOUT_RESIZE_ROW_HEIGHT = 'layout:resize-row-height',
  LAYOUT_RESIZE_COL_WIDTH = 'layout:resize-column-width',
  LAYOUT_RESIZE_COL_HEIGHT = 'layout:resize-column-height',
  LAYOUT_RESIZE_TREE_WIDTH = 'layout:resize-tree-width',
  LAYOUT_RESIZE_MOUSE_DOWN = 'layout:resize:mouse-down',
  LAYOUT_RESIZE_MOUSE_MOVE = 'layout:resize:mouse-move',
  LAYOUT_RESIZE_MOUSE_UP = 'layout:resize-mouse-up',

  /** ================ Global ================  */
  GLOBAL_KEYBOARD_DOWN = 'global:keyboard-down',
  GLOBAL_KEYBOARD_UP = 'global:keyboard-up',
  GLOBAL_COPIED = 'global:copied',
  GLOBAL_MOUSE_UP = 'global:mouse-up',
  GLOBAL_MOUSE_MOVE = 'global:mouse-move',
  GLOBAL_ACTION_ICON_CLICK = 'global:action-icon-click',
  GLOBAL_ACTION_ICON_HOVER = 'global:action-icon-hover',
  GLOBAL_ACTION_ICON_HOVER_OFF = 'global:action-icon-hover-off',
  GLOBAL_CONTEXT_MENU = 'global:context-menu',
  GLOBAL_CLICK = 'global:click',
  GLOBAL_DOUBLE_CLICK = 'global:double-click',
  GLOBAL_SELECTED = 'global:selected',
  GLOBAL_HOVER = 'global:hover',
  GLOBAL_RESET = 'global:reset',
  GLOBAL_LINK_FIELD_JUMP = 'global:link-field-jump',
  GLOBAL_SCROLL = 'global:scroll',
}
