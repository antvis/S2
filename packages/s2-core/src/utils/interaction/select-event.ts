import {
  InteractionStateName,
  INTERACTION_STATE_INFO_KEY,
  S2Event,
} from '@/common/constant';
import { CellMeta, S2CellType, ViewMeta } from '@/common/interface';
import { SpreadSheet } from '@/sheet-type';

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
