import { Event, Point, IShape } from '@antv/g-canvas';
import { DataCell } from '../cell';
import { FRONT_GROUND_GROUP_BRUSH_SELECTION_ZINDEX } from '../common/constant';
import { S2Event, DefaultEventType } from './events/types';
import { BaseInteraction } from './base';
import { StateName } from '../state/state';
import { DataItem, TooltipOptions } from '..';
import { getTooltipData } from '../utils/tooltip';
import { each } from 'lodash';
import { Node } from '../index';

const SHIFT_KEY = 'Shift';

export class ColRowMutiSelection extends BaseInteraction {
  private isMutiSelection: boolean = false;

  protected bindEvents() {
    this.bindKeyboardDown();
    this.bindKeyboardUp();
    this.bindColCellClick();
    this.bindRowCellClick();
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

  private bindColCellClick() {
    this.spreadsheet.on(S2Event.COLCELL_CLICK, (ev) => {
      if(this.isMutiSelection) {
        // 屏蔽hover和click
        this.spreadsheet.eventController.interceptEvent.add(
          DefaultEventType.CLICK,
        );
        const cell = this.spreadsheet.getCell(ev.target);
        if (cell.getMeta().x !== undefined) {
          const meta = cell.getMeta();
          const idx = meta.cellIndex;
          this.spreadsheet.eventController.interceptEvent.add(
            DefaultEventType.HOVER,
          );
          if (idx === -1) {
            // 多列
            each(Node.getAllLeavesOfNode(meta), (node: Node) => {
              if (node.belongsCell) {
                this.spreadsheet.setState(
                  node.belongsCell,
                  StateName.COL_SELECTED,
                );
              }
            });
          } else {
            // 单列
            this.spreadsheet.setState(cell, StateName.COL_SELECTED);
          }
          this.spreadsheet.updateCellStyleByState();
          this.resetCell();
          this.draw();
        }
      }
    })
  }

  private bindRowCellClick() {
    this.spreadsheet.on(S2Event.ROWCELL_CLICK, (ev: Event) => {
      if(this.isMutiSelection) {
        // 屏蔽hover和click
        this.spreadsheet.eventController.interceptEvent.add(
          DefaultEventType.CLICK,
        );
        const cell = this.spreadsheet.getCell(ev.target);
        if (cell.getMeta().x !== undefined) {
          const meta = cell.getMeta();
          const idx = meta.cellIndex;
          this.spreadsheet.eventController.interceptEvent.add(
            DefaultEventType.HOVER,
          );
          if (idx === -1) {
            // 多行
            each(Node.getAllLeavesOfNode(meta), (node: Node) => {
              if (node.belongsCell) {
                this.spreadsheet.setState(
                  node.belongsCell,
                  StateName.ROW_SELECTED,
                );
              }
            });
          } else {
            // 单行
            this.spreadsheet.setState(cell, StateName.ROW_SELECTED);
          }
          this.spreadsheet.updateCellStyleByState();
          this.resetCell();
          this.draw();
        }
      }
    });
  }

  
  private resetCell() {
    this.spreadsheet.getPanelAllCells().forEach((cell) => {
      cell.update();
    });
  }
}
