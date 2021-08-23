import {
  CellTypes,
  InterceptEventType,
  InteractionKeyboardKey,
  OriginEventType,
  S2Event,
  ANT_DESIGN_PRE_CLASS,
} from '@/common/constant';
import { SpreadSheet } from '@/sheet-type';
import { getSelectedData, keyEqualTo } from '@/utils/export/copy';
import { Canvas, Event as CanvasEvent, LooseObject } from '@antv/g-canvas';
import { each, get, includes } from 'lodash';
import { RootInteraction } from '@/interaction/root';
import {
  TOOLTIP_CLASS_PRE,
  TOOLTIP_OPERATION_CLASS_PRE,
} from '@/common/tooltip/constant';

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

  // 保存hover的元素
  private hoverTarget: LooseObject;

  private canvasEventHandlers: EventHandler[] = [];

  private domEventListeners: EventListener[] = [];

  public interaction: RootInteraction;

  constructor(spreadsheet: SpreadSheet, interaction: RootInteraction) {
    this.spreadsheet = spreadsheet;
    this.interaction = interaction;
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
      (event: KeyboardEvent) => {
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
    if (this.spreadsheet.store.get('isMouseUpFromBrushSelectionEnd')) {
      this.spreadsheet.store.set('isMouseUpFromBrushSelectionEnd', false);
      return;
    }

    if (
      this.spreadsheet.container.get('el').contains(event.target) ||
      [
        ANT_DESIGN_PRE_CLASS,
        TOOLTIP_OPERATION_CLASS_PRE,
        TOOLTIP_CLASS_PRE,
      ].some((className) =>
        includes((<HTMLElement>event.target)?.className, className),
      )
    ) {
      return;
    }

    this.spreadsheet.emit(S2Event.GLOBAL_CLEAR_INTERACTION_STYLE_EFFECT);
    this.interaction.clearState();
    this.spreadsheet.hideTooltip();
    this.interaction.interceptEvent.clear();
  }

  // TODO: 需要再考虑一下应该是触发后再屏蔽？还是拦截后再触发，从我的实际重构来看，无法预料到用户的下一步操作，只能全都emit，然后再按照实际的操作把不对应的interaction屏蔽掉。
  private onCanvasMousedown = (event: CanvasEvent) => {
    this.target = event.target;
    // 任何点击都该取消hover的后续keep态
    if (this.interaction.hoverTimer) {
      clearTimeout(this.interaction.hoverTimer);
    }
    const appendInfo = get(event.target, 'attrs.appendInfo');
    if (appendInfo?.isResizer) {
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
    const appendInfo = get(event.target, 'attrs.appendInfo');
    if (appendInfo?.isResizer) {
      this.spreadsheet.emit(S2Event.GLOBAL_RESIZE_MOUSE_MOVE, event);
      return;
    }

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

      // 如果hover的cell改变了，并且当前不需要屏蔽 hover
      if (
        this.hoverTarget !== event.target &&
        !this.interaction.interceptEvent.has(InterceptEventType.HOVER)
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
    const appendInfo = get(event.target, 'attrs.appendInfo');
    if (appendInfo && appendInfo.isResizer) {
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

  public destroy() {
    this.unbindEvents();
  }

  private unbindEvents() {
    this.clearAllEvents();
  }

  private addCanvasEvent(
    eventType: string,
    handler: (ev: CanvasEvent) => void,
  ) {
    this.canvasContainer.on(eventType, handler);
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
