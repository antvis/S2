export interface Selection {
  sheet: number;
  startRow: number;
  startCol: number;
  endRow: number;
  endCol: number;
}

export type InteractionState = 'idle' | 'hovering' | 'selecting' | 'dragging' | 'editing';

export interface HitResult {
  type: 'cell' | 'rowHeader' | 'colHeader' | 'rowHeaderBorder' | 'colHeaderBorder' | 'empty';
  row: number;
  col: number;
}

export interface HoverInfo {
  row: number;
  col: number;
}

export interface DragInfo {
  type: 'row' | 'col';
  index: number;
  startPos: number;
  startSize: number;
}
