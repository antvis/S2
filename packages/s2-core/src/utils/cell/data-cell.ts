import { isEqual, forEach, isBoolean } from 'lodash';
import type { DataCell } from '../../cell';
import type { SpreadSheet } from '../../sheet-type';
import {
  EXTRA_FIELD,
  VALUE_FIELD,
  InteractionStateName,
  CellTypes,
  EMPTY_PLACEHOLDER,
} from '../../common/constant';
import type {
  CellMeta,
  Data,
  FilterDataItemCallback,
  MappingDataItemCallback,
  S2CellType,
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
export const includeCell = (cells: CellMeta[], currentCell: S2CellType) => {
  const currentId = currentCell.getMeta().id;
  return cells.some((cell) => {
    return isEqual(cell.id, currentId);
  });
};

export const getDataCellId = (rowIndex: string, colIndex: string) => {
  return `${rowIndex}${EMPTY_PLACEHOLDER}${colIndex}`;
};

export const shouldUpdateBySelectedCellsHighlight = (s2: SpreadSheet) => {
  const { currentRow, currentCol, rowHeader, colHeader } =
    s2.interaction.getSelectedCellHighlight();
  return currentRow || currentCol || rowHeader || colHeader;
};

export const isDataCell = (cell: CellMeta) => {
  return cell.type === CellTypes.DATA_CELL;
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
    if (isDataCell(cell) && cell.rowIndex === dataCell.getMeta().rowIndex) {
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
    if (isDataCell(cell) && cell.colIndex === dataCell.getMeta().colIndex) {
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
      isDataCell(cell) &&
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
  const { rowHeader, colHeader, currentRow, currentCol } =
    s2.interaction.getSelectedCellHighlight();

  const isRowCell = dataCell.cellType === CellTypes.ROW_CELL;
  // 高亮序号
  const showSNWhenRowHeaderHighlight =
    s2.isTableMode() && s2.options.showSeriesNumber && rowHeader && isRowCell;

  if (currentRow || showSNWhenRowHeaderHighlight) {
    updateCurrentRowCellState(cells, dataCell);
  }
  if (currentCol) {
    updateCurrentColumnCellState(cells, dataCell);
  }
  if (rowHeader || colHeader) {
    updateCurrentCellState(cells, dataCell);
  }
};
