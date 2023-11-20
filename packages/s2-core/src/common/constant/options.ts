import { ResizeType } from '../../common/constant/resize';
import {
  HOVER_FOCUS_DURATION,
  ScrollbarPositionType,
} from '../constant/interaction';
import type { S2Style } from '../interface';
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

export const DEFAULT_STYLE: S2Style = {
  layoutWidthType: LayoutWidthTypes.Adaptive,
  dataCell: {
    width: 96,
    height: 30,
  },
  rowCell: {
    showTreeLeafNodeAlignDot: false,
    widthByField: null,
    heightByField: null,
  },
  colCell: {
    height: 30,
    widthByField: null,
    heightByField: null,
  },
};

export const DEFAULT_OPTIONS: S2Options = {
  width: 600,
  height: 480,
  debug: false,
  hierarchyType: 'grid',
  device: DeviceType.PC,
  conditions: {},
  totals: {},
  tooltip: {
    enable: false,
    autoAdjustBoundary: 'body',
    operation: {
      hiddenColumns: false,
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
      dataCell: true,
      rowCell: false,
      colCell: false,
    },
    multiSelection: true,
    rangeSelection: true,
    scrollbarPosition: ScrollbarPositionType.CONTENT,
    resize: {
      rowCellVertical: true,
      cornerCellHorizontal: true,
      colCellHorizontal: true,
      colCellVertical: true,
      rowResizeType: ResizeType.CURRENT,
      colResizeType: ResizeType.CURRENT,
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
  frozen: {
    rowHeader: true,
    rowCount: 0,
    colCount: 0,
    trailingRowCount: 0,
    trailingColCount: 0,
  },
  hdAdapter: true,
  cornerText: '',
  cornerExtraFieldText: '',
  placeholder: EMPTY_PLACEHOLDER,
};

const mobileWidth = document.documentElement.clientWidth;

export const DEFAULT_MOBILE_OPTIONS: S2Options = {
  width: mobileWidth - 40,
  height: 380,
  style: {
    layoutWidthType: LayoutWidthTypes.ColAdaptive,
  },
  interaction: {
    hoverHighlight: false,
    hoverFocus: false,
    brushSelection: {
      dataCell: false,
      rowCell: false,
      colCell: false,
    },
    multiSelection: false,
    rangeSelection: false,
  },
  device: DeviceType.MOBILE,
};
