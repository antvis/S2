export interface ScrollOffset {
  scrollX?: number;
  scrollY?: number;
  hRowScrollX?: number;
}

export interface S2WheelEvent extends WheelEvent {
  layerX: number;
  layerY: number;
}

export interface AreaRange {
  start: number;
  width: number;
}
