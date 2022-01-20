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
            this.scrollToActiveCell(
              this.spreadsheet,
              rowCol.row,
              rowCol.col,
              event.key as InteractionKeyboardKey,
            );
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

  private isInRange(
    spreadsheet: SpreadSheet,
    rowIndex: number,
    colIndex: number,
  ) {
    const {
      frozenRowCount = 0,
      frozenColCount = 0,
      frozenTrailingColCount = 0,
      frozenTrailingRowCount = 0,
    } = this.spreadsheet.options;
    const { rowLeafNodes } = spreadsheet.facet.layoutResult;

    const colInRange = inRange(
      colIndex,
      frozenColCount,
      spreadsheet.dataSet.fields.columns.length - frozenTrailingColCount + 1,
    );
    const rowInRange = inRange(
      rowIndex,
      frozenRowCount,
      spreadsheet.isTableMode()
        ? spreadsheet.dataSet.getDisplayDataSet().length -
            frozenTrailingRowCount
        : rowLeafNodes.length,
    );
    if (!(colInRange && rowInRange)) {
      return false;
    }
    return true;
  }

  public scrollToActiveCell(
    spreadsheet: SpreadSheet,
    rowIndex: number,
    colIndex: number,
    key: InteractionKeyboardKey,
  ) {
    const {
      frozenRowCount = 0,
      frozenColCount = 0,
      frozenTrailingColCount = 0,
      frozenTrailingRowCount = 0,
    } = spreadsheet.options;
    const { colLeafNodes, rowLeafNodes } = spreadsheet.facet.layoutResult;
    const { facet, interaction, isTableMode } = spreadsheet;
    if (!this.isInRange(spreadsheet, rowIndex, colIndex)) {
      return;
    }

    const { scrollX, scrollY } = facet.getScrollOffset();

    const { center } = facet.calculateXYIndexes(scrollX, scrollY);

    let offsetX = -2;
    let offsetY = -2;

    const targetNode = colLeafNodes.find((node) => node.colIndex === colIndex);
    if (colIndex - frozenColCount <= center[0]) {
      const FrozenWidth = spreadsheet.frozenColGroup.getBBox().width;
      offsetX = targetNode.x - FrozenWidth;
    } else if (colIndex + frozenTrailingColCount >= center[1]) {
      const FrozenTrailingWidth =
        spreadsheet.frozenTrailingColGroup.getBBox().width;
      offsetX =
        targetNode.x +
        targetNode.width -
        facet.panelBBox.viewportWidth +
        FrozenTrailingWidth;
    }

    if (rowIndex - frozenRowCount < center[2]) {
      offsetY = facet.viewCellHeights.getCellOffsetY(rowIndex - frozenRowCount);
    } else if (rowIndex + frozenTrailingRowCount >= center[3]) {
      const y = facet.viewCellHeights.getCellOffsetY(
        rowIndex + frozenTrailingRowCount,
      );
      const viewportHeight = facet.panelBBox.viewportHeight;
      const cellHeight = isTableMode()
        ? (facet as TableFacet).getCellHeight(rowIndex)
        : rowLeafNodes.find((node) => node.rowIndex === rowIndex)?.height;
      offsetY = y + cellHeight - viewportHeight;
    }

    facet.scrollWithAnimation({
      offsetX: { value: offsetX !== -2 ? offsetX : scrollX },
      offsetY: { value: offsetY !== -2 ? offsetY : scrollY },
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
    spreadsheet.emit(S2Event.GLOBAL_SELECTED, interaction.getActiveCells());
  }
}
