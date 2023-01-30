import { filter, map, reduce } from 'lodash';
import type { SpreadSheet } from '../../../sheet-type';
import { type CellMeta, SERIES_NUMBER_FIELD } from '../../../common';
import type { Node } from '../../../facet/layout/node';
import type { CopyableList } from '../interface';
import { convertString } from '../method';
import {
  getFormatter,
  matrixHtmlTransformer,
  matrixPlainTextTransformer,
} from './common';

export const processTableColSelected = (
  spreadsheet: SpreadSheet,
  selectedCols: CellMeta[],
): CopyableList => {
  const displayData = spreadsheet.dataSet.getDisplayDataSet();
  const columnNodes = spreadsheet.getColumnNodes();

  const selectedColNodes: Node[] = selectedCols.length
    ? (filter(columnNodes, (node) =>
        selectedCols.find((col) => col.id === node.id),
      ) as Node[])
    : columnNodes;

  const dataMatrix = displayData.map((row) =>
    selectedColNodes.map((node) => {
      const field = node.field;
      const formatter = getFormatter(spreadsheet, field);
      const value = row[field];

      return formatter(value);
    }),
  );

  return [
    matrixPlainTextTransformer(dataMatrix),
    matrixHtmlTransformer(dataMatrix),
  ];
};

/**
 * 明细表点击行头进行复制逻辑
 * @param {SpreadSheet} spreadsheet
 * @param {CellMeta[]} selectedRows
 * @return {CopyableList}
 */
export const processTableRowSelected = (
  spreadsheet: SpreadSheet,
  selectedRows: CellMeta[],
): CopyableList => {
  const displayData = spreadsheet.dataSet.getDisplayDataSet();
  const columnNodes = spreadsheet.getColumnNodes();
  const matrix = map(selectedRows, (row) => {
    const rowData = displayData[row.rowIndex];

    // 对行内的每条数据进行格式化
    return reduce(
      columnNodes,
      (acc: string[], colNode: Node) => {
        const key = colNode?.field;
        const value = rowData[key];
        const noFormatting = !colNode || key === SERIES_NUMBER_FIELD;

        if (noFormatting) {
          return acc;
        }

        const formatterVal = convertString(
          getFormatter(spreadsheet, colNode?.field)(value),
        ) as string;

        acc.push(formatterVal);

        return acc;
      },
      [],
    );
  });

  return [matrixPlainTextTransformer(matrix), matrixHtmlTransformer(matrix)];
};
