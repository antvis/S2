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
  nodeId?: string;
  hasChildren?: boolean;
  isCollapsed?: boolean;
}

export interface HoverInfo {
  row: number;
  col: number;
}

export interface DragInfo {
  type: 'row' | 'col' | 'fill';
  index: number;
  startPos: number;
  startSize: number;
}

export interface FillDragInfo {
  sourceRange: Selection;
  startX: number;
  startY: number;
  direction: 'none' | 'row' | 'col';
  currentRow: number;
  currentCol: number;
}
