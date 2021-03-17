import { Event, Canvas, LooseObject } from '@antv/g-canvas';
import { get, each, includes } from 'lodash';
import { BaseCell, DataCell, ColCell, CornerCell, RowCell } from '../../cell';
import { wrapBehavior } from '@antv/util';
import {
  S2Event,
  OriginEventType,
  DefaultEvent,
  DefaultEventType,
} from './types';
import BaseSpreadSheet from '../../sheet-type/base-spread-sheet';
import { StateName } from '../../state/state'
export class EventController {
  protected spreadsheet: BaseSpreadSheet;
  // 保存触发的元素
  private target: LooseObject;
  // 保存hover的元素
  private hoverTarget: LooseObject;
  private eventHandlers: any[] = [];
  private eventListeners: any[] = [];
  // 用来标记需要拦截的事件，interaction和本身的hover等事件可能会有冲突，在interaction
  public interceptEvent: Set<DefaultEvent> = new Set();

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
    this.addEventListener(window, OriginEventType.KEY_DOWN, (event: KeyboardEvent) => {
      this.spreadsheet.emit(S2Event.GLOBAL_KEYBOARDDOWN, event);
    });
    this.addEventListener(window, OriginEventType.KEY_UP, (event: KeyboardEvent) => {
      this.spreadsheet.emit(S2Event.GLOBAL_KEYBOARDUP, event);
    });
    this.addEventListener(
      document,
      'click',
      wrapBehavior(this, 'resetSheetStyle')
    );
  }

  protected resetSheetStyle(ev) {
    if (
      ev.target !== this.spreadsheet.container.get('el') &&
      !includes(ev.target?.className, 'eva-facet') &&
      !includes(ev.target?.className, 'ant-menu') &&
      !includes(ev.target?.className, 'ant-input')
    ) {
      this.spreadsheet.emit(S2Event.GLOBAL_CLEAR_INTERACTION_STYLE_EFFECT);
      this.spreadsheet.clearState();
      this.spreadsheet.hideTooltip();
      // 屏蔽的事件都重新打开
      this.spreadsheet.eventController.interceptEvent.clear();
      this.draw();
    }
  }

  /**
   * Add emit listeners for better release control
   * @param target
   * @param eventType
   * @param handler
   */
  protected addEvent(target, eventType, handler) {
    target.on(eventType, handler);
    this.eventHandlers.push({ target, type: eventType, handler });
  }

  protected start(ev: Event) {
    this.target = ev.target;
    const appendInfo = get(ev.target, 'attrs.appendInfo');
    if(appendInfo && appendInfo.isResizer) {
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
          return;
      }
    }
  }

  protected process(ev: Event) {
    const appendInfo = get(ev.target, 'attrs.appendInfo');
    if(appendInfo && appendInfo.isResizer) {
      // row-col-resize
      this.spreadsheet.emit(S2Event.GLOBAL_RESIZE_MOUSEMOVE, ev);
    } else {
      const cell = this.spreadsheet.getCell(ev.target);
      if (cell) {
        // 如果hover的cell改变了，并且当前不需要屏蔽 hover
        if (
          this.hoverTarget !== ev.target &&
          !this.interceptEvent.has(DefaultEventType.HOVER)
        ) {
          this.hoverTarget = ev.target;
          this.spreadsheet.clearState();
          this.spreadsheet.setState(cell, StateName.HOVER);
          this.spreadsheet.updateCellStyleByState();
          this.draw();
        }
        const cellType = this.spreadsheet.getCellType(ev.target);
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
            return;
        }
      }
    }
  }

  protected end(ev: Event) {
    const appendInfo = get(ev.target, 'attrs.appendInfo');
    if(appendInfo && appendInfo.isResizer) {
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
            return;
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
   * 用于绑定原生事件
   * @param target
   * @param type
   * @param handler
   */
  protected addEventListener(target, type, handler) {
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
