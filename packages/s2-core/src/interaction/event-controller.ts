import {
  Group,
  Canvas,
  Event as CanvasEvent,
  LooseObject,
} from '@antv/g-canvas';
import { each, get, isEmpty } from 'lodash';
import {
  CellTypes,
  InteractionKeyboardKey,
  InterceptType,
  OriginEventType,
  S2Event,
  SHAPE_STYLE_MAP,
} from '@/common/constant';
import { ResizeInfo } from '@/facet/header/interface';
import { SpreadSheet } from '@/sheet-type';
import { getSelectedData, keyEqualTo } from '@/utils/export/copy';

interface EventListener {
  target: EventTarget;
  type: string;
  handler: EventListenerOrEventListenerObject;
}

interface EventHandler {
  type: string;
  handler: (event: CanvasEvent) => void;
}

export class EventController {
  protected spreadsheet: SpreadSheet;

  // 保存触发的元素
  private target: LooseObject;

  private canvasEventHandlers: EventHandler[] = [];

  private domEventListeners: EventListener[] = [];

  constructor(spreadsheet: SpreadSheet) {
    this.spreadsheet = spreadsheet;
    this.bindEvents();
  }

  private get canvasContainer(): Canvas {
    return this.spreadsheet.container;
  }

  private bindEvents() {
    this.clearAllEvents();

    this.addCanvasEvent(OriginEventType.MOUSE_DOWN, this.onCanvasMousedown);
    this.addCanvasEvent(OriginEventType.MOUSE_MOVE, this.onCanvasMousemove);
    this.addCanvasEvent(OriginEventType.MOUSE_UP, this.onCanvasMouseup);
    this.addCanvasEvent(OriginEventType.DOUBLE_CLICK, this.onCanvasDoubleClick);
    this.addCanvasEvent(OriginEventType.CONTEXT_MENU, this.onCanvasContextMenu);

    this.addDomEventListener(
      document,
      OriginEventType.CLICK,
      (event: MouseEvent) => {
        this.resetSheetStyle(event);
      },
    );
    this.addDomEventListener(
      window,
      OriginEventType.KEY_DOWN,
      (event: KeyboardEvent) => {
        this.onKeyboardCopy(event);
        this.onKeyboardEsc(event);
        this.spreadsheet.emit(S2Event.GLOBAL_KEYBOARD_DOWN, event);
      },
    );
    this.addDomEventListener(
      window,
      OriginEventType.KEY_UP,
      (event: KeyboardEvent) => {
        this.spreadsheet.emit(S2Event.GLOBAL_KEYBOARD_UP, event);
      },
    );
    this.addDomEventListener(
      window,
      OriginEventType.MOUSE_UP,
      (event: MouseEvent) => {
        this.spreadsheet.emit(S2Event.GLOBAL_MOUSE_UP, event);
      },
    );
  }

  private onKeyboardCopy(event: KeyboardEvent) {
    // windows and macos copy
    if (
      this.spreadsheet.options.enableCopy &&
      keyEqualTo(event.key, InteractionKeyboardKey.COPY) &&
      (event.metaKey || event.ctrlKey)
    ) {
      this.spreadsheet.emit(
        S2Event.GLOBAL_COPIED,
        getSelectedData(this.spreadsheet),
      );
    }
  }

  private onKeyboardEsc(event: KeyboardEvent) {
    if (keyEqualTo(event.key, InteractionKeyboardKey.ESC)) {
      this.resetSheetStyle(event);
    }
  }

  private resetSheetStyle(event: Event) {
    // 全局有 mouseUp 和 click 事件, 当刷选完成后会同时触发, 当选中单元格后, 会同时触发 click 对应的 reset 事件
    // 所以如果是 刷选过程中 引起的 click(mousedown + mouseup) 事件, 则不需要重置
    const { interaction } = this.spreadsheet;
    if (interaction.hasIntercepts([InterceptType.BRUSH_SELECTION])) {
      interaction.removeIntercepts([InterceptType.BRUSH_SELECTION]);
      return;
    }

    if (
      this.isMouseOnTheTooltip(event) ||
      this.isMouseOnTheCanvasContainer(event)
    ) {
      return;
    }

    interaction.reset();
  }

  private isMouseOnTheCanvasContainer(event: Event) {
    if (event instanceof MouseEvent) {
      const canvas = this.spreadsheet.container.get('el') as HTMLCanvasElement;
      const { x, y } = canvas.getBoundingClientRect();
      // 这里不能使用 bounding rect 的 width 和 height, 高清适配后 canvas 实际宽高会变
      // 比如实际 400 * 300 => hd (800 * 600)
      // 从视觉来看, 虽然点击了空白处, 但其实还是处于 放大后的 canvas 区域, 所以还需要额外判断一下坐标
      const { width, height } = this.spreadsheet.options;
      return (
        canvas.contains(event.target as HTMLCanvasElement) &&
        event.clientX <= x + width &&
        event.clientY <= y + height
      );
    }
    return false;
  }

  private isMouseOnTheTooltip(event: Event) {
    if (!this.spreadsheet.options?.tooltip?.showTooltip) {
      return false;
    }

    const { x, y, width, height } =
      this.spreadsheet.tooltip.container?.getBoundingClientRect();

    if (event instanceof MouseEvent) {
      return (
        event.clientX >= x &&
        event.clientX <= x + width &&
        event.clientY >= y &&
        event.clientY <= y + height
      );
    }

    return false;
  }

  private isResizeArea(event: CanvasEvent) {
    const appendInfo = get(event.target, 'attrs.appendInfo') as ResizeInfo;
    return appendInfo?.isResizeArea;
  }

  private activeResizeArea(event: CanvasEvent) {
    this.resetResizeArea();
    const resizeArea = event.target as Group;
    this.spreadsheet.store.set('activeResizeArea', resizeArea);
    resizeArea.attr(
      SHAPE_STYLE_MAP.backgroundOpacity,
      this.spreadsheet.theme.resizeArea.interactionState.hover
        .backgroundOpacity,
    );
  }

  private resetResizeArea() {
    const resizeArea = this.spreadsheet.store.get('activeResizeArea');
    if (!isEmpty(resizeArea)) {
      resizeArea.attr(
        SHAPE_STYLE_MAP.backgroundOpacity,
        this.spreadsheet.theme.resizeArea.backgroundOpacity,
      );
    }
    this.spreadsheet.store.set('activeResizeArea', resizeArea);
  }

  private onCanvasMousedown = (event: CanvasEvent) => {
    this.target = event.target;
    // 任何点击都该取消hover的后续keep态
    if (this.spreadsheet.interaction.hoverTimer) {
      clearTimeout(this.spreadsheet.interaction.hoverTimer);
    }
    if (this.isResizeArea(event)) {
      this.spreadsheet.emit(S2Event.GLOBAL_RESIZE_MOUSE_DOWN, event);
      return;
    }

    const cellType = this.spreadsheet.getCellType(event.target);
    switch (cellType) {
      case CellTypes.DATA_CELL:
        this.spreadsheet.emit(S2Event.DATA_CELL_MOUSE_DOWN, event);
        break;
      case CellTypes.ROW_CELL:
        this.spreadsheet.emit(S2Event.ROW_CELL_MOUSE_DOWN, event);
        break;
      case CellTypes.COL_CELL:
        this.spreadsheet.emit(S2Event.COL_CELL_MOUSE_DOWN, event);
        break;
      case CellTypes.CORNER_CELL:
        this.spreadsheet.emit(S2Event.CORNER_CELL_MOUSE_DOWN, event);
        break;
      case CellTypes.MERGED_CELLS:
        this.spreadsheet.emit(S2Event.MERGED_CELLS_MOUSE_DOWN, event);
        break;
      default:
        break;
    }
  };

  private onCanvasMousemove = (event: CanvasEvent) => {
    if (this.isResizeArea(event)) {
      this.activeResizeArea(event);
      this.spreadsheet.emit(S2Event.GLOBAL_RESIZE_MOUSE_MOVE, event);
      return;
    }
    this.resetResizeArea();

    const cell = this.spreadsheet.getCell(event.target);
    const cellType = this.spreadsheet.getCellType(event.target);
    if (cell) {
      switch (cellType) {
        case CellTypes.DATA_CELL:
          this.spreadsheet.emit(S2Event.DATA_CELL_MOUSE_MOVE, event);
          break;
        case CellTypes.ROW_CELL:
          this.spreadsheet.emit(S2Event.ROW_CELL_MOUSE_MOVE, event);
          break;
        case CellTypes.COL_CELL:
          this.spreadsheet.emit(S2Event.COL_CELL_MOUSE_MOVE, event);
          break;
        case CellTypes.CORNER_CELL:
          this.spreadsheet.emit(S2Event.CORNER_CELL_MOUSE_MOVE, event);
          break;
        case CellTypes.MERGED_CELLS:
          this.spreadsheet.emit(S2Event.MERGED_ELLS_MOUSE_MOVE, event);
          break;
        default:
          break;
      }

      if (
        !this.spreadsheet.interaction.hasIntercepts([
          InterceptType.HOVER,
          InterceptType.BRUSH_SELECTION,
        ])
      ) {
        switch (cellType) {
          case CellTypes.DATA_CELL:
            this.spreadsheet.emit(S2Event.DATA_CELL_HOVER, event);
            break;
          case CellTypes.ROW_CELL:
            this.spreadsheet.emit(S2Event.ROW_CELL_HOVER, event);
            break;
          case CellTypes.COL_CELL:
            this.spreadsheet.emit(S2Event.COL_CELL_HOVER, event);
            break;
          case CellTypes.CORNER_CELL:
            this.spreadsheet.emit(S2Event.CORNER_CELL_HOVER, event);
            break;
          case CellTypes.MERGED_CELLS:
            this.spreadsheet.emit(S2Event.MERGED_CELLS_HOVER, event);
            break;
          default:
            break;
        }
      }
    }
  };

  private onCanvasMouseup = (event: CanvasEvent) => {
    if (this.isResizeArea(event)) {
      this.spreadsheet.emit(S2Event.GLOBAL_RESIZE_MOUSE_UP, event);
      return;
    }
    const cell = this.spreadsheet.getCell(event.target);
    if (cell) {
      const cellType = cell?.cellType;
      // target相同，说明是一个cell内的click事件
      if (this.target === event.target) {
        switch (cellType) {
          case CellTypes.DATA_CELL:
            this.spreadsheet.emit(S2Event.DATA_CELL_CLICK, event);
            break;
          case CellTypes.ROW_CELL:
            this.spreadsheet.emit(S2Event.ROW_CELL_CLICK, event);
            break;
          case CellTypes.COL_CELL:
            this.spreadsheet.emit(S2Event.COL_CELL_CLICK, event);
            break;
          case CellTypes.CORNER_CELL:
            this.spreadsheet.emit(S2Event.CORNER_CELL_CLICK, event);
            break;
          case CellTypes.MERGED_CELLS:
            this.spreadsheet.emit(S2Event.MERGED_CELLS_CLICK, event);
            break;
          default:
            break;
        }
      }

      // 通用的mouseup事件
      switch (cellType) {
        case CellTypes.DATA_CELL:
          this.spreadsheet.emit(S2Event.DATA_CELL_MOUSE_UP, event);
          break;
        case CellTypes.ROW_CELL:
          this.spreadsheet.emit(S2Event.ROW_CELL_MOUSE_UP, event);
          break;
        case CellTypes.COL_CELL:
          this.spreadsheet.emit(S2Event.COL_CELL_MOUSE_UP, event);
          break;
        case CellTypes.CORNER_CELL:
          this.spreadsheet.emit(S2Event.CORNER_CELL_MOUSE_UP, event);
          break;
        case CellTypes.MERGED_CELLS:
          this.spreadsheet.emit(S2Event.MERGED_CELLS_MOUSE_UP, event);
          break;
        default:
          break;
      }
    }
  };

  private onCanvasDoubleClick = (event: CanvasEvent) => {
    const spreadsheet = this.spreadsheet;
    if (this.isResizeArea(event)) {
      spreadsheet.emit(S2Event.GLOBAL_RESIZE_MOUSE_UP, event);
      return;
    }
    const cell = spreadsheet.getCell(event.target);
    if (cell) {
      const cellType = cell?.cellType;
      if (this.target === event.target) {
        switch (cellType) {
          case CellTypes.DATA_CELL:
            spreadsheet.emit(S2Event.DATA_CELL_DOUBLE_CLICK, event);
            break;
          case CellTypes.ROW_CELL:
            spreadsheet.emit(S2Event.ROW_CELL_DOUBLE_CLICK, event);
            break;
          case CellTypes.COL_CELL:
            spreadsheet.emit(S2Event.COL_CELL_DOUBLE_CLICK, event);
            break;
          case CellTypes.CORNER_CELL:
            spreadsheet.emit(S2Event.CORNER_CELL_DOUBLE_CLICK, event);
            break;
          case CellTypes.MERGED_CELLS:
            spreadsheet.emit(S2Event.MERGED_CELLS_DOUBLE_CLICK, event);
            break;
          default:
            break;
        }
      }
    }
  };

  private onCanvasContextMenu = (event: CanvasEvent) => {
    const spreadsheet = this.spreadsheet;
    if (this.isResizeArea(event)) {
      spreadsheet.emit(S2Event.GLOBAL_RESIZE_MOUSE_UP, event);
      return;
    }
    spreadsheet.emit(S2Event.GLOBAL_CONTEXT_MENU, event);
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

  private addDomEventListener(
    target: EventTarget,
    type: string,
    handler: EventListenerOrEventListenerObject,
  ) {
    if (target.addEventListener) {
      target.addEventListener(type, handler);
      this.domEventListeners.push({ target, type, handler });
    } else {
      // eslint-disable-next-line no-console
      console.error(`Please make sure ${target} has addEventListener function`);
    }
  }

  private clearAllEvents() {
    each(this.canvasEventHandlers, (eh) => {
      this.canvasContainer.off(eh.type, eh.handler);
    });
    this.canvasEventHandlers.length = 0;

    each(this.domEventListeners, (eh) => {
      eh.target.removeEventListener(eh.type, eh.handler);
    });
    this.domEventListeners.length = 0;
  }
}
