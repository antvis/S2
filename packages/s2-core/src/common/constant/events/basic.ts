export enum S2Event {
  /** ================ Row Cell ================  */
  ROW_CELL_COLLAPSE_TREE_ROWS = 'row-cell:collapsed-tree-rows',
  ROW_CELL_TEXT_CLICK = 'row-cell:text-click',
  ROW_CELL_CLICK = 'row-cell:click',
  ROW_CELL_DOUBLE_CLICK = 'row-cell:double-click',
  ROW_CELL_HOVER = 'row-cell:hover',
  ROW_CELL_MOUSE_DOWN = 'row-cell:mouse-down',
  ROW_CELL_MOUSE_UP = 'row-cell:mouse-up',
  ROW_CELL_MOUSE_MOVE = 'row-cell:mouse-move',

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

  /** ================ Corner Cell ================  */
  CORNER_CELL_CLICK = 'corner-cell:click',
  CORNER_CELL_DOUBLE_CLICK = 'corner-cell:double-click',
  CORNER_CELL_MOUSE_UP = 'corner-cell:mouse-up',
  CORNER_CELL_MOUSE_MOVE = 'corner-cell:mouse-move',
  CORNER_CELL_HOVER = 'corner-cell:hover',
  CORNER_CELL_MOUSE_DOWN = 'corner-cell:mouse-down',

  /** ================ Merged Cell ================  */
  MERGED_CELLS_MOUSE_UP = 'merged-cells:mouse-up',
  MERGED_ELLS_MOUSE_MOVE = 'merged-cells:mouse-move',
  MERGED_CELLS_HOVER = 'merged-cells:hover',
  MERGED_CELLS_CLICK = 'merged-cells:click',
  MERGED_CELLS_DOUBLE_CLICK = 'merged-cells:double-click',
  MERGED_CELLS_MOUSE_DOWN = 'merged-cells:mouse-down',

  /** ================ Table Sort ================  */
  RANGE_SORT = 'sort:range-sort',
  RANGE_SORTING = 'sort:range-sorting',
  RANGE_SORTED = 'sort:range-sorted',

  /** ================ Table Layout ================  */
  LAYOUT_AFTER_HEADER_LAYOUT = 'layout:after-header-layout',
  LAYOUT_COL_NODE_BORDER_REACHED = 'layout:col-node-border-reached',
  LAYOUT_ROW_NODE_BORDER_REACHED = 'layout:row-node-border-reached',
  LAYOUT_CELL_SCROLL = 'layout:cell-scroll',
  LAYOUT_PAGINATION = 'layout:pagination',
  LAYOUT_COLLAPSE_ROWS = 'layout:collapsed-rows',
  LAYOUT_AFTER_COLLAPSE_ROWS = 'layout:after-collapsed-rows',
  LAYOUT_TREE_ROWS_COLLAPSE_ALL = 'layout:toggle-collapse-all',
  LAYOUT_TABLE_COL_EXPANDED = 'layout:table-col-expanded',
  LAYOUT_TABLE_COL_HIDE = 'layout:table-col-hide',
  LAYOUT_AFTER_RENDER = 'layout:after-render',
  LAYOUT_BEFORE_RENDER = 'layout:before-render',

  /** ================ Global Resize ================  */
  GLOBAL_RESIZE_MOUSE_DOWN = 'global:resize:mouse-down',
  GLOBAL_RESIZE_MOUSE_MOVE = 'global:resize:mouse-move',
  GLOBAL_RESIZE_MOUSE_UP = 'global:resize-mouse-up',

  /** ================ Global Keyboard ================  */
  GLOBAL_KEYBOARD_DOWN = 'global:keyboard-down',
  GLOBAL_KEYBOARD_UP = 'global:keyboard-up',

  /** ================ Global Keyboard ================  */
  GLOBAL_COPIED = 'global:copied',

  /** ================ Global Mouse ================  */
  GLOBAL_MOUSE_UP = 'global:mouse-up',

  /** ================ Global Context Menu ================  */
  GLOBAL_CONTEXT_MENU = 'global:context-menu',
}
