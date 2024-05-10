import { DEFAULT_FROZEN_COUNTS } from '../../common';
import type {
  S2Options,
  S2TableSheetFrozenOptions,
} from '../../common/interface';
import type { Node } from '../../facet/layout/node';

export const getValidFrozenOptions = (
  defaultFrozenOptions: S2TableSheetFrozenOptions = {},
  colLength: number,
  dataLength = 0,
): Required<S2TableSheetFrozenOptions> => {
  const frozenOptions: Required<S2TableSheetFrozenOptions> = {
    ...DEFAULT_FROZEN_COUNTS,
    ...defaultFrozenOptions,
  };

  if (frozenOptions.colCount! >= colLength) {
    frozenOptions.colCount = colLength;
  }

  const remainFrozenColCount = colLength - frozenOptions.colCount!;

  if (frozenOptions.trailingColCount! > remainFrozenColCount) {
    frozenOptions.trailingColCount = remainFrozenColCount;
  }

  if (frozenOptions.rowCount! >= dataLength) {
    frozenOptions.rowCount = dataLength;
  }

  const remainFrozenRowCount = dataLength - frozenOptions.rowCount!;

  if (frozenOptions.trailingRowCount! > remainFrozenRowCount) {
    frozenOptions.trailingRowCount = remainFrozenRowCount;
  }

  return frozenOptions;
};

/**
 * 给定一个一层的 node 数组以及左右固定列的数量，计算出实际固定列（叶子节点）的数量
 * @param nodes
 * @param colCount
 * @param trailingColCount
 * @returns {colCount, trailingColCount}
 */
export const getFrozenLeafNodesCount = (
  nodes: Node[],
  colCount: number,
  trailingColCount: number,
): { colCount: number; trailingColCount: number } => {
  const getLeafNodesCount = (node: Node) => {
    if (node.isLeaf) {
      return 1;
    }

    if (node.children) {
      return node.children.reduce((pCount, item) => {
        pCount += getLeafNodesCount(item);

        return pCount;
      }, 0);
    }

    return 0;
  };

  if (colCount) {
    colCount = nodes.slice(0, colCount).reduce((count, node) => {
      count += getLeafNodesCount(node);

      return count;
    }, 0);
  }

  if (trailingColCount) {
    trailingColCount = nodes
      .slice(nodes.length - trailingColCount)
      .reduce((count, node) => {
        count += getLeafNodesCount(node);

        return count;
      }, 0);
  }

  return { colCount, trailingColCount };
};

/**
 * get frozen options pivot-sheet (business limit)
 * @param options
 * @returns
 */
export const getValidFrozenOptionsForPivot = (
  options: S2Options,
  dataLength: number = 0,
): Required<S2TableSheetFrozenOptions> => {
  /**
   * series number cell 可以自定义布局，和 row cell 不一定是 1 对 1 的关系
   * seriesNumber 暂时禁用 首行冻结
   * */
  const { frozen, seriesNumber } = options;

  if (seriesNumber?.enable) {
    return DEFAULT_FROZEN_COUNTS;
  }

  let rowCount = frozen?.rowCount ?? 0;
  let trailingRowCount = frozen?.trailingRowCount ?? 0;

  if (rowCount >= dataLength) {
    rowCount = dataLength;
  }

  const remainFrozenRowCount = dataLength - rowCount!;

  if (trailingRowCount > remainFrozenRowCount) {
    trailingRowCount = remainFrozenRowCount;
  }

  return {
    ...DEFAULT_FROZEN_COUNTS,
    rowCount,
    trailingRowCount,
  };
};
