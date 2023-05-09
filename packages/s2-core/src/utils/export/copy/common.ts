import { escape, map, max } from 'lodash';
import type { Node } from '../../../facet/layout/node';
import type { DataItem } from '../../../common';
import { NewLine, NewTab, ROOT_NODE_ID } from '../../../common';
import type { SpreadSheet } from '../../../sheet-type';
import {
  type CopyableHTML,
  type CopyableList,
  type CopyablePlain,
  type CopyAndExportUnifyConfig,
  type FormatOptions,
  type MatrixTransformer,
  type SheetCopyConstructorParams,
  type Transformer,
  CopyMIMEType,
} from '../interface';

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

export const transformers: {
  [key in CopyMIMEType]: MatrixTransformer;
} = {
  [CopyMIMEType.PLAIN]: matrixPlainTextTransformer,
  [CopyMIMEType.HTML]: matrixHtmlTransformer,
};

// todo: 用户想自定义方法，比如限制最大导出行数，可以通过这个方法来实现
export function registerTransformer(
  type: CopyMIMEType,
  transformer: MatrixTransformer,
) {
  transformers[type] = transformer;
}

export function getFormatter(
  spreadsheet: SpreadSheet,
  field: string,
  isFormatData = false,
) {
  if (isFormatData) {
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
export function unifyConfig({
  spreadsheet,
  config,
  isExport,
}: SheetCopyConstructorParams): CopyAndExportUnifyConfig {
  const {
    formatOptions = false,
    separator = NewTab,
    selectedCells = [],
    customTransformer,
  } = config;

  let isFormatData = spreadsheet.options.interaction?.copyWithFormat ?? false;
  let isFormatHeader = spreadsheet.options.interaction?.copyWithFormat ?? false;
  let customTransformers: Transformer = transformers;

  if (isExport) {
    ({ isFormatData, isFormatHeader } = getFormatOptions(formatOptions));

    if (customTransformer) {
      const customTransformersTemp = customTransformer(transformers);

      customTransformers = {
        [CopyMIMEType.PLAIN]:
          customTransformersTemp[CopyMIMEType.PLAIN] ||
          transformers[CopyMIMEType.PLAIN],
        [CopyMIMEType.HTML]:
          customTransformersTemp[CopyMIMEType.HTML] ||
          transformers[CopyMIMEType.HTML],
      };
    }
  }

  return {
    separator,
    selectedCells,
    transformers: customTransformers,
    isFormatData,
    isFormatHeader,
  };
}

const getNodeFormatLabel = (node: Node) => {
  const formatter = node.spreadsheet?.dataSet?.getFieldFormatter?.(node.field);

  return formatter?.(node.value) ?? node.value;
};

/**
 * 通过 rowLeafNode 获取到当前行所有 rowNode 的数据
 * @param rowLeafNode
 */
export const getNodeFormatData = (rowLeafNode: Node) => {
  const line: string[] = [];
  const getRowNodeFormatterLabel = (node: Node): string | undefined => {
    // node.id === KEY_ROOT_NODE 时，为 S2 内的虚拟根节点，导出的内容不需要考虑此节点
    if (node.id === ROOT_NODE_ID) {
      return;
    }

    const formatterLabel = getNodeFormatLabel(node);

    line.unshift(formatterLabel);
    if (node?.parent) {
      return getRowNodeFormatterLabel(node.parent);
    }
  };

  getRowNodeFormatterLabel(rowLeafNode);

  return line;
};
