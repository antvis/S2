/**
 * Create By Bruce Too
 * On 2020-10-16
 */
import { Event, IGroup, Group, IShape, Canvas } from '@antv/g-canvas';
import * as _ from '@antv/util';
import { PointObject, ScrollBarCfg, ScrollBarTheme } from './interface';
import { DEFAULT_THEME } from './style';

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

  private eventHandlers: any[] = [];

  constructor(scrollBarCfg: ScrollBarCfg) {
    super(scrollBarCfg);

    const {
      isHorizontal = false,
      trackLen,
      thumbLen,
      position,
      minThumbLen = 20,
      thumbOffset = 0,
      theme,
    } = scrollBarCfg;

    this.isHorizontal = isHorizontal;
    this.thumbOffset = thumbOffset;
    this.trackLen = trackLen;
    this.thumbLen = thumbLen;
    this.position = position;
    this.minThumbLen = minThumbLen;
    this.theme = _.deepMix({}, DEFAULT_THEME, theme);

    this.initScrollBar();
  }

  /**
   * 当前滑块滑动的位置 0 ~ 1
   */
  public current(): number {
    const thumbRate = this.thumbLen / this.trackLen;
    const offsetRate = this.thumbOffset / this.trackLen;

    return offsetRate / (1 - thumbRate);
  }

  /**
   * 更新滑道长度
   * @param newTrackLen 新的滑块长度
   */
  public updateTrackLen(newTrackLen: number) {
    // 如果更新后的 trackLen 没改变，无需执行后续逻辑
    if (this.trackLen === newTrackLen) {
      return;
    }
    // 更新滑道长度的时候，同时按比例更新滑块长度和 offset(增大视窗或者减小视窗的场景))
    const thumbRate = this.thumbLen / this.trackLen;
    const offsetRate = this.thumbOffset / this.trackLen;
    const newThumbLen = newTrackLen * thumbRate;
    const newOffset = newTrackLen * offsetRate;
    this.trackLen = newTrackLen;

    if (this.isHorizontal) {
      this.trackShape.attr('x2', newTrackLen);
    } else {
      this.trackShape.attr('y2', newTrackLen);
    }
    this.updateThumbLen(newThumbLen);
    this.updateThumbOffset(newOffset);
    this.renderNewScrollBar();
  }

  /**
   * 更新滑块长度
   * @param newThumbLen 新的滑道长度
   */
  public updateThumbLen(newThumbLen: number) {
    // 如果更新后的 thumbLen 没改变，无需执行后续逻辑
    if (this.thumbLen === newThumbLen) {
      return;
    }
    this.thumbLen = newThumbLen;
    if (this.isHorizontal) {
      this.thumbShape.attr('x2', this.thumbOffset + newThumbLen);
    } else {
      this.thumbShape.attr('y2', this.thumbOffset + newThumbLen);
    }
    this.renderNewScrollBar();
  }

  /**
   * 更新滑块的 offset 值
   * @param offset
   */
  public updateThumbOffset(offset: number) {
    const newOffset = this.validateRange(offset);
    // 如果更新后的 offset 与原值相同，则不改变
    if (this.thumbOffset === newOffset) {
      return;
    }
    this.thumbOffset = newOffset;
    if (this.isHorizontal) {
      this.thumbShape.attr({
        x1: newOffset,
        x2: newOffset + this.thumbLen,
      });
    } else {
      this.thumbShape.attr({
        y1: newOffset,
        y2: newOffset + this.thumbLen,
      });
    }
    this.renderNewScrollBar();
  }

  /**
   * 只更新位置属性，而不emit滚动事件
   * @param offset
   */
  public onlyUpdateThumbOffset(offset: number) {
    const newOffset = this.validateRange(offset);
    // 如果更新后的 offset 与原值相同，则不改变
    if (this.thumbOffset === newOffset) {
      return;
    }
    this.thumbOffset = newOffset;
    if (this.isHorizontal) {
      this.thumbShape.attr({
        x1: newOffset,
        x2: newOffset + this.thumbLen,
      });
    } else {
      this.thumbShape.attr({
        y1: newOffset,
        y2: newOffset + this.thumbLen,
      });
    }
    // 渲染
    if (this.get('canvas')) {
      this.get('canvas').draw();
    }
  }

  /**
   * 更新滑道位置
   * @param newPos 新的滑块位置
   */
  public updateScrollBarPos(newPos: PointObject) {
    if (newPos.x === this.position.x && newPos.y === this.position.y) {
      return;
    }
    this.position = newPos;
    this.scrollBarGroup.move(newPos.x, newPos.y);
    this.renderNewScrollBar();
  }

  // 绘制新的 scrollBar
  public renderNewScrollBar() {
    // 发送事件
    this.emit('scroll-change', {
      thumbOffset: this.thumbOffset,
      ratio: _.clamp(this.thumbOffset / (this.trackLen - this.thumbLen), 0, 1),
    });

    // 渲染
    if (this.get('canvas')) {
      this.get('canvas').draw();
    }
  }

  public updateTheme(theme: ScrollBarTheme) {
    this.theme = _.deepMix({}, DEFAULT_THEME, theme);
    this.thumbShape.attr('stroke', this.theme.default.thumbColor);
    this.thumbShape.attr('lineWidth', this.theme.default.size);
    this.thumbShape.attr('lineCap', this.theme.default.lineCap);
    this.get('canvas')?.draw();
  }

  // 初始化 scrollBar
  private initScrollBar() {
    this.scrollBarGroup = this.createScrollBarGroup();
    this.scrollBarGroup.move(this.position.x, this.position.y);

    // 绑定事件
    this.bindEvents();
  }

  // 创建 scrollBar 的 group
  private createScrollBarGroup(): IGroup {
    const group = this.addGroup({
      className: this.isHorizontal ? 'horizontalBar' : 'verticalBar',
    });

    this.trackShape = this.createTrackShape(group);
    this.thumbShape = this.createThumbShape(group);

    return group;
  }

  // 创建滑道的 shape
  private createTrackShape(group: IGroup): IShape {
    const { lineCap = 'round', trackColor, size } = this.theme.default;
    if (this.isHorizontal) {
      return group.addShape('line', {
        attrs: {
          x1: 0,
          y1: size / 2,
          x2: this.trackLen,
          y2: size / 2,
          lineWidth: size,
          stroke: trackColor,
          lineCap,
        },
      });
    }
    return group.addShape('line', {
      attrs: {
        x1: size / 2,
        y1: 0,
        x2: size / 2,
        y2: this.trackLen,
        lineWidth: size,
        stroke: trackColor,
        lineCap,
      },
    });
  }

  // 创建滑块的 shape
  private createThumbShape(group: IGroup): IShape {
    const { size, lineCap, thumbColor } = this.theme.default;
    if (this.isHorizontal) {
      return group.addShape('line', {
        attrs: {
          x1: this.thumbOffset,
          y1: size / 2,
          x2: this.thumbOffset + this.thumbLen,
          y2: size / 2,
          lineWidth: size,
          stroke: thumbColor,
          lineCap,
          cursor: 'default',
        },
      });
    }
    return group.addShape('line', {
      attrs: {
        x1: size / 2,
        y1: this.thumbOffset,
        x2: size / 2,
        y2: this.thumbOffset + this.thumbLen,
        lineWidth: size,
        stroke: thumbColor,
        lineCap,
        cursor: 'default',
      },
    });
  }

  // 事件绑定
  private bindEvents() {
    this.on('mousedown', this.onStartEvent(false));
    // 因为上层交叉表交互 prevent 事件，导致 container 上的 mouseup 事件没有执行，
    // 整个拖拽过程没有 cancel 掉。
    this.on('mouseup', this.onMouseUp);

    this.on('touchstart', this.onStartEvent(true));
    this.on('touchend', this.onMouseUp);
    this.trackShape.on('click', this.onTrackClick);

    this.thumbShape.on('mouseover', this.onTrackMouseOver);
    this.thumbShape.on('mouseout', this.onTrackMouseOut);
  }

  private onStartEvent = (isMobile: boolean) => (e: Event) => {
    this.isMobile = isMobile;
    // 阻止冒泡
    e.preventDefault();

    const event = this.isMobile ? _.get(e, 'touches.0', e) : e;

    const { clientX, clientY } = event;

    // 将开始的点记录下来
    this.startPos = this.isHorizontal ? clientX : clientY;

    this.bindLaterEvent();
  };

  protected addEvent(target, eventType, handler) {
    target.on(eventType, handler);
    this.eventHandlers.push({ target, type: eventType, handler });
  }

  private bindLaterEvent() {
    const canvas = this.get('canvas');
    const containerDOM = canvas.get('container');

    let events = [];
    if (this.isMobile) {
      events = [
        containerDOM.addEventListener('touchmove', this.onMouseMove),
        containerDOM.addEventListener('touchend', this.onMouseUp),
        containerDOM.addEventListener('touchcancel', this.onMouseUp),
      ];
      this.addEvent(canvas, 'touchend', this.onMouseUp);
      this.addEvent(canvas, 'touchcancel', this.onMouseUp);
    } else {
      events = [
        containerDOM.addEventListener('mousemove', this.onMouseMove),
        containerDOM.addEventListener('mouseup', this.onMouseUp),
        // 为了保证划出 canvas containerDom 时还没触发 mouseup
        containerDOM.addEventListener('mouseleave', this.onMouseUp),
      ];
      this.addEvent(canvas, 'mouseup', this.onMouseUp);
    }

    this.clearEvents = () => {
      events.forEach((e) => {
        e.remove();
      });
      _.each(this.eventHandlers, (eh) => {
        eh.target.off(eh.type, eh.handler);
      });
      this.eventHandlers.length = 0;
    };
  }

  // 点击滑道的事件回调,移动滑块位置
  private onTrackClick = (e) => {
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
  private onMouseMove = (e) => {
    e.preventDefault();

    const event = this.isMobile ? _.get(e, 'touches.0', e) : e;

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

  // 滑块鼠标松开事件回调
  private onMouseUp = (e) => {
    this.emit('scroll-finish', {});
    // 松开鼠标时，清除所有事件
    e.preventDefault();
    this.clearEvents();
  };

  private onTrackMouseOver = (e) => {
    const { thumbColor } = this.theme.hover;
    this.thumbShape.attr('stroke', thumbColor);
    this.get('canvas').draw();
  };

  private onTrackMouseOut = (e) => {
    const { thumbColor } = this.theme.default;
    this.thumbShape.attr('stroke', thumbColor);
    this.get('canvas').draw();
  };

  // 判断滑块位置是否超出滑道区域
  private validateRange(offset: number): number {
    let newOffset = offset;
    if (offset + this.thumbLen > this.trackLen) {
      newOffset = this.trackLen - this.thumbLen;
    } else if (offset + this.thumbLen < this.thumbLen) {
      newOffset = 0;
    }
    return newOffset;
  }
}
