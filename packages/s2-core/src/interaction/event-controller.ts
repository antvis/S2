import {
  Canvas,
  DisplayObject,
  type FederatedPointerEvent as CanvasEvent,
  type Group,
} from '@antv/g';
import { each, get, hasIn, isEmpty, isNil } from 'lodash';
import { CustomImage } from '../engine';
import { GuiIcon } from '../common';
import {
  CellType,
  GEventType,
  InteractionKeyboardKey,
  InterceptType,
  OriginEventType,
  S2Event,
  SHAPE_STYLE_MAP,
} from '../common/constant';
import type { EmitterType, ResizeInfo } from '../common/interface';
import type { SpreadSheet } from '../sheet-type';
<<<<<<< HEAD
import { getSelectedData } from '../utils/export/copy';
import { keyEqualTo } from '../utils/export/method';
import { getAppendInfo } from '../utils/interaction/common';
import { isMobile } from '../utils/is-mobile';
=======
import { getSelectedData, keyEqualTo } from '../utils/export/copy';
>>>>>>> origin/master
import { verifyTheElementInTooltip } from '../utils/tooltip';

interface EventListener {
  target: EventTarget;
  type: string;
  handler: EventListenerOrEventListenerObject;
  options?: AddEventListenerOptions | boolean;
}

interface S2EventHandler {
  type: keyof EmitterType;
  handler: EmitterType[keyof EmitterType];
}

interface EventHandler {
  type: string;
  handler: (event: CanvasEvent) => void;
}

export class EventController {
  public spreadsheet: SpreadSheet;

  // 保存触发的元素
  private target: CanvasEvent['target'];

  public canvasEventHandlers: EventHandler[] = [];

  public s2EventHandlers: S2EventHandler[] = [];

  public domEventListeners: EventListener[] = [];

  public isCanvasEffect = false;

  public canvasMousemoveEvent: CanvasEvent;

  constructor(spreadsheet: SpreadSheet) {
    this.spreadsheet = spreadsheet;
    this.bindEvents();
  }

  public get canvasContainer(): Canvas {
    return this.spreadsheet.container;
  }

  public get isAutoResetSheetStyle() {
    return this.spreadsheet.options.interaction?.autoResetSheetStyle;
  }

  public bindEvents() {
    this.clearAllEvents();

    // canvas events
    this.addCanvasEvent(OriginEventType.CLICK, this.onCanvasClick);
    this.addCanvasEvent(OriginEventType.MOUSE_DOWN, this.onCanvasMousedown);
    this.addCanvasEvent(OriginEventType.TOUCH_START, (event) => {
      this.target = event.target;
    });
    this.addCanvasEvent(OriginEventType.POINTER_MOVE, this.onCanvasMousemove);
    this.addCanvasEvent(OriginEventType.MOUSE_OUT, this.onCanvasMouseout);
    this.addCanvasEvent(OriginEventType.POINTER_UP, this.onCanvasMouseup);
    // TODO: g5.0 目前没支持 dbclick 事件
    this.addCanvasEvent(OriginEventType.DOUBLE_CLICK, this.onCanvasDoubleClick);
    this.addCanvasEvent(GEventType.RIGHT_MOUSE_UP, this.onCanvasContextMenu);

    // spreadsheet events
    this.addS2Event(S2Event.GLOBAL_ACTION_ICON_CLICK, () => {
      this.spreadsheet.interaction.addIntercepts([InterceptType.HOVER]);
      this.spreadsheet.interaction.clearState();
    });

    // dom events
    this.addDomEventListener(window, OriginEventType.CLICK, (event) => {
      this.resetSheetStyle(event);
      this.isCanvasEffect = this.isMouseOnTheCanvasContainer(event);
    });
    this.addDomEventListener(window, OriginEventType.KEY_DOWN, (event) => {
      this.onKeyboardCopy(event);
      this.onKeyboardEsc(event);
      this.spreadsheet.emit(S2Event.GLOBAL_KEYBOARD_DOWN, event);
    });
    this.addDomEventListener(window, OriginEventType.KEY_UP, (event) => {
      this.spreadsheet.emit(S2Event.GLOBAL_KEYBOARD_UP, event);
    });
    this.addDomEventListener(window, OriginEventType.POINTER_UP, (event) => {
      this.spreadsheet.emit(S2Event.GLOBAL_MOUSE_UP, event);
    });
    this.addDomEventListener(window, OriginEventType.POINTER_MOVE, (event) => {
      this.spreadsheet.emit(S2Event.GLOBAL_MOUSE_MOVE, event);
    });
  }

  // 不能单独判断是否 Image Shape, 用户如果自定义单元格绘制图片, 会导致判断错误
  private isGuiIconShape = (target: CanvasEvent['target']) =>
    target instanceof CustomImage && target.imgType === GuiIcon.type;

  private onKeyboardCopy(event: KeyboardEvent) {
    // windows and macos copy
    if (
      this.isCanvasEffect &&
      this.spreadsheet.options.interaction?.enableCopy &&
      // todo: 在copy header 时有问题
      keyEqualTo(event.key, InteractionKeyboardKey.COPY) &&
      (event.metaKey || event.ctrlKey)
    ) {
      const copyData = getSelectedData(this.spreadsheet);

      if (!isNil(copyData)) {
        this.spreadsheet.emit(S2Event.GLOBAL_COPIED, copyData);
      }
    }
  }

  private onKeyboardEsc(event: KeyboardEvent) {
    if (
      this.isCanvasEffect &&
      keyEqualTo(event.key, InteractionKeyboardKey.ESC)
    ) {
      this.resetSheetStyle(event);
    }
  }

  private resetSheetStyle(event: Event) {
    if (!this.isAutoResetSheetStyle || !this.spreadsheet) {
      return;
    }

    /*
     * 全局有 mouseUp 和 click 事件, 当刷选完成后会同时触发, 当选中单元格后, 会同时触发 click 对应的 reset 事件
     * 所以如果是 刷选过程中 引起的 click(mousedown + mouseup) 事件, 则不需要重置
     */
    const { interaction } = this.spreadsheet;

    if (
      interaction?.hasIntercepts?.([
        InterceptType.DATA_CELL_BRUSH_SELECTION,
        InterceptType.COL_CELL_BRUSH_SELECTION,
        InterceptType.ROW_CELL_BRUSH_SELECTION,
      ])
    ) {
      interaction?.removeIntercepts?.([
        InterceptType.DATA_CELL_BRUSH_SELECTION,
        InterceptType.ROW_CELL_BRUSH_SELECTION,
        InterceptType.COL_CELL_BRUSH_SELECTION,
      ]);

      return;
    }

    if (
      this.isMouseOnTheTooltip(event) ||
      this.isMouseOnTheCanvasContainer(event)
    ) {
      return;
    }

<<<<<<< HEAD
    this.spreadsheet.emit(S2Event.GLOBAL_RESET, event);
    interaction?.reset();
=======
    interaction.reset();
    this.spreadsheet.emit(S2Event.GLOBAL_RESET, event);
    this.spreadsheet.emit(
      S2Event.GLOBAL_SELECTED,
      interaction.getActiveCells(),
    );
>>>>>>> origin/master
  }

  private isMouseEvent(event: Event): event is MouseEvent {
    // 通过 MouseEvent 特有属性判断，避免 instanceof 失效的问题
    return hasIn(event, 'clientX') && hasIn(event, 'clientY');
  }

  private isMouseOnTheCanvasContainer(event: Event) {
    if (this.isMouseEvent(event)) {
      const canvas = this.spreadsheet.getCanvasElement();

      if (!canvas) {
        return false;
      }

      const { x, y } = canvas.getBoundingClientRect() || {};

      /*
       * 这里不能使用 bounding rect 的 width 和 height, 高清适配后 canvas 实际宽高会变
       * 比如实际 400 * 300 => hd (800 * 600)
       * 从视觉来看, 虽然点击了空白处, 但其实还是处于 放大后的 canvas 区域, 所以还需要额外判断一下坐标
       */
      const { width, height } = this.getContainerRect();

<<<<<<< HEAD
      const { target: eventTarget, clientX, clientY } = event;

=======
>>>>>>> origin/master
      return (
        (eventTarget === canvas ||
          eventTarget instanceof DisplayObject ||
          eventTarget instanceof Canvas) &&
        clientX <= x + width &&
        clientX >= x &&
        clientY <= y + height &&
        clientY >= y
      );
    }

    return false;
  }

  private getContainerRect() {
<<<<<<< HEAD
    const { maxX, maxY } = this.spreadsheet.facet?.panelBBox || {};
    const { width, height } = this.spreadsheet.options;

    return {
      width: Math.min(width!, maxX),
      height: Math.min(height!, maxY),
=======
    const { facet, options } = this.spreadsheet;
    const scrollBar = facet.hRowScrollBar || facet.hScrollBar;
    const { maxX, maxY } = facet?.panelBBox || {};
    const { width, height } = options;

    /**
     * https://github.com/antvis/S2/issues/2376
     * 横向的滚动条在表格外 (Canvas 内), 点击滚动条(含滑道区域) 不应该重置交互
     */
    const trackHeight = scrollBar?.theme?.size || 0;

    return {
      width: Math.min(width, maxX),
      height: Math.min(height, maxY + trackHeight),
>>>>>>> origin/master
    };
  }

  private isMouseOnTheTooltip(event: Event) {
    const { tooltip } = this.spreadsheet;

    if (!tooltip?.visible) {
      return false;
    }

    const { x, y, width, height } =
      this.spreadsheet.tooltip?.container?.getBoundingClientRect?.() || {};

    if (event.target instanceof Node) {
      return verifyTheElementInTooltip(
        this.spreadsheet.tooltip?.container,
        event.target,
      );
    }

    if (this.isMouseEvent(event)) {
      return (
        event.clientX >= x! &&
        event.clientX <= x! + width! &&
        event.clientY >= y! &&
        event.clientY <= y! + height!
      );
    }

    return false;
  }

  private isResizeArea(event: CanvasEvent) {
    const appendInfo = getAppendInfo(event.target as DisplayObject);

    return appendInfo?.isResizeArea;
  }

  private activeResizeArea(event: CanvasEvent) {
    const appendInfo = get(
      event.target,
      'attrs.appendInfo',
    ) as unknown as ResizeInfo;

    if (appendInfo?.isResizeMask) {
      return;
    }

    this.resetResizeArea();
    const resizeArea = event.target as Group;

    this.spreadsheet.store.set('activeResizeArea', resizeArea);
    resizeArea.attr(
      SHAPE_STYLE_MAP.backgroundOpacity,
      this.spreadsheet.theme.resizeArea?.interactionState?.hover
        ?.backgroundOpacity,
    );
  }

  private resetResizeArea() {
    const resizeArea = this.spreadsheet.store.get('activeResizeArea');

    if (!isEmpty(resizeArea)) {
      resizeArea.attr(
        SHAPE_STYLE_MAP.backgroundOpacity,
        this.spreadsheet.theme.resizeArea?.backgroundOpacity,
      );
    }

    this.spreadsheet.store.set('activeResizeArea', resizeArea);
  }

  private onCanvasMousedown = (event: CanvasEvent) => {
    this.target = event.target;
    // 点击时清除 hover focus 状态
    this.spreadsheet.interaction.clearHoverTimer();

    if (this.isResizeArea(event)) {
      this.spreadsheet.emit(S2Event.LAYOUT_RESIZE_MOUSE_DOWN, event);

<<<<<<< HEAD
      // 仅捕获在 Canvas 之外触发的事件 https://github.com/antvis/S2/issues/1592
      const resizeMouseMoveCapture = (pointerEvent: PointerEvent) => {
=======
      // 仅捕获在 canvas 之外触发的事件 https://github.com/antvis/S2/issues/1592
      const resizeMouseMoveCapture = (mouseEvent: MouseEvent) => {
>>>>>>> origin/master
        if (!this.spreadsheet.getCanvasElement()) {
          return false;
        }

        if (this.spreadsheet.getCanvasElement() !== pointerEvent.target) {
          this.spreadsheet.emit(S2Event.LAYOUT_RESIZE_MOUSE_MOVE, pointerEvent);
        }
      };

      window.addEventListener(
        OriginEventType.POINTER_MOVE,
        resizeMouseMoveCapture,
      );
      window.addEventListener(
        OriginEventType.POINTER_UP,
        () => {
          window.removeEventListener(
            OriginEventType.POINTER_MOVE,
            resizeMouseMoveCapture,
          );
        },
        { once: true },
      );

      return;
    }

    const cellType = this.spreadsheet.getCellType(event.target);

    switch (cellType) {
      case CellType.DATA_CELL:
        this.spreadsheet.emit(S2Event.DATA_CELL_MOUSE_DOWN, event);
        break;
      case CellType.ROW_CELL:
        this.spreadsheet.emit(S2Event.ROW_CELL_MOUSE_DOWN, event);
        break;
      case CellType.COL_CELL:
        this.spreadsheet.emit(S2Event.COL_CELL_MOUSE_DOWN, event);
        break;
      case CellType.CORNER_CELL:
        this.spreadsheet.emit(S2Event.CORNER_CELL_MOUSE_DOWN, event);
        break;
      case CellType.MERGED_CELL:
        this.spreadsheet.emit(S2Event.MERGED_CELLS_MOUSE_DOWN, event);
        break;
      default:
        break;
    }
  };

  private onCanvasMousemove = (event: CanvasEvent) => {
    this.canvasMousemoveEvent = event;

    if (this.isResizeArea(event)) {
      this.activeResizeArea(event);
      this.spreadsheet.emit(
        S2Event.LAYOUT_RESIZE_MOUSE_MOVE,
        event.nativeEvent as PointerEvent,
      );

      return;
    }

    this.resetResizeArea();

    const cell = this.spreadsheet.getCell(event.target);

    if (cell) {
      const cellType = cell.cellType;

      switch (cellType) {
        case CellType.DATA_CELL:
          this.spreadsheet.emit(S2Event.DATA_CELL_MOUSE_MOVE, event);
          break;
        case CellType.ROW_CELL:
          this.spreadsheet.emit(S2Event.ROW_CELL_MOUSE_MOVE, event);
          break;
        case CellType.COL_CELL:
          this.spreadsheet.emit(S2Event.COL_CELL_MOUSE_MOVE, event);
          break;
        case CellType.CORNER_CELL:
          this.spreadsheet.emit(S2Event.CORNER_CELL_MOUSE_MOVE, event);
          break;
        case CellType.MERGED_CELL:
          this.spreadsheet.emit(S2Event.MERGED_CELLS_MOUSE_MOVE, event);
          break;
        default:
          break;
      }

      if (!this.hasBrushSelectionIntercepts()) {
        this.spreadsheet.emit(S2Event.GLOBAL_HOVER, event);
        switch (cellType) {
          case CellType.DATA_CELL:
            this.spreadsheet.emit(S2Event.DATA_CELL_HOVER, event);
            break;
          case CellType.ROW_CELL:
            this.spreadsheet.emit(S2Event.ROW_CELL_HOVER, event);
            break;
          case CellType.COL_CELL:
            this.spreadsheet.emit(S2Event.COL_CELL_HOVER, event);
            break;
          case CellType.CORNER_CELL:
            this.spreadsheet.emit(S2Event.CORNER_CELL_HOVER, event);
            break;
          case CellType.MERGED_CELL:
            this.spreadsheet.emit(S2Event.MERGED_CELLS_HOVER, event);
            break;
          default:
            break;
        }
      }
    }
  };

  private hasBrushSelectionIntercepts() {
    return this.spreadsheet.interaction.hasIntercepts([
      InterceptType.HOVER,
      InterceptType.DATA_CELL_BRUSH_SELECTION,
      InterceptType.ROW_CELL_BRUSH_SELECTION,
      InterceptType.COL_CELL_BRUSH_SELECTION,
    ]);
  }

  private onCanvasMouseup = (event: CanvasEvent) => {
    if (this.isResizeArea(event)) {
      this.spreadsheet.emit(S2Event.LAYOUT_RESIZE_MOUSE_UP, event);

      return;
    }

    const cell = this.spreadsheet.getCell(event.target);

    if (cell) {
      const cellType = cell.cellType;

      // target相同，说明是一个cell内的 click 事件
      if (this.target === event.target) {
        const isGuiIconShape = this.isGuiIconShape(event.target);

        switch (cellType) {
          case CellType.DATA_CELL:
            this.spreadsheet.emit(S2Event.DATA_CELL_CLICK, event);
            break;
          case CellType.ROW_CELL:
            // 屏蔽 actionIcons 的点击，只有 HeaderCells 需要， DataCell 有状态类 icon， 不需要屏蔽
            if (isGuiIconShape) {
              break;
            }

            this.spreadsheet.emit(S2Event.ROW_CELL_CLICK, event);
            break;
          case CellType.COL_CELL:
            if (isGuiIconShape) {
              break;
            }

            this.spreadsheet.emit(S2Event.COL_CELL_CLICK, event);
            break;
          case CellType.CORNER_CELL:
            if (isGuiIconShape) {
              break;
            }

            this.spreadsheet.emit(S2Event.CORNER_CELL_CLICK, event);
            break;
          case CellType.MERGED_CELL:
            this.spreadsheet.emit(S2Event.MERGED_CELLS_CLICK, event);
            break;
          default:
            break;
        }
      }

      // 通用的mouseup事件
      switch (cellType) {
        case CellType.DATA_CELL:
          this.spreadsheet.emit(S2Event.DATA_CELL_MOUSE_UP, event);
          break;
        case CellType.ROW_CELL:
          this.spreadsheet.emit(S2Event.ROW_CELL_MOUSE_UP, event);
          break;
        case CellType.COL_CELL:
          this.spreadsheet.emit(S2Event.COL_CELL_MOUSE_UP, event);
          break;
        case CellType.CORNER_CELL:
          this.spreadsheet.emit(S2Event.CORNER_CELL_MOUSE_UP, event);
          break;
        case CellType.MERGED_CELL:
          this.spreadsheet.emit(S2Event.MERGED_CELLS_MOUSE_UP, event);
          break;
        default:
          break;
      }
    }
  };

  private onCanvasClick = (event: CanvasEvent) => {
    this.spreadsheet.emit(S2Event.GLOBAL_CLICK, event);
    if (isMobile()) {
      this.onCanvasMouseup(event);
    }

    // 双击的 detail 是 2
    if (event.detail === 2) {
      this.onCanvasDoubleClick(event);
    }
  };

  private onCanvasDoubleClick = (event: CanvasEvent) => {
    const spreadsheet = this.spreadsheet;

    if (this.isResizeArea(event)) {
      spreadsheet.emit(S2Event.LAYOUT_RESIZE_MOUSE_UP, event);

      return;
    }

    spreadsheet.emit(S2Event.GLOBAL_DOUBLE_CLICK, event);
    const cell = spreadsheet.getCell(event.target);

    if (cell) {
      const cellType = cell.cellType;

      if (this.target === event.target) {
        switch (cellType) {
          case CellType.DATA_CELL:
            spreadsheet.emit(S2Event.DATA_CELL_DOUBLE_CLICK, event);
            break;
          case CellType.ROW_CELL:
            spreadsheet.emit(S2Event.ROW_CELL_DOUBLE_CLICK, event);
            break;
          case CellType.COL_CELL:
            spreadsheet.emit(S2Event.COL_CELL_DOUBLE_CLICK, event);
            break;
          case CellType.CORNER_CELL:
            spreadsheet.emit(S2Event.CORNER_CELL_DOUBLE_CLICK, event);
            break;
          case CellType.MERGED_CELL:
            spreadsheet.emit(S2Event.MERGED_CELLS_DOUBLE_CLICK, event);
            break;
          default:
            break;
        }
      }
    }
  };

  private onCanvasMouseout = (event: CanvasEvent) => {
    if (
      !this.isAutoResetSheetStyle ||
      this.isMouseOnTheCanvasContainer(event as Event)
    ) {
      return;
    }

    const { interaction } = this.spreadsheet;

    // 两种情况不能重置 1. 选中单元格 2. 有 intercepts 时（重置会清空 intercepts）
    if (!interaction.isSelectedState() && !(interaction.intercepts.size > 0)) {
      interaction.reset();
    }
  };

  private onCanvasContextMenu = (event: CanvasEvent) => {
    const spreadsheet = this.spreadsheet;

    if (this.isResizeArea(event)) {
      spreadsheet.emit(S2Event.LAYOUT_RESIZE_MOUSE_UP, event);

      return;
    }

    spreadsheet.emit(S2Event.GLOBAL_CONTEXT_MENU, event);

    const cellType = this.spreadsheet.getCellType(event.target);

    switch (cellType) {
      case CellType.DATA_CELL:
        this.spreadsheet.emit(S2Event.DATA_CELL_CONTEXT_MENU, event);
        break;
      case CellType.ROW_CELL:
        this.spreadsheet.emit(S2Event.ROW_CELL_CONTEXT_MENU, event);
        break;
      case CellType.COL_CELL:
        this.spreadsheet.emit(S2Event.COL_CELL_CONTEXT_MENU, event);
        break;
      case CellType.CORNER_CELL:
        this.spreadsheet.emit(S2Event.CORNER_CELL_CONTEXT_MENU, event);
        break;
      case CellType.MERGED_CELL:
        this.spreadsheet.emit(S2Event.MERGED_CELLS_CONTEXT_MENU, event);
        break;
      default:
        break;
    }
  };

  public clear() {
    this.unbindEvents();
  }

  private unbindEvents() {
    this.clearAllEvents();
  }

  private addCanvasEvent(
    eventType: string,
    handler: (ev: CanvasEvent) => void,
  ) {
    this.canvasContainer?.on(eventType, handler);
    this.canvasEventHandlers.push({ type: eventType, handler });
  }

  private addS2Event<K extends keyof EmitterType>(
    eventType: K,
    handler: EmitterType[K],
  ) {
    this.spreadsheet.on(eventType, handler);
    this.s2EventHandlers.push({
      type: eventType,
      handler,
    });
  }

  private addDomEventListener<K extends keyof WindowEventMap>(
    target: EventTarget,
    type: K,
    handler: (event: WindowEventMap[K]) => void,
  ) {
    if (target.addEventListener) {
      const { eventListenerOptions } = this.spreadsheet.options.interaction!;

      target.addEventListener(
        type,
        handler as EventListenerOrEventListenerObject,
        eventListenerOptions,
      );
      this.domEventListeners.push({
        target,
        type,
        handler: handler as EventListenerOrEventListenerObject,
        options: eventListenerOptions,
      });
    } else {
      // eslint-disable-next-line no-console
      console.error(`Please make sure ${target} has addEventListener function`);
    }
  }

  public clearAllEvents() {
    each(this.canvasEventHandlers, ({ type, handler }) => {
      this.canvasContainer?.removeEventListener(type, handler);
    });
    each(this.s2EventHandlers, ({ type, handler }) => {
      this.spreadsheet.off(type, handler);
    });
    each(this.domEventListeners, (listener) => {
      listener.target.removeEventListener(
        listener.type,
        listener.handler,
        listener.options,
      );
    });
    this.canvasEventHandlers = [];
    this.s2EventHandlers = [];
    this.domEventListeners = [];
  }
}
