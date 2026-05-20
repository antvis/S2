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
 * 判断是否应该阻止默认滚动行为的回调函数类型
 * @param deltaX 水平滚动距离
 * @param deltaY 垂直滚动距离
 * @param offsetX 触摸点 X 坐标
 * @param offsetY 触摸点 Y 坐标
 * @returns boolean - true 表示应该阻止默认行为
 */
export type ShouldPreventDefaultCallback = (
  deltaX: number,
  deltaY: number,
  offsetX: number,
  offsetY: number,
) => boolean;

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

  private shouldPreventDefault?: ShouldPreventDefaultCallback;

  constructor(
    canvas: Canvas,
    shouldPreventDefault?: ShouldPreventDefaultCallback,
  ) {
    super();
    this.canvas = canvas;
    this.panning = false;
    this.shouldPreventDefault = shouldPreventDefault;

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
      const nativeEvent = evt.nativeEvent;
      const ms = now();
      const deltaMS = ms - this.lastMoveMS;

      const deltaX = this.preX - evt.x;
      const deltaY = this.preY - evt.y;

      // https://github.com/antvis/S2/issues/3249
      // 根据回调判断是否阻止默认滚动行为
      // 必须在事件链早期调用，否则浏览器的 passive 事件监听器会接管滚动
      if (nativeEvent?.cancelable) {
        const shouldPrevent =
          this.shouldPreventDefault?.(deltaX, deltaY, evt.x, evt.y) ?? true;

        if (shouldPrevent) {
          (nativeEvent as Event).preventDefault?.();
        }
      }

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
        // 传递原生事件用于移动端 preventDefault
        nativeEvent,
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
