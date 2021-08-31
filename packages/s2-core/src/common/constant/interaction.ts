import { i18n } from '@/common/i18n';

export enum InteractionName {
  DATA_CELL_CLICK = 'dataCellClick',
  MERGED_CELLS_CLICK = 'mergedCellsClick',
  CORNER_TEXT_CLICK = 'cornerCellTextClick',
  ROW_COLUMN_CLICK = 'rowColumnClick',
  ROW_TEXT_CLICK = 'rowTextClick',
  HOVER = 'hover',
  BRUSH_SELECTION = 'brushSelection',
  COL_ROW_RESIZE = 'rowColResize',
  COL_ROW_MULTI_SELECTION = 'colRowMultiSelection',
}

export enum InteractionStateName {
  SELECTED = 'selected',
  UNSELECTED = 'unselected',
  HOVER = 'hover',
  HOVER_FOCUS = 'hoverFocus',
  PREPARE_SELECT = 'prepareSelect',
}

export enum CellTypes {
  DATA_CELL = 'dataCell',
  HEADER_CELL = 'headerCell',
  ROW_CELL = 'rowCell',
  COL_CELL = 'colCell',
  CORNER_CELL = 'cornerCell',
  MERGED_CELLS = 'mergedCells',
}

export const HOVER_FOCUS_TIME = 800;

// 主题配置和canvas属性的映射
export const SHAPE_STYLE_MAP = {
  textOpacity: 'fillOpacity',
  backgroundOpacity: 'fillOpacity',
  backgroundColor: 'fill',
  borderOpacity: 'strokeOpacity',
  borderColor: 'stroke',
  opacity: 'opacity',
};

// 设置属性的时候实际对应改变的shape映射
export const SHAPE_ATTRS_MAP = {
  textShape: ['textOpacity'],
  backgroundShape: ['backgroundOpacity'],
  interactiveBgShape: ['backgroundColor', 'backgroundOpacity'],
  interactiveBorderShape: ['borderColor', 'borderOpacity'],
};

export const INTERACTION_STATE_INFO_KEY = 'interactionStateInfo';

export const INTERACTION_TREND = {
  ID: '__INTERACTION_TREND_ID__',
  NAME: i18n('趋势'),
};

export enum InteractionBrushSelectionStage {
  CLICK = 'click',
  UN_DRAGGED = 'unDragged',
  DRAGGED = 'dragged',
}

export enum InteractionKeyboardKey {
  SHIFT = 'Shift',
  COPY = 'c',
  ESC = 'Escape',
}

export enum SortMethodType {
  ASC = 'ASC',
  DESC = 'DESC',
}

export enum InterceptType {
  HOVER = 'hover',
  CLICK = 'click',
  BRUSH_SELECTION = 'brushSelection',
}

export type Intercept =
  | InterceptType.HOVER
  | InterceptType.CLICK
  | InterceptType.BRUSH_SELECTION;
