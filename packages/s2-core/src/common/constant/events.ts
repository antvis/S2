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

// interaction event names
export enum EventNames {
  DATA_CELL_CLICK_EVENT = 'spreadsheet:data-cell-click',
  MERGED_CELLS_CLICK_EVENT = 'spreadsheet:merged-cells-click',
  CORNER_TEXT_CLICK_EVENT = 'spreadsheet:corner-text-click',
  ROW_COLUMN_CLICK_EVENT = 'spreadsheet:row-column-click',
  ROW_TEXT_CLICK_EVENT = 'spreadsheet:row-text-click',
  HOVER_EVENT = 'spreadsheet:hover',
}

//
export enum ResizeEventType {
  ROW_W = 'spreadsheet:change-row-header-width',
  COL_W = 'spreadsheet:change-column-header-width',
  ROW_H = 'spreadsheet:change-row-header-height',
  COL_H = 'spreadsheet:change-column-header-height',
  TREE_W = 'spreadsheet:change-tree-width',
}
