import { merge } from 'lodash';
import { CustomInteraction } from './interaction';
import { Conditions } from './condition';
import { FilterDataItemCallback } from './basic';
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
import { TREE_ROW_DEFAULT_WIDTH } from '@/common/constant';
import { BaseDataSet } from '@/data-set';
import { SpreadSheet } from '@/sheet-type';
import { Node } from '@/facet/layout/node';

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
  // custom config of showing columns and rows
  readonly customHeaderCells?: CustomHeaderCells;
  // row header action icon's config
  readonly rowActionIcons?: RowActionIcons;
  // extra styles
  readonly style?: Partial<Style>;
  // frozen row & cols
  readonly frozenRowCount?: number;
  readonly frozenColCount?: number;
  readonly frozenTrailingRowCount?: number;
  readonly frozenTrailingColCount?: number;
  readonly hierarchyCollapse?: boolean;
  // focus selected cell, like the spotlight
  readonly selectedCellsSpotlight?: boolean;
  // highlight all row header cells and column header cells to which the hovered cell belongs
  readonly hoverHighlight?: boolean;
  readonly hdAdapter?: boolean;
  readonly hiddenColumnFields?: string[];
  // TODO: 操作相关的 可以收拢到 operator option里面, 比如 隐藏列, 复制, 等...
  readonly enableHiddenColumns?: boolean;
  // the collection of row id and column id of cells which to be merged
  readonly mergedCellsInfo?: MergedCellInfo[][];
  // enable Command + C to copy spread data
  readonly enableCopy?: boolean;

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
  [key: string]: unknown;
}

export type S2Options = S2PartialOptions & {
  // custom data set
  readonly dataSet?: (spreadsheet: SpreadSheet) => BaseDataSet;
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
  hiddenColumnFields: [],
  customHeaderCells: null,
  rowActionIcons: null,
  style: defaultStyle,
  selectedCellsSpotlight: true,
  hoverHighlight: true,
  frozenRowCount: 0,
  frozenColCount: 0,
  frozenTrailingRowCount: 0,
  frozenTrailingColCount: 0,
  hdAdapter: true,
  enableHiddenColumns: true,
} as S2Options;

export const safetyOptions = (options: S2Options) =>
  merge({}, defaultOptions, options);
