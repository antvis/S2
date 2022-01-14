import { ResizeActiveOptions } from './resize';
import { CustomInteraction } from './interaction';
import { Conditions } from './condition';
import {
  FilterDataItemCallback,
  HeaderActionIcon,
  CustomSVGIcon,
  ScrollRatio,
  ScrollbarPositionType,
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

export interface InteractionOptions {
  // record which row/col field need extra link info
  readonly linkFields?: string[];
  // focus selected cell, like the spotlight
  readonly selectedCellsSpotlight?: boolean;
  // highlight all row header cells and column header cells to which the hovered cell belongs
  readonly hoverHighlight?: boolean;
  // enable Command + C to copy spread data
  readonly enableCopy?: boolean;
  // copy with filed format
  readonly copyWithFormat?: boolean;
  // auto reset sheet style when click outside or press ecs key, default true
  readonly autoResetSheetStyle?: boolean;
  readonly hiddenColumnFields?: string[];
  // the ratio to control scroll speed, default set to 1
  readonly scrollSpeedRatio?: ScrollRatio;
  // enable resize area, default set to all enable
  readonly resize?: boolean | ResizeActiveOptions;
  // controls scrollbar's position type
  readonly scrollbarPosition?: ScrollbarPositionType;
  /** ***********CUSTOM INTERACTION HOOKS**************** */
  // register custom interactions
  customInteractions?: CustomInteraction[];
}

export interface S2BasicOptions<T = Element | string> {
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
  readonly tooltip?: Tooltip<T>;
  // interaction configs
  readonly interaction?: InteractionOptions;
  // pagination config
  readonly pagination?: Pagination;
  // freeze row header
  readonly frozenRowHeader?: boolean;
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
  readonly hierarchyCollapse?: boolean;
  readonly hdAdapter?: boolean;
  // the collection of row id and column id of cells which to be merged
  readonly mergedCellsInfo?: MergedCellInfo[][];
  // empty cell placeholder
  readonly placeholder?: string;
  
  readonly supportCSSTransform?: boolean;

  /** ***********CUSTOM CELL/HEADER HOOKS**************** */
  // custom data cell
  readonly dataCell?: DataCellCallback;
  // custom corner cell
  readonly cornerCell?: CellCallback;
  // custom row cell
  readonly rowCell?: CellCallback;
  // custom col cell
  readonly colCell?: CellCallback;
  // custom frame
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
}

// Table sheet options
export interface S2TableSheetOptions {
  // frozen row & cols
  readonly frozenRowCount?: number;
  readonly frozenColCount?: number;
  readonly frozenTrailingRowCount?: number;
  readonly frozenTrailingColCount?: number;
}

// Pivot sheet options
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface S2PivotSheetOptions {}

export interface S2Options<T = Element | string>
  extends S2BasicOptions<T>,
    S2TableSheetOptions,
    S2PivotSheetOptions {
  // custom data set
  readonly dataSet?: (spreadsheet: SpreadSheet) => BaseDataSet;
}
