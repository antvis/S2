import type { SimpleBBox } from '@antv/g-canvas';
import type {
  InteractionStateName,
  CellTypes,
  InterceptType,
  ScrollbarPositionType,
} from '../constant';
import type {
  BaseCell,
  ColCell,
  CornerCell,
  DataCell,
  MergedCell,
  RowCell,
} from '../../cell';
import type { HeaderCell } from '../../cell/header-cell';
import type { Node } from '../../facet/layout/node';
import type { BaseEvent } from '../../interaction/base-event';
import type { SpreadSheet } from '../../sheet-type';
import type { ResizeInteractionOptions } from './resize';
import type { ViewMeta } from './basic';

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
  [key: string]: unknown;
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
  NodeX?: number;
  NodeY?: number;
}

export interface BrushRange {
  start: BrushPoint;
  end: BrushPoint;
  width: number;
  height: number;
}

export type StateShapeLayer = 'interactiveBgShape' | 'interactiveBorderShape';

export type Intercept = InterceptType[keyof InterceptType];

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

export interface HoverFocusOptions {
  duration?: number;
}

export interface InteractionOptions {
  // record which row/col field need extra link info
  linkFields?: string[];
  // focus selected cell, like the spotlight
  selectedCellsSpotlight?: boolean;
  // highlight all row header cells and column header cells to which the hovered cell belongs
  hoverHighlight?: boolean;
  // keep cell hovered after 800ms duration
  hoverFocus?: boolean | HoverFocusOptions;
  // enable Command + C to copy spread data
  enableCopy?: boolean;
  // copy with filed format
  copyWithFormat?: boolean;
  // copy with header info
  copyWithHeader?: boolean;
  // auto reset sheet style when click outside or press ecs key, default true
  autoResetSheetStyle?: boolean;
  hiddenColumnFields?: string[];
  // the ratio to control scroll speed, default set to 1
  scrollSpeedRatio?: ScrollSpeedRatio;
  // enable resize area, default set to all enable
  resize?: boolean | ResizeInteractionOptions;
  // enable mouse drag brush selection on data cell
  brushSelection?: boolean;
  // enable mouse drag brush selection on row cell
  rowBrushSelection?: boolean;
  // enable mouse drag brush selection on coll cell
  colBrushSelection?: boolean;
  // enable Command / Ctrl + click multi selection
  multiSelection?: boolean;
  // enable Shift + click multi selection
  rangeSelection?: boolean;
  // use arrow keyboard to move selected cell
  selectedCellMove?: boolean;
  // controls scrollbar's position type
  scrollbarPosition?: ScrollbarPositionType;
  // An object that specifies characteristics about the event listener
  // https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget/addEventListener
  eventListenerOptions?: boolean | AddEventListenerOptions;
  // highlight col and row header for selected cell
  selectedCellHighlight?: boolean;
  // https://developer.mozilla.org/en-US/docs/Web/CSS/overscroll-behavior
  overscrollBehavior?: 'auto' | 'none' | 'contain';
  /** ***********CUSTOM INTERACTION HOOKS**************** */
  // register custom interactions
  customInteractions?: CustomInteraction[];
}
