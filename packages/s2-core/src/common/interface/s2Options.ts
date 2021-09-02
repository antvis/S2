import {
  CellCallback,
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
import { TREE_ROW_DEFAULT_WIDTH } from '@/common/constant';
import { BaseDataSet } from '@/data-set';
import { SpreadSheet } from '@/sheet-type';
import { Node } from '@/facet/layout/node';
import { FilterDataItemCallback } from './basic';
import { Conditions } from './condition';
import { CustomInteraction } from './interaction';

export interface S2PartialOptions {
  // canvas's width
  width: number;
  // canvas's height
  height: number;
  // s2 mode
  mode?: 'pivot' | 'table';
  // debug info for developer
  debug?: boolean;
  // row header hierarchy type only work in pivot mode
  hierarchyType?: 'grid' | 'tree' | 'customTree';
  // 兜底以前的衍生指标概念
  indicateConditionValues?: string[];
  // conditions config
  conditions?: Conditions;
  // total config
  totals?: Totals;
  // tooltip configs
  tooltip?: Tooltip;
  // record which row/col field need extra link info
  linkFieldIds?: string[];
  // pagination config
  pagination?: Pagination;
  // freeze row header
  freezeRowHeader?: boolean;
  // show Series Number
  showSeriesNumber?: boolean;
  // scroll reach node border(which field node belongs to) event config
  scrollReachNodeField?: NodeField;
  // hide row, col with fields
  hideRowColFields?: string[];
  // custom config of showing columns and rows
  customHeaderCells?: CustomHeaderCells;
  // row header action icon's config
  rowActionIcons?: RowActionIcons;
  // extra styles
  style?: Partial<Style>;
  hierarchyCollapse?: boolean;
  // focus selected cell, like the spotlight
  selectedCellsSpotlight?: boolean;
  // highlight all row header cells and column header cells to which the hovered cell belongs
  hoverHighlight?: boolean;
  hdAdapter?: boolean;

  /** ***********CUSTOM CELL/HEADER HOOKS**************** */
  // custom data cell
  dataCell?: DataCellCallback;
  // custom corner cell
  cornerCell?: CellCallback;
  // custom row cell
  rowCell?: CellCallback;
  // custom col cell
  colCell?: CellCallback;
  // custom frame TODO rename this
  frame?: FrameCallback;
  // custom corner header
  cornerHeader?: CornerHeaderCallback;
  // the collection of row id and column id of cells which to be merged
  mergedCellsInfo?: MergedCellInfo[][];
  // enable Command + C to copy spread data
  enableCopy?: boolean;

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
  /** ***********CUSTOM LIFECYCLE HOOKS**************** */

  /** ***********CUSTOM LAYOUT HOOKS**************** */
  otterLayout?: (
    spreadsheet: SpreadSheet,
    rowNode: Node,
    colNode: Node,
  ) => void;
  /** ***********CUSTOM INTERACTION HOOKS**************** */
  // register custom interactions
  customInteractions?: CustomInteraction[];
  // extra options if needed
  [key: string]: unknown; // TODO: Options 里面 给 extra 的作用是?
}

export type S2Options = S2PartialOptions & {
  // custom data set
  dataSet?: (spreadsheet: SpreadSheet) => BaseDataSet;
};

export const defaultStyle: Style = {
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
};

export const defaultOptions: S2Options = {
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
  selectedCellsSpotlight: true,
  hoverHighlight: true,
  hdAdapter: true,
};

export const safetyOptions = (options: S2Options) =>
  merge({}, defaultOptions, options);
