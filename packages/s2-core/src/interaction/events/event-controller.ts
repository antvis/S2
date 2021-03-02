import { Event, Canvas, LooseObject } from '@antv/g-canvas';
import * as _ from '@antv/util';
import { BaseCell, DataCell, ColCell, CornerCell, RowCell } from '../../cell';
import {
  S2Event,
  OriginEventType,
  DefaultEvent,
  DefaultEventType,
} from './types';
import BaseSpreadSheet from '../../sheet-type/base-spread-sheet';
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
    this.addEventListener(window, OriginEventType.KEY_DOWN, (event) => {
      this.spreadsheet.emit(S2Event.GLOBAL_KEBOARDDOWN, event);
    });
    this.addEventListener(window, OriginEventType.KEY_UP, (event) => {
      this.spreadsheet.emit(S2Event.GLOBAL_KEBOARDUP, event);
    });
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
    const appendInfo = _.get(ev.target, 'attrs.appendInfo');
    if(appendInfo && appendInfo.isResizer) {
      this.spreadsheet.emit(S2Event.GLOBAL_RESIZE_MOUSEDOWN, ev);
    } else {
      const cellType = this.getCellType(ev.target);
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
    const appendInfo = _.get(ev.target, 'attrs.appendInfo');
    if(appendInfo && appendInfo.isResizer) {
      this.spreadsheet.emit(S2Event.GLOBAL_RESIZE_MOUSEMOVE, ev);
    } else {
      const cell = this.getCell(ev.target);
      if (cell) {
        // 如果hover的cell改变了，并且当前不需要屏蔽 hover
        if (
          this.hoverTarget !== ev.target &&
          !this.interceptEvent.has(DefaultEventType.HOVER)
        ) {
          this.hoverTarget = ev.target;
          this.spreadsheet.clearState();
          this.spreadsheet.setState(cell, 'hover');
          this.spreadsheet.updateCellStyleByState();
          this.draw();
        }
        const cellType = this.getCellType(ev.target);
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
    const appendInfo = _.get(ev.target, 'attrs.appendInfo');
    if(appendInfo && appendInfo.isResizer) {
      this.spreadsheet.emit(S2Event.GLOBAL_RESIZE_MOUSEUP, ev);
    } else {
      const cell = this.getCell(ev.target);
      if (cell) {
        const cellType = this.getCellType(ev.target);
        // target相同，说明是一个cell内的click事件
        if (this.target === ev.target) {
          switch (cellType) {
            case DataCell.name:
              const meta = cell.getMeta();
              this.spreadsheet.emit(S2Event.DATACELL_CLICK, {
                viewMeta: meta,
                rowQuery: meta.rowQuery,
                colQuery: meta.colQuery,
              });
              break;
            case RowCell.name:
              this.spreadsheet.emit(S2Event.ROWCELL_CLICK, {
                viewMeta: cell.getMeta(),
                query: cell.getMeta().query,
              });
              break;
            case ColCell.name:
              this.spreadsheet.emit(S2Event.COLCELL_CLICK, {
                viewMeta: cell.getMeta(),
                query: cell.getMeta().query,
              });
              break;
            case CornerCell.name:
              this.spreadsheet.emit(S2Event.CORNER_CLICK, {
                viewMeta: cell.getMeta(),
              });
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

  // 获取当前cell实例
  public getCell(target) {
    let parent = target.get('parent');
    // 一直索引到g顶层的canvas来检查是否在指定的cell中
    while (parent && !(parent instanceof Canvas)) {
      if (parent instanceof BaseCell) {
        // 在单元格中，返回true
        return parent;
      }
      parent = parent.get('parent');
    }
    return null;
  }

  // 解绑事件
  protected unbindEvents() {
    this._clearEvents();
  }

  // 获取当前cell的类型
  public getCellType(target) {
    const cell = this.getCell(target);
    if (cell instanceof DataCell) {
      return DataCell.name;
    }
    if (cell instanceof RowCell) {
      return RowCell.name;
    }
    if (cell instanceof ColCell) {
      return ColCell.name;
    }
    if (cell instanceof CornerCell) {
      return CornerCell.name;
    }
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
  private _clearEvents() {
    // clear Emit listener
    const eventHandlers = this.eventHandlers;
    _.each(eventHandlers, (eh) => {
      eh.target.off(eh.type, eh.handler);
    });
    this.eventHandlers.length = 0;

    // clear Event listener
    const eventListeners = this.eventListeners;
    _.each(eventListeners, (eh) => {
      eh.target.removeEventListener(eh.type, eh.handler);
    });
    this.eventListeners.length = 0;
  }
}
