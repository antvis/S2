export interface ScrollOffset {
  scrollX?: number;
  scrollY?: number;
  rowHeaderScrollX?: number;
}

export interface AreaRange {
  start: number;
  size: number;
}

export type CellScrollPosition = Required<ScrollOffset>;

export interface CellScrollOffset {
  deltaX?: number;
  deltaY?: number;
  offset?: number;
  offsetX: number;
  offsetY: number;
}
