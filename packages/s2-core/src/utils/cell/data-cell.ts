import { isEqual, forEach, isBoolean } from 'lodash';
import type { DataCell } from '../../cell';
import type { SpreadSheet } from '../../sheet-type';
import {
  EXTRA_FIELD,
  VALUE_FIELD,
  InteractionStateName,
  CellTypes,
  type InteractionCellSelectedHighlightType,
} from '../../common/constant';
import type {
  CellMeta,
  Data,
  FilterDataItemCallback,
  MappingDataItemCallback,
  S2CellType,
  HeaderCellMeta,
} from '../../common/interface';

export const handleDataItem = (
  data: Data,
  callback?: FilterDataItemCallback | MappingDataItemCallback,
) => {
  return callback
    ? callback(data[EXTRA_FIELD] as string, data[VALUE_FIELD])
    : data[VALUE_FIELD];
};

/**
 * @description  Determine if the current cell belongs to Cells
 * @param cells active cells
 * @param currentCell current activated cell
 */
export const includeCell = (
  cells: Array<CellMeta | HeaderCellMeta>,
  currentCell: S2CellType,
) => {
  const currentId = currentCell.getMeta().id;
  return cells.some((cell) => {
    return isEqual(cell.id, currentId);
  });
};

export const SEPARATOR = '-';

export const getDataCellId = (rowIndex: string, colIndex: string) => {
  return `${rowIndex}${SEPARATOR}${colIndex}`;
};

export const splitDataCellId = (id: string) => {
  const [rowId, colId] = id.split(SEPARATOR);
  return { rowId, colId };
};

export const selectedCellHighlightAdaptor = (
  selectedCellHighlight?: boolean | InteractionCellSelectedHighlightType,
) => {
  if (isBoolean(selectedCellHighlight)) {
    return {
      rowHeader: selectedCellHighlight,
      colHeader: selectedCellHighlight,
      rowCells: false,
      colCells: false,
    };
  }

  const {
    rowHeader = false,
    colHeader = false,
    rowCells = false,
    colCells = false,
  } = selectedCellHighlight ?? {};

  return {
    rowHeader,
    colHeader,
    rowCells,
    colCells,
  };
};

export const shouldUpdateBySelectedCellsHighlight = (s2: SpreadSheet) => {
  const { rowCells, colCells, rowHeader, colHeader } =
    selectedCellHighlightAdaptor(s2.options.interaction.selectedCellHighlight);

  return rowCells || colCells || rowHeader || colHeader;
};

/**
 * highlight cells of the row
 * @param cells cells selected
 * @param dataCell cell to render
 */
export const updateCurrentRowCellState = (
  cells: CellMeta[],
  dataCell: DataCell,
) => {
  forEach(cells, (cell) => {
    if (cell.rowIndex === dataCell.getMeta().rowIndex) {
      dataCell.updateByState(InteractionStateName.SELECTED);
    }
  });
};

/**
 * highlight cells of the column
 * @param cells cells selected
 * @param dataCell cell to render
 */
export const updateCurrentColumnCellState = (
  cells: CellMeta[],
  dataCell: DataCell,
) => {
  forEach(cells, (cell) => {
    if (cell.colIndex === dataCell.getMeta().colIndex) {
      dataCell.updateByState(InteractionStateName.SELECTED);
    }
  });
};

/**
 * highlight cells
 * @param cells cells selected
 * @param dataCell cell to render
 */
export const updateCurrentCellState = (
  cells: CellMeta[],
  dataCell: DataCell,
) => {
  forEach(cells, (cell) => {
    if (
      cell.rowIndex === dataCell.getMeta().rowIndex &&
      cell.colIndex === dataCell.getMeta().colIndex
    ) {
      dataCell.updateByState(InteractionStateName.SELECTED);
    }
  });
};

export const updateBySelectedCellsHighlight = (
  cells: CellMeta[],
  dataCell: DataCell,
  s2: SpreadSheet,
) => {
  const { rowHeader, colHeader, rowCells, colCells } =
    selectedCellHighlightAdaptor(s2.options.interaction.selectedCellHighlight);

  const isRowCell = dataCell.cellType === CellTypes.ROW_CELL;
  const showSNWhenRowHeaderHighlight =
    s2.isTableMode() && s2.options.showSeriesNumber && rowHeader && isRowCell;

  if (rowCells || showSNWhenRowHeaderHighlight) {
    updateCurrentRowCellState(cells, dataCell);
  }
  if (colCells) {
    updateCurrentColumnCellState(cells, dataCell);
  }
  if (rowHeader || colHeader) {
    updateCurrentCellState(cells, dataCell);
  }
};
