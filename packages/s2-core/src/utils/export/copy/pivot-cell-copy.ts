import { isEmpty, map, zip } from 'lodash';
import { type CellMeta, VALUE_FIELD } from '../../../common';
import type { Node } from '../../../facet/layout/node';
import type { SpreadSheet } from '../../../sheet-type';
import type { CopyableList } from '../interface';
import { getHeaderList, getSelectedCols, getSelectedRows } from '../method';
import {
  matrixHtmlTransformer,
  matrixPlainTextTransformer,
  getFormatter,
  assembleMatrix,
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
