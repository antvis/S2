import {
  CellCallback,
  Conditions,
  CornerHeaderCallback,
  CustomHeaderCells,
  DataCellCallback,
  FrameCallback,
  MappingDataItemCallback,
  MergedCellInfo,
  NodeField,
  Pagination,
  RowActionIcons,
  Style,
  Tooltip,
  Totals,
} from '@/common/interface/basic';
import {
  LayoutArrange,
  LayoutCoordinate,
  LayoutDataPosition,
  LayoutHierarchy,
} from '@/common/interface/hooks';
import { merge } from 'lodash';
import { TREE_ROW_DEFAULT_WIDTH } from 'src/common/constant';
import { BaseDataSet } from 'src/data-set';
import { SpreadSheet } from 'src/sheet-type';
import { Node } from 'src/facet/layout/node';
import { FilterDataItemCallback } from './basic';

export interface S2PartialOptions {
  // canvas's width
  readonly width: number;
  // canvas's height
  readonly height: number;
  // s2 mode
  readonly mode?: 'pivot' | 'table';
  // debug info for developer
  readonly debug?: boolean;
  // row header hierarchy type only work in pivot mode
  readonly hierarchyType?: 'grid' | 'tree' | 'customTree';
  // 兜底以前的衍生指标概念
  readonly useDefaultConditionValues?: string[];
  // conditions config
  readonly conditions?: Conditions;
  // total config
  readonly totals?: Totals;
  // tooltip configs
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
  // custom config of showing columns and rows
  readonly customHeaderCells?: CustomHeaderCells;
  // row header action icon's config
  readonly rowActionIcons?: RowActionIcons;
  // extra styles
  readonly style?: Partial<Style>;
  readonly hierarchyCollapse?: boolean;

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

  // the collection of row id and column id of cells which to be merged
  readonly mergedCellsInfo?: MergedCellInfo[][];
  // enable Command + C to copy spread data
  readonly enableCopy?: boolean;
  /** ***********CUSTOM LIFECYCLE HOOKS**************** */
  // determine what does row/column tree hierarchy look like
  // eg: add/delete some nodes in specified position
  layoutHierarchy?: LayoutHierarchy;
  // determine the order of every row/column tree branch
  layoutArrange?: LayoutArrange;
  // determine the location(x,y,width,height eg..) of every node
  layoutCoordinate?: LayoutCoordinate;
  // determine the data of cells in Cartesian coordinates
  layoutDataPosition?: LayoutDataPosition;

  /** ***********CUSTOM DATA CELL RENDER HOOKS**************** */
  // determine the display part of multiple data item
  filterDisplayDataItem?: FilterDataItemCallback;
  // determine data mapping when shows in tooltip
  mappingDisplayDataItem?: MappingDataItemCallback;
  // Focus selected cell, like the spotlight
  selectedCellsSpotlight?: boolean;
  /** ***********CUSTOM LIFECYCLE HOOKS**************** */

  /** ***********CUSTOM LAYOUT HOOKS**************** */
  otterLayout?: (
    spreadsheet: SpreadSheet,
    rowNode: Node,
    colNode: Node,
  ) => void;
  /** ***********CUSTOM LAYOUT HOOKS**************** */
  // extra options if needed
  [key: string]: unknown;
}

export type S2Options = S2PartialOptions & {
  // custom data set
  readonly dataSet?: (spreadsheet: SpreadSheet) => BaseDataSet;
};

export const defaultStyle = {
  treeRowsWidth: TREE_ROW_DEFAULT_WIDTH,
  collapsedRows: {},
  collapsedCols: {},
  cellCfg: {
    width: 96,
    height: 30,
    padding: {
      top: 8,
      right: 12,
      bottom: 8,
      left: 12,
    },
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
  customHeaderCells: null,
  rowActionIcons: null,
  style: defaultStyle,
  selectedCellsSpotlight: false,
} as S2Options;

export const safetyOptions = (options: S2Options) =>
  merge({}, defaultOptions, options);
