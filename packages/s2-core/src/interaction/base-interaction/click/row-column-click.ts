import { Event } from '@antv/g-canvas';
import { BaseEvent, BaseEventImplement } from '../../base-event';
import {
  S2Event,
  InterceptType,
  InteractionKeyboardKey,
} from '@/common/constant';
import { handleRowColClick } from '@/utils/interaction/multi-click';

export class RowColumnClick extends BaseEvent implements BaseEventImplement {
  private isMultiSelection = false;

  public bindEvents() {
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
        this.interaction.removeIntercepts([InterceptType.CLICK]);
      }
    });
  }

  private bindRowCellClick() {
    this.spreadsheet.on(S2Event.ROW_CELL_CLICK, (event: Event) => {
      handleRowColClick({
        event,
        spreadsheet: this.spreadsheet,
        isTreeRowClick: this.spreadsheet.isHierarchyTreeType(),
        isMultiSelection: this.isMultiSelection,
      });
    });
  }

  private bindColCellClick() {
    this.spreadsheet.on(S2Event.COL_CELL_CLICK, (event: Event) => {
      handleRowColClick({
        event,
        spreadsheet: this.spreadsheet,
        isTreeRowClick: false,
        isMultiSelection: this.isMultiSelection,
      });
    });
  }
}
