import { DataCell, ColCell, CornerCell, RowCell } from '@/cell';
import { SpreadSheet } from '@/sheet-type';
import { BaseInteraction } from '@/interaction/base';
import { InteractionStateName } from '../constant';

export type S2CellType = DataCell | ColCell | CornerCell | RowCell;

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
