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

// group's key
export const KEY_GROUP_BACK_GROUND = 'backGroundGroup';
export const KEY_GROUP_FORE_GROUND = 'foreGroundGroup';
export const KEY_GROUP_PANEL_GROUND = 'panelGroup';
export const KEY_GROUP_PANEL_SCROLL = 'panelScrollGroup';
export const KEY_GROUP_MERGED_CELLS = 'mergedCellsGroup';
export const KEY_GROUP_PANEL_FROZEN_ROW = 'frozenRowGroup';
export const KEY_GROUP_PANEL_FROZEN_COL = 'frozenColGroup';
export const KEY_GROUP_PANEL_FROZEN_TRAILING_ROW = 'frozenTrailingRowGroup';
export const KEY_GROUP_PANEL_FROZEN_TRAILING_COL = 'frozenTrailingColGroup';
export const KEY_GROUP_PANEL_FROZEN_TOP = 'frozenTopGroup';
export const KEY_GROUP_PANEL_FROZEN_BOTTOM = 'frozenBottomGroup';
export const KEY_GROUP_ROW_RESIZE_AREA = 'rowResizeAreaGroup';
export const KEY_GROUP_FROZEN_ROW_RESIZE_AREA = 'rowFrozenResizeAreaGroup';
export const KEY_GROUP_FROZEN_SPLIT_LINE = 'frozenSplitLine';
export const KEY_GROUP_ROW_INDEX_RESIZE_AREA = 'rowIndexResizeAreaGroup';
export const KEY_GROUP_CORNER_RESIZE_AREA = 'cornerResizeAreaGroup';
export const KEY_GROUP_COL_RESIZE_AREA = 'colResizeAreaGroup';
export const KEY_GROUP_FROZEN_COL_RESIZE_AREA = 'colFrozenResizeAreaGroup';
export const KEY_GROUP_COL_SCROLL = 'colScrollGroup';
export const KEY_GROUP_COL_FROZEN = 'colFrozenGroup';
export const KEY_GROUP_COL_FROZEN_TRAILING = 'colFrozenTrailingGroup';
export const KEY_GROUP_GRID_GROUP = 'gridGroup';
export const KEY_GROUP_ROW_SCROLL = 'rowScrollGroup';
export const KEY_GROUP_ROW_HEADER_FROZEN = 'rowHeaderFrozenGroup';

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

export const getDefaultSeriesNumberText = (defaultText?: string) =>
  defaultText ?? i18n('序号');

export const getDefaultCornerText = () => i18n('指标');

// 省略号
export const ELLIPSIS_SYMBOL = '...';
