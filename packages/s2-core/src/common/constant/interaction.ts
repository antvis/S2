export enum InteractionNames {
  BRUSH_SELECTION_INTERACTION = 'spreadsheet:brush-selection',
  COL_ROW_RESIZE_INTERACTION = 'spreadsheet:row-col-resize',
  DATA_CELL_MULTI_SELECTION_INTERACTION = 'spreadsheet:data-cell-multi-selection',
  COL_ROW_MULTI_SELECTION_INTERACTION = 'spreadsheet:col-row-multi-selection',
}

export enum InteractionEvent {
  DATA_CELL_CLICK_EVENT = 'spreadsheet:data-cell-click',
  MERGED_CELLS_CLICK_EVENT = 'spreadsheet:merged-cells-click',
  CORNER_TEXT_CLICK_EVENT = 'spreadsheet:corner-cell-text-click',
  ROW_COLUMN_CLICK_EVENT = 'spreadsheet:row-column-click',
  ROW_TEXT_CLICK_EVENT = 'spreadsheet:row-text-click',
  HOVER_EVENT = 'spreadsheet:hover',
  TREND_ICON_CLICK = 'spreadsheet:trend-icon-click',
}

export enum InteractionStateName {
  SELECTED = 'selected',
  HOVER = 'hover',
  HOVER_FOCUS = 'hoverFocus',
  PREPARE_SELECT = 'prepareSelect',
}

export enum CellTypes {
  DATA_CELL = 'dataCell',
  ROW_CELL = 'rowCell',
  COL_CELL = 'colCell',
  CORNER_CELL = 'cornerCell',
  MERGED_CELLS = 'mergedCells',
}

export const HOVER_FOCUS_TIME = 800;

export const SHIFT_KEY = 'Shift';

// 主题配置和canvas属性的映射
export const SHAPE_STYLE_MAP = {
  backgroundColor: 'fill',
  opacity: 'fillOpacity',
  borderColor: 'stroke',
};

// 设置属性的时候实际对应改变的shape映射
export const SHAPE_ATTRS_MAP = {
  interactiveBgShape: ['backgroundColor', 'opacity'],
  activeBorderShape: ['borderColor', 'backgroundColor'],
};

export const INTERACTION_STATE_INFO_KEY = 'interactionStateInfo';

export const INTERACTION_TREND = {
  ID: '__INTERACTION_TREND_ID__',
  NAME: '趋势',
};
