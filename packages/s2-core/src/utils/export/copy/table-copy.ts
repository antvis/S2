import { filter, map, reduce } from 'lodash';
import type { SpreadSheet } from '../../../sheet-type';
import { type CellMeta, SERIES_NUMBER_FIELD } from '../../../common';
import type { Node } from '../../../facet/layout/node';
import type { CopyableList } from '../interface';
import { convertString } from '../method';
import type { FormatOptions } from '../interface';
import {
  assembleMatrix,
  getFormatOptions,
  getFormatter,
  matrixHtmlTransformer,
  matrixPlainTextTransformer,
} from './common';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
/*
 * class TableDataCellCopy {
 *   constructor(
 *     private spreadsheet: SpreadSheet,
 *     private selectedCells: CellMeta[],
 *   ) {}
 *
 *   processSelected(): CopyableList {
 *     const colNodes = this.getColNodes();
 *   }
 *
 *   private getColNodes(): Node[] {
 *     const columnNodes = (this.spreadsheet.getColumnNodes() || []).filter(
 *       // 滤过掉序号，序号不需要复制
 *       (colNode) => colNode.field !== SERIES_NUMBER_FIELD,
 *     );
 *
 *     const selectedColNodes: Node[] =
 *       (filter(columnNodes, (node) =>
 *         this.selectedCells.find((col) => col.id === node.id),
 *       ) as Node[]) ?? columnNodes;
 *
 *     return selectedColNodes;
 *   }
 * }
 *
 * const getTableColHeader = (spreadsheet: SpreadSheet): string[] => {};
 *
 */
export const processTableColSelected = (
  spreadsheet: SpreadSheet,
  selectedCols: CellMeta[],
): CopyableList => {
  const displayData = spreadsheet.dataSet.getDisplayDataSet();
  const columnNodes = (spreadsheet.getColumnNodes() || []).filter(
    // 滤过掉序号，序号不需要复制
    (colNode) => colNode.field !== SERIES_NUMBER_FIELD,
  );

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

export const processTableAllSelected = (
  spreadsheet: SpreadSheet,
  split: string,
  formatOptions: FormatOptions,
): CopyableList => {
  const displayData = spreadsheet.dataSet.getDisplayDataSet();
  const columnNodes = spreadsheet.getColumnNodes();
  const { isFormatData } = getFormatOptions(formatOptions);

  // 明细表的表头，没有格式化
  const colMatrix = columnNodes.map((node) => node.field) as string[];

  const dataMatrix = displayData.map((row) =>
    columnNodes.map((node) => {
      const field = node.field;
      const formatter = getFormatter(spreadsheet, field, isFormatData);
      const value = row[field];

      return formatter(value);
    }),
  ) as string[][];

  return assembleMatrix({ colMatrix: [colMatrix], dataMatrix });
};
