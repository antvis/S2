export interface ScrollOffset {
  scrollX?: number;
  scrollY?: number;
  hRowScrollX?: number;
}

export interface AreaRange {
  start: number;
  size: number;
}

export interface CellScrollPosition {
  scrollX: number;
  scrollY: number;
}

export interface CellScrollOffset {
  deltaX?: number;
  deltaY?: number;
  offset?: number;
  offsetX: number;
  offsetY: number;
}
