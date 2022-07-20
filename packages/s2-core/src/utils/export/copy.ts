import { fill, forEach, map, zip } from 'lodash';
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
    return cell[VALUE_FIELD];
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
 * 转换为 List: ['四川省', '成都市']
 * @param headerId
 */
const getHeaderList = (headerId: string) => {
  const headerList = headerId.split(ID_SEPARATOR);
  headerList.shift(); // 去除 root
  return headerList;
};

// 把 string[][] 矩阵转换成字符串格式
const transformDataMatrixToStr = (dataMatrix: string[][]) => {
  return map(dataMatrix, (line) => line.join(newTab)).join(newLine);
};

// 生成矩阵：https://gw.alipayobjects.com/zos/antfincdn/bxBVt0nXx/a182c1d4-81bf-469f-b868-8b2e29acfc5f.png
const assembleMatrix = (
  rowMatrix: string[][],
  colMatrix: string[][],
  dataMatrix: string[][],
) => {
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

  return transformDataMatrixToStr(matrix);
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

const processTableColSelected = (
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
      return getFormat(colNode.colIndex, spreadsheet)(cellData[VALUE_FIELD]);
    });
  });
};

const getPivotWithoutHeaderCopyData = (
  spreadsheet: SpreadSheet,
  leafRows: Node[],
  leafCols: Node[],
) => {
  const dataMatrix = getDataMatrix(leafRows, leafCols, spreadsheet);
  return transformDataMatrixToStr(dataMatrix);
};

const getPivotWithHeaderCopyData = (
  spreadsheet: SpreadSheet,
  leafRowNodes: Node[],
  leafColNodes: Node[],
) => {
  const rowMatrix = map(leafRowNodes, (n) => getHeaderList(n.id));
  const colMatrix = zip(...map(leafColNodes, (n) => getHeaderList(n.id)));
  const dataMatrix = getDataMatrix(leafRowNodes, leafColNodes, spreadsheet);
  return assembleMatrix(rowMatrix, colMatrix, dataMatrix);
};

function getPivotCopyData(
  spreadsheet: SpreadSheet,
  allRowLeafNodes: Node[],
  colNodes: Node[],
) {
  const { copyWithHeader } = spreadsheet.options.interaction;

  return copyWithHeader
    ? getPivotWithHeaderCopyData(spreadsheet, allRowLeafNodes, colNodes)
    : getPivotWithoutHeaderCopyData(spreadsheet, allRowLeafNodes, colNodes);
}

const processPivotColSelected = (
  spreadsheet: SpreadSheet,
  selectedCols: CellMeta[],
) => {
  const allRowLeafNodes = spreadsheet
    .getRowNodes()
    .filter((node) => node.isLeaf);
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
) => {
  if (spreadsheet.isPivotMode()) {
    return processPivotColSelected(spreadsheet, selectedCols);
  }
  return processTableColSelected(displayData, spreadsheet, selectedCols);
};

const processTableRowSelected = (
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

const processPivotRowSelected = (
  spreadsheet: SpreadSheet,
  selectedRows: CellMeta[],
) => {
  const allRowLeafNodes = spreadsheet
    .getRowNodes()
    .filter((node) => node.isLeaf);
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
) => {
  if (spreadsheet.isPivotMode()) {
    return processPivotRowSelected(spreadsheet, selectedRows);
  }
  return processTableRowSelected(displayData, selectedRows);
};

export const getCopyData = (spreadsheet: SpreadSheet, copyType: CopyType) => {
  const displayData = spreadsheet.dataSet.getDisplayDataSet();
  const cells = spreadsheet.interaction.getState().cells || [];
  if (copyType === CopyType.ALL) {
    return processColSelected(displayData, spreadsheet, []);
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
    return processColSelected(displayData, spreadsheet, colNodes);
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
    return processRowSelected(displayData, spreadsheet, rowNodes);
  }
};

/**
 * 生成包含行列头的导出数据。查看👇🏻图效果展示，更容易理解代码：
 * https://gw.alipayobjects.com/zos/antfincdn/bxBVt0nXx/a182c1d4-81bf-469f-b868-8b2e29acfc5f.png
 * @param cellMetaMatrix
 * @param displayData
 * @param spreadsheet
 */
const dataWithHeaderMatrix = (
  cellMetaMatrix: CellMeta[][],
  displayData: DataType[],
  spreadsheet: SpreadSheet,
) => {
  const colMatrix = zip(
    ...map(cellMetaMatrix[0], (it) => {
      const colId = it.id.split(EMPTY_PLACEHOLDER)?.[1] ?? '';
      return getHeaderList(colId);
    }),
  );

  const rowMatrix = map(cellMetaMatrix, (arr) => {
    const rowId = arr[0].id.split(EMPTY_PLACEHOLDER)?.[0] ?? '';
    return getHeaderList(rowId);
  });

  const dataMatrix = map(cellMetaMatrix, (metaArr) => {
    return map(metaArr, (it) => format(it, displayData, spreadsheet));
  });

  return assembleMatrix(rowMatrix, colMatrix, dataMatrix);
};

export const getSelectedData = (spreadsheet: SpreadSheet) => {
  const interaction = spreadsheet.interaction;
  const { copyWithHeader } = spreadsheet.options.interaction;

  const cells = interaction.getState().cells || [];
  let data: string;
  const selectedCols = cells.filter(({ type }) => type === CellTypes.COL_CELL);
  const selectedRows = cells.filter(({ type }) => type === CellTypes.ROW_CELL);

  const displayData = spreadsheet.dataSet.getDisplayDataSet();

  if (spreadsheet.isPivotMode() && spreadsheet.isHierarchyTreeType()) {
    // 树状模式透视表之后实现
    return;
  }
  if (interaction.getCurrentStateName() === InteractionStateName.ALL_SELECTED) {
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
    const selectedCellMeta = getTwoDimData(cells);
    data = processCopyData(displayData, getTwoDimData(cells), spreadsheet);

    if (copyWithHeader) {
      data = dataWithHeaderMatrix(selectedCellMeta, displayData, spreadsheet);
    }
  }

  if (data) {
    copyToClipboard(data);
  }
  return data;
};
