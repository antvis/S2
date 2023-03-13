import { escape, map, max } from 'lodash';
import type { DataItem } from '../../../common';
import type { SpreadSheet } from '../../../sheet-type';
import {
  type CopyableHTML,
  type CopyableList,
  type CopyablePlain,
  type FormatOptions,
  type CopyOrExportConfig,
  type CopyAndExportUnifyConfig,
  CopyMIMEType,
} from '../interface';
import { NewLine, NewTab } from '../../../common';

// 把 string[][] 矩阵转换成 CopyablePlain
export const matrixPlainTextTransformer = (
  dataMatrix: DataItem[][],
  separator = NewTab,
): CopyablePlain => {
  return {
    type: CopyMIMEType.PLAIN,
    content: map(dataMatrix, (line) => line.join(separator)).join(NewLine),
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
  field: string,
  isFormatData?: boolean,
) {
  const isFormatDataTemp = spreadsheet.options.interaction?.copyWithFormat;

  // spreadsheet.options.interaction?.copyWithFormat
  if (isFormatData ?? isFormatDataTemp) {
    return spreadsheet.dataSet.getFieldFormatter(field!);
  }

  return (value: DataItem) => value;
}

// 生成矩阵：https://gw.alipayobjects.com/zos/antfincdn/bxBVt0nXx/a182c1d4-81bf-469f-b868-8b2e29acfc5f.png
export const assembleMatrix = ({
  rowMatrix,
  colMatrix,
  dataMatrix,
  cornerMatrix,
}: {
  colMatrix: string[][];
  dataMatrix: string[][];
  rowMatrix?: string[][];
  cornerMatrix?: string[][];
}): CopyableList => {
  const rowWidth = rowMatrix?.[0]?.length ?? 0;
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
        return rowMatrix?.[y - colHeight][x];
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

export const getFormatOptions = (isFormat?: FormatOptions) => {
  if (typeof isFormat === 'object') {
    return {
      isFormatHeader: isFormat.isFormatHeader ?? false,
      isFormatData: isFormat.isFormatData ?? false,
    };
  }

  return {
    isFormatHeader: isFormat ?? false,
    isFormatData: isFormat ?? false,
  };
};

// 因为 copy 和 export 在配置上有一定差异，此方法用于抹平差异
export function unifyConfig(
  config: CopyOrExportConfig,
  spreadsheet: SpreadSheet,
  isExport: boolean,
): CopyAndExportUnifyConfig {
  let result = {
    isFormatData: spreadsheet.options.interaction?.copyWithFormat ?? false,
    isFormatHeader: spreadsheet.options.interaction?.copyWithFormat ?? false,
  };

  if (isExport) {
    const { isFormatData, isFormatHeader } = getFormatOptions(
      config?.formatOptions ?? false,
    );

    result = {
      isFormatData,
      isFormatHeader,
    };
  }

  return {
    separator: config.separator ?? NewTab,
    selectedCells: config.selectedCells ?? [],
    ...result,
  };
}
