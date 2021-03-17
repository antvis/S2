import BaseSpreadSheet from '../../sheet-type/base-spread-sheet';
import { includes } from 'lodash';
import { wrapBehavior } from '@antv/util';

export type EventConstructor = new (
  spreadsheet: BaseSpreadSheet,
) => BaseEvent;

export class BaseEvent {
  protected spreadsheet: BaseSpreadSheet;

  private eventListeners: any[] = [];

  constructor(spreadsheet: BaseSpreadSheet) {
    this.spreadsheet = spreadsheet;
    this.bindEvents();
  }

  protected bindEvents() {}

  protected addEventListener(target, type, handler) {
    if (target.addEventListener) {
      target.addEventListener(type, handler);
      this.eventListeners.push({ target, type, handler });
    } else {
      console.error(`Please make sure ${target} has addEventListener function`);
    }
  }

  protected draw() {
    this.spreadsheet.container.draw();
  }
}