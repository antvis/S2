import { S2Event, DefaultInterceptEventType } from '@/common/constant';
import { BaseEvent } from '../base-event';
import { handleRowColClick } from '@/utils/interaction/multi-click';
import { Event } from '@antv/g-canvas';

export class RowColumnClick extends BaseEvent {
  protected bindEvents() {
    this.bindColCellClick();
    this.bindRowCellClick();
    this.bindResetSheetStyle();
  }

  private bindRowCellClick() {
    this.spreadsheet.on(S2Event.ROW_CELL_CLICK, (event: Event) => {
      if (
        this.interaction.interceptEvent.has(DefaultInterceptEventType.CLICK)
      ) {
        return;
      }
      handleRowColClick(event, this.spreadsheet);
    });
  }

  private bindColCellClick() {
    if (this.interaction.interceptEvent.has(DefaultInterceptEventType.CLICK)) {
      return;
    }
    this.spreadsheet.on(S2Event.COL_CELL_CLICK, (event: Event) => {
      handleRowColClick(event, this.spreadsheet);
    });
  }

  // TODO 这个东西存在这里的必要性？
  private bindResetSheetStyle() {
    this.spreadsheet.on(S2Event.GLOBAL_CLEAR_INTERACTION_STYLE_EFFECT, () => {
      this.interaction.clearStyleIndependent();
    });
  }
}
