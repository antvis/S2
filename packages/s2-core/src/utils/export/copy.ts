import {
  escape,
  every,
  filter,
  forEach,
  isEmpty,
  map,
  max,
  repeat,
  zip,
} from 'lodash';
import {
  type CellMeta,
  CellTypes,
  CopyType,
  EMPTY_PLACEHOLDER,
  ID_SEPARATOR,
  InteractionStateName,
  VALUE_FIELD,
} from '../../common';
import type { DataType } from '../../data-set/interface';
import type { Node } from '../../facet/layout/node';
import type { SpreadSheet } from '../../sheet-type';
import { copyToClipboard } from '../../utils/export';
import type { ColCell, RowCell } from '../../cell';

export function keyEqualTo(key: string, compareKey: string) {
  if (!key || !compareKey) {
    return false;
  }
  return String(key).toLowerCase() === String(compareKey).toLowerCase();
}

const newLine = '\r\n';
const newTab = '\t';

const getColNodeField = (spreadsheet: SpreadSheet, id: string) => {
  const colNode = spreadsheet.getColumnNodes().find((col) => col.id === id);
  if (spreadsheet.isPivotMode()) {
    return colNode?.value;
  }
  return colNode?.field;
};

const getFiledIdFromMeta = (colIndex: number, spreadsheet: SpreadSheet) => {
  const colNode = spreadsheet
    .getColumnNodes()
    .find((col) => col.colIndex === colIndex);
  return getColNodeField(spreadsheet, colNode.id);
};

const getHeaderNodeFromMeta = (meta: CellMeta, spreadsheet: SpreadSheet) => {
  const { rowIndex, colIndex } = meta;
  return [
    spreadsheet.getRowNodes().find((row) => row.rowIndex === rowIndex),
    spreadsheet.getColumnNodes().find((col) => col.colIndex === colIndex),
  ];
};

const getFormat = (colIndex: number, spreadsheet: SpreadSheet) => {
  const colNode = spreadsheet
    .getColumnNodes()
    .find((col) => col.colIndex === colIndex);
  const fieldId = getColNodeField(spreadsheet, colNode.id);
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
  if (spreadsheet.isPivotMode()) {
    const [rowNode, colNode] = getHeaderNodeFromMeta(meta, spreadsheet);
    const cell = spreadsheet.dataSet.getCellData({
      query: {
        ...rowNode.query,
        ...colNode.query,
      },
      rowNode,
      isTotals:
        rowNode.isTotals ||
        rowNode.isTotalMeasure ||
        colNode.isTotals ||
        colNode.isTotalMeasure,
    });
    return cell?.[VALUE_FIELD] ?? '';
  }
  const fieldId = getFiledIdFromMeta(meta.colIndex, spreadsheet);
  return displayData[meta.rowIndex]?.[fieldId];
};

const format = (
  meta: CellMeta,
  displayData: DataType[],
  spreadsheet: SpreadSheet,
) => {
  const formatter = getFormat(meta.colIndex, spreadsheet);
  return formatter(getValueFromMeta(meta, displayData, spreadsheet));
};

export const convertString = (v: string) => {
  if (/\n/.test(v)) {
    // 单元格内换行 替换双引号 防止内容存在双引号 导致内容换行出错
    return '"' + v.replace(/\r\n?/g, '\n').replace(/"/g, "'") + '"';
  }
  return v;
};

/**
 * 根据 id 计算出行头或者列头展示的文本数组
 * 将 id : root[&]家具[&]桌子[&]price"
 * startLevel 不传, 转换为 List: ['家具', '桌子', 'price']
 * startLevel = 1, 转换为 List: ['家具', '桌子', 'price']
 * @param headerId
 * @param startLevel 层级
 */
const getHeaderList = (headerId: string, startLevel?: number) => {
  const headerList = headerId.split(ID_SEPARATOR);
  if (startLevel) {
    return headerList.slice(headerList.length - startLevel);
  }
  headerList.shift(); // 去除 root
  return headerList;
};

type MatrixTransformer = (data: string[][]) => CopyableItem;

export enum CopyMIMEType {
  PLAIN = 'text/plain',
  HTML = 'text/html',
}

export type CopyableItem = {
  type: CopyMIMEType;
  content: string;
};

export type Copyable = CopyableItem | CopyableItem[];

function pickDataFromCopyable(
  copyable: Copyable,
  type: CopyMIMEType[],
): string[];
function pickDataFromCopyable(copyable: Copyable, type: CopyMIMEType): string;
function pickDataFromCopyable(
  copyable: Copyable,
  type: CopyMIMEType | CopyMIMEType[],
): string | string[];
function pickDataFromCopyable(
  copyable: Copyable,
  type: CopyMIMEType[] | CopyMIMEType = CopyMIMEType.PLAIN,
): string[] | string {
  if (Array.isArray(type)) {
    return ([].concat(copyable) as CopyableItem[])
      .filter((item) => type.includes(item.type))
      .map((item) => item.content);
  }
  return (
    ([].concat(copyable) as CopyableItem[])
      .filter((item) => item?.type === type)
      .map((item) => item.content)[0] || ''
  );
}

// 把 string[][] 矩阵转换成 CopyableItem
const matrixPlainTextTransformer: MatrixTransformer = (dataMatrix) => {
  return {
    type: CopyMIMEType.PLAIN,
    content: map(dataMatrix, (line) => line.join(newTab)).join(newLine),
  };
};

// 把 string[][] 矩阵转换成 CopyableItem
const matrixHtmlTransformer: MatrixTransformer = (dataMatrix) => {
  function createTableData(data: string[], tagName: string) {
    return data
      .map((cell) => `<${tagName}>${escape(cell)}</${tagName}>`)
      .join('');
  }

  function createBody(data: string[][], tagName: string) {
    return data
      .map((row) => `<${tagName}>${createTableData(row, 'td')}</${tagName}>`)
      .join('');
  }

  return {
    type: CopyMIMEType.HTML,
    content: `<meta charset="utf-8"><table><tbody>${createBody(
      dataMatrix,
      'tr',
    )}</tbody></table>`,
  };
};

// 生成矩阵：https://gw.alipayobjects.com/zos/antfincdn/bxBVt0nXx/a182c1d4-81bf-469f-b868-8b2e29acfc5f.png
const assembleMatrix = (
  rowMatrix: string[][],
  colMatrix: string[][],
  dataMatrix: string[][],
): Copyable => {
  const rowWidth = rowMatrix[0]?.length ?? 0;
  const colHeight = colMatrix?.length ?? 0;
  const dataWidth = dataMatrix[0]?.length ?? 0;
  const dataHeight = dataMatrix.length ?? 0;
  const matrixWidth = rowWidth + dataWidth;
  const matrixHeight = colHeight + dataHeight;

  let matrix = Array.from(Array(matrixHeight), () => new Array(matrixWidth));

  matrix = map(matrix, (heightArr, y) => {
    return map(heightArr, (w, x) => {
      if (x >= 0 && x < rowWidth && y >= 0 && y < colHeight) {
        return '';
      }
      if (x >= rowWidth && x <= matrixWidth && y >= 0 && y < colHeight) {
        return colMatrix[y][x - rowWidth];
      }
      if (x >= 0 && x < rowWidth && y >= colHeight && y < matrixHeight) {
        return rowMatrix[y - colHeight][x];
      }
      if (
        x >= rowWidth &&
        x <= matrixWidth &&
        y >= colHeight &&
        y < matrixHeight
      ) {
        return dataMatrix[y - colHeight][x - rowWidth];
      }
      return undefined;
    });
  }) as string[][];

  return [matrixPlainTextTransformer(matrix), matrixHtmlTransformer(matrix)];
};

export const processCopyData = (
  displayData: DataType[],
  cells: CellMeta[][],
  spreadsheet: SpreadSheet,
): Copyable => {
  const matrix = cells.map((cols) =>
    cols.map((item) => convertString(format(item, displayData, spreadsheet))),
  );

  return [matrixPlainTextTransformer(matrix), matrixHtmlTransformer(matrix)];
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
const processTableColSelected = (
  spreadsheet: SpreadSheet,
  selectedCols: CellMeta[],
): Copyable => {
  const displayData = spreadsheet.dataSet.getDisplayDataSet();
  const selectedFields = selectedCols.length
    ? selectedCols.map((e) => ({
        field: getColNodeField(spreadsheet, e.id),
        formatter: getFormat(e.colIndex, spreadsheet),
      }))
    : spreadsheet.dataCfg.fields.columns
        .map((cName) =>
          spreadsheet.getColumnNodes().find((n) => n.field === cName),
        )
        .map((node) => ({
          field: getColNodeField(spreadsheet, node.id),
          formatter: getFormat(node.colIndex, spreadsheet),
        }));

  const dataMatrix = displayData.map((row) => {
    return selectedFields.map(({ field, formatter }) =>
      convertString(formatter(row[field])),
    );
  });

  return [
    matrixPlainTextTransformer(dataMatrix),
    matrixHtmlTransformer(dataMatrix),
  ];
};

const getDataMatrix = (
  leafRowNodes: Node[],
  leafColNodes: Node[],
  spreadsheet: SpreadSheet,
) => {
  return map(leafRowNodes, (rowNode) => {
    return leafColNodes.map((colNode) => {
      const cellData = spreadsheet.dataSet.getCellData({
        query: {
          ...rowNode.query,
          ...colNode.query,
        },
        rowNode,
        isTotals:
          rowNode.isTotals ||
          rowNode.isTotalMeasure ||
          colNode.isTotals ||
          colNode.isTotalMeasure,
      });
      return getFormat(
        colNode.colIndex,
        spreadsheet,
      )(cellData?.[VALUE_FIELD] ?? '');
    });
  });
};

const getPivotWithoutHeaderCopyData = (
  spreadsheet: SpreadSheet,
  leafRows: Node[],
  leafCols: Node[],
): Copyable => {
  const dataMatrix = getDataMatrix(leafRows, leafCols, spreadsheet);
  return [
    matrixPlainTextTransformer(dataMatrix),
    matrixHtmlTransformer(dataMatrix),
  ];
};

const getPivotWithHeaderCopyData = (
  spreadsheet: SpreadSheet,
  leafRowNodes: Node[],
  leafColNodes: Node[],
): Copyable => {
  const rowMatrix = map(leafRowNodes, (n) => getHeaderList(n.id));
  const colMatrix = zip(...map(leafColNodes, (n) => getHeaderList(n.id)));
  const dataMatrix = getDataMatrix(leafRowNodes, leafColNodes, spreadsheet);
  return assembleMatrix(rowMatrix, colMatrix, dataMatrix);
};

function getPivotCopyData(
  spreadsheet: SpreadSheet,
  allRowLeafNodes: Node[],
  colNodes: Node[],
): Copyable {
  const { copyWithHeader } = spreadsheet.options.interaction;

  return copyWithHeader
    ? getPivotWithHeaderCopyData(spreadsheet, allRowLeafNodes, colNodes)
    : getPivotWithoutHeaderCopyData(spreadsheet, allRowLeafNodes, colNodes);
}

function isTreeMode(spreadsheet: SpreadSheet) {
  return spreadsheet.options.hierarchyType === 'tree';
}

const processPivotColSelected = (
  spreadsheet: SpreadSheet,
  selectedCols: CellMeta[],
): Copyable => {
  const allRowLeafNodes = spreadsheet
    .getRowNodes()
    .filter((node) => node.isLeaf || isTreeMode(spreadsheet));
  const allColLeafNodes = spreadsheet
    .getColumnNodes()
    .filter((node) => node.isLeaf);

  const colNodes = selectedCols.length
    ? selectedCols.reduce((arr, e) => {
        arr.push(...allColLeafNodes.filter((node) => node.id.startsWith(e.id)));
        return arr;
      }, [])
    : allColLeafNodes;

  return getPivotCopyData(spreadsheet, allRowLeafNodes, colNodes);
};
const processColSelected = (
  displayData: DataType[],
  spreadsheet: SpreadSheet,
  selectedCols: CellMeta[],
): Copyable => {
  if (spreadsheet.isPivotMode()) {
    return processPivotColSelected(spreadsheet, selectedCols);
  }
  return processTableColSelected(spreadsheet, selectedCols);
};

const processTableRowSelected = (
  spreadsheet: SpreadSheet,
  selectedRows: CellMeta[],
): Copyable => {
  const displayData = spreadsheet.dataSet.getDisplayDataSet();
  const matrix = displayData
    .filter((_, i) => selectedRows.map((row) => row.rowIndex).includes(i))
    .map((entry) => {
      return Object.keys(entry)
        .map((cName) =>
          spreadsheet.getColumnNodes().find((n) => n.field === cName),
        )
        .filter(Boolean) // 过滤掉空值，如行头cell
        .map((node) =>
          convertString(
            getFormat(node.colIndex, spreadsheet)(entry[node.field]),
          ),
        );
    });
  return [matrixPlainTextTransformer(matrix), matrixHtmlTransformer(matrix)];
};

const processPivotRowSelected = (
  spreadsheet: SpreadSheet,
  selectedRows: CellMeta[],
): Copyable => {
  const allRowLeafNodes = spreadsheet
    .getRowNodes()
    .filter((node) => node.isLeaf || isTreeMode(spreadsheet));
  const allColLeafNodes = spreadsheet
    .getColumnNodes()
    .filter((node) => node.isLeaf);
  const rowNodes = selectedRows.reduce((arr, e) => {
    arr.push(...allRowLeafNodes.filter((node) => node.id.startsWith(e.id)));
    return arr;
  }, []);
  return getPivotCopyData(spreadsheet, rowNodes, allColLeafNodes);
};

const processRowSelected = (
  displayData: DataType[],
  spreadsheet: SpreadSheet,
  selectedRows: CellMeta[],
): Copyable => {
  if (spreadsheet.isPivotMode()) {
    return processPivotRowSelected(spreadsheet, selectedRows);
  }
  return processTableRowSelected(spreadsheet, selectedRows);
};

export function getCopyData(
  spreadsheet: SpreadSheet,
  copyType: CopyType,
  copyFormat: CopyMIMEType,
): string;

export function getCopyData(
  spreadsheet: SpreadSheet,
  copyType: CopyType,
  copyFormat: CopyMIMEType[],
): string[];

export function getCopyData(
  spreadsheet: SpreadSheet,
  copyType: CopyType,
): string;

export function getCopyData(
  spreadsheet: SpreadSheet,
  copyType: CopyType,
  copyFormat: CopyMIMEType[] | CopyMIMEType = CopyMIMEType.PLAIN,
): string[] | string {
  const displayData = spreadsheet.dataSet.getDisplayDataSet();
  const cells = spreadsheet.interaction.getState().cells || [];
  if (copyType === CopyType.ALL) {
    return pickDataFromCopyable(
      processColSelected(displayData, spreadsheet, []),
      copyFormat,
    );
  }
  if (copyType === CopyType.COL) {
    const colIndexes = cells.reduce<number[]>((pre, cur) => {
      if (!pre.find((item) => item === cur.colIndex)) {
        pre.push(cur.colIndex);
      }
      return pre;
    }, []);
    const colNodes = spreadsheet.facet.layoutResult.colLeafNodes
      .filter((node) => colIndexes.includes(node.colIndex))
      .map((node) => ({
        id: node.id,
        colIndex: node.colIndex,
        rowIndex: node.rowIndex,
        type: CellTypes.COL_CELL,
      }));
    return pickDataFromCopyable(
      processColSelected(displayData, spreadsheet, colNodes),
      copyFormat,
    );
  }
  if (copyType === CopyType.ROW) {
    const rowIndexes = cells.reduce<number[]>((pre, cur) => {
      if (!pre.find((item) => item === cur.rowIndex)) {
        pre.push(cur.rowIndex);
      }
      return pre;
    }, []);
    const rowNodes = rowIndexes.map((index) => {
      return {
        id: index + '-' + spreadsheet.facet.layoutResult.colLeafNodes[0].id,
        colIndex: 0,
        rowIndex: index,
        type: CellTypes.ROW_CELL,
      };
    });
    return pickDataFromCopyable(
      processRowSelected(displayData, spreadsheet, rowNodes),
      copyFormat,
    );
  }
}

/**
 * 生成包含行列头的导出数据。查看👇🏻图效果展示，更容易理解代码：
 * https://gw.alipayobjects.com/zos/antfincdn/bxBVt0nXx/a182c1d4-81bf-469f-b868-8b2e29acfc5f.png
 * @param cellMetaMatrix
 * @param displayData
 * @param spreadsheet
 */
const getDataWithHeaderMatrix = (
  cellMetaMatrix: CellMeta[][],
  displayData: DataType[],
  spreadsheet: SpreadSheet,
): Copyable => {
  const colMatrix = zip(
    ...map(cellMetaMatrix[0], (cellMeta) => {
      const colId = cellMeta.id.split(EMPTY_PLACEHOLDER)?.[1] ?? '';
      return getHeaderList(colId);
    }),
  );

  const rowMatrix = map(cellMetaMatrix, (cellsMeta) => {
    const rowId = cellsMeta[0].id.split(EMPTY_PLACEHOLDER)?.[0] ?? '';
    return getHeaderList(rowId);
  });

  const dataMatrix = map(cellMetaMatrix, (cellsMeta) => {
    return map(cellsMeta, (it) => format(it, displayData, spreadsheet));
  });

  return assembleMatrix(rowMatrix, colMatrix, dataMatrix);
};

function getAllLevels(interactedCells: RowCell[] | ColCell[]) {
  const allLevels = new Set<number>();
  forEach(interactedCells, (cell: RowCell | ColCell) => {
    const level = cell.getMeta().level;
    if (allLevels.has(level)) {
      return;
    }
    allLevels.add(level);
  });
  return allLevels;
}

function getLastLevelCells(
  interactedCells: RowCell[] | ColCell[],
  maxLevel: number,
) {
  return filter(interactedCells, (cell: RowCell | ColCell) => {
    const meta = cell.getMeta();
    const isLastLevel = meta.level === maxLevel;
    const isLastTotal = meta.isTotals && isEmpty(meta.children);
    return isLastLevel || isLastTotal;
  });
}

function getCellMatrix(
  lastLevelCells: Array<RowCell | ColCell>,
  maxLevel: number,
  allLevel: Set<number>,
) {
  return map(lastLevelCells, (cell: RowCell | ColCell) => {
    const meta = cell.getMeta();
    const { id, label, isTotals, level } = meta;
    let cellId = id;
    // 为总计小计补齐高度
    if (isTotals && level !== maxLevel) {
      cellId = id + ID_SEPARATOR + repeat(label, maxLevel - level);
    }
    return getHeaderList(cellId, allLevel.size);
  });
}

function getBrushHeaderCopyable(
  interactedCells: RowCell[] | ColCell[],
): Copyable {
  // 获取圈选的层级有哪些
  const allLevels = getAllLevels(interactedCells);
  const maxLevel = max(Array.from(allLevels)) ?? 0;
  // 获取最后一层的 cell
  const lastLevelCells = getLastLevelCells(interactedCells, maxLevel);

  // 拼接选中行列头的内容矩阵
  const isCol = interactedCells[0].cellType === CellTypes.COL_CELL;
  let cellMatrix = getCellMatrix(lastLevelCells, maxLevel, allLevels);

  // 如果是列头，需要转置
  if (isCol) {
    cellMatrix = zip(...cellMatrix);
  }
  return [
    matrixPlainTextTransformer(cellMatrix),
    matrixHtmlTransformer(cellMatrix),
  ];
}

function getDataCellCopyable(
  spreadsheet: SpreadSheet,
  cells: CellMeta[],
): Copyable {
  let data: Copyable;

  const selectedCols = cells.filter(({ type }) => type === CellTypes.COL_CELL);
  const selectedRows = cells.filter(({ type }) => type === CellTypes.ROW_CELL);

  const displayData = spreadsheet.dataSet.getDisplayDataSet();

  // if (spreadsheet.isPivotMode() && spreadsheet.isHierarchyTreeType()) {
  //   // 树状模式透视表之后实现
  //   return;
  // }
  if (
    spreadsheet.interaction.getCurrentStateName() ===
    InteractionStateName.ALL_SELECTED
  ) {
    data = processColSelected(displayData, spreadsheet, []);
  } else if (selectedCols.length) {
    data = processColSelected(displayData, spreadsheet, selectedCols);
  } else if (selectedRows.length) {
    data = processRowSelected(displayData, spreadsheet, selectedRows);
  } else {
    if (!cells.length) {
      return;
    }
    // normal selected
    const selectedCellsMeta = getSelectedCellsMeta(cells);

    if (spreadsheet.options.interaction?.copyWithHeader) {
      data = getDataWithHeaderMatrix(
        selectedCellsMeta,
        displayData,
        spreadsheet,
      );
    } else {
      data = processCopyData(displayData, selectedCellsMeta, spreadsheet);
    }
  }
  return data;
}

export const getSelectedData = (spreadsheet: SpreadSheet): string => {
  const interaction = spreadsheet.interaction;
  const cells = interaction.getState().cells || [];
  let data: Copyable;
  // 通过判断当前存在交互的单元格，来区分圈选行/列头 还是 点选行/列头
  const interactedCells = interaction.getInteractedCells() ?? [];
  const isBrushHeader = isEmpty(interactedCells)
    ? false
    : every(interactedCells, (cell) => {
        return (
          cell.cellType === CellTypes.ROW_CELL ||
          cell.cellType === CellTypes.COL_CELL
        );
      });

  // 行列头圈选复制 和 单元格复制不同
  if (isBrushHeader) {
    data = getBrushHeaderCopyable(interactedCells as RowCell[] | ColCell[]);
  } else {
    data = getDataCellCopyable(spreadsheet, cells);
  }

  if (data) {
    copyToClipboard(data);
  }
  return pickDataFromCopyable(data, CopyMIMEType.PLAIN);
};
