import { FRONT_GROUND_GROUP_BRUSH_SELECTION_ZINDEX } from '../common/constant';
import { S2Event, DefaultEventType } from './events/types';
import { BaseInteraction } from './base';
import { StateName } from '../state/state';
import { DataItem, TooltipOptions } from '..';
import { getTooltipData } from '../utils/tooltip';
import { each, isEqual, find } from 'lodash';

const SHIFT_KEY = 'Shift';

export class DataCellMutiSelection extends BaseInteraction {
  private isMutiSelection = false;

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
        const { stateName, cells } = currentState;
        // 手动把当前行头列头选择下的cell样式重置
        if (
          stateName === StateName.COL_SELECTED ||
          stateName === StateName.ROW_SELECTED
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

        const cellInfos = [];
        if (stateName === StateName.SELECTED) {
          each(cells, (cell) => {
            const valueInCols = this.spreadsheet.options.valueInCols;
            const query = cell.getMeta()[valueInCols ? 'colQuery' : 'rowQuery'];
            if (query) {
              const cellInfo = {
                ...query,
                colIndex: valueInCols ? cell.getMeta().colIndex : null,
                rowIndex: !valueInCols ? cell.getMeta().rowIndex : null,
              };

              if (!find(cellInfos, (info) => isEqual(info, cellInfo))) {
                cellInfos.push(cellInfo);
              }
            }
          });
        }
        this.handleTooltip(ev, cellInfos);
      }
    });
  }

  private handleTooltip(ev, cellInfos) {
    const position = {
      x: ev.clientX,
      y: ev.clientY,
    };

    const options = {
      enterable: true,
    };

    const tooltipData = getTooltipData(this.spreadsheet, cellInfos, options);
    const showOptions = {
      position,
      data: tooltipData,
      options,
    };
    this.spreadsheet.showTooltip(showOptions);
  }
}
