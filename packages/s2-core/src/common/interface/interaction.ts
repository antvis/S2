import type { SimpleBBox } from '@antv/g-canvas';
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
import type { RootInteraction } from '../../interaction';
import type { BaseEvent } from '../../interaction/base-event';
import type { SpreadSheet } from '../../sheet-type';
import type {
  CellTypes,
  InteractionStateName,
  InterceptType,
  ScrollbarPositionType,
} from '../constant';
import type { ViewMeta } from './basic';
import type { ResizeInteractionOptions } from './resize';

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
  rowQuery?: Record<string, any>;
  [key: string]: unknown;
}

export type OnUpdateCells = (
  root: RootInteraction,
  defaultOnUpdateCells: () => void,
) => void;

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
  /** 交互行为改变后，会被更新和重绘的单元格回调 */
  onUpdateCells?: OnUpdateCells;
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

export interface Rect {
  maxX: number;
  minX: number;
  maxY: number;
  minY: number;
}

export interface BrushPoint {
  rowIndex: number;
  colIndex: number;
  x: number;
  y: number;
  scrollX?: number;
  scrollY?: number;
  /** 用于标记 row cell 和 col cell 点的 x, y 坐标 */
  headerX?: number;
  headerY?: number;
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

export interface BrushSelection {
  data?: boolean;
  row?: boolean;
  col?: boolean;
}

export interface BrushSelectionInfo {
  dataBrushSelection: boolean;
  rowBrushSelection: boolean;
  colBrushSelection: boolean;
}

export interface InteractionOptions {
  // record which row/col field need extra link info
  linkFields?: string[] | ((meta: Node | ViewMeta) => boolean);
  // focus selected cell, like the spotlight
  selectedCellsSpotlight?: boolean;
  // highlight all row header cells and column header cells to which the hovered cell belongs
  hoverHighlight?: boolean | InteractionCellHighlight;
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
  // enable mouse drag brush selection on data cell, row cell, col cell
  brushSelection?: boolean | BrushSelection;
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
  selectedCellHighlight?: boolean | InteractionCellHighlight;
  // https://developer.mozilla.org/en-US/docs/Web/CSS/overscroll-behavior
  overscrollBehavior?: 'auto' | 'none' | 'contain';
  // trigger hover after scroll
  hoverAfterScroll?: boolean;
  /** ***********CUSTOM INTERACTION HOOKS**************** */
  // register custom interactions
  customInteractions?: CustomInteraction[];
}

export interface InteractionCellHighlight {
  rowHeader?: boolean; // 高亮行头
  colHeader?: boolean; // 高亮列头
  currentRow?: boolean; // 高亮选中单元格所在行
  currentCol?: boolean; // 高亮选中单元格所在列
}
