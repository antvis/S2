import type { FederatedPointerEvent as Event } from '@antv/g';
import { get } from 'lodash';
import { type CellMeta, CellType, type ViewMeta } from '../common';
import { InteractionKeyboardKey, S2Event } from '../common/constant';
import { calculateInViewIndexes } from '../facet/utils';
import type { SpreadSheet } from '../sheet-type';
import { getDataCellId } from '../utils';
import { getRangeIndex, selectCells } from '../utils/interaction/select-event';
import { floor } from '../utils/math';
import { BaseEvent, type BaseEventImplement } from './base-interaction';

const SelectedCellMoveMap = [
  InteractionKeyboardKey.ARROW_LEFT,
  InteractionKeyboardKey.ARROW_RIGHT,
  InteractionKeyboardKey.ARROW_UP,
  InteractionKeyboardKey.ARROW_DOWN,
];

export class SelectedCellMove extends BaseEvent implements BaseEventImplement {
  // like range selection
  startCell: CellMeta | null;

  endCell: CellMeta | null;

  constructor(spreadsheet: SpreadSheet) {
    super(spreadsheet);
  }

  private isCanvasEffect() {
    return this.spreadsheet.interaction.eventController.isCanvasEffect;
  }

  public bindEvents() {
    this.spreadsheet.on(
      S2Event.GLOBAL_KEYBOARD_DOWN,
      (event: KeyboardEvent) => {
        if (!this.isCanvasEffect()) {
          return;
        }

        const isShift = event.shiftKey;
        const isMeta = event.metaKey;
        const hasDirection = SelectedCellMoveMap.includes(
          event.key as InteractionKeyboardKey,
        );
        let changeStartCell = false;
        let isJumpMode = false;
        let isSingleSelection = false;

        if (hasDirection) {
          if (isMeta && isShift) {
            // META + SHIFT + Direction
            changeStartCell = false;
            isJumpMode = true;
            isSingleSelection = false;
          } else if (isMeta) {
            // META + Direction
            changeStartCell = true;
            isJumpMode = true;
            isSingleSelection = true;
          } else if (isShift) {
            // SHIFT + Direction
            changeStartCell = false;
            isJumpMode = false;
            isSingleSelection = false;
          } else {
            // Only Direction
            changeStartCell = true;
            isJumpMode = false;
            isSingleSelection = true;
          }

          this.handleMove({
            event,
            changeStartCell,
            isJumpMode,
            isSingleSelection,
          });
        }
      },
    );
    this.spreadsheet.on(S2Event.DATA_CELL_CLICK, (event: Event) => {
      const cell = this.spreadsheet.getCell(event.target);
      const cellMeta = cell?.getMeta() as ViewMeta;

      if (cellMeta) {
        this.startCell = this.getCellMetaByViewMeta(cellMeta);
        this.endCell = this.startCell;
      }
    });
  }

  private getCellMetaByViewMeta(meta: ViewMeta): CellMeta {
    return {
      rowIndex: meta.rowIndex,
      colIndex: meta.colIndex,
      id: meta.id,
      type: CellType.DATA_CELL,
    };
  }

  // core move function
  private handleMove({
    event,
    changeStartCell,
    isJumpMode,
    isSingleSelection,
  }: {
    event: any;
    changeStartCell: boolean;
    isJumpMode: boolean;
    isSingleSelection: boolean;
  }) {
    const { spreadsheet, startCell, endCell } = this;
    const cell = changeStartCell ? startCell : endCell;
    const rowCol = this.getMoveInfo(event.key, cell, isJumpMode);

    if (!rowCol) {
      return;
    }

    const [rowIndex, colIndex] = [rowCol.row, rowCol.col];

    this.scrollToActiveCell(spreadsheet, rowIndex, colIndex);
    const movedCell = this.generateCellMeta(spreadsheet, rowIndex, colIndex);
    const selectedCells = isSingleSelection
      ? [movedCell]
      : this.getRangeCells(spreadsheet, startCell!, movedCell);

    selectCells(spreadsheet, selectedCells);
    if (changeStartCell) {
      this.startCell = movedCell;
    }

    this.endCell = movedCell;
    this.spreadsheet.emit(S2Event.DATA_CELL_SELECT_MOVE, selectedCells);
  }

  private generateCellMeta(spreadsheet: SpreadSheet, row: number, col: number) {
    const { isTableMode, facet } = spreadsheet;

    const rowLeafNodes = facet.getRowLeafNodes();
    const colLeafNodes = facet.getColLeafNodes();
    const rowId = isTableMode() ? String(row) : rowLeafNodes[row].id;
    const colId = colLeafNodes[col].id;

    return {
      rowIndex: row,
      colIndex: col,
      id: getDataCellId(rowId, colId),
      type: CellType.DATA_CELL,
    };
  }

  private getRangeCells(
    spreadsheet: SpreadSheet,
    startCell: CellMeta,
    endCell: CellMeta,
  ): CellMeta[] {
    const {
      start: { rowIndex: startRowIndex, colIndex: startColIndex },
      end: { rowIndex: endRowIndex, colIndex: endColIndex },
    } = getRangeIndex(startCell, endCell);
    const cells: CellMeta[] = [];

    for (let row = startRowIndex; row <= endRowIndex; row++) {
      for (let col = startColIndex; col <= endColIndex; col++) {
        cells.push(this.generateCellMeta(spreadsheet, row, col));
      }
    }

    return cells;
  }

  private getMoveInfo(code: string, cell: CellMeta | null, isJump: boolean) {
    const { spreadsheet } = this;
    const {
      rowCount: frozenRowCount = 0,
      trailingRowCount: frozenTrailingRowCount = 0,
      colCount: frozenColCount = 0,
      trailingColCount: frozenTrailingColCount = 0,
    } = spreadsheet.options.frozen!;

    const rowLeafNodes = spreadsheet.facet.getRowLeafNodes();
    const colLeafNodes = spreadsheet.facet.getColLeafNodes();

    const [minCol, maxCol] = [
      0 + frozenColCount,
      colLeafNodes.length - frozenTrailingColCount - 1,
    ];
    const [minRow, maxRow] = [
      0 + frozenRowCount,
      (spreadsheet.isTableMode()
        ? spreadsheet.dataSet.getDisplayDataSet().length
        : rowLeafNodes.length) -
        frozenTrailingRowCount -
        1,
    ];

    if (!cell) {
      return;
    }

    switch (code) {
      case InteractionKeyboardKey.ARROW_RIGHT:
        if (cell.colIndex + 1 > maxCol) {
          return;
        }

        return {
          row: cell.rowIndex,
          col: isJump ? maxCol : cell.colIndex + 1,
        };
      case InteractionKeyboardKey.ARROW_LEFT:
        if (cell.colIndex - 1 < minCol) {
          return;
        }

        return {
          row: cell.rowIndex,
          col: isJump ? minCol : cell.colIndex - 1,
        };
      case InteractionKeyboardKey.ARROW_UP:
        if (cell.rowIndex - 1 < minRow) {
          return;
        }

        return {
          row: isJump ? minRow : cell.rowIndex - 1,
          col: cell.colIndex,
        };
      case InteractionKeyboardKey.ARROW_DOWN:
        if (cell.rowIndex + 1 > maxRow) {
          return;
        }

        return {
          row: isJump ? maxRow : cell.rowIndex + 1,
          col: cell.colIndex,
        };
      default:
        break;
    }
  }

  // 计算需要滚动的offset
  private calculateOffset(
    spreadsheet: SpreadSheet,
    rowIndex: number,
    colIndex: number,
  ) {
    const {
      rowCount: frozenRowCount = 0,
      trailingRowCount: frozenTrailingRowCount = 0,
    } = spreadsheet.options.frozen!;
    const facet = spreadsheet.facet;
    const {
      frozenColGroup,
      frozenTrailingColGroup,
      frozenRowGroup,
      frozenTrailingRowGroup,
    } = facet;

    const colLeafNodes = facet.getColLeafNodes();
    const { scrollX, scrollY } = facet.getScrollOffset();
    const { viewportHeight: height, viewportWidth: width } = facet.panelBBox;
    const splitLineStyle = get(spreadsheet, 'theme.splitLine');
    const frozenColWidth = frozenColGroup
      ? floor(
          frozenColGroup.getBBox().width -
            splitLineStyle.verticalBorderWidth / 2,
        )
      : 0;
    const frozenTrailingColWidth = frozenTrailingColGroup
      ? floor(frozenTrailingColGroup.getBBox().width)
      : 0;
    const frozenRowHeight = frozenRowGroup
      ? floor(
          frozenRowGroup.getBBox().height -
            splitLineStyle.horizontalBorderWidth / 2,
        )
      : 0;
    const frozenTrailingRowHeight = frozenTrailingRowGroup
      ? floor(frozenTrailingRowGroup.getBBox().height)
      : 0;

    const indexes = calculateInViewIndexes({
      scrollX,
      scrollY,
      widths: facet.viewCellWidths,
      heights: facet.viewCellHeights,
      viewport: {
        width: width - frozenColWidth - frozenTrailingColWidth,
        height: height - frozenRowHeight - frozenTrailingRowHeight,
        x: frozenColWidth,
        y: frozenRowHeight,
      },
      rowRemainWidth: facet.getRealScrollX(facet.cornerBBox.width),
    });

    // 小于0的初始值
    let offsetX = -1;
    let offsetY = -1;

    const targetNode = colLeafNodes.find((node) => node.colIndex === colIndex);

    // offsetX
    if (colIndex <= indexes[0]) {
      // scroll left
      offsetX = targetNode?.x! - frozenColWidth;
    } else if (
      colIndex >= indexes[1] &&
      colIndex < colLeafNodes.length - frozenTrailingRowCount
    ) {
      // scroll right
      offsetX =
        targetNode?.x! + targetNode?.width! - width + frozenTrailingColWidth;
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
    const { offsetX, offsetY } = this.calculateOffset(
      spreadsheet,
      rowIndex,
      colIndex,
    );
    const { facet } = spreadsheet;
    const { scrollX, scrollY } = spreadsheet.facet.getScrollOffset();

    facet.scrollWithAnimation({
      offsetX: { value: offsetX > -1 ? offsetX : scrollX },
      offsetY: { value: offsetY > -1 ? offsetY : scrollY },
    });
  }
}
