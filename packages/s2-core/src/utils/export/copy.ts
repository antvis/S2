import {
  escape,
  every,
  filter,
  find,
  isEmpty,
  map,
  max,
  repeat,
  zip,
} from 'lodash';
import {
  type CellMeta,
  CellTypes,
  type Data,
  type DataItem,
  EMPTY_PLACEHOLDER,
  EXTRA_FIELD,
  InteractionStateName,
  NODE_ID_SEPARATOR,
  type S2CellType,
  VALUE_FIELD,
} from '../../common';
import type { Node } from '../../facet/layout/node';
import type { SpreadSheet } from '../../sheet-type';
import { copyToClipboard } from '../../utils/export';
import type { ColCell, RowCell } from '../../cell';
import {
  convertString,
  getAllLevels,
  getColNodeFieldFromNode,
  newLine,
  newTab,
} from './method';
import {
  type Copyable,
  type CopyableHTML,
  type CopyableList,
  type CopyablePlain,
  CopyMIMEType,
} from './interface';

const getFiledIdFromMeta = (colIndex: number, spreadsheet: SpreadSheet) => {
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

const getFormat = (colIndex: number | undefined, spreadsheet: SpreadSheet) => {
  const colNode = spreadsheet
    .getColumnNodes()
    .find((col) => col.colIndex === colIndex);
  const fieldValue = getColNodeFieldFromNode(spreadsheet.isPivotMode, colNode);
  if (spreadsheet.options.interaction?.copyWithFormat) {
    return spreadsheet.dataSet.getFieldFormatter(fieldValue!);
  }
  return (value: DataItem) => value;
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
  const fieldKey = getFiledIdFromMeta(meta.colIndex, spreadsheet);
  return displayData[meta.rowIndex]?.[fieldKey!];
};

const format = (
  meta: CellMeta,
  displayData: Data[],
  spreadsheet: SpreadSheet,
) => {
  const formatter = getFormat(meta.colIndex, spreadsheet);
  return formatter(getValueFromMeta(meta, displayData, spreadsheet)!);
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
  const headerList = headerId.split(NODE_ID_SEPARATOR);
  if (startLevel) {
    return headerList.slice(headerList.length - startLevel);
  }
  headerList.shift(); // 去除 root
  return headerList;
};

// 把 DataItem[][] 矩阵转换成 CopyableItem
const matrixPlainTextTransformer = (
  dataMatrix: DataItem[][],
): CopyablePlain => {
  return {
    type: CopyMIMEType.PLAIN,
    content: map(dataMatrix, (line) => line.join(newTab)).join(newLine),
  };
};

// 把 string[][] 矩阵转换成 CopyableItem
const matrixHtmlTransformer = (dataMatrix: DataItem[][]): CopyableHTML => {
  function createTableData(data: DataItem[], tagName: string) {
    return data
      .map((cell) => `<${tagName}>${escape(cell as string)}</${tagName}>`)
      .join('');
  }

  function createBody(data: DataItem[][], tagName: string) {
    return data
      .map((row) => `<${tagName}>${createTableData(row, 'td')}</${tagName}>`)
      .join('');
  }

  const body = createBody(dataMatrix, 'tr');
  return {
    type: CopyMIMEType.HTML,
    content: `<meta charset="utf-8"><table><tbody>${body}</tbody></table>`,
  };
};

// 生成矩阵：https://gw.alipayobjects.com/zos/antfincdn/bxBVt0nXx/a182c1d4-81bf-469f-b868-8b2e29acfc5f.png
const assembleMatrix = (
  rowMatrix: string[][],
  colMatrix: string[][],
  dataMatrix: string[][],
  cornerMatrix?: string[][],
): CopyableList => {
  const rowWidth = rowMatrix[0]?.length ?? 0;
  const colHeight = colMatrix?.length ?? 0;
  const dataWidth = dataMatrix[0]?.length ?? 0;
  const dataHeight = dataMatrix.length ?? 0;
  const matrixWidth = rowWidth + dataWidth;
  const matrixHeight = colHeight + dataHeight;

  let matrix: (string | undefined)[][] = Array.from(
    Array(matrixHeight),
    () => new Array(matrixWidth),
  );

  matrix = map(matrix, (heightArr, y) => {
    return map(heightArr, (_, x) => {
      if (x >= 0 && x < rowWidth && y >= 0 && y < colHeight) {
        return cornerMatrix?.[y]?.[x] ?? '';
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
  });

  return [matrixPlainTextTransformer(matrix), matrixHtmlTransformer(matrix)];
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

const processTableColSelected = (
  spreadsheet: SpreadSheet,
  selectedCols: CellMeta[],
): CopyableList => {
  const { columns = [] } = spreadsheet.dataCfg.fields;
  const displayData = spreadsheet.dataSet.getDisplayDataSet();

  /**
   * 获取 id 对应的 colNode field. eg: id: root&age, field: age
   * @param id
   */
  const getColNodeFieldFromId = (id: string | undefined) => {
    const colNode = spreadsheet.getColumnNodes().find((col) => col.id === id);
    return colNode?.field;
  };

  const selectedFields = selectedCols.length
    ? selectedCols.map((e) => ({
        field: getColNodeFieldFromId(e.id),
        formatter: getFormat(e.colIndex, spreadsheet),
      }))
    : columns
        .map((cName) =>
          spreadsheet.getColumnNodes().find((n) => n.field === cName),
        )
        .map((node) => ({
          field: getColNodeFieldFromNode(spreadsheet.isPivotMode, node),
          formatter: getFormat(node?.colIndex, spreadsheet),
        }));

  const dataMatrix = displayData.map((row) => {
    return selectedFields.map(({ field, formatter }) =>
      convertString(formatter(row[field!]) as string),
    );
  });

  return [
    matrixPlainTextTransformer(dataMatrix),
    matrixHtmlTransformer(dataMatrix),
  ];
};

const getDataMatrixByHeaderNode = (
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

export const getPivotAllCopyData = (
  spreadsheet: SpreadSheet,
  leafRowNodes: Node[],
  leafColNodes: Node[],
): Copyable => {
  const getCornerMatrix = (): string[][] => {
    const { fields, meta } = spreadsheet.dataCfg;
    const { columns = [], rows = [] } = fields;
    const realRows = rows;
    // const { showSeriesNumber, seriesNumberText } = spreadsheet.options;
    // 需要考虑 serisesNumber
    // if (showSeriesNumber) {
    //   realRows.unshift(getDefaultSeriesNumberText(seriesNumberText));
    // }
    columns.push(''); // 为了对齐数值
    // cornerMatrix 形成的矩阵为  rows.length(宽) * columns.length(高)
    // @ts-ignore
    const cornerMatrix: string[][] = map(columns, (col, colIndex) => {
      return map(realRows, (row, rowIndex) => {
        // 角头的最后一行，为行头
        if (colIndex === columns.length - 1) {
          return find(meta, ['field', row])?.name ?? row;
        }
        // 角头的最后一列，为列头
        if (rowIndex === rows.length - 1) {
          return find(meta, ['field', col])?.name ?? col;
        }
        return '';
      });
    });
    // console.log(cornerMatrix, 'cornerMatrix');
    return cornerMatrix;
  };

  const cornerMatrix = getCornerMatrix();
  // todo-zc 的序号处理还有点麻烦，先不处理
  const rowMatrix = map(leafRowNodes, (n) => getHeaderList(n.id));
  const colMatrix = zip(
    ...map(leafColNodes, (n) => getHeaderList(n.id)),
  ) as string[][];
  const dataMatrix = getDataMatrixByHeaderNode(
    leafRowNodes,
    leafColNodes,
    spreadsheet,
  ) as string[][];
  return assembleMatrix(rowMatrix, colMatrix, dataMatrix, cornerMatrix);
};

function getPivotCopyData(
  spreadsheet: SpreadSheet,
  leafRowNodes: Node[],
  leafColNodes: Node[],
): CopyableList {
  const { copyWithHeader } = spreadsheet.options.interaction!;
  const dataMatrix = getDataMatrixByHeaderNode(
    leafRowNodes,
    leafColNodes,
    spreadsheet,
  ) as string[][];
  // 不带表头复制
  if (!copyWithHeader) {
    return [
      matrixPlainTextTransformer(dataMatrix),
      matrixHtmlTransformer(dataMatrix),
    ];
  }

  // 带表头复制
  const rowMatrix = map(leafRowNodes, (n) => getHeaderList(n.id));
  const colMatrix = zip(
    ...map(leafColNodes, (n) => getHeaderList(n.id)),
  ) as string[][];
  return assembleMatrix(rowMatrix, colMatrix, dataMatrix);
}

const getSelectedCols = (cells: CellMeta[]) =>
  cells.filter(({ type }) => type === CellTypes.COL_CELL);

const getSelectedRows = (cells: CellMeta[]) =>
  cells.filter(({ type }) => type === CellTypes.ROW_CELL);

function processPivotSelected(
  spreadsheet: SpreadSheet,
  selectedCells: CellMeta[],
): CopyableList {
  const allRowLeafNodes = spreadsheet
    .getRowNodes()
    .filter((node) => node.isLeaf || spreadsheet.isHierarchyTreeType());
  const allColLeafNodes = spreadsheet
    .getColumnNodes()
    .filter((node) => node.isLeaf);

  let colNodes: Node[] = allColLeafNodes;
  let rowNodes: Node[] = allRowLeafNodes;
  const selectedColNodes = getSelectedCols(selectedCells);
  const selectedRowNodes = getSelectedRows(selectedCells);

  if (!isEmpty(selectedColNodes)) {
    colNodes = selectedColNodes.reduce<Node[]>((nodes, cellMeta) => {
      nodes.push(
        ...allColLeafNodes.filter((node) => node.id.startsWith(cellMeta.id)),
      );
      return nodes;
    }, []);
  }

  if (!isEmpty(selectedRowNodes)) {
    rowNodes = selectedRowNodes.reduce<Node[]>((nodes, cellMeta) => {
      nodes.push(
        ...allRowLeafNodes.filter((node) => node.id.startsWith(cellMeta.id)),
      );
      return nodes;
    }, []);
  }

  return getPivotCopyData(spreadsheet, rowNodes, colNodes);
}

// const processPivotAllSelected = (
//   spreadsheet: SpreadSheet,
//   selectedCols: CellMeta[],
// ): Copyable => {
//   const allRowLeafNodes = spreadsheet
//     .getRowNodes()
//     .filter((node) => node.isLeaf);
//   const allColLeafNodes = spreadsheet
//     .getColumnNodes()
//     .filter((node) => node.isLeaf);
//
//   const colNodes = selectedCols.length
//     ? selectedCols.reduce<Node[]>((nodes, cellMeta) => {
//         nodes.push(
//           ...allColLeafNodes.filter((node) => node.id.startsWith(cellMeta.id)),
//         );
//         return nodes;
//       }, [])
//     : allColLeafNodes;
//
//   return getPivotAllCopyData(spreadsheet, allRowLeafNodes, colNodes);
// };

const processColSelected = (
  spreadsheet: SpreadSheet,
  selectedCols: CellMeta[],
): CopyableList => {
  if (spreadsheet.isPivotMode()) {
    return processPivotSelected(spreadsheet, selectedCols);
  }
  return processTableColSelected(spreadsheet, selectedCols);
};

// const processAllSelected = (
//   spreadsheet: SpreadSheet,
//   selectedCols: CellMeta[],
// ): Copyable => {
//   if (spreadsheet.isPivotMode()) {
//     return processPivotAllSelected(spreadsheet, selectedCols);
//   }
//   return processTableColSelected(spreadsheet, selectedCols);
// };

const processTableRowSelected = (
  spreadsheet: SpreadSheet,
  selectedRows: CellMeta[],
): CopyableList => {
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
            getFormat(node?.colIndex, spreadsheet)(entry[node?.field!]),
          ),
        );
    });
  return [matrixPlainTextTransformer(matrix), matrixHtmlTransformer(matrix)];
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

  const dataMatrix = map(cellMetaMatrix, (cellsMeta) => {
    return map(cellsMeta, (it) =>
      convertString(format(it, displayData, spreadsheet)),
    );
  }) as string[][];

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

/**
 * 过滤出 intersection cell 中所有叶子节点的 cellMeta
 * @param interactedCells
 * @param maxLevel
 * @returns {CellMeta[]}
 */
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

/**
 * 获取表头圈选后的 header cells 值矩阵
 * @param lastLevelCells
 * @param maxLevel
 * @param allLevel
 * @returns {string[][]}
 */
function getHeaderCellMatrix(
  lastLevelCells: Array<RowCell | ColCell>,
  maxLevel: number,
  allLevel: Set<number>,
): string[][] {
  return map(lastLevelCells, (cell: RowCell | ColCell) => {
    const meta = cell.getMeta();
    const { id, value, isTotals, level } = meta;
    let cellId = id;
    // 为总计小计补齐高度
    if (isTotals && level !== maxLevel) {
      cellId = id + NODE_ID_SEPARATOR + repeat(value, maxLevel - level);
    }
    return getHeaderList(cellId, allLevel.size);
  });
}

function getBrushHeaderCopyable(
  interactedCells: RowCell[] | ColCell[],
): CopyableList {
  // 获取圈选的层级有哪些
  const allLevels = getAllLevels(interactedCells);
  const maxLevel = max(Array.from(allLevels)) ?? 0;
  // 获取最后一层的 cell
  const lastLevelCells = getLastLevelCells(interactedCells, maxLevel) as Array<
    RowCell | ColCell
  >;

  // 拼接选中行列头的内容矩阵
  const isCol = interactedCells[0].cellType === CellTypes.COL_CELL;
  let cellMatrix = getHeaderCellMatrix(lastLevelCells, maxLevel, allLevels);

  // 如果是列头，需要转置
  if (isCol) {
    cellMatrix = zip(...cellMatrix) as string[][];
  }
  return [
    matrixPlainTextTransformer(cellMatrix),
    matrixHtmlTransformer(cellMatrix),
  ];
}

// const tilePivotData = (
//   data: any,
//   columnOrdered: CustomHeaderField[],
//   defaultDataValue?: string,
// ): Array<string> => {
//   // @ts-ignore
//   return map(columnOrdered, (field) => data[field] ?? defaultDataValue);
// };

// const getDataByRowData = (
//   spreadsheet: SpreadSheet,
//   rowData: RowData,
// ): Copyable => {
//   const {
//     options: { placeholder },
//     dataCfg: {
//       fields: { rows = [], columns = [], values = [] },
//     },
//   } = spreadsheet;
//   const defaultDataValue = getEmptyPlaceholder(spreadsheet, placeholder);
//   const column = spreadsheet.getColumnLeafNodes();
//   let datas: string[][] = [];
//
//   if (spreadsheet.isTableMode()) {
//     const columnWithoutSeriesNumber = filter(
//       column,
//       (node) => node.field !== SERIES_NUMBER_FIELD,
//     );
//     // 按列头顺序复制
//     datas = map(rowData, (rowDataItem) => {
//       return map(
//         columnWithoutSeriesNumber,
//         // @ts-ignore
//         (node) => rowDataItem?.[node.field] ?? defaultDataValue,
//       );
//     });
//   } else if (spreadsheet.isPivotMode()) {
//     // 透视表的数据加上行头、列头才有意义，这里会以行头、列头、数据值的顺序将每一个单元格构造成一行
//     const columnOrdered = [...rows, ...columns, ...values];
//     const rowDataFlatten = flattenDeep(rowData as unknown as Array<RowData>);
//     // 去掉小计
//     const rowDataFlattenWithoutTotal = rowDataFlatten.filter((data) =>
//       [...rows, ...columns].every((field) => !isNil(data[field as string])),
//     );
//     datas = reduce(
//       rowDataFlattenWithoutTotal,
//       (ret: unknown[], data) => {
//         return [...ret, tilePivotData(data, columnOrdered, defaultDataValue)];
//       },
//       [],
//     ) as string[][];
//   }
//   return matrixPlainTextTransformer(datas);
// };

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
    // const { currentRow } = spreadsheet.interaction.getSelectedCellHighlight();
    // if (currentRow) {
    //   const rowData = orderBy(cells, 'rowIndex', 'asc').map((cell) =>
    //     spreadsheet.dataSet.getRowData(cell),
    //   );
    //   data = getDataByRowData(spreadsheet, rowData as unknown as RowData);
    // } else
    data = getDataMatrixByDataCell(
      selectedCellsMeta,
      displayData as Data[],
      spreadsheet,
    );
  }
  return data;
}

function getIsBrushHeader(interactedCells: S2CellType[]) {
  return isEmpty(interactedCells)
    ? false
    : every(interactedCells, (cell) => {
        return (
          cell.cellType === CellTypes.ROW_CELL ||
          cell.cellType === CellTypes.COL_CELL
        );
      });
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
