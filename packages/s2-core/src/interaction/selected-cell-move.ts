import { inRange } from 'lodash';
import { BaseEvent, BaseEventImplement } from './base-interaction';
import { InteractionKeyboardKey, S2Event } from '@/common/constant';
import { TableFacet } from '@/facet';
import { InteractionStateName, CellTypes, CellMeta } from '@/common';
import { getDataCellId } from '@/utils';
import { SpreadSheet } from '@/sheet-type';

export class SelectedCellMove extends BaseEvent implements BaseEventImplement {
  public bindEvents() {
    this.spreadsheet.on(
      S2Event.GLOBAL_KEYBOARD_DOWN,
      (event: KeyboardEvent) => {
        const SelectedCellMoveMap = [
          InteractionKeyboardKey.ARROW_LEFT,
          InteractionKeyboardKey.ARROW_RIGHT,
          InteractionKeyboardKey.ARROW_UP,
          InteractionKeyboardKey.ARROW_DOWN,
        ];
        if (SelectedCellMoveMap.includes(event.key as InteractionKeyboardKey)) {
          const cells = this.spreadsheet.interaction.getCells();
          const cell = cells.length ? cells[cells.length - 1] : null;
          const rowCol = this.getMoveInfo(event.key, cell);
          if (rowCol) {
            this.scrollToActiveCell(this.spreadsheet, rowCol.row, rowCol.col);
          }
        }
      },
    );
  }

  private getMoveInfo(code: string, cell: CellMeta) {
    if (!cell) return;
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
  }

  private getOffsetX(colIndex: number) {
    const { colLeafNodes } = this.spreadsheet.facet.layoutResult;
    const { frozenColCount = 0 } = this.spreadsheet.options;
    let offsetX = 0;
    offsetX = colLeafNodes.find((item) => item.colIndex === colIndex)?.x || 0;
    if (frozenColCount > 1) {
      const firstUnfrozenNodeX = this.spreadsheet.isTableMode()
        ? colLeafNodes.find((item) => item.colIndex === frozenColCount)?.x || 0
        : 0;
      offsetX -= firstUnfrozenNodeX;
    }
    if (offsetX < 0) {
      offsetX = 0;
    }
    return offsetX;
  }

  private getOffsetY(rowIndex: number) {
    const { frozenRowCount = 0 } = this.spreadsheet.options;
    const { facet, isTableMode } = this.spreadsheet;
    let offsetY = 0;
    offsetY = facet.viewCellHeights.getCellOffsetY(rowIndex - 1);
    if (frozenRowCount > 0 && rowIndex > frozenRowCount - 1) {
      const firstUnfrozenNodeY = isTableMode()
        ? (facet as TableFacet).getTotalHeightForRange(0, frozenRowCount - 1)
        : 0;
      offsetY -= firstUnfrozenNodeY;
    }

    if (offsetY < 0) {
      offsetY = 0;
    }
    return offsetY;
  }

  public scrollToActiveCell(
    spreadsheet: SpreadSheet,
    rowIndex: number,
    colIndex: number,
  ) {
    const {
      frozenRowCount = 0,
      frozenColCount = 0,
      frozenTrailingColCount = 0,
    } = this.spreadsheet.options;
    const { colLeafNodes, rowLeafNodes } = spreadsheet.facet.layoutResult;
    const { facet, interaction, isTableMode } = spreadsheet;

    const colInRange = inRange(
      colIndex,
      frozenColCount,
      spreadsheet.dataSet.fields.columns.length - frozenTrailingColCount,
    );
    const rowInRange = inRange(
      rowIndex,
      frozenRowCount,
      isTableMode()
        ? spreadsheet.dataSet.getDisplayDataSet().length
        : rowLeafNodes.length,
    );

    if (!(colInRange && rowInRange)) {
      return;
    }

    facet.scrollWithAnimation({
      offsetX: { value: this.getOffsetX(colIndex) },
      offsetY: { value: this.getOffsetY(rowIndex) },
    });
    const rowId = isTableMode() ? String(rowIndex) : rowLeafNodes[rowIndex].id;

    interaction.changeState({
      stateName: InteractionStateName.SELECTED,
      cells: [
        {
          colIndex,
          rowIndex,
          id: getDataCellId(rowId, colLeafNodes[colIndex].id),
          type: CellTypes.DATA_CELL,
        },
      ],
    });
  }
}
