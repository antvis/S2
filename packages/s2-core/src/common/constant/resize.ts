export const RESIZE_START_GUIDE_LINE_ID = 'RESIZE_START_GUIDE_LINE';
export const RESIZE_END_GUIDE_LINE_ID = 'RESIZE_END_GUIDE_LINE';
export const RESIZE_MASK_ID = 'RESIZE_MASK';

// resize时鼠标移动方向类型
export enum ResizeDirectionType {
  Horizontal = 'col', // 水平方向resize
  Vertical = 'row', // 垂直方向resize
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
