import { reduce, uniqBy } from 'lodash';
import { ColCell, RowCell, TableSeriesCell } from '../../cell';
import {
  InteractionKeyboardKey,
  InteractionStateName,
  S2Event,
} from '../../common/constant';
import type {
  CellMeta,
  OnUpdateCells,
  S2CellType,
  ViewMeta,
} from '../../common/interface';
import type { Node } from '../../facet/layout/node';
import type { SpreadSheet } from '../../sheet-type';
import { getDataCellId } from '../cell/data-cell';
import { getActiveHoverRowColCells } from './hover-event';

export const isMultiSelectionKey = (e: KeyboardEvent) => {
  return [InteractionKeyboardKey.META, InteractionKeyboardKey.CONTROL].includes(
    e.key as InteractionKeyboardKey,
  );
};

export const isMouseEventWithMeta = (e: MouseEvent) => {
  return e.ctrlKey || e.metaKey;
};

export const getCellMeta = (cell: S2CellType): CellMeta => {
  const meta = cell.getMeta();
  const { id, colIndex, rowIndex, rowQuery } = meta || {};
  return {
    id,
    colIndex,
    rowIndex,
    type: cell.cellType,
    rowQuery,
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

export const getInteractionCells = (
  cell: CellMeta,
  s2: SpreadSheet,
): Array<CellMeta> => {
  const { colHeader, rowHeader } = s2.interaction.getSelectedCellHighlight();

  const headerGetters = [
    {
      shouldGet: rowHeader,
      getter: getRowHeaderByCellId,
    },
    {
      shouldGet: colHeader,
      getter: getColHeaderByCellId,
    },
  ];

  const selectedHeaderCells = headerGetters
    .filter((item) => item.shouldGet)
    .reduce((nodes, i) => [...nodes, ...i.getter(cell.id, s2)], [])
    .filter((node) => !!node.belongsCell)
    .map((node) => getCellMeta(node.belongsCell));

  return [cell, ...selectedHeaderCells];
};

export const getInteractionCellsBySelectedCells = (
  selectedCells: CellMeta[],
  s2: SpreadSheet,
): Array<CellMeta> => {
  const headerSelectedCell: CellMeta[] = reduce(
    selectedCells,
    (_cells, selectedCell) => {
      return [..._cells, ...getInteractionCells(selectedCell, s2)];
    },
    [],
  );

  // headerSelectedCell 会有重复的 cell，在这里统一去重
  return uniqBy([...selectedCells, ...headerSelectedCell], 'id');
};

export const afterSelectDataCells: OnUpdateCells = (root, updateDataCells) => {
  const { colHeader, rowHeader } = root.getSelectedCellHighlight();
  if (colHeader) {
    root.updateCells(root.getAllColHeaderCells());
  }
  if (rowHeader) {
    root.updateCells(root.getAllRowHeaderCells());
  }
  updateDataCells();
};
