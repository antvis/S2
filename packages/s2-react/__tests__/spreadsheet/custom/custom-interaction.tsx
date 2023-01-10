import { isEmpty } from 'lodash';
import {
  SpreadSheet,
  type S2CellType,
  S2Event,
  BaseEvent,
  InteractionStateName,
  getCellMeta,
  GEvent,
} from '@antv/s2';

export class CustomHover extends BaseEvent {
  public bindEvents() {
    this.bindDataCellHover();
  }

  private bindDataCellHover() {
    this.spreadsheet.on(S2Event.DATA_CELL_HOVER, (event: GEvent) => {
      const cell = this.spreadsheet.getCell(event.target) as S2CellType;

      if (isEmpty(cell)) {
        return;
      }

      this.spreadsheet.interaction.changeState({
        cells: [getCellMeta(cell)],
        stateName: InteractionStateName.HOVER,
      });
      cell.updateByState(InteractionStateName.UNSELECTED, cell);
    });
  }
}

export const CustomInteraction = (spreadsheet: SpreadSheet) =>
  new CustomHover(spreadsheet);
