import { inRange, isEmpty, isNil, range } from 'lodash';
import type { FederatedPointerEvent } from '@antv/g';
import { DataCell } from '../cell';
import {
  CellType,
  InteractionKeyboardKey,
  InteractionStateName,
  InterceptType,
  S2Event,
} from '../common/constant';
import type { S2CellType, ViewMeta } from '../common/interface';
import type { Node } from '../facet/layout/node';
import { getCellMeta, getRangeIndex } from '../utils/interaction/select-event';
import { getCellsTooltipData } from '../utils/tooltip';
import { BaseEvent, type BaseEventImplement } from './base-interaction';

export class RangeSelection extends BaseEvent implements BaseEventImplement {
  private isRangeSelection = false;

  public bindEvents() {
    this.bindKeyboardDown();
    this.bindDataCellClick();
    this.bindColCellClick();
    this.bindKeyboardUp();
    this.bindMouseMove();
  }

  public reset() {
    this.isRangeSelection = false;
    this.spreadsheet.interaction.removeIntercepts([InterceptType.CLICK]);
  }

  private bindKeyboardDown() {
    this.spreadsheet.on(
      S2Event.GLOBAL_KEYBOARD_DOWN,
      (event: KeyboardEvent) => {
        if (event.key === InteractionKeyboardKey.SHIFT) {
          this.isRangeSelection = true;
          this.spreadsheet.interaction.addIntercepts([InterceptType.CLICK]);
        }
      },
    );
  }

  private bindKeyboardUp() {
    this.spreadsheet.on(S2Event.GLOBAL_KEYBOARD_UP, (event: KeyboardEvent) => {
      if (event.key === InteractionKeyboardKey.SHIFT) {
        this.reset();
      }
    });
  }

  private bindMouseMove() {
    // 当快捷键被系统拦截后，按需补充调用一次 reset
    this.spreadsheet.on(S2Event.GLOBAL_MOUSE_MOVE, (event) => {
      if (this.isRangeSelection && !event.shiftKey) {
        this.reset();
      }
    });
  }

  private bindColCellClick() {
    if (this.spreadsheet.isTableMode()) {
      // series-number click
      this.spreadsheet.on(S2Event.ROW_CELL_CLICK, (event) => {
        this.handleColClick(event);
      });
    }

    this.spreadsheet.on(S2Event.COL_CELL_CLICK, (event) => {
      this.handleColClick(event);
    });
  }

  private bindDataCellClick() {
    this.spreadsheet.on(S2Event.DATA_CELL_CLICK, (event) => {
      event.stopPropagation();
      const cell = this.spreadsheet.getCell(event.target) as DataCell;
      const meta = cell.getMeta();
      const { interaction } = this.spreadsheet;

      if (!meta) {
        return;
      }

      const lastClickedCell = this.spreadsheet.store.get('lastClickedCell');
      const isShiftSelect =
        this.isRangeSelection && lastClickedCell?.cellType === cell.cellType;

      if (!isShiftSelect) {
        this.spreadsheet.store.set('lastClickedCell', cell);

        return;
      }

      const { start, end } = getRangeIndex(
        lastClickedCell.getMeta() as ViewMeta,
        cell.getMeta(),
      );

      const cells = range(start.colIndex, end.colIndex + 1).flatMap((col) => {
        const cellIdSuffix = this.spreadsheet.facet.getColLeafNodes()[col].id;

        return range(start.rowIndex, end.rowIndex + 1).map((row) => {
          const cellIdPrefix =
            this.spreadsheet.facet.getSeriesNumberWidth() ||
            this.spreadsheet.isTableMode()
              ? String(row)
              : this.spreadsheet.facet.getRowLeafNodes()[row].id;

          return {
            id: `${cellIdPrefix}-${cellIdSuffix}`,
            colIndex: col,
            rowIndex: row,
            type: cell.cellType,
          };
        });
      });

      interaction.addIntercepts([InterceptType.CLICK, InterceptType.HOVER]);
      interaction.changeState({
        cells,
        stateName: InteractionStateName.SELECTED,
      });
      this.spreadsheet.showTooltipWithInfo(
        event,
        getCellsTooltipData(this.spreadsheet),
      );
      this.spreadsheet.emit(
        S2Event.GLOBAL_SELECTED,
        interaction.getActiveCells(),
      );
    });
  }

  private handleColClick = (event: FederatedPointerEvent) => {
    event.stopPropagation();
    const { interaction, facet } = this.spreadsheet;
    const cell = this.spreadsheet.getCell(event.target);
    const meta = cell?.getMeta() as Node;

    if (!isNil(meta?.x)) {
      interaction.addIntercepts([InterceptType.HOVER]);
      let selectedCells = [getCellMeta(cell!)];
      const lastCell = this.spreadsheet.store.get('lastClickedCell');

      // 处理shift区间多选
      if (
        this.isRangeSelection &&
        lastCell &&
        lastCell.cellType === cell!.cellType &&
        lastCell.getMeta().level === meta.level
      ) {
        const { rowsHierarchy, colsHierarchy } = facet.getLayoutResult();
        const [rowMaxLevel, colMaxLevel] = [
          rowsHierarchy.maxLevel,
          colsHierarchy.maxLevel,
        ];
        const { start, end } = getRangeIndex(lastCell.getMeta(), meta);

        if (cell instanceof DataCell) {
          selectedCells = this.handleSeriesNumberRowSelected(
            start.rowIndex,
            end.rowIndex,
            cell,
          );
        } else if (
          cell?.cellType === CellType.ROW_CELL &&
          meta.level === rowMaxLevel
        ) {
          selectedCells = this.handleRowSelected(
            start.rowIndex,
            end.rowIndex,
            cell,
          );
        } else if (
          cell?.cellType === CellType.COL_CELL &&
          meta.level === colMaxLevel
        ) {
          selectedCells = this.handleColSelected(
            start.colIndex,
            end.colIndex,
            cell,
          );
        }

        /*
         * 兼容行列多选
         * Set the header cells (colCell or RowCell)  selected information and update the dataCell state.
         */
        interaction.changeState({
          cells: selectedCells,
          stateName: InteractionStateName.SELECTED,
        });
      } else {
        if (isEmpty(interaction.getCells())) {
          interaction.removeIntercepts([InterceptType.HOVER]);
        }

        this.spreadsheet.store.set('lastClickedCell', cell);
      }

      const selectedCellIds = selectedCells.map(({ id }) => id);

      // Update the interaction state of all the selected cells:  header cells(colCell or RowCell) and dataCells belong to them.
      interaction.updateCells(facet.getHeaderCells(selectedCellIds));

      this.spreadsheet.emit(
        S2Event.GLOBAL_SELECTED,
        interaction.getActiveCells(),
      );
    }
  };

  private handleSeriesNumberRowSelected(
    startIndex: number,
    endIndex: number,
    cell: S2CellType<ViewMeta>,
  ) {
    // table模式下序列号行头
    const cellIdSufFix = this.spreadsheet.facet.getColLeafNodes()[0].id;

    return range(startIndex, endIndex + 1).map((row) => {
      const cellIdPrefix = String(row);

      return {
        id: `${cellIdPrefix}-${cellIdSufFix}`,
        colIndex: 0,
        rowIndex: row,
        type: cell.cellType,
      };
    });
  }

  private handleRowSelected(
    startIndex: number,
    endIndex: number,
    cell: S2CellType<ViewMeta>,
  ) {
    // ROW_CELL类型 最后一个Level支持区间选择
    return this.spreadsheet.facet
      .getRowNodes()
      .filter(({ rowIndex }) => inRange(rowIndex, startIndex, endIndex + 1))
      .map((e) => {
        return {
          id: e.id,
          colIndex: e.colIndex,
          rowIndex: e.rowIndex,
          type: cell.cellType,
        };
      });
  }

  private handleColSelected(
    startIndex: number,
    endIndex: number,
    cell: S2CellType<ViewMeta>,
  ) {
    // COL_CELL类型 最后一个Level支持区间选择
    return this.spreadsheet.facet
      .getColLeafNodes()
      .filter(({ colIndex }) => inRange(colIndex, startIndex, endIndex + 1))
      .map((e) => {
        return {
          id: e.id,
          colIndex: e.colIndex,
          rowIndex: e.rowIndex,
          type: cell.cellType,
        };
      });
  }
}
