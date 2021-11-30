import { getCsvString } from './export-worker';
import { copyToClipboard } from '@/utils/export';
import { CellMeta } from '@/common/interface';
import { SpreadSheet } from '@/sheet-type';
import { CellTypes, InteractionStateName } from '@/common/constant/interaction';
import { DataType } from '@/data-set/interface';
import { ID_SEPARATOR } from '@/common';

export function keyEqualTo(key: string, compareKey: string) {
  if (!key || !compareKey) {
    return false;
  }
  return String(key).toLowerCase() === String(compareKey).toLowerCase();
}

const format = (
  meta: CellMeta,
  displayData: DataType[],
  spreadsheet: SpreadSheet,
) => {
  const ids = meta.id.split(ID_SEPARATOR);
  const fieldId = ids[ids.length - 1];
  const formatter = spreadsheet.dataSet.getFieldFormatter(fieldId);
  const value = displayData[meta.rowIndex][fieldId];
  if (formatter && spreadsheet.options.interaction.copyWithFormat) {
    return formatter(value);
  }
  return value;
};

const convertString = (v: string) => {
  if (/\t|\n/.test(v)) {
    return getCsvString(v);
  }
  return v;
};

export const processCopyData = (
  displayData: DataType[],
  cells: CellMeta[][],
  spreadsheet: SpreadSheet,
): string => {
  const getRowString = (pre: string, cur: CellMeta) =>
    pre +
    (cur ? convertString(format(cur, displayData, spreadsheet)) : '') +
    '\t';
  const getColString = (pre: string, cur: CellMeta[]) =>
    pre + cur.reduce(getRowString, '').slice(0, -1) + '\n';
  return cells.reduce(getColString, '').slice(0, -1);
};

export const getTwoDimData = (cells: CellMeta[]) => {
  if (!cells?.length) return [];
  const [minCell, maxCell] = [
    { row: Infinity, col: Infinity },
    { row: 0, col: 0 },
  ];
  // get left-top cell and right-bottom cell position
  cells.forEach((e) => {
    const { rowIndex, colIndex } = e;
    minCell.col = Math.min(colIndex, minCell.col);
    minCell.row = Math.min(rowIndex, minCell.row);
    maxCell.col = Math.max(colIndex, maxCell.col);
    maxCell.row = Math.max(rowIndex, maxCell.row);
  });
  const [rowLen, colLen] = [
    maxCell.row - minCell.row + 1,
    maxCell.col - minCell.col + 1,
  ];
  const twoDimDataArray: CellMeta[][] = new Array(rowLen)
    .fill('')
    .map(() => new Array(colLen).fill(''));

  cells.forEach((e) => {
    const { rowIndex, colIndex } = e;
    const [diffRow, diffCol] = [rowIndex - minCell.row, colIndex - minCell.col];
    twoDimDataArray[diffRow][diffCol] = e;
  });
  return twoDimDataArray;
};

const processAllSelected = (
  displayData: DataType[],
  spreadsheet: SpreadSheet,
) => {
  // 全选复制
  const selectedFiled = spreadsheet.dataCfg.fields.columns;
  return displayData.reduce((pre, cur) => {
    return (
      pre +
      selectedFiled
        .reduce((prev, curr) => prev + cur[curr] + '\t', '')
        .slice(0, -1) +
      '\n'
    );
  }, '');
};

const processColSelected = (
  displayData: DataType[],
  selectedCols: CellMeta[],
) => {
  const selectedFiled = selectedCols.map((e) => {
    const ids = e.id.split(ID_SEPARATOR);
    return ids[ids.length - 1];
  });
  return displayData.reduce((pre, cur) => {
    return (
      pre +
      selectedFiled
        .reduce((prev, curr) => prev + cur[curr] + '\t', '')
        .slice(0, -1) +
      '\n'
    );
  }, '');
};

const processRowSelected = (
  displayData: DataType[],
  selectedRows: CellMeta[],
) => {
  const selectedIndex = selectedRows.map((e) => e.rowIndex);
  return displayData
    .filter((e, i) => selectedIndex.includes(i))
    .map((e) =>
      Object.keys(e)
        .map((key) => e[key])
        .join('\t'),
    )
    .join('\n');
};

export const getSelectedData = (spreadsheet: SpreadSheet) => {
  const interaction = spreadsheet.interaction;
  const cells = interaction.getState().cells || [];
  let data: string;
  const selectedCols = cells.filter(({ type }) => type === CellTypes.COL_CELL);
  const selectedRows = cells.filter(({ type }) => type === CellTypes.ROW_CELL);

  const displayData = spreadsheet.dataSet.getDisplayDataSet();

  if (spreadsheet.isPivotMode()) {
    // 透视表之后实现
    return;
  }
  if (interaction.getCurrentStateName() === InteractionStateName.ALL_SELECTED) {
    data = processAllSelected(displayData, spreadsheet);
  } else if (selectedCols.length) {
    data = processColSelected(displayData, selectedCols);
  } else if (selectedRows.length) {
    data = processRowSelected(displayData, selectedRows);
  } else {
    if (!cells.length) {
      return;
    }
    // normal selected
    data = processCopyData(displayData, getTwoDimData(cells), spreadsheet);
  }

  if (data) {
    copyToClipboard(data);
  }
  return data;
};
