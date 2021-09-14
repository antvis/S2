import { Event } from '@antv/g-canvas';
import { getActiveCellsTooltipData } from '@/utils/tooltip';
import {
  InterceptType,
  InteractionKeyboardKey,
  InteractionStateName,
  S2Event,
} from '@/common/constant';

import { BaseEvent, BaseEventImplement } from './base-interaction';

const ACTIVATE_KEYS: string[] = [
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
        if (ACTIVATE_KEYS.includes(event.key)) {
          this.isMultiSelection = true;
          this.interaction.addIntercepts([InterceptType.CLICK]);
        }
      },
    );
  }

  private bindKeyboardUp() {
    this.spreadsheet.on(S2Event.GLOBAL_KEYBOARD_UP, (event: KeyboardEvent) => {
      if (ACTIVATE_KEYS.includes(event.key)) {
        this.isMultiSelection = false;
        this.interaction.removeIntercepts([InterceptType.CLICK]);
      }
    });
  }

  private bindDataCellClick() {
    this.spreadsheet.on(S2Event.DATA_CELL_CLICK, (event: Event) => {
      event.stopPropagation();
      const cell = this.spreadsheet.getCell(event.target);
      const meta = cell.getMeta();

      if (this.isMultiSelection && meta) {
        let activeCells = this.interaction.getActiveCells();
        let cells = [];
        if (
          this.interaction.getCurrentStateName() !==
          InteractionStateName.SELECTED
        ) {
          activeCells = [];
        }
        if (activeCells.includes(cell)) {
          cells = activeCells.filter((item) => item !== cell);
        } else {
          cells = [...activeCells, cell];
        }

        if (cells.length === 0) {
          this.interaction.clearState();
          this.spreadsheet.hideTooltip();
          return;
        }

        this.interaction.addIntercepts([
          InterceptType.CLICK,
          InterceptType.HOVER,
        ]);

        this.spreadsheet.hideTooltip();
        this.interaction.changeState({
          cells: cells,
          stateName: InteractionStateName.SELECTED,
        });
        this.interaction.updateCellStyleByState();
        this.spreadsheet.showTooltipWithInfo(
          event,
          getActiveCellsTooltipData(this.spreadsheet),
        );
      }
    });
  }
}
