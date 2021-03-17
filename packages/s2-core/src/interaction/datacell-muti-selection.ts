import { Event, Point, IShape } from '@antv/g-canvas';
import { DataCell } from '../cell';
import { FRONT_GROUND_GROUP_BRUSH_SELECTION_ZINDEX } from '../common/constant';
import { S2Event, DefaultEventType } from './events/types';
import { BaseInteraction } from './base';
import { StateName } from '../state/state';
import { DataItem, TooltipOptions } from '..';
import { getTooltipData } from '../utils/tooltip';

const SHIFT_KEY = 'Shift';

export class DataCellMutiSelection extends BaseInteraction {
  private isMutiSelection: boolean = false;

  protected bindEvents() {
    this.bindKeyboardDown();
    this.bindDataCellClick();
    this.bindKeyboardUp();
  }

  private bindKeyboardDown() {
    this.spreadsheet.on(S2Event.GLOBAL_KEYBOARDDOWN, (ev: KeyboardEvent) => {
      if (ev.key === SHIFT_KEY) {
        this.isMutiSelection = true;
      }
    });
  }

  private bindKeyboardUp() {
    this.spreadsheet.on(S2Event.GLOBAL_KEYBOARDUP, (ev: KeyboardEvent) => {
      if (ev.key === SHIFT_KEY) {
        this.isMutiSelection = false;
        this.spreadsheet.eventController.interceptEvent.delete(
          DefaultEventType.CLICK,
        );
      }
    });
  }

  private bindDataCellClick() {
    this.spreadsheet.on(S2Event.DATACELL_CLICK, (ev) => {
      ev.stopPropagation();
      const cell = this.spreadsheet.getCell(ev.target);
      const meta = cell.getMeta();
      if (this.isMutiSelection && meta) {
        const currentState = this.spreadsheet.getCurrentState();
        // 手动把当前行头列头选择下的cell样式重置
        if (
          currentState.stateName === StateName.COL_SELECTED ||
          currentState.stateName === StateName.ROW_SELECTED
        ) {
          this.spreadsheet.getPanelAllCells().forEach((cell) => {
            cell.hideShapeUnderState();
          });
        }
        // 屏蔽hover和click
        this.spreadsheet.eventController.interceptEvent.add(
          DefaultEventType.CLICK,
        );
        this.spreadsheet.eventController.interceptEvent.add(
          DefaultEventType.HOVER,
        );
        // 先把之前的tooltip隐藏
        this.spreadsheet.hideTooltip();
        const cell = this.spreadsheet.getCell(ev.target);
        this.spreadsheet.setState(cell, StateName.SELECTED);
        this.spreadsheet.updateCellStyleByState();
        this.draw();
      }
    });
  }
}
