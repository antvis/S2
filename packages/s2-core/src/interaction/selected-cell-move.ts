import { inRange } from 'lodash';
import { BaseEvent, BaseEventImplement } from './base-interaction';
import { InteractionKeyboardKey, S2Event } from '@/common/constant';
import { InteractionStateName, CellTypes, CellMeta } from '@/common';
import { getDataCellId } from '@/utils';
import { SpreadSheet } from '@/sheet-type';
import { calculateInViewIndexes } from '@/facet/utils';

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

  private isInRange(
    spreadsheet: SpreadSheet,
    rowIndex: number,
    colIndex: number,
  ) {
    const { rowLeafNodes } = spreadsheet.facet.layoutResult;
    const colInRange = inRange(
      colIndex,
      0,
      spreadsheet.dataSet.fields.columns.length,
    );
    const rowInRange = inRange(
      rowIndex,
      0,
      spreadsheet.isTableMode()
        ? spreadsheet.dataSet.getDisplayDataSet().length
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
  ) {
    const { frozenRowCount = 0, frozenTrailingRowCount = 0 } =
      spreadsheet.options;
    const { colLeafNodes, rowLeafNodes } = spreadsheet.facet.layoutResult;
    const { facet, interaction, isTableMode } = spreadsheet;
    if (!this.isInRange(spreadsheet, rowIndex, colIndex)) {
      return;
    }

    const { scrollX, scrollY } = facet.getScrollOffset();

    const { viewportHeight: height, viewportWidth: width } = facet.panelBBox;

    const frozenColWidth = Math.floor(
      this.spreadsheet.frozenColGroup.getBBox().width,
    );
    const frozenTrailingColWidth = Math.floor(
      this.spreadsheet.frozenTrailingColGroup.getBBox().width,
    );
    const frozenRowHeight = Math.floor(
      this.spreadsheet.frozenRowGroup.getBBox().height,
    );
    const frozenTrailingRowHeight = Math.floor(
      this.spreadsheet.frozenTrailingRowGroup.getBBox().height,
    );

    const indexes = calculateInViewIndexes(
      scrollX,
      scrollY,
      facet.viewCellWidths,
      facet.viewCellHeights,
      {
        width: width - frozenColWidth - frozenTrailingColWidth,
        height: height - frozenRowHeight - frozenTrailingRowHeight,
        x: frozenColWidth,
        y: frozenRowHeight,
      },
      facet.getRealScrollX(facet.cornerBBox.width),
    );

    const { center } = { center: indexes };

    // 小于0的初始值
    let offsetX = -1;
    let offsetY = -1;

    const targetNode = colLeafNodes.find((node) => node.colIndex === colIndex);
    // offsetX
    if (colIndex <= center[0]) {
      offsetX = targetNode.x - frozenColWidth;
    } else if (colIndex >= center[1]) {
      if (colLeafNodes.length - colIndex > frozenTrailingRowCount) {
        offsetX =
          targetNode.x + targetNode.width - width + frozenTrailingColWidth;
      }
    }

    // offsetY
    if (rowIndex <= center[2]) {
      offsetY = facet.viewCellHeights.getCellOffsetY(rowIndex - frozenRowCount);
    } else if (rowIndex >= center[3]) {
      const y = facet.viewCellHeights.getCellOffsetY(rowIndex + 1);
      offsetY = y + frozenTrailingRowHeight - height;
    }

    facet.scrollWithAnimation({
      offsetX: { value: offsetX !== -1 ? offsetX : scrollX },
      offsetY: { value: offsetY !== -1 ? offsetY : scrollY },
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
