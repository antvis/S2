import { concat, every, isEmpty } from 'lodash';
import {
  type CellMeta,
  CellTypes,
  EMPTY_PLACEHOLDER,
  InteractionStateName,
  type S2CellType,
} from '../../../common';
import type { SpreadSheet } from '../../../sheet-type';
import { copyToClipboard } from '../index';
import type { ColCell, RowCell } from '../../../cell';
import { getSelectedCols, getSelectedRows } from '../method';
import {
  type CopyableList,
  CopyMIMEType,
  type FormatOptions,
} from '../interface';
import { getBrushHeaderCopyable } from './pivot-header-copy';
import {
  processSelectedAllPivot,
  processSelectedPivotByDataCell,
  processSelectedPivotByHeader,
} from './pivot-data-cell-copy';
import {
  processSelectedAllTable,
  processSelectedTableByDataCell,
  processSelectedTableByHeader,
} from './table-copy';

export const getHeaderNodeFromMeta = (
  meta: CellMeta,
  spreadsheet: SpreadSheet,
) => {
  const { rowIndex, colIndex } = meta;

  return [
    spreadsheet.getRowNodes().find((row) => row.rowIndex === rowIndex),
    spreadsheet.getColumnNodes().find((col) => col.colIndex === colIndex),
  ];
};

/**
 * 返回选中数据单元格生成的二维数组（ CellMeta[][]）
 * @param { CellMeta[] } cells
 * @return { CellMeta[][] }
 */
const getSelectedCellsMeta = (cells: CellMeta[]) => {
  if (!cells?.length) {
    return [];
  }

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

const processSelectedByHeader = (
  spreadsheet: SpreadSheet,
  selectedRows: CellMeta[],
): CopyableList => {
  if (spreadsheet.isPivotMode()) {
    return processSelectedPivotByHeader(spreadsheet, selectedRows);
  }

  return processSelectedTableByHeader(spreadsheet, selectedRows);
};

function getIsBrushHeader(interactedCells: S2CellType[]) {
  return isEmpty(interactedCells)
    ? false
    : every(
        interactedCells,
        (cell) =>
          cell.cellType === CellTypes.ROW_CELL ||
          cell.cellType === CellTypes.COL_CELL,
      );
}

function processSelectedByData(
  selectedCellsMeta: CellMeta[][],
  selectedColMetas: CellMeta[],
  selectedRowMetas: CellMeta[],
  spreadsheet: SpreadSheet,
): CopyableList {
  if (spreadsheet.isPivotMode()) {
    return processSelectedPivotByDataCell({
      spreadsheet,
      selectedCells: selectedCellsMeta,
      headerSelectedCells: concat(selectedColMetas, selectedRowMetas),
    });
  }

  return processSelectedTableByDataCell({
    spreadsheet,
    selectedCells: selectedCellsMeta,
    headerSelectedCells: selectedColMetas,
  });
}

function getDataCellCopyable(
  spreadsheet: SpreadSheet,
  cells: CellMeta[],
): CopyableList {
  let data: CopyableList;

  const selectedCols = getSelectedCols(cells);
  const selectedRows = getSelectedRows(cells);

  if (
    spreadsheet.interaction.getCurrentStateName() ===
    InteractionStateName.ALL_SELECTED
  ) {
    data = processSelectedByHeader(spreadsheet, []);
  } else if (selectedCols.length) {
    // 选中某列
    data = processSelectedByHeader(spreadsheet, selectedCols);
  } else if (selectedRows.length) {
    // 选中某行
    data = processSelectedByHeader(spreadsheet, selectedRows);
  } else {
    if (!cells.length) {
      return [
        {
          type: CopyMIMEType.PLAIN,
          content: '',
        },
        {
          type: CopyMIMEType.HTML,
          content: '',
        },
      ];
    }

    // normal selected
    const selectedCellsMeta = getSelectedCellsMeta(cells) as CellMeta[][];

    const selectedColMetas = selectedCellsMeta[0].map((cellMeta) => {
      return {
        ...cellMeta,
        id: cellMeta?.id?.split(EMPTY_PLACEHOLDER)?.[1] ?? '',
        type: CellTypes.COL_CELL,
      };
    });
    const selectedRowMetas = selectedCellsMeta.map((cellMeta) => {
      return {
        ...cellMeta[0],
        id: cellMeta[0]?.id?.split(EMPTY_PLACEHOLDER)?.[0] ?? '',
        type: CellTypes.ROW_CELL,
      };
    });

    data = processSelectedByData(
      selectedCellsMeta,
      selectedColMetas,
      selectedRowMetas,
      spreadsheet,
    );
  }

  return data;
}

// 刷选复制使用
export const getSelectedData = (spreadsheet: SpreadSheet): CopyableList => {
  const interaction = spreadsheet.interaction;
  const cells = interaction.getState().cells || [];
  let data: CopyableList;
  // 通过判断当前存在交互的单元格，来区分圈选行/列头 还是 点选行/列头
  const interactedCells = interaction.getInteractedCells() ?? [];
  const isBrushHeader = getIsBrushHeader(interactedCells);

  // 行列头圈选复制 和 单元格复制不同
  if (isBrushHeader) {
    data = getBrushHeaderCopyable(interactedCells as RowCell[] | ColCell[]);
  } else {
    data = getDataCellCopyable(spreadsheet, cells);
  }

  if (data) {
    copyToClipboard(data);
  }

  return data!;
};

// 全量导出使用
export const processAllSelected = (
  spreadsheet: SpreadSheet,
  split: string,
  formatOptions?: FormatOptions,
): CopyableList => {
  if (spreadsheet.isPivotMode()) {
    return processSelectedAllPivot(spreadsheet, split, formatOptions);
  }

  return processSelectedAllTable(spreadsheet, split, formatOptions);
};
