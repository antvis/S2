import {
  DefaultInterceptEventType,
  InteractionStateName,
  S2Event,
  SHIFT_KEY,
} from '@/common/constant';
import { S2CellType, TooltipData } from '@/common/interface';
import { Event } from '@antv/g-canvas';
import { each, find, isEmpty, isEqual } from 'lodash';
import { BaseInteraction } from './base';

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
        this.interaction.interceptEvent.delete(DefaultInterceptEventType.CLICK);
      }
    });
  }

  private bindDataCellClick() {
    this.spreadsheet.on(S2Event.DATA_CELL_CLICK, (event: Event) => {
      event.stopPropagation();
      const cell = this.spreadsheet.getCell(event.target) as S2CellType;
      const meta = cell.getMeta();
      if (this.isMultiSelection && meta) {
        const currentState = this.interaction.getState();
        const stateName = currentState?.stateName;
        const cells = currentState?.cells;
        this.interaction.clearStyleIndependent();
        // 屏蔽hover和click
        this.interaction.interceptEvent.add(DefaultInterceptEventType.CLICK);
        this.interaction.interceptEvent.add(DefaultInterceptEventType.HOVER);
        // 先把之前的tooltip隐藏
        this.spreadsheet.hideTooltip();
        this.interaction.setState(cell, InteractionStateName.SELECTED);
        this.interaction.updateCellStyleByState();
        this.draw();

        const cellInfos: TooltipData[] = [];
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
        this.interaction.showSelectedCellsSpotlight();
        this.spreadsheet.showTooltipWithInfo(event, cellInfos);
      }
    });
  }
}
