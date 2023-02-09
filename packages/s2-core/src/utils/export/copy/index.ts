import { every, isEmpty, map, zip } from 'lodash';
import {
  type CellMeta,
  CellTypes,
  type Data,
  EMPTY_PLACEHOLDER,
  EXTRA_FIELD,
  InteractionStateName,
  type S2CellType,
  VALUE_FIELD,
} from '../../../common';
import type { SpreadSheet } from '../../../sheet-type';
import { copyToClipboard } from '../index';
import type { ColCell, RowCell } from '../../../cell';
import {
  convertString,
  getColNodeFieldFromNode,
  getHeaderList,
  getSelectedCols,
  getSelectedRows,
} from '../method';
import { type CopyableList, CopyMIMEType } from '../interface';
import { getBrushHeaderCopyable } from './pivot-header-copy';
import { processPivotSelected } from './pivot-cell-copy';
import { processTableColSelected, processTableRowSelected } from './table-copy';
import {
  assembleMatrix,
  getFormatter,
  matrixHtmlTransformer,
  matrixPlainTextTransformer,
} from './common';

const getFiledFromMeta = (colIndex: number, spreadsheet: SpreadSheet) => {
  const colNode = spreadsheet
    .getColumnNodes()
    .find((col) => col.colIndex === colIndex);

  return getColNodeFieldFromNode(spreadsheet.isPivotMode, colNode);
};

const getHeaderNodeFromMeta = (meta: CellMeta, spreadsheet: SpreadSheet) => {
  const { rowIndex, colIndex } = meta;

  return [
    spreadsheet.getRowNodes().find((row) => row.rowIndex === rowIndex),
    spreadsheet.getColumnNodes().find((col) => col.colIndex === colIndex),
  ];
};

/**
 * 兼容 hideMeasureColumn 方案：hideMeasureColumn 的隐藏实现是通过截取掉度量(measure)数据，但是又只截取了 Node 中的，像 pivotMeta 中的又是完整的。导致复制时，无法通过 Node 找出正确路径。
 * https://github.com/antvis/S2/issues/1955
 * @param spreadsheet
 */
const compatibleHideMeasureColumn = (spreadsheet: SpreadSheet) => {
  const isHideValue =
    spreadsheet.options?.style?.colCell?.hideValue &&
    spreadsheet.isValueInCols();

  // 被 hideMeasureColumn 隐藏的 度量(measure) 值，手动添加上。
  return isHideValue
    ? {
        [EXTRA_FIELD]: spreadsheet.dataCfg.fields.values?.[0],
      }
    : {};
};

const getValueFromMeta = (
  meta: CellMeta,
  displayData: Data[],
  spreadsheet: SpreadSheet,
) => {
  if (spreadsheet.isPivotMode()) {
    const [rowNode, colNode] = getHeaderNodeFromMeta(meta, spreadsheet);
    const measureQuery = compatibleHideMeasureColumn(spreadsheet);

    const cell = spreadsheet.dataSet.getCellData({
      query: {
        ...rowNode?.query,
        ...colNode?.query,
        ...measureQuery,
      },
      rowNode,
      isTotals:
        rowNode?.isTotals ||
        rowNode?.isTotalMeasure ||
        colNode?.isTotals ||
        colNode?.isTotalMeasure,
    });

    return cell?.[VALUE_FIELD] ?? '';
  }

  const fieldKey = getFiledFromMeta(meta.colIndex, spreadsheet);

  return displayData[meta.rowIndex]?.[fieldKey!];
};

const format = (
  meta: CellMeta,
  displayData: Data[],
  spreadsheet: SpreadSheet,
) => {
  const field = getFiledFromMeta(meta.colIndex!, spreadsheet);
  const formatter = getFormatter(spreadsheet, field);

  return formatter(getValueFromMeta(meta, displayData, spreadsheet)!);
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

/**
 * 生成包含行列头的导出数据。查看👇🏻图效果展示，更容易理解代码：
 * https://gw.alipayobjects.com/zos/antfincdn/bxBVt0nXx/a182c1d4-81bf-469f-b868-8b2e29acfc5f.png
 * @param cellMetaMatrix
 * @param displayData
 * @param spreadsheet
 */
const getDataMatrixByDataCell = (
  cellMetaMatrix: CellMeta[][],
  displayData: Data[],
  spreadsheet: SpreadSheet,
): CopyableList => {
  const { copyWithHeader } = spreadsheet.options.interaction!;

  const dataMatrix = map(cellMetaMatrix, (cellsMeta) =>
    map(cellsMeta, (it) => convertString(format(it, displayData, spreadsheet))),
  ) as string[][];

  if (!copyWithHeader) {
    return [
      matrixPlainTextTransformer(dataMatrix),
      matrixHtmlTransformer(dataMatrix),
    ];
  }

  // 通过第一行来获取列头信息
  const colMatrix = zip(
    ...map(cellMetaMatrix[0], (cellMeta) => {
      const colId = cellMeta.id.split(EMPTY_PLACEHOLDER)?.[1] ?? '';

      return getHeaderList(colId);
    }),
  ) as string[][];

  // 通过第一列来获取行头信息
  const rowMatrix = map(cellMetaMatrix, (cellsMeta) => {
    const rowId = cellsMeta[0].id.split(EMPTY_PLACEHOLDER)?.[0] ?? '';

    return getHeaderList(rowId);
  });

  return assembleMatrix(rowMatrix, colMatrix, dataMatrix);
};

const processColSelected = (
  spreadsheet: SpreadSheet,
  selectedCols: CellMeta[],
): CopyableList => {
  if (spreadsheet.isPivotMode()) {
    return processPivotSelected(spreadsheet, selectedCols);
  }

  return processTableColSelected(spreadsheet, selectedCols);
};

const processRowSelected = (
  spreadsheet: SpreadSheet,
  selectedRows: CellMeta[],
): CopyableList => {
  if (spreadsheet.isPivotMode()) {
    return processPivotSelected(spreadsheet, selectedRows);
  }

  return processTableRowSelected(spreadsheet, selectedRows);
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

function getDataCellCopyable(
  spreadsheet: SpreadSheet,
  cells: CellMeta[],
): CopyableList {
  let data: CopyableList;

  const selectedCols = getSelectedCols(cells);
  const selectedRows = getSelectedRows(cells);

  const displayData = spreadsheet.dataSet.getDisplayDataSet();

  if (
    spreadsheet.interaction.getCurrentStateName() ===
    InteractionStateName.ALL_SELECTED
  ) {
    data = processColSelected(spreadsheet, []);
  } else if (selectedCols.length) {
    data = processColSelected(spreadsheet, selectedCols);
  } else if (selectedRows.length) {
    data = processRowSelected(spreadsheet, selectedRows);
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
    const selectedCellsMeta = getSelectedCellsMeta(cells);

    data = getDataMatrixByDataCell(
      selectedCellsMeta,
      displayData as Data[],
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
