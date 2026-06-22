export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface PointerEventLike {
  x: number;
  y: number;
  type: 'down' | 'move' | 'up' | 'dblclick' | 'contextmenu';
  button: number;
}

export interface WheelEventLike {
  deltaX: number;
  deltaY: number;
}

export interface KeyboardEventLike {
  key: string;
  shiftKey: boolean;
  ctrlKey: boolean;
  metaKey: boolean;
  altKey: boolean;
  preventDefault(): void;
}
