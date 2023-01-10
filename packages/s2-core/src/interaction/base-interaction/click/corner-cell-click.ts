import { InterceptType, S2Event } from '../../../common/constant';
import {
  BaseEvent,
  type BaseEventImplement,
} from '../../../interaction/base-event';

export class CornerCellClick extends BaseEvent implements BaseEventImplement {
  public bindEvents() {
    this.bindCornerCellClick();
  }

  private bindCornerCellClick() {
    this.spreadsheet.on(S2Event.CORNER_CELL_CLICK, () => {
      const { interaction, tooltip } = this.spreadsheet;

      interaction.reset();
      interaction.addIntercepts([InterceptType.HOVER]);

      // 角头点击后如果 tooltip 未显示, 则取消 hover 拦截
      setTimeout(() => {
        if (tooltip.visible) {
          return;
        }

        interaction.removeIntercepts([InterceptType.HOVER]);
      });
    });
  }
}
