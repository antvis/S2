import { every, isEmpty, map, zip } from 'lodash';
import { Node, ROOT_NODE_ID } from '@antv/s2';
import {
  type CellMeta,
  CellTypes,
  type Data,
  EMPTY_PLACEHOLDER,
  EXTRA_FIELD,
  InteractionStateName,
  type S2CellType,
  SERIES_NUMBER_FIELD,
  VALUE_FIELD,
} from '../../../common';
import type { SpreadSheet } from '../../../sheet-type';
import { copyToClipboard } from '../index';
import type { ColCell, RowCell } from '../../../cell';
import {
  convertString,
  getColNodeFieldFromNode,
  getSelectedCols,
  getSelectedRows,
} from '../method';
import {
  type CopyableList,
  type FormatOptions,
  CopyMIMEType,
} from '../interface';
import { getBrushHeaderCopyable } from './pivot-header-copy';
import {
  processPivotAllSelected,
  processPivotSelected,
} from './pivot-data-cell-copy';
import { processTableColSelected, processTableRowSelected } from './table-copy';
import {
  assembleMatrix,
  completeMatrix,
  getFormatter,
  matrixHtmlTransformer,
  matrixPlainTextTransformer,
} from './common';

// todo-zc: 逻辑合并
export const getFiledFromMeta = (
  colIndex: number,
  spreadsheet: SpreadSheet,
) => {
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
  const formatter = getFormatter(spreadsheet, field!);
  const value = getValueFromMeta(meta, displayData, spreadsheet);

  return formatter(value);
};

const getNodeFormatLabel = (node: Node) => {
  const formatter = node.spreadsheet?.dataSet?.getFieldFormatter?.(node.field);

  return formatter?.(node.value) ?? node.value;
};

/**
 * todo: 统一逻辑
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
export const getSelectedCellsMeta = (cells: CellMeta[]) => {
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

function getSelectedNode(
  selectedMeta: CellMeta[],
  allRowOrColLeafNodes: Node[],
): Node[] {
  return selectedMeta.reduce<Node[]>((nodes, cellMeta) => {
    const filterNodes = allRowOrColLeafNodes.filter(
      (node) => node.id === cellMeta.id,
    );

    nodes.push(...filterNodes);

    return nodes;
  }, []);
}

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

  /**
   * todo-zc:
   * 1. 可以使用 getPivotCopyData 替代此方法？
   *  不行，因为 getPivotCopyData 都是 整行或者整列的处理
   *  getPivotCopyData 通过行列信息获取单元格信息，而此处是通过单元格信息获取行列信息。
   *  等 table 模式优化后再考虑。
   * 2. 对下面的代码进行优化
   *  colMatrix 和 rowMatrix 有很多重复的代码，可以进行优化
   *  保留使用 getHeaderList vs Node 方式， getHeaderList 简单性能好（用于不格式化的场景）
   */

  // 通过第一行来获取列头信息
  const allColLeafNodes = spreadsheet.getColumnLeafNodes();
  const selectedColMetas = cellMetaMatrix[0].map((cellMeta) => {
    return {
      ...cellMeta,
      id: cellMeta.id.split(EMPTY_PLACEHOLDER)?.[1] ?? '',
    };
  });
  const selectedColNode = getSelectedNode(selectedColMetas, allColLeafNodes);
  const colMatrix = zip(
    ...map(selectedColNode, (n) => getNodeFormatData(n)),
  ) as string[][];
  /*
   * const colMatrix = zip(
   *   ...map(cellMetaMatrix[0], (cellMeta) => {
   *     const colId = cellMeta.id.split(EMPTY_PLACEHOLDER)?.[1] ?? '';
   *
   *     return getHeaderList(colId);
   *   }),
   * ) as string[][];
   */

  // 通过第一列来获取行头信息
  const allRowLeafNodes = spreadsheet.getRowLeafNodes();
  const selectedRowMetas = cellMetaMatrix.map((it) => {
    return {
      ...it[0],
      id: it[0].id.split(EMPTY_PLACEHOLDER)?.[0] ?? '',
    };
  });
  const selectedRowNode = getSelectedNode(selectedRowMetas, allRowLeafNodes);
  let rowMatrix = map(selectedRowNode, (n) => getNodeFormatData(n));
  /*
   * let rowMatrix = map(cellMetaMatrix, (cellsMeta) => {
   *   const rowId = cellsMeta[0].id.split(EMPTY_PLACEHOLDER)?.[0] ?? '';
   *
   *   return getHeaderList(rowId);
   * });
   */

  // 当 rowMatrix 中的元素个数不一致时，需要补全
  rowMatrix = completeMatrix(rowMatrix);

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

    /*
     * todo-zc：可以使用 getPivotCopyData 替代此方法？ 不行，因为 getPivotCopyData 都是 整行或者整列的处理
     * 圈选时，格式化错误
     */
    data = getDataMatrixByDataCell(
      selectedCellsMeta,
      displayData as Data[],
      spreadsheet,
    );

    // data = processPivotSelected(spreadsheet, cells);
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
    return processPivotAllSelected(spreadsheet, split, formatOptions);
  }

  const columnNodes = (spreadsheet.getColumnNodes() || []).filter(
    // 滤过掉序号，序号不需要复制
    (colNode) => colNode.field !== SERIES_NUMBER_FIELD,
  );

  // @ts-ignore
  return processTableColSelected(spreadsheet, columnNodes);
};
