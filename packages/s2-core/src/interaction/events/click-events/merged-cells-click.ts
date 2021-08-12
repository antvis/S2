import { BaseEvent } from '../base-event';
import { S2Event } from '@/common/constant';
import { Event } from '@antv/g-canvas';

export class MergedCellsClick extends BaseEvent {
  protected bindEvents() {
    this.bindDataCellClick();
  }

  private bindDataCellClick() {
    this.spreadsheet.on(S2Event.MERGED_CELLS_CLICK, (ev: Event) => {
      ev.stopPropagation();
    });
  }
}
