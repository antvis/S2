import { BaseCell, ColCell, CornerCell, DataCell, RowCell } from '@/cell';
import { BaseInteraction } from '@/interaction/base';
import { SpreadSheet } from '@/sheet-type';
import { InteractionStateName } from '../constant';
import { ViewMeta } from './basic';

export type S2CellType =
  | DataCell
  | ColCell
  | CornerCell
  | RowCell
  | BaseCell<ViewMeta>;

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

export interface InteractionMaskRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface InteractionMaskRectPosition {
  x: number;
  y: number;
}
