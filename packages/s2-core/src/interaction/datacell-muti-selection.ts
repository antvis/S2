import { each, isEqual, find, isEmpty } from 'lodash';
import { SelectedStateName } from '../common/constant/interatcion';
import { getTooltipData } from '../utils/tooltip';
import { S2Event, DefaultInterceptEventType } from './events/types';
import { BaseInteraction } from './base';

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
        this.spreadsheet.interceptEvent.delete(DefaultInterceptEventType.CLICK);
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
        this.spreadsheet.clearStyleIndependent();
        // 屏蔽hover和click
        this.spreadsheet.interceptEvent.add(DefaultInterceptEventType.CLICK);
        this.spreadsheet.interceptEvent.add(DefaultInterceptEventType.HOVER);
        // 先把之前的tooltip隐藏
        this.spreadsheet.hideTooltip();
        this.spreadsheet.setState(cell, SelectedStateName.SELECTED);
        this.spreadsheet.updateCellStyleByState();
        this.draw();

        const cellInfos = [];
        if (stateName === SelectedStateName.SELECTED) {
          each(cells, (stateCell) => {
            const valueInCols = this.spreadsheet.options.valueInCols;
            const stateCellMeta = stateCell.getMeta();
            if (!isEmpty(stateCellMeta)) {
              const query =
                stateCellMeta[valueInCols ? 'colQuery' : 'rowQuery'];
              if (query) {
                const cellInfo = {
                  ...query,
                  colIndex: valueInCols ? stateCellMeta.colIndex : null,
                  rowIndex: !valueInCols ? stateCellMeta.rowIndex : null,
                };

                if (!find(cellInfos, (info) => isEqual(info, cellInfo))) {
                  cellInfos.push(cellInfo);
                }
              }
            }
          });
        }
        this.handleTooltip(ev, cellInfos);
      }
    });
  }

  private handleTooltip(ev, cellInfos) {
    if (!this.spreadsheet.options?.tooltip?.showTooltip) {
      return;
    }
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
