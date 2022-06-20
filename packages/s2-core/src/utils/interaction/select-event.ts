import { ColCell, RowCell, TableSeriesCell } from '../../cell';
import { getDataCellId } from '../cell/data-cell';
import {
  InteractionKeyboardKey,
  InteractionStateName,
  S2Event,
} from '../../common/constant';
import type { CellMeta, S2CellType, ViewMeta } from '../../common/interface';
import type { SpreadSheet } from '../../sheet-type';
import { getActiveHoverRowColCells } from './hover-event';

export const isMultiSelectionKey = (e: KeyboardEvent) => {
  return [InteractionKeyboardKey.META, InteractionKeyboardKey.CONTROL].includes(
    e.key as InteractionKeyboardKey,
  );
};

export const getCellMeta = (cell: S2CellType) => {
  const meta = cell.getMeta();
  const { id, colIndex, rowIndex } = meta;
  return {
    id,
    colIndex,
    rowIndex,
    type: cell.cellType,
  };
};

export const selectCells = (spreadsheet: SpreadSheet, cells: CellMeta[]) => {
  const { interaction } = spreadsheet;
  interaction.changeState({
    stateName: InteractionStateName.SELECTED,
    cells,
  });
  spreadsheet.emit(S2Event.GLOBAL_SELECTED, interaction.getActiveCells());
};

export function getRangeIndex<T extends CellMeta | ViewMeta>(start: T, end: T) {
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

export function getRowCellForSelectedCell(
  meta: ViewMeta,
  spreadsheet: SpreadSheet,
): (ColCell | RowCell | TableSeriesCell)[] {
  const { interaction, facet, options } = spreadsheet;

  if (spreadsheet.isTableMode()) {
    if (!options.showSeriesNumber) {
      return [];
    }
    const colId = facet.layoutResult.colLeafNodes[0].id;
    const id = getDataCellId(String(meta.rowIndex), colId);
    const result: TableSeriesCell[] = [];
    const rowCell = interaction
      .getAllCells()
      .find((cell) => cell.getMeta().id === id);

    if (rowCell && rowCell instanceof TableSeriesCell) {
      result.push(rowCell);
    }
    return result;
  }

  return getActiveHoverRowColCells(
    meta.rowId,
    interaction.getAllRowHeaderCells(),
    spreadsheet.isHierarchyTreeType(),
  );
}
