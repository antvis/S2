import { BaseCell, ColCell, CornerCell, DataCell, RowCell } from '@/cell';
import { BaseInteraction } from '@/interaction/base';
import { SpreadSheet } from '@/sheet-type';
import { InteractionStateName } from '../constant';
import { ViewMeta } from './basic';
import { Node } from '@/index';

export type S2CellType<T extends Record<string, unknown> = ViewMeta> =
  | DataCell
  | ColCell
  | CornerCell
  | RowCell
  | BaseCell<T>;

export interface InteractionStateInfo {
  // current state name
  stateName?: InteractionStateName;
  // all the active cells rendered by the canvas
  cells?: S2CellType[];
  // all the active nodes, including rendered and unrendered cells
  nodes?: Node[];
}

export type InteractionConstructor = new (
  spreadsheet: SpreadSheet,
) => BaseInteraction;

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
