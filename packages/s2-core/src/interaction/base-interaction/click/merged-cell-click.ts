import { BaseEvent, BaseEventImplement } from '@/interaction/base-event';
import { InterceptType, S2Event } from '@/common/constant';
import { CanvasEvent } from '@/common';

export class MergedCellClick extends BaseEvent implements BaseEventImplement {
  public bindEvents() {
    this.bindDataCellClick();
  }

  private bindDataCellClick() {
    this.spreadsheet.on(S2Event.MERGED_CELLS_CLICK, (event: CanvasEvent) => {
      event.stopPropagation();
      const { interaction } = this.spreadsheet;
      if (interaction.hasIntercepts([InterceptType.CLICK])) {
        return;
      }
      interaction.addIntercepts([InterceptType.HOVER]);
    });
  }
}
