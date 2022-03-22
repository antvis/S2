import { Event } from '@antv/g-canvas';
import { inRange, isNil, range } from 'lodash';
import { getCellMeta } from 'src/utils/interaction/select-event';
import { BaseEvent, BaseEventImplement } from './base-interaction';
import {
  InterceptType,
  InteractionKeyboardKey,
  InteractionStateName,
  S2Event,
  CellTypes,
} from '@/common/constant';
import { S2CellType, ViewMeta } from '@/common/interface';
import { DataCell } from '@/cell';
import { Node } from '@/facet/layout/node';
import { getRangeIndex } from '@/utils/interaction/select-event';

export class RangeSelection extends BaseEvent implements BaseEventImplement {
  private isRangeSelection = false;

  public bindEvents() {
    this.bindKeyboardDown();
    this.bindDataCellClick();
    this.bindColCellClick();
    this.bindKeyboardUp();
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
        this.isRangeSelection = false;
        this.spreadsheet.interaction.removeIntercepts([InterceptType.CLICK]);
      }
    });
  }

  private bindColCellClick() {
    if (this.spreadsheet.isTableMode()) {
      // series-number click
      this.spreadsheet.on(S2Event.ROW_CELL_CLICK, (event: Event) => {
        this.handleColClick(event);
      });
    }
    this.spreadsheet.on(S2Event.COL_CELL_CLICK, (event: Event) => {
      this.handleColClick(event);
    });
  }

  private bindDataCellClick() {
    this.spreadsheet.on(S2Event.DATA_CELL_CLICK, (event: Event) => {
      event.stopPropagation();
      const cell: DataCell = this.spreadsheet.getCell(event.target);
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
        const cellIdSuffix =
          this.spreadsheet.facet.layoutResult.colLeafNodes[col].id;
        return range(start.rowIndex, end.rowIndex + 1).map((row) => {
          const cellIdPrefix = this.spreadsheet.facet.getSeriesNumberWidth()
            ? String(row)
            : this.spreadsheet.facet.layoutResult.rowLeafNodes[row].id;
          return {
            id: cellIdPrefix + '-' + cellIdSuffix,
            colIndex: col,
            rowIndex: row,
            type: cell.cellType,
          };
        });
      });

      interaction.addIntercepts([InterceptType.CLICK, InterceptType.HOVER]);
      this.spreadsheet.hideTooltip();
      interaction.changeState({
        cells,
        stateName: InteractionStateName.SELECTED,
      });
      this.spreadsheet.emit(
        S2Event.GLOBAL_SELECTED,
        interaction.getActiveCells(),
      );
    });
  }

  private handleColClick = (event: Event) => {
    event.stopPropagation();
    const { interaction } = this.spreadsheet;
    const cell = this.spreadsheet.getCell(event.target);
    const meta = cell?.getMeta() as Node;

    if (!isNil(meta?.x)) {
      interaction.addIntercepts([InterceptType.HOVER]);
      let selectedCells = [getCellMeta(cell)];
      const lastCell = this.spreadsheet.store.get('lastClickedCell');
      // 处理shift区间多选
      if (
        this.isRangeSelection &&
        lastCell &&
        lastCell.cellType === cell.cellType &&
        lastCell.getMeta().level === cell.getMeta().level
      ) {
        const [rowMaxLevel, colMaxLevel] = [
          this.spreadsheet.facet.layoutResult.rowsHierarchy.maxLevel,
          this.spreadsheet.facet.layoutResult.colsHierarchy.maxLevel,
        ];
        const { start, end } = getRangeIndex(
          lastCell.getMeta() as ViewMeta,
          cell.getMeta() as ViewMeta,
        );
        if (cell instanceof DataCell) {
          selectedCells = this.handleSeriesNumberRowSelected(
            start.rowIndex,
            end.rowIndex,
            cell,
          );
        } else if (
          cell.cellType === CellTypes.ROW_CELL &&
          cell.getMeta().level === rowMaxLevel
        ) {
          selectedCells = this.handleRowSelected(
            start.rowIndex,
            end.rowIndex,
            cell,
          );
        } else if (
          cell.cellType === CellTypes.COL_CELL &&
          cell.getMeta().level === colMaxLevel
        ) {
          selectedCells = this.handleColSelected(
            start.colIndex,
            end.colIndex,
            cell,
          );
        }
        // 兼容行列多选
        // Set the header cells (colCell or RowCell)  selected information and update the dataCell state.
        interaction.changeState({
          cells: selectedCells,
          stateName: InteractionStateName.SELECTED,
        });
      } else {
        this.spreadsheet.store.set('lastClickedCell', cell);
      }

      const selectedCellIds = selectedCells.map(({ id }) => id);
      // Update the interaction state of all the selected cells:  header cells(colCell or RowCell) and dataCells belong to them.
      interaction.updateCells(
        interaction.getRowColActiveCells(selectedCellIds),
      );

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
    const cellIdSufFix = this.spreadsheet.facet.layoutResult.colLeafNodes[0].id;
    return range(startIndex, endIndex + 1).map((row) => {
      const cellIdPrefix = String(row);
      return {
        id: cellIdPrefix + '-' + cellIdSufFix,
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
    return this.spreadsheet.facet.layoutResult.rowNodes
      .filter(({ rowIndex }) => inRange(rowIndex, startIndex, endIndex + 1))
      .map((e) => ({
        id: e.id,
        colIndex: e.colIndex,
        rowIndex: e.rowIndex,
        type: cell.cellType,
      }));
  }

  private handleColSelected(
    startIndex: number,
    endIndex: number,
    cell: S2CellType<ViewMeta>,
  ) {
    // COL_CELL类型 最后一个Level支持区间选择
    return this.spreadsheet.facet.layoutResult.colLeafNodes
      .filter(({ colIndex }) => inRange(colIndex, startIndex, endIndex + 1))
      .map((e) => ({
        id: e.id,
        colIndex: e.colIndex,
        rowIndex: e.rowIndex,
        type: cell.cellType,
      }));
  }
}
