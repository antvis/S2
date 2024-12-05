import { i18n } from '../i18n';

// 约定这个 z-index 为 0 的 container 作为基准
export const BACK_GROUND_GROUP_CONTAINER_Z_INDEX = 0;

// foregroundGroup 上的 children 层叠顺序
export const FRONT_GROUND_GROUP_CONTAINER_Z_INDEX = 3;
export const FRONT_GROUND_GROUP_SCROLL_Z_INDEX = 3;
export const FRONT_GROUND_GROUP_FROZEN_Z_INDEX = 4;
export const FRONT_GROUND_GROUP_RESIZE_AREA_Z_INDEX = 5;
export const FRONT_GROUND_GROUP_BRUSH_SELECTION_Z_INDEX = 5;

// panelGroup 上的 children 层叠顺序
export const PANEL_GROUP_GROUP_CONTAINER_Z_INDEX = 1;
export const PANEL_GROUP_SCROLL_GROUP_Z_INDEX = 1;
export const PANEL_GRID_GROUP_Z_INDEX = 2;
export const PANEL_MERGE_GROUP_Z_INDEX = 3;
export const PANEL_GROUP_FROZEN_GROUP_Z_INDEX = 4;

// emptyPlaceholderGroup 上的 children 层叠顺序
export const EMPTY_PLACEHOLDER_GROUP_CONTAINER_Z_INDEX = 4;

// group's key
export const KEY_GROUP_BACK_GROUND = 'backGroundGroup';
export const KEY_GROUP_FORE_GROUND = 'foreGroundGroup';

export const KEY_GROUP_PANEL_GROUND = 'panelGroup';
export const KEY_GROUP_GRID_GROUP = 'gridGroup';
export const KEY_GROUP_PANEL_SCROLL = 'panelScrollGroup';
export const KEY_GROUP_MERGED_CELLS = 'mergedCellsGroup';

/**
 * series number
 */
export const KEY_GROUP_ROW_INDEX_SCROLL = 'rowIndexScrollGroup';
export const KEY_GROUP_ROW_INDEX_FROZEN = 'rowIndexFrozenGroup';
export const KEY_GROUP_ROW_INDEX_FROZEN_TRAILING =
  'rowIndexFrozenTrailingGroup';
export const KEY_GROUP_ROW_INDEX_RESIZE_AREA = 'rowIndexResizeAreaGroup';
/**
 * row
 */
export const KEY_GROUP_ROW_SCROLL = 'rowScrollGroup';
export const KEY_GROUP_ROW_FROZEN = 'rowHeaderFrozenGroup';
export const KEY_GROUP_ROW_FROZEN_TRAILING = 'rowHeaderFrozenTrailingGroup';
export const KEY_GROUP_ROW_RESIZE_AREA = 'rowResizeAreaGroup';

/**
 * column
 */
export const KEY_GROUP_COL_SCROLL = 'colScrollGroup';
export const KEY_GROUP_COL_FROZEN = 'colFrozenGroup';
export const KEY_GROUP_COL_FROZEN_TRAILING = 'colFrozenTrailingGroup';
export const KEY_GROUP_COL_RESIZE_AREA = 'colResizeAreaGroup';

/**
 * corner
 */
export const KEY_GROUP_CORNER_SCROLL = 'cornerScrollGroup';
export const KEY_GROUP_CORNER_RESIZE_AREA = 'cornerResizeAreaGroup';

export const KEY_GROUP_FROZEN_SPLIT_LINE = 'frozenSplitLine';

export const KEY_GROUP_EMPTY_PLACEHOLDER = 'emptyPlaceholderGroup';

export const HORIZONTAL_RESIZE_AREA_KEY_PRE = 'horizontal-resize-area-';

export const EMPTY_PLACEHOLDER = '-';

// data precision
export const PRECISION = 16;

// 角头最大占整个容器的比例 (0-1)
export const DEFAULT_CORNER_MAX_WIDTH_RATIO = 0.5;

/** 布局采样数 */
export const LAYOUT_SAMPLE_COUNT = 50;

/** mini 图类型 */
export enum MiniChartType {
  Line = 'line',
  Bar = 'bar',
  Bullet = 'bullet',
}

export const getDefaultSeriesNumberText = () => i18n('序号');

export const getDefaultCornerText = () => i18n('指标');

// 省略号
export const ELLIPSIS_SYMBOL = '...';

export const DEFAULT_TEXT_LINE_HEIGHT = 16;
