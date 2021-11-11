import { copyToClipboard } from '@/utils/export';
import { Formatter, S2CellType, ViewMeta } from '@/common/interface';
import { SpreadSheet } from '@/sheet-type';
import { CellTypes, InteractionStateName } from '@/common/constant/interaction';

export function keyEqualTo(key: string, compareKey: string) {
  if (!key || !compareKey) {
    return false;
  }
  return String(key).toLowerCase() === String(compareKey).toLowerCase();
}

const format = (cell: S2CellType, spreadsheet: SpreadSheet) => {
  const meta = cell.getMeta();
  const rowField = meta.rowId;
  const rowMeta = spreadsheet.dataSet.getFieldMeta(rowField);
  let formatter: Formatter;
  if (rowMeta) {
    // format by row field
    formatter = spreadsheet.dataSet.getFieldFormatter(rowField);
  } else {
    // format by value field
    formatter = spreadsheet.dataSet.getFieldFormatter(meta.valueField);
  }
  if (formatter) {
    return formatter(meta.fieldValue);
  }
  return meta.fieldValue;
};

export const processCopyData = (
  cells: S2CellType[][],
  spreadsheet: SpreadSheet,
): string => {
  const getRowString = (pre: string, cur: S2CellType) =>
    pre + (cur ? format(cur, spreadsheet) : '') + '\t';
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

const processAllSelected = (spreadsheet: SpreadSheet) => {
  // 全选复制
  const selectedFiled = spreadsheet.dataCfg.fields.columns;
  return spreadsheet.dataCfg.data.reduce((pre, cur) => {
    return (
      pre +
      '\n' +
      selectedFiled.reduce((prev, curr) => prev + '\t' + cur[curr], '')
    );
  }, '');
};

const processColSelected = (
  spreadsheet: SpreadSheet,
  selectedCols: S2CellType<ViewMeta>[],
) => {
  const selectedFiled = selectedCols.map((e) => e.getMeta().field);
  return spreadsheet.dataCfg.data.reduce((pre, cur) => {
    return (
      pre +
      '\n' +
      selectedFiled.reduce((prev, curr) => prev + '\t' + cur[curr], '')
    );
  }, '');
};

const processRowSelected = (
  spreadsheet: SpreadSheet,
  selectedRows: S2CellType<ViewMeta>[],
) => {
  const selectedIndex = selectedRows.map((e) => e.getMeta().rowIndex);
  return spreadsheet.dataCfg.data
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
  const cells = interaction.getActiveCells();

  let data: string;
  const selectedCols = cells.filter(
    ({ cellType }) => cellType === CellTypes.COL_CELL,
  );
  const selectedRows = cells.filter(
    ({ cellType }) => cellType === CellTypes.ROW_CELL,
  );

  if (interaction.getCurrentStateName() === InteractionStateName.ALL_SELECTED) {
    data = processAllSelected(spreadsheet);
  } else if (selectedCols.length) {
    data = processColSelected(spreadsheet, selectedCols);
  } else if (selectedRows.length) {
    data = processRowSelected(spreadsheet, selectedRows);
  } else {
    // normal selected
    data = processCopyData(getTwoDimData(cells), spreadsheet);
  }
  if (data) {
    copyToClipboard(data);
  }
  return data;
};
