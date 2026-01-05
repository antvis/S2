import EE from '@antv/event-emitter';
import type {
  Canvas,
  FederatedPointerEvent,
  FederatedWheelEvent,
} from '@antv/g';
import { easeCubicIn as easeFunc } from '@antv/vendor/d3-ease';
import { OriginEventType } from '../../common';

/** 获取执行时间戳 */
const now = (): number => performance?.now() ?? Date.now();

/** 动画总时间 */
const TOTAL_MS = 800;

/** swipe 手势判断阈值 */
const SWIPE_TIME_GAP = 100;

/**
 * 判断是否是多点触控 (用于检测缩放手势)
 * @param evt FederatedPointerEvent
 * @returns boolean - true 表示是多点触控 (>= 2 个触摸点)
 */
const isMultiTouch = (evt: FederatedPointerEvent): boolean => {
  const nativeEvent = evt.nativeEvent as TouchEvent;

  // 检查是否是触摸事件且有多个触摸点
  return nativeEvent?.touches?.length >= 2;
};

/**
 * 移动端滚动事件
 * @see https://github.com/antvis/g-gesture/blob/next/src/event/wheel.ts
 */
export class WheelEvent extends EE {
  private canvas: Canvas;

  private panning: boolean;

  private preX: number;

  private speedX: number;

  private preY: number;

  private speedY: number;

  private lastMoveMS: number;

  private raf: number;

  constructor(canvas: Canvas) {
    super();
    this.canvas = canvas;
    this.panning = false;

    this.init();
  }

  private init() {
    this.canvas.addEventListener(
      OriginEventType.POINTER_DOWN,
      this.bindPointerDown,
    );
    this.canvas.addEventListener(
      OriginEventType.POINTER_MOVE,
      this.bindPointerMove,
    );
    this.canvas.addEventListener(
      OriginEventType.POINTER_UP,
      this.bindPointerUp,
    );
  }

  private bindPointerDown = (evt: FederatedPointerEvent) => {
    // 多点触控时 (如缩放手势), 不开始滚动, 让浏览器处理原生缩放行为
    // When multi-touch is detected (e.g., pinch-to-zoom), don't start panning
    // to allow native browser zoom behavior
    if (isMultiTouch(evt)) {
      return;
    }

    window.cancelAnimationFrame(this.raf);
    this.panning = true;

    this.preX = evt.x;
    this.preY = evt.y;
    this.speedX = 0;
    this.speedY = 0;
    this.lastMoveMS = now();
  };

  private bindPointerMove = (evt: FederatedPointerEvent) => {
    // 多点触控时 (如缩放手势), 停止滚动, 让浏览器处理原生缩放行为
    // When multi-touch is detected (e.g., pinch-to-zoom), stop panning
    // to allow native browser zoom behavior
    if (isMultiTouch(evt)) {
      this.panning = false;
      window.cancelAnimationFrame(this.raf);

      return;
    }

    if (this.panning) {
      const ms = now();
      const deltaMS = ms - this.lastMoveMS;

      const deltaX = this.preX - evt.x;
      const deltaY = this.preY - evt.y;

      this.speedX = deltaX / deltaMS;
      this.speedY = deltaY / deltaMS;

      this.preX = evt.x;
      this.preY = evt.y;
      this.lastMoveMS = ms;

      this.emit('wheel', {
        ...evt.clone(),
        x: evt.x,
        y: evt.y,
        deltaX,
        deltaY,
      } as unknown as FederatedWheelEvent);
    }
  };

  private bindPointerUp = (evt: FederatedPointerEvent) => {
    this.panning = false;

    const pointerUpMS = now();

    if (
      !this.speedX ||
      !this.speedY ||
      pointerUpMS - this.lastMoveMS >= SWIPE_TIME_GAP
    ) {
      return;
    }

    const moveLoop = () => {
      const loopStartMS = now();

      this.raf = window.requestAnimationFrame(() => {
        const ms = now();
        const ratio = (ms - pointerUpMS) / TOTAL_MS;

        if (ratio < 1) {
          const currentRatio = easeFunc(1 - ratio);
          const t = ms - loopStartMS;

          this.emit('wheel', {
            ...evt.clone(),
            x: evt.x,
            y: evt.y,
            deltaX: this.speedX * currentRatio * t,
            deltaY: this.speedY * currentRatio * t,
          } as unknown as FederatedWheelEvent);
          moveLoop();
        }
      });
    };

    moveLoop();
  };

  public destroy() {
    this.canvas.removeEventListener(
      OriginEventType.POINTER_DOWN,
      this.bindPointerDown,
    );
    this.canvas.removeEventListener(
      OriginEventType.POINTER_MOVE,
      this.bindPointerMove,
    );
    this.canvas.removeEventListener(
      OriginEventType.POINTER_UP,
      this.bindPointerUp,
    );
  }
}
