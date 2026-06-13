import type { PointerEventLike, Rect, WheelEventLike } from './types';

export interface CanvasRuntime {
  getContext(): CanvasRenderingContext2D;
  getWidth(): number;
  getHeight(): number;
  getDPR(): number;
  markDirty(region?: Rect): void;
  requestRepaint(paintFn: () => void): void;
  onWheel(handler: (e: WheelEventLike) => void): void;
  onPointer(handler: (e: PointerEventLike) => void): void;
  resize(width: number, height: number): void;
  destroy(): void;
}

export function createCanvasRuntime(container: HTMLElement): CanvasRuntime {
  const dpr = window.devicePixelRatio || 1;
  const canvas = document.createElement('canvas');
  canvas.style.display = 'block';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  container.appendChild(canvas);

  const ctx = canvas.getContext('2d')!;
  let width = container.clientWidth;
  let height = container.clientHeight;
  let rafId: number | null = null;
  let dirty = true;

  function applySize(): void {
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
  }

  applySize();

  const wheelHandlers: ((e: WheelEventLike) => void)[] = [];
  const pointerHandlers: ((e: PointerEventLike) => void)[] = [];

  canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    // Support shift+wheel as horizontal scroll
    let deltaX = e.deltaX;
    let deltaY = e.deltaY;
    if (e.shiftKey && deltaX === 0) {
      deltaX = deltaY;
      deltaY = 0;
    }
    const ev: WheelEventLike = { deltaX, deltaY };
    for (let i = 0, len = wheelHandlers.length; i < len; ++i) {
      wheelHandlers[i]!(ev);
    }
  }, { passive: false });

  canvas.addEventListener('pointerdown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const ev: PointerEventLike = { x: e.clientX - rect.left, y: e.clientY - rect.top, type: 'down', button: e.button };
    for (let i = 0, len = pointerHandlers.length; i < len; ++i) {
      pointerHandlers[i]!(ev);
    }
  });

  canvas.addEventListener('pointermove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const ev: PointerEventLike = { x: e.clientX - rect.left, y: e.clientY - rect.top, type: 'move', button: e.button };
    for (let i = 0, len = pointerHandlers.length; i < len; ++i) {
      pointerHandlers[i]!(ev);
    }
  });

  canvas.addEventListener('pointerup', (e) => {
    const rect = canvas.getBoundingClientRect();
    const ev: PointerEventLike = { x: e.clientX - rect.left, y: e.clientY - rect.top, type: 'up', button: e.button };
    for (let i = 0, len = pointerHandlers.length; i < len; ++i) {
      pointerHandlers[i]!(ev);
    }
  });

  canvas.addEventListener('dblclick', (e) => {
    const rect = canvas.getBoundingClientRect();
    const ev: PointerEventLike = { x: e.clientX - rect.left, y: e.clientY - rect.top, type: 'dblclick', button: 0 };
    for (let i = 0, len = pointerHandlers.length; i < len; ++i) {
      pointerHandlers[i]!(ev);
    }
  });

  return {
    getContext() { return ctx; },
    getWidth() { return width; },
    getHeight() { return height; },
    getDPR() { return dpr; },
    markDirty(_region?: Rect) { dirty = true; },
    requestRepaint(paintFn: () => void) {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        if (dirty) {
          dirty = false;
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
          paintFn();
        }
      });
    },
    onWheel(handler) { wheelHandlers.push(handler); },
    onPointer(handler) { pointerHandlers.push(handler); },
    resize(w: number, h: number) {
      width = w;
      height = h;
      applySize();
      dirty = true;
    },
    destroy() {
      if (rafId !== null) cancelAnimationFrame(rafId);
      canvas.remove();
    },
  };
}
