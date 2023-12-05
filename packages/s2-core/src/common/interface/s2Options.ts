import type {
  CellCallback,
  CornerHeaderCallback,
  DataCellCallback,
  FrameCallback,
  MappingDataItemCallback,
  MergedCellCallback,
  MergedCellInfo,
  Pagination,
  Style,
  Totals,
} from '../../common/interface/basic';
import type {
  LayoutArrange,
  LayoutCoordinate,
  LayoutDataPosition,
  LayoutHierarchy,
} from '../../common/interface/hooks';
import type { BaseDataSet } from '../../data-set';
import type { ColHeaderConfig } from '../../facet/header/col';
import type { CornerHeaderConfig } from '../../facet/header/corner';
import type { RowHeaderConfig } from '../../facet/header/row';
import type { SpreadSheet } from '../../sheet-type';
import type {
  CustomSVGIcon,
  FilterDataItemCallback,
  HeaderActionIcon,
} from './basic';
import type { Conditions } from './condition';
import type { InteractionOptions } from './interaction';
import type { Tooltip, TooltipContentType } from './tooltip';

export interface S2BasicOptions<
  T = TooltipContentType,
  P = Pagination,
  Icon = Element | string,
  Text = string,
> {
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
  tooltip?: Tooltip<T, Icon, Text>;
  // interaction configs
  interaction?: InteractionOptions;
  // pagination config
  pagination?: P;
  // freeze row header
  frozenRowHeader?: boolean;
  // show series Number
  showSeriesNumber?: boolean;
  // if show the default header actionIcons
  showDefaultHeaderActionIcon?: boolean;
  // header cells including ColCell, RowCell, CornerCell action icon's config
  headerActionIcons?: HeaderActionIcon[];
  // register custom svg icons
  customSVGIcons?: CustomSVGIcon[];
  // extra styles
  style?: Style;
  hdAdapter?: boolean;
  // the collection of row id and column id of cells which to be merged
  mergedCellsInfo?: MergedCellInfo[][];
  // empty cell placeholder
  placeholder?: ((meta: Record<string, any>) => string) | string;
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
  // custom merged cell
  mergedCell?: MergedCellCallback;
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

export interface S2Options<
  T = TooltipContentType,
  P = Pagination,
  Icon = Element | string,
  Text = string,
> extends S2BasicOptions<T, P, Icon, Text>,
    S2TableSheetOptions,
    S2PivotSheetOptions {
  // custom data set
  dataSet?: (spreadsheet: SpreadSheet) => BaseDataSet;
}

export interface S2RenderOptions {
  reloadData?: boolean;
  reBuildDataSet?: boolean;
  reBuildHiddenColumnsDetail?: boolean;
}
