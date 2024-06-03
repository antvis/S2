import type { Group } from '@antv/g';
import { findIndex, isEmpty, isNil } from 'lodash';
import type { FrozenCellIndex } from '../common/constant/frozen';
import { FrozenGroupType } from '../common/constant/frozen';
import { DEFAULT_PAGE_INDEX } from '../common/constant/pagination';
import type {
  CustomHeaderFields,
  Fields,
  Pagination,
  S2BaseFrozenOptions,
  ScrollSpeedRatio,
} from '../common/interface';
import type { SimpleBBox } from '../engine';
import type { Indexes } from '../utils/indexes';
import type { ViewCellHeights } from './layout/interface';
import type { Node } from './layout/node';

export const isFrozenCol = (colIndex: number, frozenCount: number) =>
  frozenCount > 0 && colIndex < frozenCount;

export const isFrozenTrailingCol = (
  colIndex: number,
  frozenCount: number,
  colLength: number,
) => frozenCount > 0 && colIndex >= colLength - frozenCount;

export const isFrozenRow = (
  rowIndex: number,
  minRowIndex: number,
  frozenCount: number,
) => frozenCount > 0 && rowIndex < minRowIndex + frozenCount;

export const isFrozenTrailingRow = (
  rowIndex: number,
  maxRowIndex: number,
  frozenCount: number,
) => frozenCount > 0 && rowIndex >= maxRowIndex + 1 - frozenCount;

/**
 * 计算偏移 scrollX、scrollY 的时候，在视窗中的节点索引
 */
export const calculateInViewIndexes = (options: {
  scrollX: number;
  scrollY: number;
  widths: number[];
  heights: ViewCellHeights;
  viewport: SimpleBBox;
  rowRemainWidth?: number;
}): Indexes => {
  const { scrollX, scrollY, widths, heights, viewport, rowRemainWidth } =
    options;

  // 1. 计算 x min、max
  let xMin = findIndex(
    widths,
    (width: number, idx: number) => {
      const x =
        scrollX - (isNil(rowRemainWidth) ? 0 : rowRemainWidth) + viewport.x;

      return x >= width && x < widths[idx + 1];
    },
    0,
  );

  xMin = Math.max(xMin, 0);

  let xMax = findIndex(
    widths,
    (width: number, idx: number) => {
      const x = viewport.width + scrollX + viewport.x;

      return x >= width && x < widths[idx + 1];
    },
    xMin,
  );

  xMax = Math.min(xMax === -1 ? Infinity : xMax, widths.length - 2);

  const { start: yMin, end: yMax } = heights.getIndexRange(
    scrollY + viewport.y,
    viewport.height + scrollY + viewport.y,
  );

  return [xMin, xMax, yMin, yMax];
};

/**
 * 优化滚动方向，对于小角度的滚动，固定为一个方向
 * @param x
 * @param y
 * @param ratio
 */
export const optimizeScrollXY = (
  x: number,
  y: number,
  ratio: ScrollSpeedRatio,
): [number, number] => {
  // 调参工程师
  const ANGLE = 2;
  const angle = Math.abs(x / y);

  // 经过滚动优化之后的 x, y
  const deltaX = angle <= 1 / ANGLE ? 0 : x;
  const deltaY = angle > ANGLE ? 0 : y;

  return [deltaX * ratio.horizontal!, deltaY * ratio.vertical!];
};

export const translateGroup = (
  group: Group,
  scrollX: number,
  scrollY: number,
) => {
  if (group) {
    const [preX, preY] = group.getPosition();

    group.translate(scrollX - preX, scrollY - preY);
  }
};

export const translateGroupX = (group: Group, scrollX: number) => {
  if (group) {
    const [preX] = group.getPosition();

    group.translate(scrollX - preX, 0);
  }
};

export const translateGroupY = (group: Group, scrollY: number) => {
  if (group) {
    const [, preY] = group.getPosition();

    group?.translate(0, scrollY - preY);
  }
};

/**
 * frozen                     frozenTrailing
 * ColCount                   ColCount
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * |     |     frozenRow     |          |  frozenRowCount
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * | fro |                   | fro      |
 * | zen |      panel        | zen      |
 * | col |      scroll       | trailing |
 * |     |                   | col      |
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * |     | frozenTrailingRow |          |  frozenTrailingRowCount
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * @description returns which group data cell belongs in frozen mode
 */
export const getFrozenGroupTypeByCell = (
  meta: {
    colIndex: number;
    rowIndex: number;
  },
  frozenOptions: S2BaseFrozenOptions,
  colLength: number,
  cellRange: {
    start: number;
    end: number;
  },
) => {
  const {
    colCount = 0,
    rowCount = 0,
    trailingColCount = 0,
    trailingRowCount = 0,
  } = frozenOptions;
  const { colIndex, rowIndex } = meta;

  if (isFrozenRow(rowIndex, cellRange.start, rowCount)) {
    return FrozenGroupType.Row;
  }

  if (isFrozenTrailingRow(rowIndex, cellRange.end, trailingRowCount)) {
    return FrozenGroupType.TrailingRow;
  }

  if (isFrozenCol(colIndex, colCount)) {
    return FrozenGroupType.Col;
  }

  if (isFrozenTrailingCol(colIndex, trailingColCount, colLength)) {
    return FrozenGroupType.TrailingCol;
  }

  return FrozenGroupType.Scroll;
};

/**
 * @description calculate all cells in frozen group's intersection region
 */
export const calculateFrozenCornerCells = (
  frozenOptions: S2BaseFrozenOptions,
  colLength: number,
  cellRange: {
    start: number;
    end: number;
  },
) => {
  const {
    colCount: frozenColCount = 0,
    rowCount: frozenRowCount = 0,
    trailingColCount: frozenTrailingColCount = 0,
    trailingRowCount: frozenTrailingRowCount = 0,
  } = frozenOptions;

  const result = {
    [FrozenGroupType.TopLeft]: [] as FrozenCellIndex[],
    [FrozenGroupType.TopRight]: [] as FrozenCellIndex[],
    [FrozenGroupType.BottomLeft]: [] as FrozenCellIndex[],
    [FrozenGroupType.BottomRight]: [] as FrozenCellIndex[],
  };

  // frozenColGroup with frozenRowGroup or frozenTrailingRowGroup. Top left and Bottom left corner.
  for (let i = 0; i < frozenColCount; i++) {
    for (let j = cellRange.start; j < cellRange.start + frozenRowCount; j++) {
      result[FrozenGroupType.TopLeft].push({
        x: i,
        y: j,
      });
    }

    if (frozenTrailingRowCount > 0) {
      for (let j = 0; j < frozenTrailingRowCount; j++) {
        const index = cellRange.end - j;

        result[FrozenGroupType.BottomLeft].push({
          x: i,
          y: index,
        });
      }
    }
  }

  // frozenTrailingColGroup with frozenRowGroup or frozenTrailingRowGroup. Top right and bottom right corner.
  for (let i = 0; i < frozenTrailingColCount; i++) {
    const colIndex = colLength - 1 - i;

    for (let j = cellRange.start; j < cellRange.start + frozenRowCount; j++) {
      result[FrozenGroupType.TopRight].push({
        x: colIndex,
        y: j,
      });
    }

    if (frozenTrailingRowCount > 0) {
      for (let j = 0; j < frozenTrailingRowCount; j++) {
        const index = cellRange.end - j;

        result[FrozenGroupType.BottomRight].push({
          x: colIndex,
          y: index,
        });
      }
    }
  }

  return result;
};

/**
 * @description split all cells in current panel with five child group
 */
export const splitInViewIndexesWithFrozen = (
  indexes: Indexes,
  frozenOptions: S2BaseFrozenOptions,
  colLength: number,
  cellRange: {
    start: number;
    end: number;
  },
) => {
  const {
    colCount = 0,
    rowCount = 0,
    trailingColCount = 0,
    trailingRowCount = 0,
  } = frozenOptions;

  const centerIndexes: Indexes = [...indexes];

  // Cut off frozen cells from centerIndexes
  if (isFrozenCol(centerIndexes[0], colCount)) {
    centerIndexes[0] = colCount;
  }

  if (isFrozenTrailingCol(centerIndexes[1], trailingColCount, colLength)) {
    centerIndexes[1] = colLength - trailingColCount - 1;
  }

  if (isFrozenRow(centerIndexes[2], cellRange.start, rowCount)) {
    centerIndexes[2] = cellRange.start + rowCount;
  }

  if (isFrozenTrailingRow(centerIndexes[3], cellRange.end, trailingRowCount)) {
    centerIndexes[3] = cellRange.end - trailingRowCount;
  }

  // Calculate indexes for four frozen groups
  const frozenRowIndexes: Indexes = [...centerIndexes];

  frozenRowIndexes[2] = cellRange.start;
  frozenRowIndexes[3] = cellRange.start + rowCount - 1;

  const frozenColIndexes: Indexes = [...centerIndexes];

  frozenColIndexes[0] = 0;
  frozenColIndexes[1] = colCount - 1;

  const frozenTrailingRowIndexes: Indexes = [...centerIndexes];

  frozenTrailingRowIndexes[2] = cellRange.end + 1 - trailingRowCount;
  frozenTrailingRowIndexes[3] = cellRange.end;

  const frozenTrailingColIndexes: Indexes = [...centerIndexes];

  frozenTrailingColIndexes[0] = colLength - trailingColCount;
  frozenTrailingColIndexes[1] = colLength - 1;

  return {
    center: centerIndexes,
    frozenRow: frozenRowIndexes,
    frozenCol: frozenColIndexes,
    frozenTrailingCol: frozenTrailingColIndexes,
    frozenTrailingRow: frozenTrailingRowIndexes,
  };
};

export const getCellRange = (
  viewCellHeights: ViewCellHeights,
  pagination?: Pagination,
) => {
  const heights = viewCellHeights;
  let start = 0;
  let end = heights.getTotalLength() - 1;

  if (pagination) {
    const { current = DEFAULT_PAGE_INDEX, pageSize } = pagination;

    start = Math.max((current - 1) * pageSize, 0);
    end = Math.min(current * pageSize - 1, heights.getTotalLength() - 1);
  }

  return {
    start,
    end,
  };
};

/**
 * 明细表多级表头根据一个 node 返回其所属顶层节点
 * @param node
 * @returns {Node}
 */
export const getNodeRoot = (node: Node): Node => {
  while (node.level !== 0) {
    node = node.parent!;
  }

  return node;
};

/**
 * 获取 columns 的所有叶子节点
 * @param columns 列配置
 * @returns {Array} 叶子节点列组成的数组
 */
export const getLeafColumns = (
  columns: CustomHeaderFields,
): CustomHeaderFields => {
  const leafs: CustomHeaderFields = [];
  const recursionFn = (list: CustomHeaderFields) => {
    list.forEach((column) => {
      if (typeof column === 'string' || !column.children) {
        leafs.push(column);
      } else {
        recursionFn(column.children);
      }
    });
  };

  recursionFn(columns);

  return leafs;
};

/**
 * 获取 columns 的所有叶子节点的 key
 * @param columns 列配置
 * @returns {Array<string>} 叶子节点列的key组成的数组
 */
export const getLeafColumnsWithKey = (
  columns: CustomHeaderFields = [],
): string[] => {
  const leafs = getLeafColumns(columns);

  return leafs.map((column) => {
    if (typeof column === 'string') {
      return column;
    }

    return column.field;
  });
};

/**
 * 获取一个 node 的最左叶子节点，找不到则返回自身
 * @param node
 * @returns {Node}
 */
export const getLeftLeafNode = (node: Node): Node => {
  const firstNode = node.children[0];

  if (!firstNode) {
    return node;
  }

  return firstNode.isLeaf ? firstNode : getLeftLeafNode(firstNode);
};
/**
 * fields 的 rows、columns、values 值都为空时，返回 true
 * @param {Fields} fields
 * @return {boolean}
 */
export const areAllFieldsEmpty = (fields: Fields) => {
  return (
    isEmpty(fields.rows) && isEmpty(fields.columns) && isEmpty(fields.values)
  );
};
