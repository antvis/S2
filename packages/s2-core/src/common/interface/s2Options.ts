import { CustomInteraction } from './interaction';
import { Conditions } from './condition';
import {
  FilterDataItemCallback,
  HeaderActionIcon,
  CustomSVGIcon,
  ScrollRatio,
} from './basic';
import { Tooltip } from './tooltip';
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
  Style,
  Totals,
} from '@/common/interface/basic';
import {
  LayoutArrange,
  LayoutCoordinate,
  LayoutDataPosition,
  LayoutHierarchy,
} from '@/common/interface/hooks';
import { BaseDataSet } from '@/data-set';
import { SpreadSheet } from '@/sheet-type';
import { Node } from '@/facet/layout/node';

export interface S2PartialOptions {
  // canvas's width
  readonly width: number;
  // canvas's height
  readonly height: number;
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
  readonly linkFields?: string[];
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
  // if show the default header actionIcons
  readonly showDefaultHeaderActionIcon?: boolean;
  // header cells including ColCell, RowCell, CornerCell action icon's config
  readonly headerActionIcons?: HeaderActionIcon[];
  // register custom svg icons
  readonly customSVGIcons?: CustomSVGIcon[];
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
  // the collection of row id and column id of cells which to be merged
  readonly mergedCellsInfo?: MergedCellInfo[][];
  // enable Command + C to copy spread data
  readonly enableCopy?: boolean;
  // the ratio to control scroll speed, default set to 1
  readonly scrollSpeedRatio?: ScrollRatio;
  // auto reset sheet style when click outside or press ecs key, default true
  readonly autoResetSheetStyle?: boolean;

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
