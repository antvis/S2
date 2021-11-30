import { copyToClipboard } from '@/utils/export';
import { CellMeta } from '@/common/interface';
import { SpreadSheet } from '@/sheet-type';
import { CellTypes, InteractionStateName } from '@/common/constant/interaction';
import { DataType } from '@/data-set/interface';

export function keyEqualTo(key: string, compareKey: string) {
  if (!key || !compareKey) {
    return false;
  }
  return String(key).toLowerCase() === String(compareKey).toLowerCase();
}

const newLine = '\r\n';
const newTab = '\t';

const getColNodeField = (spreadsheet: SpreadSheet, id: string) =>
  spreadsheet.getColumnNodes().find((col) => col.id === id)?.field;

const getFiledIdFromMeta = (meta: CellMeta, spreadsheet: SpreadSheet) => {
  const ids = meta.id.split('-');
  return getColNodeField(spreadsheet, ids[ids.length - 1]);
};

const getFormat = (meta: CellMeta, spreadsheet: SpreadSheet) => {
  const ids = meta.id.split('-');
  const fieldId = getColNodeField(spreadsheet, ids[ids.length - 1]);
  if (spreadsheet.options.interaction.copyWithFormat) {
    return spreadsheet.dataSet.getFieldFormatter(fieldId);
  }
  return (v: string) => v;
};

const getValueFromMeta = (
  meta: CellMeta,
  displayData: DataType[],
  spreadsheet: SpreadSheet,
) => {
  const fieldId = getFiledIdFromMeta(meta, spreadsheet);
  return displayData[meta.rowIndex][fieldId];
};

const format = (
  meta: CellMeta,
  displayData: DataType[],
  spreadsheet: SpreadSheet,
) => {
  const formatter = getFormat(meta, spreadsheet);
  return formatter(getValueFromMeta(meta, displayData, spreadsheet));
};

export const convertString = (v: string) => {
  if (/\n/.test(v)) {
    // 单元格内换行
    return '"' + v.replace(/\r\n?/g, '\n') + '"';
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
    newTab;
  const getColString = (pre: string, cur: CellMeta[]) =>
    pre + cur.reduce(getRowString, '').slice(0, -1) + newLine;
  return cells.reduce(getColString, '').slice(0, -2);
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

const processColSelected = (
  displayData: DataType[],
  spreadsheet: SpreadSheet,
  selectedCols: CellMeta[],
) => {
  const selectedFiled = selectedCols.length
    ? selectedCols.map((e) => getColNodeField(spreadsheet, e.id))
    : spreadsheet.dataCfg.fields.columns;
  return displayData
    .map((row) => {
      return selectedFiled
        .map((filed) => convertString(row[filed]))
        .join(newTab);
    })
    .join(newLine);
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
        .map((key) => convertString(e[key]))
        .join(newTab),
    )
    .join(newLine);
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
    data = processColSelected(displayData, spreadsheet, []);
  } else if (selectedCols.length) {
    data = processColSelected(displayData, spreadsheet, selectedCols);
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
