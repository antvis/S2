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

export interface CellScrollToOptions {
  /**
   * 是否展示滚动动画
   */
  animate?: boolean;

  /**
   * 是否触发滚动事件
   */
  skipScrollEvent?: boolean;
}
