export interface CellStyle {
  bold?: boolean;
  color?: string;
  backgroundColor?: string;
}

export interface CellState {
  value?: string | number | boolean | null;
  formula?: string;
  computedValue?: string | number | boolean | null;
  style?: CellStyle;
}

export interface RowState {
  height?: number;
  hidden?: boolean;
}

export interface ColumnState {
  width?: number;
  hidden?: boolean;
}

export interface MergeRange {
  startRow: number;
  endRow: number;
  startCol: number;
  endCol: number;
}

export interface SheetState {
  id: string;
  name: string;
  cells: Sparse<Sparse<CellState>>;
  rows: Sparse<RowState>;
  columns: Sparse<ColumnState>;
  merges: MergeRange[];
}

export interface WorkbookState {
  sheets: SheetState[];
  activeSheet: number;
}

export type Sparse<T> = Map<number, T>;
