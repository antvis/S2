import { forEach, reduce, uniqBy } from 'lodash';
import { ColCell, RowCell, TableSeriesCell } from '../../cell';
import {
  CellTypes,
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
import {
  getActiveHoverRowColCells,
  updateAllColHeaderCellState,
} from './hover-event';

type HeaderGetter = {
  getter: typeof getRowHeaderByCellId;
  shouldGet?: boolean;
};

export const isMultiSelectionKey = (e: KeyboardEvent) =>
  [InteractionKeyboardKey.META, InteractionKeyboardKey.CONTROL].includes(
    e.key as InteractionKeyboardKey,
  );

export const getCellMeta = (cell: S2CellType): CellMeta => {
  const meta = cell.getMeta();
  const { id, colIndex, rowIndex, rowQuery } = meta || {};

  return {
    id,
    colIndex,
    rowIndex,
    rowQuery,
    type: cell instanceof TableSeriesCell ? CellTypes.ROW_CELL : cell.cellType,
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

export function getRangeIndex<T extends CellMeta | ViewMeta | Node>(
  start: T,
  end: T,
) {
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
    meta.rowId!,
    interaction.getAllRowHeaderCells(),
    spreadsheet.isHierarchyTreeType(),
  );
}

export function updateRowColCells(meta: ViewMeta) {
  const { rowId, colId, spreadsheet } = meta;
  const { interaction } = spreadsheet;

  updateAllColHeaderCellState(
    colId!,
    interaction.getAllColHeaderCells(),
    InteractionStateName.SELECTED,
  );

  if (rowId) {
    const allRowHeaderCells = getRowCellForSelectedCell(meta, spreadsheet);

    forEach(allRowHeaderCells, (cell) => {
      cell.updateByState(InteractionStateName.SELECTED);
    });
  }
}

export const getRowHeaderByCellId = (cellId: string, s2: SpreadSheet): Node[] =>
  s2.getRowNodes().filter((node: Node) => cellId.includes(node.id));

export const getColHeaderByCellId = (cellId: string, s2: SpreadSheet): Node[] =>
  s2.getColumnNodes().filter((node: Node) => cellId.includes(node.id));

export const getInteractionCells = (
  cell: CellMeta,
  s2: SpreadSheet,
): Array<CellMeta> => {
  const { colHeader, rowHeader } = s2.interaction.getSelectedCellHighlight();

  const headerGetters: HeaderGetter[] = [
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
    .reduce((acc: Node[], i) => [...acc, ...i.getter(cell.id, s2)], [])
    .filter((node) => !!node.belongsCell)
    .map((node) => getCellMeta(node.belongsCell!));

  return [cell, ...selectedHeaderCells];
};

export const getInteractionCellsBySelectedCells = (
  selectedCells: CellMeta[],
  s2: SpreadSheet,
): Array<CellMeta> => {
  const headerSelectedCell: CellMeta[] = reduce(
    selectedCells,
    (_cells: CellMeta[], selectedCell) => [
      ..._cells,
      ...getInteractionCells(selectedCell, s2),
    ],
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
