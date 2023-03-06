import { find, isEmpty, map, slice, zip } from 'lodash';
import { type CellMeta, VALUE_FIELD } from '../../../common';
import type { Node } from '../../../facet/layout/node';
import type { SpreadSheet } from '../../../sheet-type';
import type { CopyableList } from '../interface';
import { getHeaderList, getSelectedCols, getSelectedRows } from '../method';
import type { FormatOptions } from '../index';
import {
  matrixHtmlTransformer,
  matrixPlainTextTransformer,
  getFormatter,
  assembleMatrix,
  completeMatrix,
  getMaxRowLen,
} from './common';

const getDataMatrixByHeaderNode = (
  leafRowNodes: Node[],
  leafColNodes: Node[],
  spreadsheet: SpreadSheet,
) =>
  map(leafRowNodes, (rowNode) =>
    leafColNodes.map((colNode) => {
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

      return getFormatter(
        spreadsheet,
        colNode.field,
      )(cellData?.[VALUE_FIELD] ?? '');
    }),
  );

const getCornerMatrix = (
  spreadsheet: SpreadSheet,
  rowMatrix?: string[][],
): string[][] => {
  const { fields, meta } = spreadsheet.dataCfg;
  const { columns = [], rows = [] } = fields;
  const realRows = rows;
  const maxRowLen = spreadsheet.isHierarchyTreeType()
    ? getMaxRowLen(rowMatrix ?? [])
    : realRows.length;

  /*
   * const { showSeriesNumber, seriesNumberText } = spreadsheet.options;
   * 需要考虑 serisesNumber
   * if (showSeriesNumber) {
   *   realRows.unshift(getDefaultSeriesNumberText(seriesNumberText));
   * }
   */
  // 为了对齐数值
  columns.push('');
  // console.log(slice(realRows, 0, maxRowLen), 'slice(realRows, 0, maxRowLen)');
  /*
   * cornerMatrix 形成的矩阵为  rows.length(宽) * columns.length(高)
   */
  const cornerMatrix = map(columns, (col, colIndex) =>
    map(slice(realRows, 0, maxRowLen), (row, rowIndex) => {
      // 角头的最后一行，为行头
      if (colIndex === columns.length - 1) {
        return find(meta, ['field', row])?.name ?? row;
      }

      // 角头的最后一列，为列头
      if (rowIndex === maxRowLen - 1) {
        return find(meta, ['field', col])?.name ?? col;
      }

      return '';
    }),
  ) as unknown as string[][];

  // console.log(cornerMatrix, 'cornerMatrix');

  return cornerMatrix;
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
  let rowMatrix = map(leafRowNodes, (n) => getHeaderList(n.id));

  rowMatrix = completeMatrix(rowMatrix);

  const colMatrix = zip(
    ...map(leafColNodes, (n) => getHeaderList(n.id)),
  ) as string[][];

  return assembleMatrix(rowMatrix, colMatrix, dataMatrix);
}

export function processPivotSelected(
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

  // selectedColNodes 选中了指定的列头，则只展示对应列头对应的数据
  if (!isEmpty(selectedColNodes)) {
    colNodes = selectedColNodes.reduce<Node[]>((nodes, cellMeta) => {
      nodes.push(
        ...allColLeafNodes.filter((node) => node.id.startsWith(cellMeta.id)),
      );

      return nodes;
    }, []);
  }

  // selectedRowNodes 选中了指定的行头，则只展示对应行头对应的数据
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

export const getPivotAllCopyData = (
  spreadsheet: SpreadSheet,
  leafRowNodes: Node[],
  leafColNodes: Node[],
): CopyableList => {
  // todo-zc 的序号处理还有点麻烦，先不处理
  let rowMatrix = map(leafRowNodes, (n) => getHeaderList(n.id));

  // 当 rowMatrix 中的元素个数不一致时，需要补全
  rowMatrix = completeMatrix(rowMatrix);

  const colMatrix = zip(
    ...map(leafColNodes, (n) => getHeaderList(n.id)),
  ) as string[][];

  const cornerMatrix = getCornerMatrix(spreadsheet, rowMatrix);
  const dataMatrix = getDataMatrixByHeaderNode(
    leafRowNodes,
    leafColNodes,
    spreadsheet,
  ) as string[][];

  return assembleMatrix(rowMatrix, colMatrix, dataMatrix, cornerMatrix);
};

export const processPivotAllSelected = (
  spreadsheet: SpreadSheet,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  selectedCols?: CellMeta[],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  formatOptions?: FormatOptions,
): CopyableList => {
  const allRowLeafNodes = spreadsheet.getRowLeafNodes();
  const allColLeafNodes = spreadsheet.getColumnLeafNodes();
  /*
   * const colNodes = selectedCols.length
   *   ? selectedCols.reduce<Node[]>((nodes, cellMeta) => {
   *     nodes.push(
   *       ...allColLeafNodes.filter((node) => node.id.startsWith(cellMeta.id)),
   *     );
   *     return nodes;
   *   }, [])
   *   : allColLeafNodes;
   */

  return getPivotAllCopyData(spreadsheet, allRowLeafNodes, allColLeafNodes);
};
