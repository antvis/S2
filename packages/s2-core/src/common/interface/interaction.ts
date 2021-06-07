import { DataCell, ColCell, CornerCell, RowCell } from '@/cell';
import { SpreadSheet } from '@/sheet-type';
import { BaseInteraction } from '@/interaction/base';

export type S2CellType = DataCell | ColCell | CornerCell | RowCell;

export interface SelectedState {
  stateName: string;
  cells: S2CellType[];
}

export type InteractionConstructor = new (
  spreadsheet: SpreadSheet,
) => BaseInteraction;

export interface CustomInteraction {
  key: string;
  interaction: InteractionConstructor;
}
