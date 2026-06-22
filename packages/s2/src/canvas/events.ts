import type { Selection } from '../interaction/types';

// TODO: cornerHeader / seriesNumber 现有 hit-test 没区分,等 hit-test 扩展后补充
export type CellTarget = {
  sheet: number;
  row: number;
  col: number;
  cellType: 'dataCell' | 'rowHeader' | 'colHeader';
};

export interface PointerEventPayload {
  target: CellTarget;
  x: number;
  y: number;
  button: number;
}

export interface KeyEventPayload {
  key: string;
  ctrlKey: boolean;
  shiftKey: boolean;
  metaKey: boolean;
  altKey: boolean;
}

export type CanvasEventMap = {
  // 指针交互 — 一个事件 + target.cellType 区分,替代 v2 的 5×N 个事件
  'click': PointerEventPayload;
  'doubleClick': PointerEventPayload;
  'hover': PointerEventPayload;
  'mouseDown': PointerEventPayload;
  'mouseUp': PointerEventPayload;
  'mouseMove': PointerEventPayload;

  // TODO: contextMenu — runtime 当前没监听 right-click,需要扩展 runtime
  // 'contextMenu': PointerEventPayload;

  // 框选(拖拽 selection 形成 range)
  'brushSelection': { sheet: number; selection: Selection };

  // 滚动
  'scroll': { scrollX: number; scrollY: number };

  // 键盘 — TODO: keyUp,runtime 当前没监听 keyup
  'keyDown': KeyEventPayload;
  // 'keyUp': KeyEventPayload;

  // 列宽/行高 resize
  'resize': { type: 'row' | 'col'; index: number; size: number };
  'resizeStart': { type: 'row' | 'col'; index: number };
  'resizeEnd': { type: 'row' | 'col'; index: number; size: number };

  // 渲染生命周期
  'beforeRender': Record<string, never>;
  'afterRender': Record<string, never>;

  // TODO: linkClick — 需要 hit-test 区分链接区域
  // 'linkClick': { sheet: number; row: number; col: number; url: string };

  // TODO: actionIconClick / actionIconHover — 需要 hit-test 暴露 actionIcon 区域
  // 'actionIconClick': { sheet: number; row: number; col: number; iconName: string };
  // 'actionIconHover': { sheet: number; row: number; col: number; iconName: string };
};
