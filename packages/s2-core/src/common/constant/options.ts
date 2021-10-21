import { S2Options } from '../interface/s2Options';
import { Style } from '@/common/interface/basic';

export const DEFAULT_STYLE: Readonly<Style> = {
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
    height: 40,
    widthByFieldValue: {},
    heightByField: {},
    colWidthType: 'adaptive',
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
    showTooltip: true,
    operation: {
      hiddenColumns: true,
      trend: false,
      sort: true,
    },
  },
  linkFields: [],
  freezeRowHeader: true,
  showSeriesNumber: false,
  scrollReachNodeField: {},
  hiddenColumnFields: [],
  customSVGIcons: [],
  customHeaderCells: null,
  showDefaultHeaderActionIcon: true,
  headerActionIcons: [],
  style: DEFAULT_STYLE,
  selectedCellsSpotlight: true,
  hoverHighlight: true,
  frozenRowCount: 0,
  frozenColCount: 0,
  frozenTrailingRowCount: 0,
  frozenTrailingColCount: 0,
  hdAdapter: true,
  scrollSpeedRatio: {
    horizontal: 1,
    vertical: 1,
  },
  autoResetSheetStyle: true,
};
