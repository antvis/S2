import { inRange } from 'lodash';
import { BaseEvent, BaseEventImplement } from './base-interaction';
import { InteractionKeyboardKey, S2Event } from '@/common/constant';
import { scrollToCell } from '@/utils/interaction/scrollToCell';
import { TableFacet } from '@/facet';

export class KeyboardMove extends BaseEvent implements BaseEventImplement {
  public bindEvents() {
    this.spreadsheet.on(
      S2Event.GLOBAL_KEYBOARD_DOWN,
      (event: KeyboardEvent) => {
        const KeyboardMove = [
          InteractionKeyboardKey.ARROW_LEFT,
          InteractionKeyboardKey.ARROW_RIGHT,
          InteractionKeyboardKey.ARROW_UP,
          InteractionKeyboardKey.ARROW_DOWN,
        ];
        if (KeyboardMove.includes(event.key as InteractionKeyboardKey)) {
          const cells = this.spreadsheet.interaction.getCells();
          const dataSet = this.spreadsheet.dataSet;
          const {
            frozenRowCount = 0,
            frozenColCount = 0,
            frozenTrailingRowCount = 0,
            frozenTrailingColCount = 0,
          } = this.spreadsheet.options;

          const cell = cells.length ? cells[cells.length - 1] : null;
          const getRowCol = (code: string) => {
            switch (code) {
              case InteractionKeyboardKey.ARROW_RIGHT:
                return { row: cell.rowIndex, col: cell.colIndex + 1 };
              case InteractionKeyboardKey.ARROW_LEFT:
                return { row: cell.rowIndex, col: cell.colIndex - 1 };
              case InteractionKeyboardKey.ARROW_UP:
                return { row: cell.rowIndex - 1, col: cell.colIndex };
              case InteractionKeyboardKey.ARROW_DOWN:
                return { row: cell.rowIndex + 1, col: cell.colIndex };
              default:
                break;
            }
          };
          const rowCol = cell && getRowCol(event.key);
          const colInRange = inRange(
            rowCol.col,
            frozenColCount,
            dataSet.fields.columns.length - frozenTrailingColCount,
          );
          const rowInRange = inRange(
            rowCol.row,
            frozenRowCount,
            dataSet.getDisplayDataSet().length - frozenTrailingRowCount,
          );
          if (rowCol && colInRange && rowInRange) {
            scrollToCell(
              rowCol.row,
              rowCol.col,
              this.spreadsheet.options,
              this.spreadsheet.facet as TableFacet,
              this.spreadsheet.interaction,
            );
          }
        }
      },
    );
  }
}
