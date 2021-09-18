import { Event } from '@antv/g-canvas';
import { isEmpty } from 'lodash';
import { BaseEvent } from '@/interaction/base-interaction';
import { S2Event } from '@/common/constant';
import { InteractionStateName } from '@/common/constant/interaction';
import { S2CellType } from '@/common/interface';
import { SpreadSheet } from '@/sheet-type';
import { RootInteraction } from '@/interaction/root';

export class CustomHover extends BaseEvent {
  public bindEvents() {
    this.bindDataCellHover();
  }

  private bindDataCellHover() {
    this.spreadsheet.on(S2Event.DATA_CELL_HOVER, (event: Event) => {
      const cell = this.spreadsheet.getCell(event.target) as S2CellType;
      if (isEmpty(cell)) return;
      this.interaction.changeState({
        selectedCells: [this.interaction.getSelectedCellMeta(cell)],
        stateName: InteractionStateName.HOVER,
      });
      cell.updateByState(InteractionStateName.UNSELECTED, cell);
    });
  }
}

export const CustomInteraction = (
  spreadsheet: SpreadSheet,
  interaction: RootInteraction,
) => new CustomHover(spreadsheet, interaction);
