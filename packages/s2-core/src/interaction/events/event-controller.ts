import { Event, LooseObject, Canvas, IElement } from '@antv/g-canvas';
import { get, each, includes } from 'lodash';
import { DataCell, ColCell, CornerCell, RowCell } from '../../cell';
import { S2Event, OriginEventType, DefaultInterceptEventType } from './types';
import BaseSpreadSheet from '../../sheet-type/base-spread-sheet';

interface EventListener {
  target: EventTarget;
  type: string;
  handler: EventListenerOrEventListenerObject;
}
interface EventHandler {
  target: IElement;
  type: string;
  handler: Function;
}
export class EventController {
  protected spreadsheet: BaseSpreadSheet;

  // 保存触发的元素
  private target: LooseObject;

  // 保存hover的元素
  private hoverTarget: LooseObject;

  private eventHandlers: EventHandler[] = [];

  private eventListeners: EventListener[] = [];

  constructor(spreadsheet: BaseSpreadSheet) {
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
        this.spreadsheet.emit(S2Event.GLOBAL_KEYBOARDDOWN, event);
      },
    );
    this.addEventListener(
      window,
      OriginEventType.KEY_UP,
      (event: KeyboardEvent) => {
        this.spreadsheet.emit(S2Event.GLOBAL_KEYBOARDUP, event);
      },
    );
    this.addEventListener(document, 'click', (event: MouseEvent) => {
      this.resetSheetStyle(event);
    });
  }

  protected resetSheetStyle(ev: MouseEvent) {
    if (
      ev.target !== this.spreadsheet.container.get('el') &&
      !includes((<HTMLElement>ev.target)?.className, 'eva-facet') &&
      !includes((<HTMLElement>ev.target)?.className, 'ant-menu') &&
      !includes((<HTMLElement>ev.target)?.className, 'ant-input')
    ) {
      this.spreadsheet.emit(S2Event.GLOBAL_CLEAR_INTERACTION_STYLE_EFFECT);
      this.spreadsheet.clearState();
      this.spreadsheet.hideTooltip();
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
      this.spreadsheet.emit(S2Event.GLOBAL_RESIZE_MOUSEDOWN, ev);
    } else {
      const cellType = this.spreadsheet.getCellType(ev.target);
      switch (cellType) {
        case DataCell.name:
          this.spreadsheet.emit(S2Event.DATACELL_MOUSEDOWN, ev);
          break;
        case RowCell.name:
          this.spreadsheet.emit(S2Event.ROWCELL_MOUSEDOWN, ev);
          break;
        case ColCell.name:
          this.spreadsheet.emit(S2Event.COLCELL_MOUSEDOWN, ev);
          break;
        case CornerCell.name:
          this.spreadsheet.emit(S2Event.CORNER_MOUSEDOWN, ev);
          break;
        default:
      }
    }
  }

  protected process(ev: Event) {
    const appendInfo = get(ev.target, 'attrs.appendInfo');
    if (appendInfo && appendInfo.isResizer) {
      // row-col-resize
      this.spreadsheet.emit(S2Event.GLOBAL_RESIZE_MOUSEMOVE, ev);
    } else {
      const cell = this.spreadsheet.getCell(ev.target);
      const cellType = this.spreadsheet.getCellType(ev.target);
      if (cell) {
        switch (cellType) {
          case DataCell.name:
            this.spreadsheet.emit(S2Event.DATACELL_MOUSEMOVE, ev);
            break;
          case RowCell.name:
            this.spreadsheet.emit(S2Event.ROWCELL_MOUSEMOVE, ev);
            break;
          case ColCell.name:
            this.spreadsheet.emit(S2Event.COLCELL_MOUSEMOVE, ev);
            break;
          case CornerCell.name:
            this.spreadsheet.emit(S2Event.CORNER_MOUSEMOVE, ev);
            break;
          default:
        }

        // 如果hover的cell改变了，并且当前不需要屏蔽 hover
        if (
          this.hoverTarget !== ev.target &&
          !this.spreadsheet.interceptEvent.has(DefaultInterceptEventType.HOVER)
        ) {
          switch (cellType) {
            case DataCell.name:
              this.spreadsheet.emit(S2Event.DATACELL_HOVER, ev);
              break;
            case RowCell.name:
              this.spreadsheet.emit(S2Event.ROWCELL_HOVER, ev);
              break;
            case ColCell.name:
              this.spreadsheet.emit(S2Event.COLCELL_HOVER, ev);
              break;
            case CornerCell.name:
              this.spreadsheet.emit(S2Event.CORNER_HOVER, ev);
              break;
            default:
          }
        }
      }
    }
  }

  protected end(ev: Event) {
    const appendInfo = get(ev.target, 'attrs.appendInfo');
    if (appendInfo && appendInfo.isResizer) {
      this.spreadsheet.emit(S2Event.GLOBAL_RESIZE_MOUSEUP, ev);
    } else {
      const cell = this.spreadsheet.getCell(ev.target);
      if (cell) {
        const cellType = this.spreadsheet.getCellType(ev.target);
        // target相同，说明是一个cell内的click事件
        if (this.target === ev.target) {
          switch (cellType) {
            case DataCell.name:
              this.spreadsheet.emit(S2Event.DATACELL_CLICK, ev);
              break;
            case RowCell.name:
              this.spreadsheet.emit(S2Event.ROWCELL_CLICK, ev);
              break;
            case ColCell.name:
              this.spreadsheet.emit(S2Event.COLCELL_CLICK, ev);
              break;
            case CornerCell.name:
              this.spreadsheet.emit(S2Event.CORNER_CLICK, ev);
              break;
            default:
              return;
          }
        }

        // 通用的mouseup事件
        switch (cellType) {
          case DataCell.name:
            this.spreadsheet.emit(S2Event.DATACELL_MOUSEUP, ev);
            break;
          case RowCell.name:
            this.spreadsheet.emit(S2Event.ROWCELL_MOUSEUP, ev);
            break;
          case ColCell.name:
            this.spreadsheet.emit(S2Event.COLCELL_MOUSEUP, ev);
            break;
          case CornerCell.name:
            this.spreadsheet.emit(S2Event.CORNER_MOUSEUP, ev);
            break;
          default:
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
  protected addEvent(target: IElement, eventType: string, handler: Function) {
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
