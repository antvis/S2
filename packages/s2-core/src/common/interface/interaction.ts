import { DataCell, ColCell, CornerCell, RowCell } from 'src/cell';

export type S2CellType = DataCell | ColCell | CornerCell | RowCell;

export interface SelectedState {
  stateName: string;
  cells: S2CellType[];
}
