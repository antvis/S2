export interface Selection {
  sheet: number;
  startRow: number;
  startCol: number;
  endRow: number;
  endCol: number;
}

export type InteractionState = 'idle' | 'selecting' | 'editing';

export interface HitResult {
  type: 'cell' | 'rowHeader' | 'colHeader' | 'empty';
  row: number;
  col: number;
}
