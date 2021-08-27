import {
  S2Event,
  InterceptEventType,
  InteractionKeyboardKey,
} from '@/common/constant';
import { BaseEvent } from '../base-event';
import { handleRowColClick } from '@/utils/interaction/multi-click';
import { Event } from '@antv/g-canvas';

export class RowColumnClick extends BaseEvent {
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
        this.interaction.interceptEvent.delete(InterceptEventType.CLICK);
      }
    });
  }

  private bindRowCellClick() {
    this.spreadsheet.on(S2Event.ROW_CELL_CLICK, (event: Event) => {
      event.stopPropagation();
      if (this.interaction.interceptEvent.has(InterceptEventType.CLICK)) {
        return;
      }
      handleRowColClick(
        event,
        this.spreadsheet,
        this.spreadsheet.isHierarchyTreeType(),
        this.isMultiSelection,
      );
    });
  }

  private bindColCellClick() {
    this.spreadsheet.on(S2Event.COL_CELL_CLICK, (event: Event) => {
      event.stopPropagation();
      if (this.interaction.interceptEvent.has(InterceptEventType.CLICK)) {
        return;
      }
      handleRowColClick(event, this.spreadsheet, false, this.isMultiSelection);
    });
  }
}
