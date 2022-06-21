import { ResizeType } from '../../common/constant/resize';
import type { Style } from '../../common/interface/basic';
import {
  HOVER_FOCUS_DURATION,
  ScrollbarPositionType,
} from '../constant/interaction';
import type { S2Options } from '../interface/s2Options';
import { EMPTY_PLACEHOLDER } from './basic';

export const MIN_DEVICE_PIXEL_RATIO = 1;

export enum LayoutWidthTypes {
  Adaptive = 'adaptive',
  ColAdaptive = 'colAdaptive',
  Compact = 'compact',
}

export const DEFAULT_STYLE: Readonly<Style> = {
  layoutWidthType: LayoutWidthTypes.Adaptive,
  showTreeLeafNodeAlignDot: false,
  treeRowsWidth: 120,
  collapsedRows: {},
  collapsedCols: {},
  cellCfg: {
    width: 96,
    height: 30,
  },
  rowCfg: {
    width: null,
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
  conditions: {
    enableNegativeInterval: false,
  },
  totals: {},
  tooltip: {
    showTooltip: false,
    autoAdjustBoundary: 'body',
    operation: {
      hiddenColumns: false,
      trend: false,
      sort: false,
      menus: [],
    },
  },
  interaction: {
    linkFields: [],
    hiddenColumnFields: [],
    selectedCellsSpotlight: false,
    hoverHighlight: true,
    hoverFocus: { duration: HOVER_FOCUS_DURATION },
    scrollSpeedRatio: {
      horizontal: 1,
      vertical: 1,
    },
    autoResetSheetStyle: true,
    brushSelection: true,
    multiSelection: true,
    rangeSelection: true,
    scrollbarPosition: ScrollbarPositionType.CONTENT,
    resize: {
      rowCellVertical: true,
      cornerCellHorizontal: true,
      colCellHorizontal: true,
      colCellVertical: true,
      rowResizeType: ResizeType.ALL,
    },
    eventListenerOptions: false,
    selectedCellHighlight: false,
    overscrollBehavior: 'auto',
  },
  showSeriesNumber: false,
  customSVGIcons: [],
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
  cornerExtraFieldText: '',
  placeholder: EMPTY_PLACEHOLDER,
  supportCSSTransform: false,
  devicePixelRatio: window.devicePixelRatio,
};
