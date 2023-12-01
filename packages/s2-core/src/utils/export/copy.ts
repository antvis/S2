import {
  escape,
  every,
  filter,
  forEach,
  isEmpty,
  isNil,
  map,
  max,
  orderBy,
  reduce,
  zip,
} from 'lodash';
import type { ColCell, HeaderCell, RowCell } from '../../cell';
import {
  CellTypes,
  CopyType,
  EMPTY_PLACEHOLDER,
  EXTRA_FIELD,
  ID_SEPARATOR,
  InteractionStateName,
  SERIES_NUMBER_FIELD,
  VALUE_FIELD,
  type CellMeta,
  type RowData,
} from '../../common';
import type { DataType } from '../../data-set/interface';
import type { Node } from '../../facet/layout/node';
import type { SpreadSheet } from '../../sheet-type';
import { copyToClipboard } from '../../utils/export';
import { flattenDeep } from '../data-set-operate';
import { getHeaderTotalStatus } from '../dataset/pivot-data-set';
import { getEmptyPlaceholder } from '../text';

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

/**
 * 兼容 hideMeasureColumn 方案：hideMeasureColumn 的隐藏实现是通过截取掉度量(measure)数据，但是又只截取了 Node 中的，像 pivotMeta 中的又是完整的。导致复制时，无法通过 Node 找出正确路径。
 * https://github.com/antvis/S2/issues/1955
 * @param spreadsheet
 */
const compatibleHideMeasureColumn = (spreadsheet: SpreadSheet) => {
  const isHideMeasureColumn =
    spreadsheet.options?.style?.colCfg?.hideMeasureColumn &&
    spreadsheet.isValueInCols();
  // 被 hideMeasureColumn 隐藏的 度量(measure) 值，手动添加上。
  return isHideMeasureColumn
    ? {
        [EXTRA_FIELD]: spreadsheet.dataCfg.fields.values[0],
      }
    : {};
};

const getValueFromMeta = (
  meta: CellMeta,
  displayData: DataType[],
  spreadsheet: SpreadSheet,
) => {
  if (spreadsheet.isPivotMode()) {
    const [rowNode, colNode] = getHeaderNodeFromMeta(meta, spreadsheet);
    const measureQuery = compatibleHideMeasureColumn(spreadsheet);

    const cell = spreadsheet.dataSet.getCellData({
      query: {
        ...rowNode.query,
        ...colNode.query,
        ...measureQuery,
      },
      rowNode,
      isTotals:
        rowNode.isTotals ||
        rowNode.isTotalMeasure ||
        colNode.isTotals ||
        colNode.isTotalMeasure,
      totalStatus: getHeaderTotalStatus(rowNode, colNode),
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
    return '"' + v.replace(/\r\n?/g, '\n') + '"';
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
const getHeaderMeasureFields = (headerId: string, startLevel?: number) => {
  const headerList = headerId.split(ID_SEPARATOR);
  if (startLevel) {
    return headerList.slice(headerList.length - startLevel);
  }
  headerList.shift(); // 去除 root
  return headerList;
};

const getHeaderMeasureFieldNames = (
  fields: string[],
  spreadsheet: SpreadSheet,
): string[] => {
  return map(fields, (field) => {
    return spreadsheet.dataSet.getFieldName(field);
  });
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

const transformers: {
  [key in CopyMIMEType]: MatrixTransformer;
} = {
  [CopyMIMEType.PLAIN]: matrixPlainTextTransformer,
  [CopyMIMEType.HTML]: matrixHtmlTransformer,
};

export function registerTransformer(
  type: CopyMIMEType,
  transformer: MatrixTransformer,
) {
  transformers[type] = transformer;
}

function getTransformer(type: CopyMIMEType) {
  return transformers[type];
}

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

  return [
    getTransformer(CopyMIMEType.PLAIN)(matrix),
    getTransformer(CopyMIMEType.HTML)(matrix),
  ];
};

export const processCopyData = (
  displayData: DataType[],
  cells: CellMeta[][],
  spreadsheet: SpreadSheet,
): Copyable => {
  const matrix = cells.map((cols) =>
    cols.map((item) => {
      if (!item) {
        return '';
      }
      return convertString(format(item, displayData, spreadsheet));
    }),
  );

  return [
    getTransformer(CopyMIMEType.PLAIN)(matrix),
    getTransformer(CopyMIMEType.HTML)(matrix),
  ];
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

  const matrix = displayData.map((row) => {
    return selectedFields.map(({ field, formatter }) =>
      convertString(formatter(row[field])),
    );
  });

  return [
    getTransformer(CopyMIMEType.PLAIN)(matrix),
    getTransformer(CopyMIMEType.HTML)(matrix),
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
        totalStatus: getHeaderTotalStatus(rowNode, colNode),
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
  const matrix = getDataMatrix(leafRows, leafCols, spreadsheet);

  return [
    getTransformer(CopyMIMEType.PLAIN)(matrix),
    getTransformer(CopyMIMEType.HTML)(matrix),
  ];
};

const getPivotWithHeaderCopyData = (
  spreadsheet: SpreadSheet,
  leafRowNodes: Node[],
  leafColNodes: Node[],
): Copyable => {
  const rowMatrix = map(leafRowNodes, (node) =>
    getHeaderMeasureFields(node.id),
  );
  const colMatrix = zip(
    ...map(leafColNodes, (node) => getHeaderMeasureFields(node.id)),
  );
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

const processPivotColSelected = (
  spreadsheet: SpreadSheet,
  selectedCols: CellMeta[],
): Copyable => {
  const allRowLeafNodes = spreadsheet
    .getRowNodes()
    .filter((node) => node.isLeaf || spreadsheet.isHierarchyTreeType());
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
      // 确保顺序和表格中的列顺序一致
      const idxMap = spreadsheet.getColumnNodes().reduce((prev, curr, idx) => {
        prev[curr.field] = idx;
        return prev;
      }, {});

      return Object.keys(entry)
        .sort((a, b) => idxMap[a] - idxMap[b])
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

  return [
    getTransformer(CopyMIMEType.PLAIN)(matrix),
    getTransformer(CopyMIMEType.HTML)(matrix),
  ];
};

const processPivotRowSelected = (
  spreadsheet: SpreadSheet,
  selectedRows: CellMeta[],
): Copyable => {
  const allRowLeafNodes = spreadsheet
    .getRowNodes()
    .filter((node) => node.isLeaf || spreadsheet.isHierarchyTreeType());
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
      return getHeaderMeasureFieldNames(
        getHeaderMeasureFields(colId),
        spreadsheet,
      );
    }),
  );

  const rowMatrix = map(cellMetaMatrix, (cellsMeta) => {
    const rowId = cellsMeta[0].id.split(EMPTY_PLACEHOLDER)?.[0] ?? '';
    return getHeaderMeasureFieldNames(
      getHeaderMeasureFields(rowId),
      spreadsheet,
    );
  });

  const dataMatrix = map(cellMetaMatrix, (cellsMeta) => {
    return map(cellsMeta, (meta) => format(meta, displayData, spreadsheet));
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

/** 处理有合并单元格的复制（小记总计格）
 *  维度1 ｜ 维度2  ｜ 维度3
 *  总计           ｜  维度三
 *  => 总计  总计  维度三
 */
function getTotalCellMatrixId(meta: Node, maxLevel: number) {
  let nextNode = meta;
  let lastNode = { level: maxLevel };
  let cellId = nextNode.label;
  while (nextNode.level >= 0) {
    let repeatNumber = lastNode.level - nextNode.level;
    while (repeatNumber > 0) {
      cellId = `${nextNode.label}${ID_SEPARATOR}${cellId}`;
      repeatNumber--;
    }
    lastNode = nextNode;
    nextNode = nextNode.parent;
  }
  return cellId;
}

function getCellMatrix(
  lastLevelCells: Array<HeaderCell>,
  maxLevel: number,
  allLevel: Set<number>,
) {
  return map(lastLevelCells, (cell) => {
    const meta = cell.getMeta();
    const { id, isTotals, spreadsheet } = meta;
    const cellId = isTotals ? getTotalCellMatrixId(meta, maxLevel) : id;

    // 将指标维度单元格的标签替换为实际文本
    const headerFields = getHeaderMeasureFields(cellId, allLevel.size);
    return getHeaderMeasureFieldNames(headerFields, spreadsheet);
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
  let matrix = getCellMatrix(lastLevelCells, maxLevel, allLevels);

  // 如果是列头，需要转置
  if (isCol) {
    matrix = zip(...matrix);
  }
  return [
    getTransformer(CopyMIMEType.PLAIN)(matrix),
    getTransformer(CopyMIMEType.HTML)(matrix),
  ];
}

const tilePivotData = (
  data,
  columnOrdered,
  defaultDataValue,
): Array<string> => {
  return map(columnOrdered, (field) => data[field] ?? defaultDataValue);
};

export const getDataByRowData = (
  spreadsheet: SpreadSheet,
  rowData: RowData,
): Copyable => {
  const {
    options: { placeholder },
    dataCfg: {
      fields: { rows, columns, values },
    },
  } = spreadsheet;
  const defaultDataValue = getEmptyPlaceholder(spreadsheet, placeholder);
  const column = spreadsheet.getColumnLeafNodes();
  let matrix: string[][] = [];

  if (spreadsheet.isTableMode()) {
    const columnWithoutSeriesNumber = filter(
      column,
      (node) => node.field !== SERIES_NUMBER_FIELD,
    );
    // 按列头顺序复制
    matrix = map(rowData, (rowDataItem) => {
      return map(
        columnWithoutSeriesNumber,
        (node) => rowDataItem?.[node.field] ?? defaultDataValue,
      );
    });
  } else if (spreadsheet.isPivotMode()) {
    // 透视表的数据加上行头、列头才有意义，这里会以行头、列头、数据值的顺序将每一个单元格构造成一行
    const columnOrdered = [...rows, ...columns, ...values];
    const rowDataFlatten = flattenDeep(rowData);
    // 去掉小计
    const rowDataFlattenWithoutTotal = rowDataFlatten.filter((data) =>
      [...rows, ...columns].every((field) => !isNil(data[field as string])),
    );
    matrix = reduce(
      rowDataFlattenWithoutTotal,
      (ret, data) => {
        return [...ret, tilePivotData(data, columnOrdered, defaultDataValue)];
      },
      [],
    );
  }
  return [
    getTransformer(CopyMIMEType.PLAIN)(matrix),
    getTransformer(CopyMIMEType.HTML)(matrix),
  ];
};

function getDataCellCopyable(
  spreadsheet: SpreadSheet,
  cells: CellMeta[],
): Copyable {
  let data: Copyable;

  const selectedCols = cells.filter(({ type }) => type === CellTypes.COL_CELL);
  const selectedRows = cells.filter(({ type }) => type === CellTypes.ROW_CELL);
  const displayData = spreadsheet.dataSet.getDisplayDataSet();

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
    const { currentRow } = spreadsheet.interaction.getSelectedCellHighlight();

    if (currentRow) {
      const rowData = orderBy(cells, 'rowIndex', 'asc').map((cell) =>
        spreadsheet.dataSet.getRowData(cell),
      );
      data = getDataByRowData(spreadsheet, rowData);
    } else if (spreadsheet.options.interaction?.copyWithHeader) {
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
