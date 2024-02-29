import {
  RESIZE_MIN_CELL_HEIGHT,
  RESIZE_MIN_CELL_WIDTH,
  ResizeType,
} from '../../common/constant/resize';
import {
  HOVER_FOCUS_DURATION,
  ScrollbarPositionType,
} from '../constant/interaction';
import type { CellTextWordWrapStyle, S2Style } from '../interface';
import type { S2Options } from '../interface/s2Options';
import { DeviceType } from '../interface/s2Options';
import { EMPTY_PLACEHOLDER } from './basic';

export const MIN_DEVICE_PIXEL_RATIO = 1;

/**
 * 布局类型：
 * adaptive: 行列等宽，均分整个 canvas 画布宽度
 * colAdaptive：列等宽，行头紧凑布局，列等分画布宽度减去行头宽度的剩余宽度
 * compact：行列紧凑布局，指标维度少的时候无法布满整个画布，列头宽度为实际内容宽度（取当前列最大值，采样每一列前 50 条数据
 */
export enum LayoutWidthType {
  Adaptive = 'adaptive',
  ColAdaptive = 'colAdaptive',
  Compact = 'compact',
}

export const SPLIT_LINE_WIDTH = 1;

export const DEFAULT_TREE_ROW_CELL_WIDTH = 120;

export const DEFAULT_CELL_TEXT_WORD_WRAP_STYLE: CellTextWordWrapStyle = {
  wordWrap: true,
  maxLines: 1,
  textOverflow: 'ellipsis',
};

export const DEFAULT_STYLE: S2Style = {
  layoutWidthType: LayoutWidthType.Adaptive,
  seriesNumberCell: DEFAULT_CELL_TEXT_WORD_WRAP_STYLE,
  cornerCell: DEFAULT_CELL_TEXT_WORD_WRAP_STYLE,
  rowCell: {
    ...DEFAULT_CELL_TEXT_WORD_WRAP_STYLE,
    showTreeLeafNodeAlignDot: false,
    widthByField: null,
    heightByField: null,
  },
  colCell: {
    ...DEFAULT_CELL_TEXT_WORD_WRAP_STYLE,
    height: 30,
    widthByField: null,
    heightByField: null,
  },
  dataCell: {
    ...DEFAULT_CELL_TEXT_WORD_WRAP_STYLE,
    width: 96,
    height: 30,
  },
} as const;

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
      menu: {
        items: [],
      },
    },
  },
  interaction: {
    copy: {
      enable: true,
      withFormat: true,
      withHeader: false,
    },
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
      rowCell: true,
      colCell: true,
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
      minCellWidth: RESIZE_MIN_CELL_WIDTH,
      minCellHeight: RESIZE_MIN_CELL_HEIGHT,
    },
    eventListenerOptions: false,
    selectedCellHighlight: false,
    overscrollBehavior: 'auto',
  },
  seriesNumber: {
    enable: false,
  },
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
  hd: true,
  cornerText: '',
  cornerExtraFieldText: '',
  placeholder: EMPTY_PLACEHOLDER,
};
