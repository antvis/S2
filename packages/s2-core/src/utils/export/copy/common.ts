import { escape, map, max } from 'lodash';
import type { Node } from '../../../facet/layout/node';
import type { DataItem } from '../../../common';
import { NewLine, NewTab, ROOT_NODE_ID } from '../../../common';
import {
  type CopyableHTML,
  type CopyablePlain,
  type CopyAndExportUnifyConfig,
  type FormatOptions,
  type SheetCopyConstructorParams,
  type Transformer,
  type MatrixPlainTransformer,
  type MatrixHTMLTransformer,
  CopyMIMEType,
} from '../../../common/interface/export';
import type { BaseDataSet } from './../../../data-set/base-data-set';

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

export const Transformers: {
  [CopyMIMEType.PLAIN]: MatrixPlainTransformer;
  [CopyMIMEType.HTML]: MatrixHTMLTransformer;
} = {
  [CopyMIMEType.PLAIN]: matrixPlainTextTransformer,
  [CopyMIMEType.HTML]: matrixHtmlTransformer,
};

export function getFormatter(
  field: string,
  formatData = false,
  dataSet: BaseDataSet,
) {
  if (formatData) {
    return dataSet.getFieldFormatter(field!);
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
}): string[][] => {
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

  return matrix as string[][];
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

export const getFormatOptions = (formatOptions?: FormatOptions) => {
  if (typeof formatOptions === 'object') {
    return {
      formatHeader: formatOptions.formatHeader ?? false,
      formatData: formatOptions.formatData ?? false,
    };
  }

  return {
    formatHeader: formatOptions ?? false,
    formatData: formatOptions ?? false,
  };
};

function getTransformer(
  customTransformer?: (transformer: Transformer) => Partial<Transformer>,
): Transformer {
  if (!customTransformer) {
    return Transformers;
  }

  const customTransformersTemp = customTransformer(Transformers);

  return {
    [CopyMIMEType.PLAIN]:
      customTransformersTemp[CopyMIMEType.PLAIN] ||
      Transformers[CopyMIMEType.PLAIN],
    [CopyMIMEType.HTML]:
      customTransformersTemp[CopyMIMEType.HTML] ||
      Transformers[CopyMIMEType.HTML],
  };
}

// 因为 copy 和 export 在配置上有一定差异，此方法用于抹平差异
export function unifyConfig({
  spreadsheet: {
    options: { interaction },
  },
  config: {
    formatOptions = false,
    separator = NewTab,
    selectedCells = [],
    customTransformer,
    isAsyncExport = false,
  },
  isExport,
}: SheetCopyConstructorParams): CopyAndExportUnifyConfig {
  const { copy } = interaction!;
  const { formatData, formatHeader } = isExport
    ? getFormatOptions(formatOptions)
    : {
        formatData: copy?.withFormat ?? false,
        formatHeader: copy?.withFormat ?? false,
      };
  const transformers = getTransformer(
    isExport ? customTransformer : copy?.customTransformer,
  );

  return {
    separator,
    selectedCells,
    transformers,
    formatData,
    formatHeader,
    isAsyncExport,
  };
}

const getNodeFormatLabel = (node: Node) => {
  const formatter = node.spreadsheet?.dataSet?.getFieldFormatter?.(node.field);

  return formatter?.(node.value) ?? node.value;
};

/**
 * 获取到当前节点所有数据
 * @param leafNode
 */
export const getNodeFormatData = (leafNode: Node) => {
  const line: string[] = [];

  const getNodeFormatterLabel = (node: Node): string | undefined => {
    // node.id === KEY_ROOT_NODE 时，为 S2 内的虚拟根节点，导出的内容不需要考虑此节点
    if (node.id === ROOT_NODE_ID) {
      return;
    }

    const formatterLabel = getNodeFormatLabel(node);

    line.unshift(formatterLabel);
    if (node?.parent) {
      return getNodeFormatterLabel(node.parent);
    }
  };

  getNodeFormatterLabel(leafNode);

  return line;
};
