import {
  CustomEvent,
  FederatedPointerEvent,
  Group,
  Line,
  type DisplayObject,
  type ICanvas,
  type LineStyleProps,
} from '@antv/g';
import { each } from 'lodash';
import { OriginEventType } from '../../common/';
import type { ScrollBarTheme } from '../../common/interface/theme';
import type { PointObject, ScrollBarCfg } from './interface';

export enum ScrollType {
  ScrollChange = 'scroll-change',
  ScrollEnd = 'scroll-end',
}

export interface EventListenerReturn {
  remove: () => void;
}

export type EventHandler = {
  target: ICanvas;
  type: keyof HTMLElementEventMap;
  handler: (e: any) => void;
};

export class ScrollBar extends Group {
  // 滚动条的布局，横向 | 纵向, 非必传，默认为 false(纵向)
  public isHorizontal: boolean;

  // 滑道长度，必传
  public trackLen: number;

  // 滑块长度，必传
  public thumbLen: number;

  // scrollBar 的位置，必传
  public position: PointObject;

  // 滑块相对滑道的偏移, 非必传，默认值为 0
  public thumbOffset: number;

  // 滚动对象的长度
  public scrollTargetMaxOffset: number;

  // 滚动条样式，非必传
  public theme: ScrollBarTheme;

  public scrollBarGroup: Group;

  public trackShape: DisplayObject;

  public thumbShape: DisplayObject;

  // 鼠标 drag 过程中的开始位置
  private startPos: number;

  // 清除事件
  private clearEvents: () => void;

  private eventHandlers: EventHandler[] = [];

  private scrollFrameId: ReturnType<typeof requestAnimationFrame> | null = null;

  constructor(scrollBarCfg: ScrollBarCfg) {
    super();

    const {
      isHorizontal = false,
      trackLen,
      thumbLen,
      position,
      thumbOffset = 0,
      theme,
      scrollTargetMaxOffset,
    } = scrollBarCfg;

    this.isHorizontal = isHorizontal;
    this.thumbOffset = thumbOffset;
    this.trackLen = trackLen;
    this.thumbLen = thumbLen;
    this.position = position;
    this.theme = theme!;
    this.scrollTargetMaxOffset = scrollTargetMaxOffset;

    this.initScrollBar();
  }

  private getCoordinatesName = () => {
    const from = this.isHorizontal ? 'x1' : 'y1';
    const to = this.isHorizontal ? 'x2' : 'y2';

    return { from, to };
  };

  /**
   * Antv/g 5.0 环境下坐标修正
   *
   * 当 lineCap 设置为非 'butt' 后，实际绘制左右两端会多两个头，且不计入 getBBox 的计算
   * 如长100，strokeWidth=10，实际渲染110长度的线，getBBox 仍返回100
   */
  private getCoordinatesWithBBoxExtraPadding = () => {
    const { lineCap = 'butt', size = 0 } = this.theme;

    if (lineCap === 'butt') {
      return {
        start: this.thumbOffset,
        end: this.thumbOffset + this.thumbLen,
      };
    }

    const startPadding = this.isHorizontal ? 0 : size / 2;
    const endPadding = this.isHorizontal ? size : size / 2;

    return {
      start: this.thumbOffset + startPadding,
      end: this.thumbOffset + this.thumbLen - endPadding,
    };
  };

  /**
   * 当前滑块滑动的位置 0 ~ 1
   */
  public current = (): number => {
    const thumbRate = this.thumbLen / this.trackLen;
    const offsetRate = this.thumbOffset / this.trackLen;

    return offsetRate / (1 - thumbRate);
  };

  /**
   * 更新滑块长度
   * @param newThumbLen 新的滑道长度
   */
  public updateThumbLen = (newThumbLen: number) => {
    // 如果更新后的 thumbLen 没改变，无需执行后续逻辑
    if (this.thumbLen === newThumbLen) {
      return;
    }

    this.thumbLen = newThumbLen;
    const coordinate = this.getCoordinatesName();

    this.thumbShape.attr(coordinate.to, this.thumbOffset + newThumbLen);
    this.emitScrollChange(
      (this.thumbOffset / (this.trackLen - this.thumbLen)) *
        this.scrollTargetMaxOffset,
      false,
    );
  };

  /**
   * 更新滑块的 offset 值
   * @param offset
   */
  public updateThumbOffset = (offset: number, emitScrollChange = true) => {
    const newOffset = this.validateRange(offset);
    const isNotChanged = this.thumbOffset === newOffset && newOffset !== 0;

    if (isNotChanged) {
      return;
    }

    this.thumbOffset = newOffset;

    const { from, to } = this.getCoordinatesName();
    const { start, end } = this.getCoordinatesWithBBoxExtraPadding();

    this.thumbShape.attr({
      [from]: start,
      [to]: end,
    });

    if (emitScrollChange) {
      this.emitScrollChange(
        (newOffset / (this.trackLen - this.thumbLen)) *
          this.scrollTargetMaxOffset,
        false,
      );
    }
  };

  /**
   * 只更新位置属性，而不emit滚动事件
   * @param offset
   */
  public onlyUpdateThumbOffset = (offset: number) => {
    this.updateThumbOffset(offset, false);
  };

  public emitScrollChange = (offset: number, updateThumbOffset = true) => {
    cancelAnimationFrame(this.scrollFrameId!);

    this.scrollFrameId = requestAnimationFrame(() => {
      this.dispatchEvent(
        new CustomEvent(ScrollType.ScrollChange, {
          offset,
          updateThumbOffset,
        }),
      );
    });
  };

  protected bindEventListener = (
    target: EventTarget,
    eventType: keyof HTMLElementEventMap,
    callback: EventListenerOrEventListenerObject,
  ): EventListenerReturn => {
    target?.addEventListener(eventType, callback, false);

    return {
      remove: () => {
        target?.removeEventListener(eventType, callback, false);
      },
    };
  };

  protected addEvent = (
    target: EventHandler['target'],
    type: EventHandler['type'],
    handler: EventHandler['handler'],
  ) => {
    target.addEventListener(type, handler);
    this.eventHandlers.push({ target, type, handler });
  };

  private initScrollBar = () => {
    this.scrollBarGroup = this.createScrollBarGroup();
    this.scrollBarGroup.setPosition(this.position.x, this.position.y);

    this.bindEvents();
  };

  // 创建 scrollBar 的 group
  private createScrollBarGroup = (): Group => {
    const group = this.appendChild(
      new Group({
        className: this.isHorizontal ? 'horizontalBar' : 'verticalBar',
      }),
    );

    this.trackShape = this.createTrackShape(group);
    this.thumbShape = this.createThumbShape(group);

    return group;
  };

  // 创建滑道的 shape
  private createTrackShape = (group: Group): DisplayObject => {
    const { lineCap = 'round', trackColor, size = 0 } = this.theme;

    const baseAttrs: Omit<LineStyleProps, 'x1' | 'x2' | 'y1' | 'y2'> = {
      lineWidth: size,
      stroke: trackColor,
      lineCap,
    };

    if (this.isHorizontal) {
      return group.appendChild(
        new Line({
          style: {
            ...baseAttrs,
            x1: 0,
            y1: size / 2,
            x2: this.trackLen,
            y2: size / 2,
          },
        }),
      );
    }

    return group.appendChild(
      new Line({
        style: {
          ...baseAttrs,
          x1: size / 2,
          y1: 0,
          x2: size / 2,
          y2: this.trackLen,
        },
      }),
    );
  };

  // 创建滑块的 shape
  private createThumbShape = (group: Group): DisplayObject => {
    const { size = 0, lineCap = 'round', thumbColor } = this.theme;
    const baseAttrs: Omit<LineStyleProps, 'x1' | 'x2' | 'y1' | 'y2'> = {
      lineWidth: size,
      stroke: thumbColor,
      lineCap,
      cursor: 'default',
    };

    const { start, end } = this.getCoordinatesWithBBoxExtraPadding();

    if (this.isHorizontal) {
      return group.appendChild(
        new Line({
          style: {
            ...baseAttrs,
            x1: start,
            y1: size / 2,
            x2: end,
            y2: size / 2,
          },
        }),
      );
    }

    return group.appendChild(
      new Line({
        style: {
          ...baseAttrs,
          x1: size / 2,
          y1: start,
          x2: size / 2,
          y2: end,
        },
      }),
    );
  };

  private bindEvents = () => {
    this.addEventListener(OriginEventType.POINTER_DOWN, this.onStartEvent);
    this.addEventListener(OriginEventType.POINTER_UP, this.onPointerUp);

    this.trackShape.addEventListener('click', this.onTrackClick);
    this.thumbShape.addEventListener(
      OriginEventType.POINTER_OVER,
      this.onTrackPointerOver,
    );
    this.thumbShape.addEventListener(
      OriginEventType.POINTER_OUT,
      this.onTrackPointerOut,
    );
  };

  private onStartEvent = (e: FederatedPointerEvent) => {
    e.preventDefault();
    const { clientX, clientY } = e;

    // 将开始的点记录下来
    this.startPos = this.isHorizontal ? clientX : clientY;

    this.bindLaterEvent();
  };

  private bindLaterEvent = () => {
    const canvas = this.ownerDocument!.defaultView!;
    const containerDOM: EventTarget = document.body;

    const events: EventListenerReturn[] = [
      this.bindEventListener(
        containerDOM,
        OriginEventType.POINTER_MOVE,
        this.onPointerMove,
      ),
      this.bindEventListener(
        containerDOM,
        OriginEventType.POINTER_UP,
        this.onPointerUp,
      ),
      // 为了保证划出 canvas containerDom 时还没触发 pointerup
      this.bindEventListener(
        containerDOM,
        OriginEventType.POINTER_LEAVE,
        this.onPointerUp,
      ),
    ];

    this.addEvent(canvas, OriginEventType.POINTER_UP, this.onPointerUp);

    this.clearEvents = () => {
      events.forEach((e) => {
        e?.remove();
      });
      each(this.eventHandlers, (eh) => {
        eh.target?.removeEventListener(eh.type, eh.handler);
      });
      this.eventHandlers.length = 0;
    };
  };

  // 点击滑道的事件回调,移动滑块位置
  private onTrackClick = (event: FederatedPointerEvent) => {
    const offset = this.isHorizontal
      ? event.x - this.position.x - this.thumbLen / 2
      : event.y - this.position.y - this.thumbLen / 2;

    const newOffset = this.validateRange(offset);

    this.updateThumbOffset(newOffset);
  };

  /*
   * 拖拽滑块的事件回调
   * 这里是 dom 原生事件，绑定在 dom 元素上的
   */
  private onPointerMove = (e: { preventDefault: () => void }) => {
    e.preventDefault();

    const clientX = (e as FederatedPointerEvent).clientX;
    const clientY = (e as FederatedPointerEvent).clientY;

    // 鼠标松开的位置
    const endPos = this.isHorizontal ? clientX : clientY;
    // 滑块需要移动的距离, 由于这里是对滑块监听，所以移动的距离就是 diffDis, 如果监听对象是 container dom，则需要算比例
    const diff = endPos - this.startPos;

    // 更新 startPos
    this.startPos = endPos;
    this.updateThumbOffset(this.thumbOffset + diff);
  };

  private onPointerUp = (e: { preventDefault: () => void }) => {
    this.dispatchEvent(new CustomEvent(ScrollType.ScrollEnd, {}));
    e.preventDefault();
    this.clearEvents?.();
  };

  private onTrackPointerOver = () => {
    const { thumbHoverColor, hoverSize } = this.theme;

    this.thumbShape.attr('stroke', thumbHoverColor);
    this.thumbShape.attr('lineWidth', hoverSize);
  };

  private onTrackPointerOut = () => {
    const { thumbColor, size } = this.theme;

    this.thumbShape.attr('stroke', thumbColor);
    this.thumbShape.attr('lineWidth', size);
  };

  // 判断滑块位置是否超出滑道区域
  private validateRange = (offset: number): number => {
    let newOffset = offset;

    if (offset + this.thumbLen > this.trackLen) {
      newOffset = this.trackLen - this.thumbLen;
    } else if (offset + this.thumbLen < this.thumbLen) {
      newOffset = 0;
    }

    return newOffset;
  };
}
