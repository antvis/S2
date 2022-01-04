import { inRange } from 'lodash';
import { BaseEvent, BaseEventImplement } from './base-interaction';
import { InteractionKeyboardKey, S2Event } from '@/common/constant';
import { TableFacet } from '@/facet';
import { RootInteraction } from '@/interaction';
import { InteractionStateName, S2Options, CellTypes } from '@/common';
import { getDataCellId } from '@/utils';

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
            this.spreadsheet.isTableMode()
              ? dataSet.getDisplayDataSet().length
              : dataSet.fields.rows.length - frozenTrailingRowCount,
          );
          if (rowCol && colInRange && rowInRange) {
            this.scrollToCell(
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

  public scrollToCell(
    rowIndex: number,
    colIndex: number,
    options: S2Options,
    facet: TableFacet,
    interaction: RootInteraction,
  ) {
    const { frozenRowCount, frozenColCount = 0 } = options;
    const colsNodes = facet.layoutResult.colLeafNodes;
    const rowsNodes = facet.layoutResult.rowLeafNodes;

    let offsetX = 0;
    let offsetY = 0;

    offsetX = colsNodes.find((item) => item.colIndex === colIndex)?.x || 0;
    if (frozenColCount > 1) {
      const firstUnfrozenNodeX =
        colsNodes.find((item) => item.colIndex === frozenColCount)?.x || 0;
      offsetX -= firstUnfrozenNodeX;
    }

    offsetY = facet.viewCellHeights.getCellOffsetY(rowIndex - 1);

    if (frozenRowCount > 0 && rowIndex > frozenRowCount - 1) {
      offsetY -= facet.getTotalHeightForRange(0, frozenRowCount - 1);
    }

    if (offsetY < 0) {
      offsetY = 0;
    }

    if (offsetX < 0) {
      offsetX = 0;
    }

    facet.scrollWithAnimation({
      offsetX: {
        value: offsetX,
      },
      offsetY: {
        value: offsetY,
      },
    });
    const rowId = this.spreadsheet.isTableMode()
      ? String(rowIndex)
      : rowsNodes[rowIndex].id;

    interaction.changeState({
      stateName: InteractionStateName.SELECTED,
      cells: [
        {
          colIndex,
          rowIndex,
          id: getDataCellId(rowId, colsNodes[colIndex].id),
          type: CellTypes.DATA_CELL,
        },
      ],
    });
  }
}
