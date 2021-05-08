// 值字段的 id 是固定的！
export const VALUE_FIELD = '$$value$$';
export const EXTRA_FIELD = '$$extra$$';
export const TOTAL_VALUE = '$$total$$';
// export const COLUMN_FIELD_KEY = '$$column_key$$';
// icon radius
export const ICON_RADIUS = 6;
// cell default padding
export const DEFAULT_PADDING = 4;
// tree row default width
export const TREE_ROW_DEFAULT_WIDTH = 100;

export const STRATEGY_PADDING = 8; // 各种padding 左右和元素边界
export const STRATEGY_ICON_WIDTH = 10; // 三角icon 宽度

// frontgroundGroup 上的 children 层叠顺序
export const FRONT_GROUND_GROUP_CONTAINER_ZINDEX = 0; // 约定这个 z-index 为 0 的 container 作为基准
export const FRONT_GROUND_GROUP_BRUSH_SELECTION_ZINDEX = -1;

// panelGroup 上的 children 层叠顺序
export const PANEL_GROUP_CELL_GROUP_ZINDEX = 0;
export const PANEL_GROUP_HOVER_BOX_GROUP_ZINDEX = 1;

// group's key
export const KEY_GROUP_BACK_GROUND = 'backGroundGroup';
export const KEY_GROUP_FORE_GROUND = 'foreGroundGroup';
export const KEY_GROUP_PANEL_GROUND = 'panelGroup';
export const KEY_GROUP_ROW_RESIZER = 'rowResizerGroup';
export const KEY_GROUP_ROW_INDEX_RESIZER = 'rowIndexResizerGroup';
export const KEY_GROUP_CORNER_RESIZER = 'cornerResizerGroup';
export const KEY_GROUP_COL_RESIZER = 'colResizerGroup';

// color
export const COLOR_DEFAULT_RESIZER = 'rgba(33,33,33,0)';

// event keys
export const KEY_LIST_SORT = 'spreadsheet:list-sort';
export const KEY_COLLAPSE_TREE_ROWS = 'spreadsheet:collapsed-tree-rows';
export const KEY_ROW_CELL_CLICK = 'spreadsheet:row-cell-click';
export const KEY_COLUMN_CELL_CLICK = 'spreadsheet:column-cell-click';
export const KEY_CORNER_CELL_CLICK = 'spreadsheet:corner-cell-click';
export const KEY_SINGLE_CELL_CLICK = 'spreadsheet:single-cell-click';
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

// key of series number node in corner header
export const KEY_SERIES_NUMBER_NODE = 'series-number-node';

export const KEY_COL_REAL_WIDTH_INFO = 'col-real-width-info';

export const MAX_SCROLL_OFFSET = 10;
export const MIN_SCROLL_BAR_HEIGHT = 20;

export const ID_SEPARATOR = '[&]';
export const EMPTY_PLACEHOLDER = '-';
