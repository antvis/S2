import { BaseCell, ColCell, CornerCell, DataCell, RowCell } from '@/cell';
import { BaseInteraction } from '@/interaction/base';
import { SpreadSheet } from '@/sheet-type';
import { InteractionStateName } from '../constant';
import { ViewMeta } from './basic';

export type S2CellType<T extends Record<string, unknown> = ViewMeta> =
  | DataCell
  | ColCell
  | CornerCell
  | RowCell
  | BaseCell<T>;

export interface InteractionStateInfo {
  stateName?: InteractionStateName;
  cells?: S2CellType[];
}

export type InteractionConstructor = new (
  spreadsheet: SpreadSheet,
) => BaseInteraction;

export interface CustomInteraction {
  key: string;
  interaction: InteractionConstructor;
}

export interface S2CellBrushRange {
  leftX: number;
  topY: number;
  rightX: number;
  bottomY: number;
  width?: number;
  height?: number;
}
