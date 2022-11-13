import { forEach } from 'lodash';
import { ColCell, RowCell, TableSeriesCell } from '../../cell';
import { getDataCellId, selectedCellHighlightAdaptor } from '../cell/data-cell';
import {
  InteractionKeyboardKey,
  InteractionStateName,
  S2Event,
} from '../../common/constant';
import type {
  CellMeta,
  S2CellType,
  ViewMeta,
  HeaderCellMeta,
} from '../../common/interface';
import type { SpreadSheet } from '../../sheet-type';
import type { Node } from '../../facet/layout/node';
import {
  getActiveHoverRowColCells,
  updateAllColHeaderCellState,
} from './hover-event';

export const isMultiSelectionKey = (e: KeyboardEvent) => {
  return [InteractionKeyboardKey.META, InteractionKeyboardKey.CONTROL].includes(
    e.key as InteractionKeyboardKey,
  );
};

export const getCellMeta = (cell: S2CellType) => {
  const meta = cell.getMeta();
  const { id, colIndex, rowIndex, rowQuery } = meta;
  return {
    id,
    colIndex,
    rowIndex,
    type: cell.cellType,
    rowQuery,
  };
};

export const getHeaderCellMeta = (cell: S2CellType): HeaderCellMeta => {
  const meta = cell.getMeta();
  const { id } = meta;
  return {
    id,
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

export function updateRowColCells(meta: ViewMeta) {
  const { rowId, colId, spreadsheet } = meta;
  const { interaction } = spreadsheet;

  updateAllColHeaderCellState(
    colId,
    interaction.getAllColHeaderCells(),
    InteractionStateName.SELECTED,
  );

  if (rowId) {
    const allRowHeaderCells = getRowCellForSelectedCell(meta, spreadsheet);
    forEach(allRowHeaderCells, (cell: RowCell) => {
      cell.updateByState(InteractionStateName.SELECTED);
    });
  }
}

export const getRowHeaderByCellId = (
  cellId: string,
  s2: SpreadSheet,
): Node[] => {
  return s2.getRowNodes().filter((node: Node) => cellId.includes(node.id));
};

export const getColHeaderByCellId = (
  cellId: string,
  s2: SpreadSheet,
): Node[] => {
  return s2.getColumnNodes().filter((node: Node) => cellId.includes(node.id));
};

export const getRowColHeaderCellBySelectedCellHighlight = (
  cellId: string,
  s2: SpreadSheet,
): Node[] => {
  const { colHeader, rowHeader } = selectedCellHighlightAdaptor(
    s2.options.interaction.selectedCellHighlight,
  );

  const getters = [
    {
      shouldGet: rowHeader,
      getter: getRowHeaderByCellId,
    },
    {
      shouldGet: colHeader,
      getter: getColHeaderByCellId,
    },
  ];

  return getters
    .filter((item) => item.shouldGet)
    .reduce((s, i) => {
      return [...s, ...i.getter(cellId, s2)];
    }, []);
};
