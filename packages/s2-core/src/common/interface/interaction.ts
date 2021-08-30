import { BaseCell, ColCell, CornerCell, DataCell, RowCell } from '@/cell';
import { HeaderCell } from '@/cell/header-cell';
import { Node } from '@/index';
import { BaseEvent } from '@/interaction/events';
import { SpreadSheet } from '@/sheet-type';
import { InteractionStateName } from '../constant';
import { ViewMeta } from './basic';

export type S2CellType<T extends Record<string, unknown> = ViewMeta> =
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
  changedCells?: S2CellType[];
  // all the active nodes, including rendered and not rendered cells
  nodes?: Node[];
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
}

export interface BrushRange {
  start: BrushPoint;
  end: BrushPoint;
  width: number;
  height: number;
}

export type StateShapeLayer = 'interactiveBgShape' | 'interactiveBorderShape';
