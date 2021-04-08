import { Event, LooseObject } from '@antv/g-canvas';
import { get, isEmpty, set, each, find } from 'lodash';
import { S2Event, DefaultInterceptEventType } from './types';
import { BaseEvent } from './base-event';
import { StateName } from '../../state/state';

/**
 * Row header click navigation interaction
 */
export class HoverEvent extends BaseEvent {

  private hoverTimer: number = null;

  protected bindEvents() {
    this.bindDataCellHover();
  }

  private bindDataCellHover() {
    this.spreadsheet.on(S2Event.DATACELL_HOVER, (ev: Event) => {
      const cell = this.spreadsheet.getCell(ev.target);
      this.spreadsheet.clearState();
      this.changeState(cell, StateName.HOVER);
      if(this.hoverTimer) {
        window.clearTimeout(this.hoverTimer);
        this.hoverTimer = window.setTimeout(() => {
          this.changeState(cell, StateName.KEEP_HOVER);
        }, 800);
      } else {
        this.hoverTimer = window.setTimeout(() => {
          this.changeState(cell, StateName.KEEP_HOVER);
        }, 800);
      }
    })
  }

  private changeState(cell, cellName) {
    this.spreadsheet.setState(cell, cellName);
    this.spreadsheet.updateCellStyleByState();
    this.spreadsheet.container.draw();
  }
}
