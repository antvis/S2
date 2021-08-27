import { S2Event, InterceptEventType } from '@/common/constant';
import { BaseEvent } from '../base-event';
import { handleRowColClick } from '@/utils/interaction/multi-click';
import { Event } from '@antv/g-canvas';

export class RowColumnClick extends BaseEvent {
  protected bindEvents() {
    this.bindColCellClick();
    this.bindRowCellClick();
  }

  private bindRowCellClick() {
    this.spreadsheet.on(S2Event.ROW_CELL_CLICK, (event: Event) => {
      if (this.interaction.interceptEvent.has(InterceptEventType.CLICK)) {
        return;
      }
      handleRowColClick(
        event,
        this.spreadsheet,
        this.spreadsheet.isHierarchyTreeType(),
      );
    });
  }

  private bindColCellClick() {
    if (this.interaction.interceptEvent.has(InterceptEventType.CLICK)) {
      return;
    }
    this.spreadsheet.on(S2Event.COL_CELL_CLICK, (event: Event) => {
      handleRowColClick(event, this.spreadsheet);
    });
  }
}
