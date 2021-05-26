import { DataCell, ColCell, CornerCell, RowCell } from 'src/cell';
import { ViewMeta } from './index';

export type S2CellType = DataCell | ColCell | CornerCell | RowCell;

export interface Cell {
  getMeta();
  cell: S2CellType;
  meta: ViewMeta;
}
export interface SelectedState {
  stateName: string;
  cells: Cell[];
}

export interface Posision {
  x: number;
  y: number;
}
