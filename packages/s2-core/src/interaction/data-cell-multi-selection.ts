import {
  InterceptType,
  InteractionKeyboardKey,
  InteractionStateName,
  S2Event,
} from '@/common/constant';
import { Event } from '@antv/g-canvas';
import { isEmpty } from 'lodash';
import { getActiveCellsTooltipData } from '@/utils/tooltip';
import { BaseEvent, BaseEventImplement } from './base-interaction';

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
        if (event.key === InteractionKeyboardKey.SHIFT) {
          this.isMultiSelection = true;
        }
      },
    );
  }

  private bindKeyboardUp() {
    this.spreadsheet.on(S2Event.GLOBAL_KEYBOARD_UP, (event: KeyboardEvent) => {
      if (event.key === InteractionKeyboardKey.SHIFT) {
        this.isMultiSelection = false;
        this.interaction.intercept.delete(InterceptType.CLICK);
      }
    });
  }

  private bindDataCellClick() {
    this.spreadsheet.on(S2Event.DATA_CELL_CLICK, (event: Event) => {
      event.stopPropagation();
      const cell = this.spreadsheet.getCell(event.target);
      const meta = cell.getMeta();

      if (this.isMultiSelection && meta) {
        const activeCells = this.interaction.getActiveCells();
        const cells = isEmpty(activeCells) ? [] : [...activeCells, cell];

        this.interaction.intercept.add(InterceptType.CLICK);
        this.interaction.intercept.add(InterceptType.HOVER);

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
