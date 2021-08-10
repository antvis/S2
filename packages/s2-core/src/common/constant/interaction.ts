export enum InteractionNames {
  BRUSH_SELECTION_INTERACTION = 'spreadsheet:brush-selection',
  COL_ROW_RESIZE_INTERACTION = 'spreadsheet:row-col-resize',
  DATA_CELL_MULTI_SELECTION_INTERACTION = 'spreadsheet:data-cell-multi-selection',
  COL_ROW_MULTI_SELECTION_INTERACTION = 'spreadsheet:col-row-multi-selection',
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
