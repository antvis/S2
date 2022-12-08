import { ResizeType } from '../../common/constant/resize';
import type { S2Style } from '../../common/interface/basic';
import {
  HOVER_FOCUS_DURATION,
  ScrollbarPositionType,
} from '../constant/interaction';
import type { S2Options } from '../interface/s2Options';
import { DeviceType } from '../interface/s2Options';
import { EMPTY_PLACEHOLDER } from './basic';

export const MIN_DEVICE_PIXEL_RATIO = 1;

export enum LayoutWidthTypes {
  Adaptive = 'adaptive',
  ColAdaptive = 'colAdaptive',
  Compact = 'compact',
}

export const SPLIT_LINE_WIDTH = 1;

export const DEFAULT_TREE_ROW_WIDTH = 120;

export const DEFAULT_STYLE: Readonly<S2Style> = {
  layoutWidthType: LayoutWidthTypes.Adaptive,
  showTreeLeafNodeAlignDot: false,
  collapsedRows: {},
  collapsedCols: {},
  cellCfg: {
    width: 96,
    height: 30,
  },
  rowCfg: {
    widthByField: null,
    heightByField: null,
  },
  colCfg: {
    height: 30,
    widthByField: null,
    heightByField: null,
  },
  device: DeviceType.PC,
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
    brushSelection: {
      data: true,
      row: false,
      col: false,
    },
    multiSelection: true,
    rangeSelection: true,
    scrollbarPosition: ScrollbarPositionType.CONTENT,
    resize: {
      rowCellVertical: true,
      cornerCellHorizontal: true,
      colCellHorizontal: true,
      colCellVertical: true,
      rowResizeType: ResizeType.ALL,
      colResizeType: ResizeType.ALL,
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

const mobileWidth = document.documentElement.clientWidth;

export const DEFAULT_MOBILE_OPTIONS: Readonly<S2Options> = {
  width: mobileWidth - 40,
  height: 380,
  style: {
    layoutWidthType: LayoutWidthTypes.ColAdaptive,
  },
  interaction: {
    hoverHighlight: false,
    hoverFocus: false,
    brushSelection: {
      data: false,
      row: false,
      col: false,
    },
    multiSelection: false,
    rangeSelection: false,
  },
  device: DeviceType.MOBILE,
};
