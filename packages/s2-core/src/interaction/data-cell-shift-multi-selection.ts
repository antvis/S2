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
import { ViewMeta } from '@/common/interface';
import { DataCell } from '@/cell';
import { Node } from '@/facet/layout/node';

export class DataCellShiftMultiSelection
  extends BaseEvent
  implements BaseEventImplement
{
  private isShiftMultiSelection = false;

  public bindEvents() {
    this.bindKeyboardDown();
    this.bindDataCellClick();
    this.bindRowColCellClick();
    this.bindKeyboardUp();
  }

  private bindKeyboardDown() {
    this.spreadsheet.on(
      S2Event.GLOBAL_KEYBOARD_DOWN,
      (event: KeyboardEvent) => {
        if (event.key === InteractionKeyboardKey.SHIFT) {
          this.isShiftMultiSelection = true;
          this.spreadsheet.interaction.addIntercepts([InterceptType.CLICK]);
        }
      },
    );
  }

  private bindKeyboardUp() {
    this.spreadsheet.on(S2Event.GLOBAL_KEYBOARD_UP, (event: KeyboardEvent) => {
      if (event.key === InteractionKeyboardKey.SHIFT) {
        this.isShiftMultiSelection = false;
        this.spreadsheet.interaction.removeIntercepts([InterceptType.CLICK]);
      }
    });
  }

  private bindRowColCellClick() {
    this.spreadsheet.on(S2Event.ROW_CELL_CLICK, (event: Event) => {
      this.handleRowColClick(event);
    });
    this.spreadsheet.on(S2Event.COL_CELL_CLICK, (event: Event) => {
      this.handleRowColClick(event);
    });
  }

  private getShiftSelectRange(start: ViewMeta, end: ViewMeta) {
    const minRowIndex = Math.min(start.rowIndex, end.rowIndex);
    const maxRowIndex = Math.max(start.rowIndex, end.rowIndex);
    const minColIndex = Math.min(start.colIndex, end.colIndex);
    const maxColIndex = Math.max(start.colIndex, end.colIndex);
    return {
      start: {
        rowIndex: minRowIndex,
        colIndex: minColIndex,
      },
      end: {
        rowIndex: maxRowIndex,
        colIndex: maxColIndex,
      },
    };
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

      // 保留按shift之前最后一个点击的cell
      if (!this.isShiftMultiSelection) {
        this.spreadsheet.store.set('lastClickCell', cell);
      }

      if (this.isShiftMultiSelection) {
        const lastCell = this.spreadsheet.store.get('lastClickCell');

        // 同类型支持shift区间多选
        if (!lastCell || lastCell.cellType !== cell.cellType) {
          this.spreadsheet.store.set('lastClickCell', cell);
          interaction.clearState();
          interaction.changeState({
            cells: [cell].map((item) => getCellMeta(item)),
            stateName: InteractionStateName.SELECTED,
          });
          return;
        }
        const { start, end } = this.getShiftSelectRange(
          lastCell.getMeta() as ViewMeta,
          cell.getMeta(),
        );

        const cells = range(start.colIndex, end.colIndex + 1).flatMap((col) => {
          const cellIdSufFix =
            this.spreadsheet.facet.layoutResult.colLeafNodes[col].id;
          return range(start.rowIndex, end.rowIndex + 1).map((row) => {
            const cellIdPrefix = this.spreadsheet.facet.getSeriesNumberWidth()
              ? String(row)
              : this.spreadsheet.facet.layoutResult.rowLeafNodes[row].id;
            return {
              id: cellIdPrefix + '-' + cellIdSufFix,
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
      }
    });
  }

  private handleRowColClick = (event: Event) => {
    event.stopPropagation();
    const { interaction } = this.spreadsheet;
    const cell = this.spreadsheet.getCell(event.target);
    const meta = cell?.getMeta() as Node;

    if (!isNil(meta.x)) {
      interaction.addIntercepts([InterceptType.HOVER]);
      let selectedCells = [getCellMeta(cell)];
      const lastCell = this.spreadsheet.store.get('lastClickCell');
      // 处理shift区间多选
      if (
        this.isShiftMultiSelection &&
        lastCell &&
        lastCell.cellType === cell.cellType &&
        lastCell.getMeta().level === cell.getMeta().level
      ) {
        const { start, end } = this.getShiftSelectRange(
          lastCell.getMeta() as ViewMeta,
          cell.getMeta() as ViewMeta,
        );
        if (cell instanceof DataCell) {
          // table模式下序列号行头
          const cellIdSufFix =
            this.spreadsheet.facet.layoutResult.colLeafNodes[0].id;
          selectedCells = range(start.rowIndex, end.rowIndex + 1).map((row) => {
            const cellIdPrefix = String(row);
            return {
              id: cellIdPrefix + '-' + cellIdSufFix,
              colIndex: 0,
              rowIndex: row,
              type: cell.cellType,
            };
          });
        } else if (
          cell.cellType === CellTypes.ROW_CELL &&
          cell.getMeta().level ===
            this.spreadsheet.facet.layoutResult.rowsHierarchy.maxLevel
        ) {
          // ROW_CELL 最后一个Level支持区间选择
          selectedCells = this.spreadsheet.facet.layoutResult.rowNodes
            .filter(({ rowIndex }) =>
              inRange(rowIndex, start.rowIndex, end.rowIndex + 1),
            )
            .map((e) => ({
              id: e.id,
              colIndex: e.colIndex,
              rowIndex: e.rowIndex,
              type: cell.cellType,
            }));
        } else if (
          cell.cellType === CellTypes.COL_CELL &&
          cell.getMeta().level ===
            this.spreadsheet.facet.layoutResult.colsHierarchy.maxLevel
        ) {
          // Col_CELL 最后一个Level支持区间选择
          selectedCells = this.spreadsheet.facet.layoutResult.colLeafNodes
            .filter(({ colIndex }) =>
              inRange(colIndex, start.colIndex, end.colIndex + 1),
            )
            .map((e) => ({
              id: e.id,
              colIndex: e.colIndex,
              rowIndex: e.rowIndex,
              type: cell.cellType,
            }));
        }
        // 兼容行列多选
        // Set the header cells (colCell or RowCell)  selected information and update the dataCell state.
        interaction.changeState({
          cells: selectedCells,
          stateName: InteractionStateName.SELECTED,
        });
      } else {
        this.spreadsheet.store.set('lastClickCell', cell);
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
}
