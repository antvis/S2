export enum InteractionName {
  CORNER_CELL_CLICK = 'cornerCellClick',
  DATA_CELL_CLICK = 'dataCellClick',
  MERGED_CELLS_CLICK = 'mergedCellsClick',
  ROW_COLUMN_CLICK = 'rowColumnClick',
  ROW_TEXT_CLICK = 'rowTextClick',
  HOVER = 'hover',
  DATA_CELL_BRUSH_SELECTION = 'dataCellBrushSelection',
  ROW_CELL_BRUSH_SELECTION = 'rowCellBrushSelection',
  COL_CELL_BRUSH_SELECTION = 'colCellBrushSelection',
  COL_ROW_RESIZE = 'rowColResize',
  DATA_CELL_MULTI_SELECTION = 'dataCellMultiSelection',
  RANGE_SELECTION = 'rangeSelection',
  SELECTED_CELL_MOVE = 'selectedCellMove',
}

export enum InteractionStateName {
  ALL_SELECTED = 'allSelected',
  SELECTED = 'selected',
  ROW_CELL_BRUSH_SELECTED = 'rowCellBrushSelected',
  COL_CELL_BRUSH_SELECTED = 'colCellBrushSelected',
  DATA_CELL_BRUSH_SELECTED = 'dataCellBrushSelected',
  UNSELECTED = 'unselected',
  HOVER = 'hover',
  HOVER_FOCUS = 'hoverFocus',
  HIGHLIGHT = 'highlight',
  SEARCH_RESULT = 'searchResult',
  PREPARE_SELECT = 'prepareSelect',
}

export enum CellType {
  DATA_CELL = 'dataCell',
  ROW_CELL = 'rowCell',
  COL_CELL = 'colCell',
  SERIES_NUMBER_CELL = 'seriesNumberCell',
  CORNER_CELL = 'cornerCell',
  MERGED_CELL = 'mergedCell',
}

export const HOVER_FOCUS_DURATION = 800;

// 主题配置和canvas属性的映射
export const SHAPE_STYLE_MAP = {
  textOpacity: 'fillOpacity',
  backgroundOpacity: 'fillOpacity',
  backgroundColor: 'fill',
  borderOpacity: 'strokeOpacity',
  borderColor: 'stroke',
  borderWidth: 'lineWidth',
  opacity: 'opacity',
};

// 设置属性的时候实际对应改变的shape映射
export const SHAPE_ATTRS_MAP = {
  textShape: ['textOpacity'],
  textShapes: ['textOpacity'],
  linkFieldShape: ['opacity'],
  interactiveBgShape: ['backgroundColor', 'backgroundOpacity'],
  interactiveBorderShape: ['borderColor', 'borderOpacity', 'borderWidth'],
};

export const INTERACTION_STATE_INFO_KEY = 'interactionStateInfo';

export enum InteractionBrushSelectionStage {
  CLICK = 'click',
  UN_DRAGGED = 'unDragged',
  DRAGGED = 'dragged',
}

export enum InteractionKeyboardKey {
  SHIFT = 'Shift',
  COPY = 'c',
  ESC = 'Escape',
  META = 'Meta',
  CONTROL = 'Control',
  ARROW_UP = 'ArrowUp',
  ARROW_DOWN = 'ArrowDown',
  ARROW_LEFT = 'ArrowLeft',
  ARROW_RIGHT = 'ArrowRight',
}

export enum SortMethodType {
  ASC = 'ASC',
  DESC = 'DESC',
}

export enum InterceptType {
  HOVER = 'hover',
  CLICK = 'click',
  DATA_CELL_BRUSH_SELECTION = 'dataCellBrushSelection',
  ROW_CELL_BRUSH_SELECTION = 'rowCellBrushSelection',
  COL_CELL_BRUSH_SELECTION = 'colCellBrushSelection',
  MULTI_SELECTION = 'multiSelection',
  RESIZE = 'resize',
}

export const BRUSH_AUTO_SCROLL_INITIAL_CONFIG = {
  x: {
    value: 0,
    scroll: false,
  },
  y: {
    value: 0,
    scroll: false,
  },
};

export enum ScrollbarPositionType {
  CONTENT = 'content',
  CANVAS = 'canvas',
}

export enum ScrollDirection {
  SCROLL_UP = 'scrollUp',
  SCROLL_DOWN = 'scrollDown',
}

export enum ScrollDirectionRowIndexDiff {
  SCROLL_UP = -1,
  SCROLL_DOWN = 1,
}
