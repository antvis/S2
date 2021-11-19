import type { IElement, IGroup, IShape, ShapeAttrs } from '@antv/g-canvas';
import { Group } from '@antv/g-canvas';
import { clamp, each, get } from 'lodash';
import type { PointObject, ScrollBarCfg } from './interface';
import { ScrollBarTheme } from '@/common/interface/theme';
import { MIN_SCROLL_BAR_HEIGHT } from '@/common/constant/scroll';

export enum ScrollType {
  ScrollChange = 'scroll-change',
  ScrollEnd = 'scroll-end',
}

export interface EventListenerReturn {
  remove: () => void;
}

export interface EventHandler {
  target: IElement;
  type: keyof HTMLElementEventMap;
  handler: (e: MouseEvent | TouchEvent) => void;
}

export class ScrollBar extends Group {
  // 滚动条的布局，横向 | 纵向, 非必传，默认为 false(纵向)
  public isHorizontal: boolean;

  // 滑道长度，必传
  public trackLen: number;

  // 滑块长度，必传
  public thumbLen: number;

  // scrollBar 的位置，必传
  public position: PointObject;

  // 滑块的最小长度，非必传，默认值为 20
  public minThumbLen: number;

  // 滑块相对滑道的偏移, 非必传，默认值为 0
  public thumbOffset: number;

  // 滚动对象的长度
  public scrollTargetMaxOffset: number;

  // 滚动条样式，非必传
  public theme: ScrollBarTheme;

  public scrollBarGroup: IGroup;

  public trackShape: IShape;

  public thumbShape: IShape;

  // 鼠标 drag 过程中的开始位置
  private startPos: number;

  // 通过拖拽开始的事件是 mousedown 还是 touchstart 来决定是移动端还是 pc 端
  private isMobile = false;

  // 清除事件
  private clearEvents: () => void;

  private eventHandlers: EventHandler[] = [];

  private scrollFrameId: ReturnType<typeof requestAnimationFrame> = null;

  constructor(scrollBarCfg: ScrollBarCfg) {
    super(scrollBarCfg);

    const {
      isHorizontal = false,
      trackLen,
      thumbLen,
      position,
      minThumbLen = MIN_SCROLL_BAR_HEIGHT,
      thumbOffset = 0,
      theme,
      scrollTargetMaxOffset,
    } = scrollBarCfg;

    this.isHorizontal = isHorizontal;
    this.thumbOffset = thumbOffset;
    this.trackLen = trackLen;
    this.thumbLen = thumbLen;
    this.position = position;
    this.minThumbLen = minThumbLen;
    this.theme = theme;
    this.scrollTargetMaxOffset = scrollTargetMaxOffset;

    this.initScrollBar();
  }

  getCoordinates = () => {
    const from = this.isHorizontal ? 'x1' : 'y1';
    const to = this.isHorizontal ? 'x2' : 'y2';
    return { from, to };
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
   * 更新滑道长度
   * @param newTrackLen 新的滑块长度
   */
  public updateTrackLen = (newTrackLen: number) => {
    // 如果更新后的 trackLen 没改变，无需执行后续逻辑
    if (this.trackLen === newTrackLen) {
      return;
    }
    // 更新滑道长度的时候，同时按比例更新滑块长度和 offset(增大视窗或者减小视窗的场景))
    const thumbRate = this.thumbLen / this.trackLen;
    const offsetRate = this.thumbOffset / this.trackLen;
    const newThumbLen = newTrackLen * thumbRate;
    const newOffset = newTrackLen * offsetRate;
    this.scrollTargetMaxOffset =
      this.scrollTargetMaxOffset + this.trackLen - newTrackLen;
    this.trackLen = newTrackLen;

    const coordinate = this.getCoordinates();
    this.trackShape.attr(coordinate.to, newTrackLen);

    this.updateThumbLen(newThumbLen);
    this.updateThumbOffset(newOffset);
    this.emitScrollChange(
      (newOffset / (newTrackLen - newThumbLen)) * this.scrollTargetMaxOffset,
      false,
    );
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
    const coordinate = this.getCoordinates();
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

    const { from, to } = this.getCoordinates();
    this.thumbShape.attr({
      [from]: newOffset,
      [to]: newOffset + this.thumbLen,
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
    this.get('canvas')?.draw();
  };

  public emitScrollChange = (offset: number, updateThumbOffset = true) => {
    cancelAnimationFrame(this.scrollFrameId);

    this.scrollFrameId = requestAnimationFrame(() => {
      this.emit(ScrollType.ScrollChange, {
        offset,
        updateThumbOffset,
      });
    });
  };

  protected addEventListener = (
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
    target.on(type, handler);
    this.eventHandlers.push({ target, type, handler });
  };

  private initScrollBar = () => {
    this.scrollBarGroup = this.createScrollBarGroup();
    this.scrollBarGroup.move(this.position.x, this.position.y);

    this.bindEvents();
  };

  // 创建 scrollBar 的 group
  private createScrollBarGroup = (): IGroup => {
    const group = this.addGroup({
      className: this.isHorizontal ? 'horizontalBar' : 'verticalBar',
    });

    this.trackShape = this.createTrackShape(group);
    this.thumbShape = this.createThumbShape(group);

    return group;
  };

  // 创建滑道的 shape
  private createTrackShape = (group: IGroup): IShape => {
    const { lineCap = 'round', trackColor, size } = this.theme;

    const baseAttrs: ShapeAttrs = {
      lineWidth: size,
      stroke: trackColor,
      lineCap,
    };

    if (this.isHorizontal) {
      return group.addShape('line', {
        attrs: {
          ...baseAttrs,
          x1: 0,
          y1: size / 2,
          x2: this.trackLen,
          y2: size / 2,
        },
      });
    }
    return group.addShape('line', {
      attrs: {
        ...baseAttrs,
        x1: size / 2,
        y1: 0,
        x2: size / 2,
        y2: this.trackLen,
      },
    });
  };

  // 创建滑块的 shape
  private createThumbShape = (group: IGroup): IShape => {
    const { size, lineCap = 'round', thumbColor } = this.theme;
    const baseAttrs: ShapeAttrs = {
      lineWidth: size,
      stroke: thumbColor,
      lineCap,
      cursor: 'default',
    };

    if (this.isHorizontal) {
      return group.addShape('line', {
        attrs: {
          ...baseAttrs,
          x1: this.thumbOffset,
          y1: size / 2,
          x2: this.thumbOffset + this.thumbLen,
          y2: size / 2,
        },
      });
    }
    return group.addShape('line', {
      attrs: {
        ...baseAttrs,
        x1: size / 2,
        y1: this.thumbOffset,
        x2: size / 2,
        y2: this.thumbOffset + this.thumbLen,
      },
    });
  };

  private bindEvents = () => {
    this.on('mousedown', this.onStartEvent(false));
    // 因为上层透视表交互 prevent 事件，导致 container 上的 mouseup 事件没有执行，
    // 整个拖拽过程没有 cancel 掉。
    this.on('mouseup', this.onMouseUp);
    this.on('touchstart', this.onStartEvent(true));
    this.on('touchend', this.onMouseUp);

    this.trackShape.on('click', this.onTrackClick);
    this.thumbShape.on('mouseover', this.onTrackMouseOver);
    this.thumbShape.on('mouseout', this.onTrackMouseOut);
  };

  private onStartEvent =
    (isMobile: boolean) => (e: MouseEvent | TouchEvent) => {
      e.preventDefault();

      this.isMobile = isMobile;

      const event: MouseEvent = this.isMobile ? get(e, 'touches.0', e) : e;
      const { clientX, clientY } = event;

      // 将开始的点记录下来
      this.startPos = this.isHorizontal ? clientX : clientY;

      this.bindLaterEvent();
    };

  private bindLaterEvent = () => {
    const canvas = this.get('canvas');
    const containerDOM: EventTarget = document.body;

    let events: EventListenerReturn[] = [];
    if (this.isMobile) {
      events = [
        this.addEventListener(containerDOM, 'touchmove', this.onMouseMove),
        this.addEventListener(containerDOM, 'touchend', this.onMouseUp),
        this.addEventListener(containerDOM, 'touchcancel', this.onMouseUp),
      ];
      this.addEvent(canvas, 'touchend', this.onMouseUp);
      this.addEvent(canvas, 'touchcancel', this.onMouseUp);
    } else {
      events = [
        this.addEventListener(containerDOM, 'mousemove', this.onMouseMove),
        this.addEventListener(containerDOM, 'mouseup', this.onMouseUp),
        // 为了保证划出 canvas containerDom 时还没触发 mouseup
        this.addEventListener(containerDOM, 'mouseleave', this.onMouseUp),
      ];
      this.addEvent(canvas, 'mouseup', this.onMouseUp);
    }

    this.clearEvents = () => {
      events.forEach((e) => {
        e?.remove();
      });
      each(this.eventHandlers, (eh) => {
        eh.target?.off(eh.type, eh.handler);
      });
      this.eventHandlers.length = 0;
    };
  };

  // 点击滑道的事件回调,移动滑块位置
  private onTrackClick = (e: MouseEvent) => {
    const containerDOM = this.get('canvas').get('container');
    const rect = containerDOM.getBoundingClientRect();
    const { clientX, clientY } = e;
    const offset = this.isHorizontal
      ? clientX - rect.left - this.position.x - this.thumbLen / 2
      : clientY - rect.top - this.position.y - this.thumbLen / 2;

    const newOffset = this.validateRange(offset);
    this.updateThumbOffset(newOffset);
  };

  // 拖拽滑块的事件回调
  // 这里是 dom 原生事件，绑定在 dom 元素上的
  private onMouseMove = (e: MouseEvent) => {
    e.preventDefault();

    const event: MouseEvent = this.isMobile ? get(e, 'touches.0', e) : e;

    const clientX = event.clientX;
    const clientY = event.clientY;

    // 鼠标松开的位置
    const endPos = this.isHorizontal ? clientX : clientY;
    // 滑块需要移动的距离, 由于这里是对滑块监听，所以移动的距离就是 diffDis, 如果监听对象是 container dom，则需要算比例
    const diff = endPos - this.startPos;
    // 更新 startPos
    this.startPos = endPos;
    this.updateThumbOffset(this.thumbOffset + diff);
  };

  private onMouseUp = (e: MouseEvent) => {
    this.emit(ScrollType.ScrollEnd, {});
    e.preventDefault();
    this.clearEvents?.();
  };

  private onTrackMouseOver = () => {
    const { thumbHoverColor, hoverSize } = this.theme;
    this.thumbShape.attr('stroke', thumbHoverColor);
    this.thumbShape.attr('lineWidth', hoverSize);
  };

  private onTrackMouseOut = () => {
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
