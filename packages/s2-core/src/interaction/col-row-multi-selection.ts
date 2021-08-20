import {
  DefaultInterceptEventType,
  InteractionKeyboardKey,
  S2Event,
} from '@/common/constant';
import { Event } from '@antv/g-canvas';
import { handleRowColClick } from '@/utils/interaction/multi-click';
import { BaseInteraction } from './base';
export class ColRowMultiSelection extends BaseInteraction {
  private isMultiSelection = false;

  protected bindEvents() {
    this.bindKeyboardDown();
    this.bindKeyboardUp();
    this.bindColCellClick();
    this.bindRowCellClick();
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
        this.interaction.interceptEvent.delete(DefaultInterceptEventType.CLICK);
      }
    });
  }

  private bindColCellClick() {
    this.spreadsheet.on(S2Event.COL_CELL_CLICK, (event: Event) => {
      if (this.isMultiSelection) {
        handleRowColClick(event, this.spreadsheet);
      }
    });
  }

  private bindRowCellClick() {
    this.spreadsheet.on(S2Event.ROW_CELL_CLICK, (event: Event) => {
      if (this.isMultiSelection) {
        handleRowColClick(event, this.spreadsheet);
      }
    });
  }
}
