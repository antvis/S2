import { EMPTY_PLACEHOLDER } from './basic';
import type { S2Options } from '@/common/interface/s2Options';
import { ScrollbarPositionType, Style } from '@/common/interface/basic';
import { ResizeType } from '@/common/constant/resize';

export enum LayoutWidthTypes {
  Adaptive = 'adaptive',
  ColAdaptive = 'colAdaptive',
  Compact = 'compact',
}

export const DEFAULT_STYLE: Readonly<Style> = {
  layoutWidthType: LayoutWidthTypes.Adaptive,
  treeRowsWidth: 120,
  collapsedRows: {},
  collapsedCols: {},
  cellCfg: {
    width: 96,
    height: 30,
  },
  rowCfg: {
    width: 96,
    widthByField: {},
    heightByField: {},
  },
  colCfg: {
    height: 30,
    widthByFieldValue: {},
    heightByField: {},
  },
  device: 'pc',
};

export const DEFAULT_OPTIONS: Readonly<S2Options> = {
  width: 600,
  height: 480,
  debug: false,
  hierarchyType: 'grid',
  conditions: {},
  totals: {},
  tooltip: {
    showTooltip: false,
    autoAdjustBoundary: 'body',
    operation: {
      hiddenColumns: false,
      trend: false,
      sort: false,
    },
  },
  interaction: {
    linkFields: [],
    hiddenColumnFields: [],
    selectedCellsSpotlight: false,
    hoverHighlight: true,
    hoverFocus: true,
    scrollSpeedRatio: {
      horizontal: 1,
      vertical: 1,
    },
    autoResetSheetStyle: true,
    brushSelection: true,
    multiSelection: true,
    rangeSelection: true,
    scrollbarPosition: ScrollbarPositionType.content,
    resize: {
      rowCellVertical: true,
      cornerCellHorizontal: true,
      colCellHorizontal: true,
      colCellVertical: true,
      rowResizeType: ResizeType.ALL,
    },
  },
  showSeriesNumber: false,
  scrollReachNodeField: {},
  customSVGIcons: [],
  customHeaderCells: null,
  showDefaultHeaderActionIcon: false,
  headerActionIcons: [],
  style: DEFAULT_STYLE,
  frozenRowHeader: true,
  frozenRowCount: 0,
  frozenColCount: 0,
  frozenTrailingRowCount: 0,
  frozenTrailingColCount: 0,
  hdAdapter: true,
  cornerText: '',
  placeholder: EMPTY_PLACEHOLDER,
  supportCSSTransform: false,
};
