import type { SimpleBBox } from '@antv/g-canvas';
import type {
  InteractionStateName,
  CellTypes,
  InterceptType,
  ScrollbarPositionType,
} from '../constant';
import type { ViewMeta } from './basic';
import type { ResizeActiveOptions } from './resize';
import type {
  BaseCell,
  ColCell,
  CornerCell,
  DataCell,
  MergedCell,
  RowCell,
} from '@/cell';
import type { HeaderCell } from '@/cell/header-cell';
import type { Node } from '@/facet/layout/node';
import type { BaseEvent } from '@/interaction/base-event';
import type { SpreadSheet } from '@/sheet-type';

export type S2CellType<T extends SimpleBBox = ViewMeta> =
  | DataCell
  | HeaderCell
  | ColCell
  | CornerCell
  | RowCell
  | MergedCell
  | BaseCell<T>;

export interface CellMeta {
  id: string;
  colIndex: number;
  rowIndex: number;
  type: CellTypes;
}

export interface InteractionStateInfo {
  // current state name
  stateName?: InteractionStateName;
  // all the active cells for this interaction (save meta data for recording offscreen cells)
  cells?: CellMeta[];
  // all the cells changed the state style
  interactedCells?: S2CellType[];
  // all the active nodes, including rendered and not rendered cells
  nodes?: Node[];
  // for empty cells, updates are ignored, use `force` to skip ignore
  force?: boolean;
}

export interface SelectHeaderCellInfo {
  // target header cell
  cell: S2CellType<ViewMeta>;
  // whether the target header cell is in tree mode
  isTreeRowClick?: boolean;
  isMultiSelection?: boolean;
}

export type InteractionConstructor = new (
  spreadsheet: SpreadSheet,
) => BaseEvent;

export interface CustomInteraction {
  key: string;
  interaction: InteractionConstructor;
}

export interface BrushPoint {
  rowIndex: number;
  colIndex: number;
  x: number;
  y: number;
  scrollX?: number;
  scrollY?: number;
}

export interface BrushRange {
  start: BrushPoint;
  end: BrushPoint;
  width: number;
  height: number;
}

export type StateShapeLayer = 'interactiveBgShape' | 'interactiveBorderShape';

export type Intercept =
  | InterceptType.HOVER
  | InterceptType.CLICK
  | InterceptType.BRUSH_SELECTION
  | InterceptType.MULTI_SELECTION
  | InterceptType.RESIZE;

export interface BrushAutoScrollConfigItem {
  value: number;
  scroll: boolean;
}

export interface BrushAutoScrollConfig {
  x: BrushAutoScrollConfigItem;
  y: BrushAutoScrollConfigItem;
}
export interface ScrollSpeedRatio {
  horizontal?: number;
  vertical?: number;
}

export interface InteractionOptions {
  // record which row/col field need extra link info
  readonly linkFields?: string[];
  // focus selected cell, like the spotlight
  readonly selectedCellsSpotlight?: boolean;
  // highlight all row header cells and column header cells to which the hovered cell belongs
  readonly hoverHighlight?: boolean;
  // keep cell hovered after 800ms duration
  readonly hoverFocus?: boolean;
  // enable Command + C to copy spread data
  readonly enableCopy?: boolean;
  // copy with filed format
  readonly copyWithFormat?: boolean;
  // auto reset sheet style when click outside or press ecs key, default true
  readonly autoResetSheetStyle?: boolean;
  readonly hiddenColumnFields?: string[];
  // the ratio to control scroll speed, default set to 1
  readonly scrollSpeedRatio?: ScrollSpeedRatio;
  // enable resize area, default set to all enable
  readonly resize?: boolean | ResizeActiveOptions;
  // enable mouse drag brush selection
  readonly brushSelection?: boolean;
  // enable Command / Ctrl + click multi selection
  readonly multiSelection?: boolean;
  // enable Shift + click multi selection
  readonly rangeSelection?: boolean;
  // use arrow keyboard to move selected cell
  readonly selectedCellMove?: boolean;
  // controls scrollbar's position type
  readonly scrollbarPosition?: ScrollbarPositionType;
  /** ***********CUSTOM INTERACTION HOOKS**************** */
  // register custom interactions
  customInteractions?: CustomInteraction[];
}
