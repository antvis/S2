// TODO: 常量分类, 而不是所有都放在一个文件
export * from './events';

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

// key of series number node in corner header
export const KEY_SERIES_NUMBER_NODE = 'series-number-node';

export const MAX_SCROLL_OFFSET = 10;
export const MIN_SCROLL_BAR_HEIGHT = 20;

export const ID_SEPARATOR = '[&]';
export const EMPTY_PLACEHOLDER = '-';

export const PADDING_TOP = 0;
export const PADDING_RIGHT = 1;
export const PADDING_DOWN = 2;
export const PADDING_LEFT = 3;
