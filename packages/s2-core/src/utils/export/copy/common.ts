import { escape, map, max } from 'lodash';
import type { CellMeta, DataItem, SimpleData } from '../../../common';
import { LINE_SEPARATOR, ROOT_NODE_ID, TAB_SEPARATOR } from '../../../common';
import {
  CopyMIMEType,
  type CopyAndExportUnifyConfig,
  type CopyableHTML,
  type CopyablePlain,
  type FormatOptions,
  type MatrixHTMLTransformer,
  type MatrixPlainTransformer,
  type SheetCopyConstructorParams,
  type Transformer,
} from '../../../common/interface/export';
import type { Node } from '../../../facet/layout/node';
import type { SpreadSheet } from '../../../sheet-type/spread-sheet';

// 把 string[][] 矩阵转换成 CopyablePlain
export const matrixPlainTextTransformer = (
  dataMatrix: DataItem[][],
  separator = TAB_SEPARATOR,
): CopyablePlain => {
  return {
    type: CopyMIMEType.PLAIN,
    content: map(dataMatrix, (line) => line.join(separator)).join(
      LINE_SEPARATOR,
    ),
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

// 生成矩阵：https://gw.alipayobjects.com/zos/antfincdn/bxBVt0nXx/a182c1d4-81bf-469f-b868-8b2e29acfc5f.png
export const assembleMatrix = ({
  rowMatrix,
  colMatrix,
  dataMatrix,
  cornerMatrix,
}: {
  colMatrix: SimpleData[][];
  dataMatrix: SimpleData[][];
  rowMatrix?: SimpleData[][];
  cornerMatrix?: SimpleData[][];
}): SimpleData[][] => {
  const rowWidth = rowMatrix?.[0]?.length ?? 0;
  const colHeight = colMatrix?.length ?? 0;
  const dataWidth = dataMatrix[0]?.length ?? 0;
  const dataHeight = dataMatrix.length ?? 0;
  const matrixWidth = rowWidth + dataWidth;
  const matrixHeight = colHeight + dataHeight;

  let matrix: SimpleData[][] = Array.from(
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

  return matrix as SimpleData[][];
};

export function getMaxRowLen(matrix: SimpleData[][]): number {
  return max(map(matrix, (row) => row.length)) ?? 0;
}

/**
 * 补全 matrix 中的元素个数, 使得每一行的元素个数一致，以最大的行元素个数为准
 * @param {SimpleData[][]} matrix
 * @return {SimpleData[][]}
 */
export function completeMatrix(matrix: SimpleData[][]): SimpleData[][] {
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
    separator = TAB_SEPARATOR,
    selectedCells = [],
    customTransformer,
    async = false,
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
    async,
  };
}

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

    const formatter = node.spreadsheet?.dataSet?.getFieldFormatter?.(
      node.field,
    );
    const value = formatter?.(node.value);

    line.unshift(value as string);
    if (node?.parent) {
      return getNodeFormatterLabel(node.parent);
    }
  };

  getNodeFormatterLabel(leafNode);

  return line;
};

export const getHeaderNodeFromMeta = (
  meta: CellMeta,
  spreadsheet: SpreadSheet,
) => {
  const { rowIndex, colIndex } = meta;
  const { facet } = spreadsheet;

  return [facet.getRowNodeByIndex(rowIndex), facet.getColNodeByIndex(colIndex)];
};
