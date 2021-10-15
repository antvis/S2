import { Event } from '@antv/g-canvas';
import { isEmpty } from 'lodash';
import { getCellMeta } from 'src/utils/interaction/select-event';
import { BaseEvent, BaseEventImplement } from './base-interaction';
import { getActiveCellsTooltipData } from '@/utils/tooltip';
import {
  InterceptType,
  InteractionKeyboardKey,
  InteractionStateName,
  S2Event,
} from '@/common/constant';
import { S2CellType, ViewMeta } from '@/common/interface';

const ACTIVATE_KEYS = [
  InteractionKeyboardKey.SHIFT,
  InteractionKeyboardKey.META,
];

export class DataCellMultiSelection
  extends BaseEvent
  implements BaseEventImplement
{
  private isMultiSelection = false;

  public bindEvents() {
    this.bindKeyboardDown();
    this.bindDataCellClick();
    this.bindKeyboardUp();
  }

  private bindKeyboardDown() {
    this.spreadsheet.on(
      S2Event.GLOBAL_KEYBOARD_DOWN,
      (event: KeyboardEvent) => {
        if (ACTIVATE_KEYS.includes(event.key as InteractionKeyboardKey)) {
          this.isMultiSelection = true;
          this.spreadsheet.interaction.addIntercepts([InterceptType.CLICK]);
        }
      },
    );
  }

  private bindKeyboardUp() {
    this.spreadsheet.on(S2Event.GLOBAL_KEYBOARD_UP, (event: KeyboardEvent) => {
      if (ACTIVATE_KEYS.includes(event.key as InteractionKeyboardKey)) {
        this.isMultiSelection = false;
        this.spreadsheet.interaction.removeIntercepts([InterceptType.CLICK]);
      }
    });
  }

  private getSelectedCells(cell: S2CellType<ViewMeta>) {
    const id = cell.getMeta().id;
    const { interaction } = this.spreadsheet;
    let selectedCells = interaction.getCells();
    let cells = [];
    if (interaction.getCurrentStateName() !== InteractionStateName.SELECTED) {
      selectedCells = [];
    }
    if (selectedCells.find((meta) => meta.id === id)) {
      cells = selectedCells.filter((item) => item.id !== id);
    } else {
      cells = [...selectedCells, getCellMeta(cell)];
    }

    return cells;
  }

  private bindDataCellClick() {
    this.spreadsheet.on(S2Event.DATA_CELL_CLICK, (event: Event) => {
      event.stopPropagation();
      const cell = this.spreadsheet.getCell(event.target);
      const meta = cell.getMeta();
      const { interaction } = this.spreadsheet;

      if (this.isMultiSelection && meta) {
        const selectedCells = this.getSelectedCells(cell);

        if (isEmpty(selectedCells)) {
          interaction.clearState();
          this.spreadsheet.hideTooltip();
          return;
        }

        interaction.addIntercepts([InterceptType.CLICK, InterceptType.HOVER]);
        this.getSelectedCells(cell);
        this.spreadsheet.hideTooltip();
        interaction.changeState({
          cells: selectedCells,
          stateName: InteractionStateName.SELECTED,
        });
        this.spreadsheet.showTooltipWithInfo(
          event,
          getActiveCellsTooltipData(this.spreadsheet),
        );
      }
    });
  }
}
