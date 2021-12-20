import type { S2Options } from '../interface/s2Options';
import { EMPTY_PLACEHOLDER } from './basic';
import type { Style } from '@/common/interface/basic';

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
  },
  colCfg: {
    height: 30,
    widthByFieldValue: {},
    heightByField: {},
    totalSample: 10,
    detailSample: 30,
    maxSampleIndex: 1,
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
    scrollSpeedRatio: {
      horizontal: 1,
      vertical: 1,
    },
    autoResetSheetStyle: true,
    resize: true,
    brushSelection: true,
    multiSelection: true,
    rangeMultiSelection: true,
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
};
