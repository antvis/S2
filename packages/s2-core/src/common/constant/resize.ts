export const RESIZE_START_GUIDE_LINE_ID = 'RESIZE_START_GUIDE_LINE';
export const RESIZE_END_GUIDE_LINE_ID = 'RESIZE_END_GUIDE_LINE';
export const RESIZE_MASK_ID = 'RESIZE_MASK';
export const RESIZE_MIN_CELL_WIDTH = 20;
export const RESIZE_MIN_CELL_HEIGHT = 20;

// resize 时鼠标移动方向类型
export enum ResizeDirectionType {
  /** 水平方向 resize */
  Horizontal = 'col',

  /** 垂直方向 resize */
  Vertical = 'row',
}

export enum ResizeAreaEffect {
  Field = 'field',
  Cell = 'cell',
  Tree = 'tree',
  Series = 'series',
}

export enum ResizeType {
  ALL = 'all',
  CURRENT = 'current',
}
