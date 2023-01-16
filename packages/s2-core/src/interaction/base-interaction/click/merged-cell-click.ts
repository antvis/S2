import type { FederatedPointerEvent as Event } from '@antv/g';
import { InterceptType, S2Event } from '../../../common/constant';
import { BaseEvent, type BaseEventImplement } from '../../base-event';

export class MergedCellClick extends BaseEvent implements BaseEventImplement {
  public bindEvents() {
    this.bindDataCellClick();
  }

  private bindDataCellClick() {
    this.spreadsheet.on(S2Event.MERGED_CELLS_CLICK, (event: Event) => {
      event.stopPropagation();
      const { interaction } = this.spreadsheet;

      if (interaction.hasIntercepts([InterceptType.CLICK])) {
        return;
      }

      interaction.addIntercepts([InterceptType.HOVER]);
    });
  }
}
