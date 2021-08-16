import { S2CellType } from '@/common/interface';
import { SpreadSheet } from '@/sheet-type';
import { copyToClipboard } from '.';

export function keyEqualTo(key: string, compareKey: string) {
  if (!key || !compareKey) {
    return false;
  }
  return String(key).toLowerCase() === String(compareKey).toLowerCase();
}

export const processCopyData = (cells: S2CellType[][]): string => {
  const getRowString = (pre: string, cur: S2CellType) =>
    pre + (cur ? cur.getMeta().fieldValue : '') + '\t';
  const getColString = (pre: string, cur: S2CellType[]) =>
    pre + cur.reduce(getRowString, '') + '\n';
  return cells.reduce(getColString, '');
};

export const getTwoDimData = (cells: S2CellType[]) => {
  if (!cells?.length) return [];
  const [minCell, maxCell] = [
    { row: Infinity, col: Infinity },
    { row: 0, col: 0 },
  ];
  // get left-top cell and right-bottom cell position
  cells.forEach((e) => {
    const { rowIndex, colIndex } = e.getMeta();
    minCell.col = Math.min(colIndex, minCell.col);
    minCell.row = Math.min(rowIndex, minCell.row);
    maxCell.col = Math.max(colIndex, maxCell.col);
    maxCell.row = Math.max(rowIndex, maxCell.row);
  });
  const [rowLen, colLen] = [
    maxCell.row - minCell.row + 1,
    maxCell.col - minCell.col + 1,
  ];
  const twoDimDataArray: S2CellType[][] = new Array(rowLen)
    .fill('')
    .map(() => new Array(colLen).fill(''));

  cells.forEach((e) => {
    const { rowIndex, colIndex } = e.getMeta();
    const [diffRow, diffCol] = [rowIndex - minCell.row, colIndex - minCell.col];
    twoDimDataArray[diffRow][diffCol] = e;
  });
  return twoDimDataArray;
};

export const getSelectedData = (spreadsheet: SpreadSheet) => {
  const cells = spreadsheet.interaction.getActiveCells();
  const data = processCopyData(getTwoDimData(cells));
  if (data) {
    copyToClipboard(data);
  }
  return data;
};
