import { BaseCell, ColCell, CornerCell, DataCell, RowCell } from '@/cell';
import { HeaderCell } from '@/cell/header-cell';
import { Node } from '@/index';
import { Event } from '@antv/g-canvas';
import { BaseEvent, EventConstructor } from '@/interaction/base-event';
import { SpreadSheet } from '@/sheet-type';
import { SimpleBBox } from '@antv/g-canvas';
import { InteractionStateName } from '../constant';
import { ViewMeta } from './basic';

export type S2CellType<T extends SimpleBBox = ViewMeta> =
  | DataCell
  | HeaderCell
  | ColCell
  | CornerCell
  | RowCell
  | BaseCell<T>;

export interface InteractionStateInfo {
  // current state name
  stateName?: InteractionStateName;
  // all the active cells
  cells?: S2CellType[];
  // all the cells changed the state style
  interactedCells?: S2CellType[];
  // all the active nodes, including rendered and not rendered cells
  nodes?: Node[];
  // for empty cells, updates are ignored, use `force` to skip ignore
  force?: boolean;
}

export type InteractionConstructor = new (
  spreadsheet: SpreadSheet,
) => BaseEvent;

export interface CustomInteraction {
  key: string;
  interaction: EventConstructor;
}

export interface BrushPoint {
  rowIndex: number;
  colIndex: number;
  x: number;
  y: number;
}

export interface BrushRange {
  start: BrushPoint;
  end: BrushPoint;
  width: number;
  height: number;
}

export type StateShapeLayer = 'interactiveBgShape' | 'interactiveBorderShape';

export interface MultiClickParams {
  event: Event;
  spreadsheet: SpreadSheet;
  isTreeRowClick: boolean;
  isMultiSelection: boolean;
}
