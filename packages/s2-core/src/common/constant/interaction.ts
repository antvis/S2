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

export enum SelectedStateName {
  SELECTED = 'selected',
  HOVER = 'hover',
  HOVER_LINKAGE = 'hoverLinkage', // hover时，同列和同行有联动的十字选中效果
  KEEP_HOVER = 'keepHover',
  PREPARE_SELECT = 'prepareSelect',
  COL_SELECTED = 'colSelected',
  ROW_SELECTED = 'rowSelected',
}

export const KEEP_HOVER_TIME = 800;
