import { Event, LooseObject, Canvas, IElement } from '@antv/g-canvas';
import { get, each, includes } from 'lodash';
import { CellTypes } from '@/common/constant';
import { S2Event, OriginEventType, DefaultInterceptEventType } from './types';
import { SpreadSheet } from 'src/sheet-type';

interface EventListener {
  target: EventTarget;
  type: string;
  handler: EventListenerOrEventListenerObject;
}
interface EventHandler {
  target: IElement;
  type: string;
  handler: (ev: Event) => void;
}
export class EventController {
  protected spreadsheet: SpreadSheet;

  // 保存触发的元素
  private target: LooseObject;

  // 保存hover的元素
  private hoverTarget: LooseObject;

  private eventHandlers: EventHandler[] = [];

  private eventListeners: EventListener[] = [];

  constructor(spreadsheet: SpreadSheet) {
    this.spreadsheet = spreadsheet;
    this.bindEvents();
  }

  protected triggerGroup(): Canvas {
    return this.spreadsheet.container;
  }

  /**
   * All event name in the progress
   * start -> process -> end
   */
  protected getStarEvent(): string {
    return 'mousedown';
  }

  protected getProcessEvent(): string {
    return 'mousemove';
  }

  protected getEndEvent(): string {
    return 'mouseup';
  }

  protected bindEvents() {
    // 绑定 g 的事件
    this.addEvent(
      this.triggerGroup(),
      this.getStarEvent(),
      this.start.bind(this),
    );
    this.addEvent(
      this.triggerGroup(),
      this.getProcessEvent(),
      this.process.bind(this),
    );
    this.addEvent(this.triggerGroup(), this.getEndEvent(), this.end.bind(this));

    // 绑定原生事件
    this.addEventListener(
      window,
      OriginEventType.KEY_DOWN,
      (event: KeyboardEvent) => {
        this.spreadsheet.emit(S2Event.GLOBAL_KEYBOARD_DOWN, event);
      },
    );
    this.addEventListener(
      window,
      OriginEventType.KEY_UP,
      (event: KeyboardEvent) => {
        this.spreadsheet.emit(S2Event.GLOBAL_KEYBOARD_UP, event);
      },
    );
    this.addEventListener(document, 'click', (event: MouseEvent) => {
      this.resetSheetStyle(event);
    });
  }

  protected resetSheetStyle(ev: MouseEvent) {
    // TODO tooltip 隐藏判断
    if (
      ev.target !== this.spreadsheet.container.get('el') &&
      !includes((<HTMLElement>ev.target)?.className, 'eva-facet') &&
      !includes((<HTMLElement>ev.target)?.className, 'ant-menu') &&
      !includes((<HTMLElement>ev.target)?.className, 'ant-input')
    ) {
      this.spreadsheet.emit(S2Event.GLOBAL_CLEAR_INTERACTION_STYLE_EFFECT);
      this.spreadsheet.clearState();
      // this.spreadsheet.hideTooltip();
      // 屏蔽的事件都重新打开
      this.spreadsheet.interceptEvent.clear();
      this.draw();
    }
  }

  // TODO: 需要再考虑一下应该是触发后再屏蔽？还是拦截后再触发，从我的实际重构来看，无法预料到用户的下一步操作，只能全都emit，然后再按照实际的操作把不对应的interaction屏蔽掉。
  protected start(ev: Event) {
    this.target = ev.target;
    // 任何点击都该取消hover的后续keep态
    if (this.spreadsheet.hoverTimer) {
      clearTimeout(this.spreadsheet.hoverTimer);
    }
    const appendInfo = get(ev.target, 'attrs.appendInfo');
    if (appendInfo && appendInfo.isResizer) {
      this.spreadsheet.emit(S2Event.GLOBAL_RESIZE_MOUSE_DOWN, ev);
    } else {
      const cellType = this.spreadsheet.getCellType(ev.target);
      switch (cellType) {
        case CellTypes.DATA_CELL:
          this.spreadsheet.emit(S2Event.DATA_CELL_MOUSE_DOWN, ev);
          break;
        case CellTypes.ROW_CELL:
          this.spreadsheet.emit(S2Event.ROW_CELL_MOUSE_DOWN, ev);
          break;
        case CellTypes.COL_CELL:
          this.spreadsheet.emit(S2Event.COL_CELL_MOUSE_DOWN, ev);
          break;
        case CellTypes.CORNER_CELL:
          this.spreadsheet.emit(S2Event.CORNER_CELL_MOUSE_DOWN, ev);
          break;
        case CellTypes.MERGED_CELLS:
          this.spreadsheet.emit(S2Event.MERGED_CELLS_MOUSE_DOWN, ev);
          break;
        default:
          break;
      }
    }
  }

  protected process(ev: Event) {
    const appendInfo = get(ev.target, 'attrs.appendInfo');
    if (appendInfo && appendInfo.isResizer) {
      // row-col-resize
      this.spreadsheet.emit(S2Event.GLOBAL_RESIZE_MOUSE_MOVE, ev);
    } else {
      const cell = this.spreadsheet.getCell(ev.target);
      const cellType = this.spreadsheet.getCellType(ev.target);
      if (cell) {
        switch (cellType) {
          case CellTypes.DATA_CELL:
            this.spreadsheet.emit(S2Event.DATA_CELL_MOUSE_MOVE, ev);
            break;
          case CellTypes.ROW_CELL:
            this.spreadsheet.emit(S2Event.ROW_CELL_MOUSE_MOVE, ev);
            break;
          case CellTypes.COL_CELL:
            this.spreadsheet.emit(S2Event.COL_CELL_MOUSE_MOVE, ev);
            break;
          case CellTypes.CORNER_CELL:
            this.spreadsheet.emit(S2Event.CORNER_CELL_MOUSE_MOVE, ev);
            break;
          case CellTypes.MERGED_CELLS:
            this.spreadsheet.emit(S2Event.MERGED_ELLS_MOUSE_MOVE, ev);
            break;
          default:
            break;
        }

        // 如果hover的cell改变了，并且当前不需要屏蔽 hover
        if (
          this.hoverTarget !== ev.target &&
          !this.spreadsheet.interceptEvent.has(DefaultInterceptEventType.HOVER)
        ) {
          switch (cellType) {
            case CellTypes.DATA_CELL:
              this.spreadsheet.emit(S2Event.DATA_CELL_HOVER, ev);
              break;
            case CellTypes.ROW_CELL:
              this.spreadsheet.emit(S2Event.ROW_CELL_HOVER, ev);
              break;
            case CellTypes.COL_CELL:
              this.spreadsheet.emit(S2Event.COL_CELL_HOVER, ev);
              break;
            case CellTypes.CORNER_CELL:
              this.spreadsheet.emit(S2Event.CORNER_CELL_HOVER, ev);
              break;
            case CellTypes.MERGED_CELLS:
              this.spreadsheet.emit(S2Event.MERGED_CELLS_HOVER, ev);
              break;
            default:
              break;
          }
        }
      }
    }
  }

  protected end(ev: Event) {
    const appendInfo = get(ev.target, 'attrs.appendInfo');
    if (appendInfo && appendInfo.isResizer) {
      this.spreadsheet.emit(S2Event.GLOBAL_RESIZE_MOUSE_UP, ev);
    } else {
      const cell = this.spreadsheet.getCell(ev.target);
      if (cell) {
        const cellType = cell?.cellType;
        // target相同，说明是一个cell内的click事件
        if (this.target === ev.target) {
          switch (cellType) {
            case CellTypes.DATA_CELL:
              this.spreadsheet.emit(S2Event.DATA_CELL_CLICK, ev);
              break;
            case CellTypes.ROW_CELL:
              this.spreadsheet.emit(S2Event.ROW_CELL_CLICK, ev);
              break;
            case CellTypes.COL_CELL:
              this.spreadsheet.emit(S2Event.COL_CELL_CLICK, ev);
              break;
            case CellTypes.CORNER_CELL:
              this.spreadsheet.emit(S2Event.CORNER_CELL_CLICK, ev);
              break;
            case CellTypes.MERGED_CELLS:
              this.spreadsheet.emit(S2Event.MERGED_CELLS_CLICK, ev);
              break;
            default:
              break;
          }
        }

        // 通用的mouseup事件
        switch (cellType) {
          case CellTypes.DATA_CELL:
            this.spreadsheet.emit(S2Event.DATA_CELL_MOUSE_UP, ev);
            break;
          case CellTypes.ROW_CELL:
            this.spreadsheet.emit(S2Event.ROW_CELL_MOUSE_UP, ev);
            break;
          case CellTypes.COL_CELL:
            this.spreadsheet.emit(S2Event.COL_CELL_MOUSE_UP, ev);
            break;
          case CellTypes.CORNER_CELL:
            this.spreadsheet.emit(S2Event.CORNER_CELL_MOUSE_UP, ev);
            break;
          case CellTypes.MERGED_CELLS:
            this.spreadsheet.emit(S2Event.MERGED_CELLS_MOUSE_UP, ev);
            break;
          default:
            break;
        }
      }
    }
  }

  protected draw() {
    this.spreadsheet.container.draw();
  }

  public destroy() {
    this.unbindEvents();
  }

  // 解绑事件
  protected unbindEvents() {
    this.clearEvents();
  }

  /**
   * Add emit listeners for better release control
   * @param target
   * @param eventType
   * @param handler
   */
  protected addEvent(
    target: IElement,
    eventType: string,
    handler: (ev: Event) => void,
  ) {
    target.on(eventType, handler);
    this.eventHandlers.push({ target, type: eventType, handler });
  }

  /**
   * 用于绑定原生事件
   * @param target
   * @param type
   * @param handler
   */
  protected addEventListener(
    target: EventTarget,
    type: string,
    handler: EventListenerOrEventListenerObject,
  ) {
    if (target.addEventListener) {
      target.addEventListener(type, handler);
      this.eventListeners.push({ target, type, handler });
    } else {
      console.error(`Please make sure ${target} has addEventListener function`);
    }
  }

  /**
   * Auto clear all emit and event listeners, don't need clear by hand
   * @private
   */
  private clearEvents() {
    // clear Emit listener
    const eventHandlers = this.eventHandlers;
    each(eventHandlers, (eh) => {
      eh.target.off(eh.type, eh.handler);
    });
    this.eventHandlers.length = 0;

    // clear Event listener
    const eventListeners = this.eventListeners;
    each(eventListeners, (eh) => {
      eh.target.removeEventListener(eh.type, eh.handler);
    });
    this.eventListeners.length = 0;
  }
}
