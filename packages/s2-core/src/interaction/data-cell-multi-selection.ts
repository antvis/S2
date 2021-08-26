import {
  InterceptEventType,
  InteractionKeyboardKey,
  InteractionStateName,
  S2Event,
} from '@/common/constant';
import { S2CellType, TooltipData } from '@/common/interface';
import { Event } from '@antv/g-canvas';
import { each, find, isEmpty, isEqual, concat } from 'lodash';
import { BaseInteraction } from './base';

export class DataCellMultiSelection extends BaseInteraction {
  private isMultiSelection = false;

  protected bindEvents() {
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
        this.interaction.interceptEvent.delete(InterceptEventType.CLICK);
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
        const cells = isEmpty(currentState?.cells)
          ? currentState?.cells
          : concat(currentState?.cells, cell);
        // 屏蔽hover和click
        this.interaction.interceptEvent.add(InterceptEventType.CLICK);
        this.interaction.interceptEvent.add(InterceptEventType.HOVER);
        // 先把之前的tooltip隐藏
        this.spreadsheet.hideTooltip();
        this.interaction.changeState({
          cells: cells,
          stateName: InteractionStateName.SELECTED,
        });
        this.interaction.updateCellStyleByState();

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
        this.spreadsheet.showTooltipWithInfo(event, cellInfos);
      }
    });
  }
}
