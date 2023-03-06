import { escape, map, max } from 'lodash';
import type { DataItem } from '../../../common';
import type { SpreadSheet } from '../../../sheet-type';
import {
  type CopyableHTML,
  type CopyableList,
  type CopyablePlain,
  CopyMIMEType,
} from '../interface';
import { NewLine, NewTab } from '../../../common';

export const matrixPlainTextTransformer = (
  dataMatrix: DataItem[][],
): CopyablePlain => {
  return {
    type: CopyMIMEType.PLAIN,
    content: map(dataMatrix, (line) => line.join(NewTab)).join(NewLine),
  };
};

// 把 string[][] 矩阵转换成 CopyableItem
export const matrixHtmlTransformer = (
  dataMatrix: DataItem[][],
): CopyableHTML => {
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

export function getFormatter(
  spreadsheet: SpreadSheet,
  field: string | undefined,
) {
  if (spreadsheet.options.interaction?.copyWithFormat) {
    return spreadsheet.dataSet.getFieldFormatter(field!);
  }

  return (value: DataItem) => value;
}

// 生成矩阵：https://gw.alipayobjects.com/zos/antfincdn/bxBVt0nXx/a182c1d4-81bf-469f-b868-8b2e29acfc5f.png
export const assembleMatrix = (
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

  matrix = map(matrix, (heightArr, y) =>
    map(heightArr, (_, x) => {
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
    }),
  );

  return [matrixPlainTextTransformer(matrix), matrixHtmlTransformer(matrix)];
};

export function getMaxRowLen(matrix: string[][]): number {
  return max(map(matrix, (row) => row.length)) ?? 0;
}

/**
 * 补全 matrix 中的元素个数, 使得每一行的元素个数一致，以最大的行元素个数为准
 * @param {string[][]} matrix
 * @return {string[][]}
 */
export function completeMatrix(matrix: string[][]): string[][] {
  const maxRowLen = getMaxRowLen(matrix);

  return map(matrix, (row) => {
    const diff = maxRowLen - row.length;

    return diff ? [...row, ...new Array(diff).fill('')] : row;
  });
}
