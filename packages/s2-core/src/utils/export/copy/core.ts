import { concat, every, isEmpty } from 'lodash';
import {
  type CellMeta,
  CellTypes,
  type Data,
  EMPTY_PLACEHOLDER,
  EXTRA_FIELD,
  InteractionStateName,
  ROOT_NODE_ID,
  type S2CellType,
  VALUE_FIELD,
} from '../../../common';
import type { SpreadSheet } from '../../../sheet-type';
import { copyToClipboard } from '../index';
import type { ColCell, RowCell } from '../../../cell';
import type { Node } from '../../../facet/layout/node';
import {
  getColNodeFieldFromNode,
  getSelectedCols,
  getSelectedRows,
} from '../method';
import {
  type CopyableList,
  CopyMIMEType,
  type FormatOptions,
} from '../interface';
import { getBrushHeaderCopyable } from './pivot-header-copy';
import {
  processSelectedAllPivot,
  processSelectedPivotByHeader,
  processSelectedPivotByDataCell,
} from './pivot-data-cell-copy';
import {
  processSelectedAllTable,
  processSelectedTableByHeader,
  processSelectedTableByDataCell,
} from './table-copy';
import { getFormatter } from './common';

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
 * 兼容 hideMeasureColumn 方案：hideMeasureColumn 的隐藏实现是通过截取掉度量(measure)数据，但是又只截取了 Node 中的，像 pivotMeta 中的又是完整的。导致复制时，无法通过 Node 找出正确路径。
 * https://github.com/antvis/S2/issues/1955
 * @param spreadsheet
 */
export const compatibleHideMeasureColumn = (spreadsheet: SpreadSheet) => {
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

// todo: getDataMatrixByHeaderNode 的逻辑同
export const getValueFromMeta = (
  meta: CellMeta,
  displayData: Data[],
  spreadsheet: SpreadSheet,
) => {
  const [rowNode, colNode] = getHeaderNodeFromMeta(meta, spreadsheet);

  const fieldKey = getColNodeFieldFromNode(spreadsheet.isPivotMode, colNode);
  let value = displayData[meta.rowIndex]?.[fieldKey!];

  if (spreadsheet.isPivotMode()) {
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

    value = cell?.[VALUE_FIELD] ?? '';
  }

  const formatter = getFormatter(spreadsheet, fieldKey!);

  return formatter(value);
};

const getNodeFormatLabel = (node: Node) => {
  const formatter = node.spreadsheet?.dataSet?.getFieldFormatter?.(node.field);

  return formatter?.(node.value) ?? node.value;
};

/**
 * 通过 rowLeafNode 获取到当前行所有 rowNode 的数据
 * @param rowLeafNode
 */
export const getNodeFormatData = (rowLeafNode: Node) => {
  const line: string[] = [];
  const getRowNodeFormatterLabel = (node: Node): string | undefined => {
    // node.id === KEY_ROOT_NODE 时，为 S2 内的虚拟根节点，导出的内容不需要考虑此节点
    if (node.id === ROOT_NODE_ID) {
      return;
    }

    const formatterLabel = getNodeFormatLabel(node);

    line.unshift(formatterLabel);
    if (node?.parent) {
      return getRowNodeFormatterLabel(node.parent);
    }
  };

  getRowNodeFormatterLabel(rowLeafNode);

  return line;
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
        id: cellMeta.id.split(EMPTY_PLACEHOLDER)?.[1] ?? '',
        type: CellTypes.COL_CELL,
      };
    });
    const selectedRowMetas = selectedCellsMeta.map((it) => {
      return {
        ...it[0],
        id: it[0].id.split(EMPTY_PLACEHOLDER)?.[0] ?? '',
        type: CellTypes.ROW_CELL,
      };
    });

    if (spreadsheet.isPivotMode()) {
      data = processSelectedPivotByDataCell({
        spreadsheet,
        selectedCells: selectedCellsMeta,
        displayData: displayData as Data[],
        headerSelectedCells: concat(selectedColMetas, selectedRowMetas),
      });
    } else {
      data = processSelectedTableByDataCell({
        spreadsheet,
        selectedCells: selectedCellsMeta,
        headerSelectedCells: selectedColMetas,
      });
    }
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
