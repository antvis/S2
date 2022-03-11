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
  readonly width?: number;
  // canvas's height
  readonly height?: number;
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
  // custom corner text
  readonly cornerText?: string;
  readonly supportCSSTransform?: boolean;
  // custom device pixel ratio, default "window.devicePixelRatio"
  readonly devicePixelRatio?: number;

  /** ***********CUSTOM CELL/HEADER HOOKS**************** */
  // custom data cell
  readonly dataCell?: DataCellCallback;
  // custom corner cell
  readonly cornerCell?: CellCallback<CornerHeaderConfig>;
  // custom row cell
  readonly rowCell?: CellCallback<RowHeaderConfig>;
  // custom col cell
  readonly colCell?: CellCallback<ColHeaderConfig>;
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
