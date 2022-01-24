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

  // 判断是否在可移动范围内
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

  // 计算需要滚动的offset
  private calculateOffset(
    spreadsheet: SpreadSheet,
    rowIndex: number,
    colIndex: number,
  ) {
    const { frozenRowCount = 0, frozenTrailingRowCount = 0 } =
      spreadsheet.options;
    const {
      facet,
      frozenColGroup,
      frozenTrailingColGroup,
      frozenRowGroup,
      frozenTrailingRowGroup,
    } = spreadsheet;
    const { colLeafNodes } = facet.layoutResult;
    const { scrollX, scrollY } = facet.getScrollOffset();
    const { viewportHeight: height, viewportWidth: width } = facet.panelBBox;
    const frozenColWidth = frozenColGroup
      ? Math.floor(frozenColGroup.getBBox().width)
      : 0;
    const frozenTrailingColWidth = frozenTrailingColGroup
      ? Math.floor(frozenTrailingColGroup.getBBox().width)
      : 0;
    const frozenRowHeight = frozenRowGroup
      ? Math.floor(frozenRowGroup.getBBox().height)
      : 0;
    const frozenTrailingRowHeight = frozenTrailingRowGroup
      ? Math.floor(frozenTrailingRowGroup.getBBox().height)
      : 0;

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

    // 小于0的初始值
    let offsetX = -1;
    let offsetY = -1;

    const targetNode = colLeafNodes.find((node) => node.colIndex === colIndex);
    // offsetX
    if (colIndex <= indexes[0]) {
      // scroll left
      offsetX = targetNode.x - frozenColWidth;
    } else if (
      colIndex >= indexes[1] &&
      colIndex < colLeafNodes.length - frozenTrailingRowCount
    ) {
      // scroll right
      offsetX =
        targetNode.x + targetNode.width - width + frozenTrailingColWidth;
    }

    // offsetY
    if (rowIndex <= indexes[2]) {
      // scroll top
      offsetY = facet.viewCellHeights.getCellOffsetY(rowIndex - frozenRowCount);
    } else if (rowIndex >= indexes[3]) {
      // scroll bottom
      const y = facet.viewCellHeights.getCellOffsetY(rowIndex + 1);
      offsetY = y + frozenTrailingRowHeight - height;
    }
    return { offsetX, offsetY };
  }

  public scrollToActiveCell(
    spreadsheet: SpreadSheet,
    rowIndex: number,
    colIndex: number,
  ) {
    if (!this.isInRange(spreadsheet, rowIndex, colIndex)) {
      return;
    }
    const { offsetX, offsetY } = this.calculateOffset(
      spreadsheet,
      rowIndex,
      colIndex,
    );
    const { colLeafNodes, rowLeafNodes } = spreadsheet.facet.layoutResult;
    const { facet, interaction, isTableMode } = spreadsheet;
    const { scrollX, scrollY } = facet.getScrollOffset();
    facet.scrollWithAnimation({
      offsetX: { value: offsetX > 0 ? offsetX : scrollX },
      offsetY: { value: offsetY > 0 ? offsetY : scrollY },
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
