import {
  CellCallback,
  Conditions,
  CornerHeaderCallback,
  CustomHeaderCells,
  DataCellCallback,
  FrameCallback,
  HierarchyCallback,
  LayoutArrangeCallback,
  LayoutCallback,
  LayoutResultCallback,
  NodeField,
  Pagination,
  RowActionIcons,
  Style,
  Tooltip,
  TooltipCallback,
  Totals,
  MergedCellInfo,
} from '@/common/interface/index';
import { TREE_ROW_DEFAULT_WIDTH } from '@/common/constant';
import { merge } from 'lodash';

export interface S2Options {
  // canvas's width
  readonly width: number;
  // canvas's height
  readonly height: number;
  // s2 mode
  readonly mode?: 'pivot' | 'table';
  // debug info for developer
  readonly debug?: boolean;
  // row header hierarchy type only work in pivot mode
  readonly hierarchyType?: 'grid' | 'tree';
  // conditions config
  readonly conditions?: Conditions;
  // total config
  readonly totals?: Totals;
  // s2 tooltip configs
  readonly tooltip?: Tooltip;
  // record which row/col field need extra link info
  readonly linkFieldIds?: string[];
  // pagination config
  readonly pagination?: Pagination;
  // freeze row header
  readonly freezeRowHeader?: boolean;
  // show Series Number
  readonly showSeriesNumber?: boolean;
  // scroll reach node border(which field node belongs to) event config
  readonly scrollReachNodeField?: NodeField;
  // hide row, col with fields
  readonly hideRowColFields?: string[];
  // measure values in cols as new col, only works in 'pivot' mode
  readonly valueInCols?: boolean;
  // custom config of showing columns and rows
  readonly customHeaderCells?: CustomHeaderCells;
  // row header action icon's config
  readonly rowActionIcons?: RowActionIcons;
  // extra styles
  readonly style?: Partial<Style>;
  /** ***********CUSTOM CELL/HEADER HOOKS**************** */
  // custom data cell
  readonly dataCell?: DataCellCallback;
  // custom corner cell
  readonly cornerCell?: CellCallback;
  // custom row cell
  readonly rowCell?: CellCallback;
  // custom col cell
  readonly colCell?: CellCallback;
  // custom frame TODO rename this
  readonly frame?: FrameCallback;
  // custom corner header
  readonly cornerHeader?: CornerHeaderCallback;
  // custom tooltips
  readonly initTooltip?: TooltipCallback;
  // replace the whole default tooltip component
  readonly tooltipComponent?: JSX.Element;
  /** ***********CUSTOM LIFECYCLE HOOKS**************** */
  // determine what does row/column tree hierarchy look like
  // eg: add/delete some nodes in specified position
  readonly hierarchy?: HierarchyCallback;
  // determine the order of every row/column tree branch
  readonly layoutArrange?: LayoutArrangeCallback;
  // determine the location(x,y,width,height eg..) of every node
  layout?: LayoutCallback;
  // determine the data of cells in Cartesian coordinates
  readonly layoutResult?: LayoutResultCallback;

  // the collection of row id and column id of cells which to be merged
  readonly mergedCellsInfo?: MergedCellInfo[][];
  // extra options if needed
  [key: string]: any;
}

export const defaultStyle = {
  treeRowsWidth: TREE_ROW_DEFAULT_WIDTH,
  collapsedRows: {},
  collapsedCols: {},
  cellCfg: {
    width: 96,
    height: 30,
    padding: 0,
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
    showDerivedIcon: true,
    maxSampleIndex: 1,
  },
  device: 'pc',
} as Style;

export const defaultOptions = {
  width: 600,
  height: 480,
  mode: 'pivot',
  debug: false,
  hierarchyType: 'grid',
  conditions: {},
  totals: {},
  tooltip: {},
  linkFieldIds: [],
  freezeRowHeader: true,
  showSeriesNumber: false,
  scrollReachNodeField: {},
  hideRowColFields: [],
  valueInCols: true,
  customHeaderCells: null,
  rowActionIcons: null,
  style: defaultStyle,
} as S2Options;

export const safetyOptions = (options: S2Options) =>
  merge({}, defaultOptions, options);
