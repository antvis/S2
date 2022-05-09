import { Conditions } from './condition';
import {
  FilterDataItemCallback,
  HeaderActionIcon,
  CustomSVGIcon,
} from './basic';
import { Tooltip } from './tooltip';
import { InteractionOptions } from './interaction';
import { ColHeaderConfig } from '@/facet/header/col';
import { RowHeaderConfig } from '@/facet/header/row';
import { CornerHeaderConfig } from '@/facet/header/corner';
import {
  CellCallback,
  CornerHeaderCallback,
  DataCellCallback,
  FrameCallback,
  MappingDataItemCallback,
  MergedCellInfo,
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

export interface S2BasicOptions<T = Element | string> {
  // canvas's width
  width?: number;
  // canvas's height
  height?: number;
  // debug info for developer
  debug?: boolean;
  // row header hierarchy type only work in pivot mode
  hierarchyType?: 'grid' | 'tree' | 'customTree';
  // conditions config
  conditions?: Conditions;
  // total config
  totals?: Totals;
  // tooltip configs
  tooltip?: Tooltip<T>;
  // interaction configs
  interaction?: InteractionOptions;
  // pagination config
  pagination?: Pagination;
  // freeze row header
  frozenRowHeader?: boolean;
  // show Series Number
  showSeriesNumber?: boolean;
  // if show the default header actionIcons
  showDefaultHeaderActionIcon?: boolean;
  // header cells including ColCell, RowCell, CornerCell action icon's config
  headerActionIcons?: HeaderActionIcon[];
  // register custom svg icons
  customSVGIcons?: CustomSVGIcon[];
  // extra styles
  style?: Partial<Style>;
  hierarchyCollapse?: boolean;
  hdAdapter?: boolean;
  // the collection of row id and column id of cells which to be merged
  mergedCellsInfo?: MergedCellInfo[][];
  // empty cell placeholder
  placeholder?: string;
  // custom corner text
  cornerText?: string;
  // custom virtual extra field text
  cornerExtraFieldText?: string;
  supportCSSTransform?: boolean;
  // custom device pixel ratio, default "window.devicePixelRatio"
  devicePixelRatio?: number;

  /** ***********CUSTOM CELL/HEADER HOOKS**************** */
  // custom data cell
  dataCell?: DataCellCallback;
  // custom corner cell
  cornerCell?: CellCallback<CornerHeaderConfig>;
  // custom row cell
  rowCell?: CellCallback<RowHeaderConfig>;
  // custom col cell
  colCell?: CellCallback<ColHeaderConfig>;
  // custom frame
  frame?: FrameCallback;
  // custom corner header
  cornerHeader?: CornerHeaderCallback;

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
}

// Table sheet options
export interface S2TableSheetOptions {
  // frozen row & cols
  frozenRowCount?: number;
  frozenColCount?: number;
  frozenTrailingRowCount?: number;
  frozenTrailingColCount?: number;
}

// Pivot sheet options
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface S2PivotSheetOptions {}

export interface S2Options<T = Element | string>
  extends S2BasicOptions<T>,
    S2TableSheetOptions,
    S2PivotSheetOptions {
  // custom data set
  dataSet?: (spreadsheet: SpreadSheet) => BaseDataSet;
}
