import type {
  BaseSheetInitEmitKeys,
  BaseSheetInitPropKeys,
} from './../interface';
export const initBaseSheetPropKeys = (): BaseSheetInitPropKeys => [
  'sheetType',
  'spreadsheet',
  'dataCfg',
  'options',
  'loading',
  'partDrillDown',
  'adaptive',
  'showPagination',
  'themeCfg',
  'header',
  'getSpreadSheet',
];

export const initBaseSheetEmitKeys = (): BaseSheetInitEmitKeys => [
  // row cell
  'rowCellHover',
  'rowCellClick',
  'rowCellDoubleClick',
  'rowCellMouseDown',
  'rowCellMouseUp',
  'rowCellMouseMove',
  'rowCellCollapseTreeRows',
  // ============== Col Cell ====================
  'colCellHover',
  'colCellClick',
  'colCellDoubleClick',
  'colCellMouseDown',
  'colCellMouseUp',
  'colCellMouseMove',

  // ============== Data Cell ====================
  'dataCellHover',
  'dataCellClick',
  'dataCellDoubleClick',
  'dataCellMouseDown',
  'dataCellMouseUp',
  'dataCellMouseMove',
  'dataCellTrendIconClick',
  'dataCellBrushSelection',

  // ============== Corner Cell ====================
  'cornerCellHover',
  'cornerCellClick',
  'cornerCellDoubleClick',
  'cornerCellMouseDown',
  'cornerCellMouseUp',
  'cornerCellMouseMove',

  // ============== Merged Cells ====================
  'mergedCellsHoverer',
  'mergedCellClick',
  'mergedCellsDoubleClick',
  'mergedCellsMouseDown',
  'mergedCellsMouseUp',
  'mergedCellsMouseMove',

  // ============== Sort ====================
  'rangeSort',
  'rangeSorted',

  // ============== Filter ====================
  'rangeFilter',
  'rangeFiltered',

  // ============== Layout ====================
  'layoutAfterHeaderLayout',
  'layoutPagination',
  'layoutCellScroll',
  'layoutAfterCollapseRows',
  'collapseRowsAll',
  'layoutColsExpanded',
  'layoutColsHidden',
  'beforeRender',
  'afterRender',
  'destroy',

  // ============== Resize ====================
  'layoutResize',
  'layoutResizeSeriesWidth',
  'layoutResizeRowWidth',
  'layoutResizeRowHeight',
  'layoutResizeColWidth',
  'layoutResizeColHeight',
  'layoutResizeTreeWidth',
  'layoutResizeMouseDown',
  'layoutResizeMouseUp',
  'layoutResizeMouseMove',

  // ============== Global ====================
  'keyBoardDown',
  'keyBoardUp',
  'copied',
  'actionIconHover',
  'actionIconClick',
  'contextMenu',
  'mouseHover',
  'mouseUp',
  'selected',
  'reset',
  'linkFieldJump',
];
