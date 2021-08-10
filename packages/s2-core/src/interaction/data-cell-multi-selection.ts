import { S2Event, DefaultInterceptEventType } from './events/types';
import { BaseInteraction } from './base';
import { getTooltipData } from '../utils/tooltip';
import { each, isEqual, find, isEmpty } from 'lodash';
import { InteractionStateName, SHIFT_KEY } from '@/common/constant';
export class DataCellMultiSelection extends BaseInteraction {
  private isMultiSelection = false;

  protected bindEvents() {
    this.bindKeyboardDown();
    this.bindDataCellClick();
    this.bindKeyboardUp();
  }

  private bindKeyboardDown() {
    this.spreadsheet.on(S2Event.GLOBAL_KEYBOARD_DOWN, (ev: KeyboardEvent) => {
      if (ev.key === SHIFT_KEY) {
        this.isMultiSelection = true;
      }
    });
  }

  private bindKeyboardUp() {
    this.spreadsheet.on(S2Event.GLOBAL_KEYBOARD_UP, (ev: KeyboardEvent) => {
      if (ev.key === SHIFT_KEY) {
        this.isMultiSelection = false;
        this.spreadsheet.interceptEvent.delete(DefaultInterceptEventType.CLICK);
      }
    });
  }

  private bindDataCellClick() {
    this.spreadsheet.on(S2Event.DATA_CELL_CLICK, (ev) => {
      ev.stopPropagation();
      const cell = this.spreadsheet.getCell(ev.target);
      const meta = cell.getMeta();
      if (this.isMultiSelection && meta) {
        const currentState = this.spreadsheet.getCurrentState();
        const stateName = currentState?.stateName;
        const cells = currentState?.cells;
        this.spreadsheet.clearStyleIndependent();
        // 屏蔽hover和click
        this.spreadsheet.interceptEvent.add(DefaultInterceptEventType.CLICK);
        this.spreadsheet.interceptEvent.add(DefaultInterceptEventType.HOVER);
        // 先把之前的tooltip隐藏
        this.spreadsheet.hideTooltip();
        this.spreadsheet.setState(cell, InteractionStateName.SELECTED);
        this.spreadsheet.updateCellStyleByState();
        this.draw();

        const cellInfos = [];
        if (stateName === InteractionStateName.SELECTED) {
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
