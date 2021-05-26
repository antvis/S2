import { BaseEvent } from '../base-event';
import { S2Event, DefaultInterceptEventType } from '../types';
import { Event } from '@antv/g-canvas';

export class MergedCellsClick extends BaseEvent {
  protected bindEvents() {
    this.bindDataCellClick();
  }

  private bindDataCellClick() {
    this.spreadsheet.on(S2Event.MERGEDCELLS_CLICK, (ev: Event) => {
      ev.stopPropagation();
    });
  }
}
