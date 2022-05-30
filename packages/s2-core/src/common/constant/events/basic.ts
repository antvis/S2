export enum S2Event {
  /** ================ Row Cell ================  */
  ROW_CELL_HOVER = 'row-cell:hover',
  ROW_CELL_CLICK = 'row-cell:click',
  ROW_CELL_DOUBLE_CLICK = 'row-cell:double-click',
  ROW_CELL_MOUSE_DOWN = 'row-cell:mouse-down',
  ROW_CELL_MOUSE_UP = 'row-cell:mouse-up',
  ROW_CELL_MOUSE_MOVE = 'row-cell:mouse-move',
  ROW_CELL_COLLAPSE_TREE_ROWS = 'row-cell:collapsed-tree-rows',

  /** ================ Col Cell ================  */
  COL_CELL_HOVER = 'col-cell:hover',
  COL_CELL_CLICK = 'col-cell:click',
  COL_CELL_DOUBLE_CLICK = 'col-cell:double-click',
  COL_CELL_MOUSE_DOWN = 'col-cell:mouse-down',
  COL_CELL_MOUSE_UP = 'col-cell:mouse-up',
  COL_CELL_MOUSE_MOVE = 'col-cell:mouse-move',

  /** ================ Data Cell ================  */
  DATA_CELL_HOVER = 'data-cell:hover',
  DATA_CELL_CLICK = 'data-cell:click',
  DATA_CELL_DOUBLE_CLICK = 'data-cell:double-click',
  DATA_CELL_MOUSE_UP = 'data-cell:mouse-up',
  DATA_CELL_MOUSE_DOWN = 'data-cell:mouse-down',
  DATA_CELL_MOUSE_MOVE = 'data-cell:mouse-move',
  DATA_CELL_TREND_ICON_CLICK = 'data-cell:trend-icon-click',
  DATE_CELL_BRUSH_SELECTION = 'data-cell:brush-selection',

  /** ================ Corner Cell ================  */
  CORNER_CELL_HOVER = 'corner-cell:hover',
  CORNER_CELL_CLICK = 'corner-cell:click',
  CORNER_CELL_DOUBLE_CLICK = 'corner-cell:double-click',
  CORNER_CELL_MOUSE_DOWN = 'corner-cell:mouse-down',
  CORNER_CELL_MOUSE_UP = 'corner-cell:mouse-up',
  CORNER_CELL_MOUSE_MOVE = 'corner-cell:mouse-move',

  /** ================ Merged Cells ================  */
  MERGED_CELLS_HOVER = 'merged-cells:hover',
  MERGED_CELLS_CLICK = 'merged-cells:click',
  MERGED_CELLS_DOUBLE_CLICK = 'merged-cells:double-click',
  MERGED_CELLS_MOUSE_DOWN = 'merged-cells:mouse-down',
  MERGED_CELLS_MOUSE_UP = 'merged-cells:mouse-up',
  MERGED_CELLS_MOUSE_MOVE = 'merged-cells:mouse-move',

  /** ================ Sort ================  */
  RANGE_SORT = 'sort:range-sort',
  RANGE_SORTED = 'sort:range-sorted',

  /** ================ Table Filter ================  */
  RANGE_FILTER = 'filter:range-filter',
  RANGE_FILTERED = 'filter:range-filtered',

  /** ================ Table Layout ================  */
  LAYOUT_AFTER_HEADER_LAYOUT = 'layout:after-header-layout',
  LAYOUT_CELL_SCROLL = 'layout:cell-scroll',
  LAYOUT_PAGINATION = 'layout:pagination',
  LAYOUT_COLLAPSE_ROWS = 'layout:collapsed-rows',
  LAYOUT_AFTER_COLLAPSE_ROWS = 'layout:after-collapsed-rows',
  LAYOUT_TREE_ROWS_COLLAPSE_ALL = 'layout:toggle-collapse-all',
  LAYOUT_COLS_EXPANDED = 'layout:table-col-expanded',
  LAYOUT_COLS_HIDDEN = 'layout:table-col-hidden',
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
  GLOBAL_CONTEXT_MENU = 'global:context-menu',
  GLOBAL_SELECTED = 'global:selected',
  GLOBAL_HOVER = 'global:hover',
  GLOBAL_RESET = 'global:reset',
  GLOBAL_LINK_FIELD_JUMP = 'global:link-field-jump',
}
