export enum InteractionNames {
  BRUSH_SELECTION_INTERACTION = 'spreadsheet:brush-selection',
  COL_ROW_RESIZE_INTERACTION = 'spreadsheet:row-col-resize',
  DATACELL_MUTI_SELECTION_INTERACTION = 'spreadsheet:datacell-muti-selection',
  COL_ROW_MUTI_SELECTION_INTERACTION = 'spreadsheet:col-row-muti-selection',
}

export enum EventNames {
  DATACELL_CLICK_EVENT = 'spreadsheet:data-cell-click',
  MERGEDCELLS_CLICK_EVENT = 'spreadsheet:merged-cells-click',
  CORNER_TEXT_CLICK_EVENT = 'spreadsheet:corner-text-click',
  ROW_COLUMN_CLICK_EVENT = 'spreadsheet:row-column-click',
  ROW_TEXT_CLICK_EVENT = 'spreadsheet:row-text-click',
  HOVER_EVENT = 'spreadsheet:hover',
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
