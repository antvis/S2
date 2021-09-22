import { copyToClipboard } from '.';
import { S2CellType } from '@/common/interface';
import { SpreadSheet } from '@/sheet-type';

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
  const interaction = spreadsheet.interaction;
  const cells = interaction.getActiveCells();

  let data;
  const selectedCols = cells.filter((e) => e.cellType === 'colCell');
  const selectedRows = cells.filter((e) => e.cellType === 'rowCell');

  if (false) {
    // 等待全选标记
    const selectedFiled = spreadsheet.dataCfg.fields.columns;
    data = spreadsheet.dataCfg.data.reduce((pre, cur) => {
      return (
        pre +
        '\n' +
        selectedFiled.reduce((prev, curr) => prev + '\t' + cur[curr], '')
      );
    }, '');
  } else if (selectedCols.length) {
    // col selected
    const selectedFiled = selectedCols.map((e) => e.getMeta().field);

    data = spreadsheet.dataCfg.data.reduce((pre, cur) => {
      return (
        pre +
        '\n' +
        selectedFiled.reduce((prev, curr) => prev + '\t' + cur[curr], '')
      );
    }, '');
  } else if (selectedRows.length) {
    // row selected
    const selectedIndex = selectedRows.map((e) => e.getMeta().rowIndex);
    data = spreadsheet.dataCfg.data
      .filter((e, i) => selectedIndex.includes(i))
      .map((e) =>
        Object.keys(e)
          .map((key) => e[key])
          .join('\t'),
      )
      .join('\n');
  } else {
    // normal selected
    data = processCopyData(getTwoDimData(cells));
  }
  if (data) {
    copyToClipboard(data);
  }
  return data;
};
