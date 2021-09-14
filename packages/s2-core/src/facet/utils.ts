import { SimpleBBox, IGroup } from '@antv/g-canvas';
import { findIndex, isNil } from 'lodash';

import { Indexes } from '../utils/indexes';
import { ViewCellHeights } from './layout/interface';
import {
  FrozenCellType,
  FrozenOpts,
  FrozenCellIndex,
} from '@/common/constant/frozen';

/**
 * 计算偏移 scrollX、scrollY 的时候，在视窗中的节点索引
 * @param scrollX
 * @param scrollY
 * @param widths
 * @param heights
 * @param viewport
 * @param rowRemainWidth
 */
export const calculateInViewIndexes = (
  scrollX: number,
  scrollY: number,
  widths: number[],
  heights: ViewCellHeights,
  viewport: SimpleBBox,
  rowRemainWidth?: number,
): Indexes => {
  // 1. 计算 x min、max
  let xMin = findIndex(
    widths,
    (width: number, idx: number) => {
      const x = scrollX - (isNil(rowRemainWidth) ? 0 : rowRemainWidth);
      return x >= width && x < widths[idx + 1];
    },
    0,
  );
  xMin = Math.max(xMin, 0);

  let xMax = findIndex(
    widths,
    (width: number, idx: number) => {
      const x = viewport.width + scrollX;
      return x >= width && x < widths[idx + 1];
    },
    xMin,
  );
  xMax = Math.min(xMax === -1 ? Infinity : xMax, widths.length - 2);

  const { start: yMin, end: yMax } = heights.getIndexRange(
    scrollY,
    viewport.height + scrollY,
  );

  // use direction
  // const halfWidthSize = Math.ceil(xMax - xMin / 4);
  // const halfHeightSize = Math.ceil(yMax - yMin / 4);
  // xMin = Math.max(0, xMin - halfWidthSize)
  // xMax = xMax + halfWidthSize;
  // yMin = Math.max(0, yMin - halfHeightSize);
  // yMax = yMax + halfHeightSize;

  return [xMin, xMax, yMin, yMax];
};

/**
 * 优化滚动方向，对于小角度的滚动，固定为一个方向
 * @param x
 * @param y
 */
export const optimizeScrollXY = (x: number, y: number): [number, number] => {
  const ANGLE = 2; // 调参工程师
  const angle = Math.abs(x / y);

  // 经过滚动优化之后的 x, y
  const deltaX = angle <= 1 / ANGLE ? 0 : x;
  const deltaY = angle > ANGLE ? 0 : y;

  return [deltaX, deltaY];
};

export const translateGroup = (
  group: IGroup,
  scrollX: number,
  scrollY: number,
) => {
  const matrix = group.getMatrix();
  const preX = matrix?.[6] ?? 0;
  const preY = matrix?.[7] ?? 0;
  group.translate(scrollX - preX, scrollY - preY);
};

export const translateGroupX = (group: IGroup, scrollX: number) => {
  const matrix = group.getMatrix();
  const preX = matrix?.[6] ?? 0;
  group.translate(scrollX - preX, 0);
};

export const translateGroupY = (group: IGroup, scrollY: number) => {
  const matrix = group.getMatrix();
  const preY = matrix?.[7] ?? 0;
  group.translate(0, scrollY - preY);
};

/**
 * frozen                     frozenTrailing
 * ColCount                   ColCount
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * |     |     forzenRow     |          |  frozenRowCount
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
export const getFrozenDataCellType = (
  meta: {
    colIndex: number;
    rowIndex: number;
  },
  frozenOpts: FrozenOpts,
  colLength: number,
  rowLength: number,
) => {
  const {
    frozenColCount,
    frozenRowCount,
    frozenTrailingColCount,
    frozenTrailingRowCount,
  } = frozenOpts;
  const { colIndex, rowIndex } = meta;

  if (rowIndex <= frozenRowCount - 1) {
    return FrozenCellType.ROW;
  }
  if (
    frozenTrailingRowCount > 0 &&
    rowIndex >= rowLength - frozenTrailingRowCount
  ) {
    return FrozenCellType.TRAILING_ROW;
  }
  if (colIndex <= frozenColCount - 1) {
    return FrozenCellType.COL;
  }
  if (
    frozenTrailingColCount > 0 &&
    colIndex >= colLength - frozenTrailingColCount
  ) {
    return FrozenCellType.TRAILING_COL;
  }
  return FrozenCellType.SCROLL;
};

/**
 * @description calculate all cells in frozen group's intersection region
 */
export const calculateFrozenCornerCells = (
  opts: FrozenOpts,
  colLength: number,
  rowLength: number,
) => {
  const {
    frozenColCount,
    frozenRowCount,
    frozenTrailingColCount,
    frozenTrailingRowCount,
  } = opts;

  const result: {
    [key: string]: FrozenCellIndex[];
  } = {
    [FrozenCellType.TOP]: [],
    [FrozenCellType.BOTTOM]: [],
  };

  // frozenColGroup with frozenRowGroup or frozenTrailingRowGroup. Top left and bottom left corner.
  for (let i = 0; i < frozenColCount; i++) {
    for (let j = 0; j < frozenRowCount; j++) {
      result[FrozenCellType.TOP].push({
        x: i,
        y: j,
      });
    }

    if (frozenTrailingRowCount > 0) {
      for (let j = 0; j < frozenTrailingRowCount; j++) {
        const index = rowLength - 1 - j;
        result[FrozenCellType.BOTTOM].push({
          x: i,
          y: index,
        });
      }
    }
  }

  // frozenTrailingColGroup with frozenRowGroup or frozenTrailingRowGroup. Top right and bottom right corner.
  for (let i = 0; i < frozenTrailingColCount; i++) {
    const colIndex = colLength - 1 - i;
    for (let j = 0; j < frozenRowCount; j++) {
      result[FrozenCellType.TOP].push({
        x: colIndex,
        y: j,
      });
    }

    if (frozenTrailingRowCount > 0) {
      for (let j = 0; j < frozenTrailingRowCount; j++) {
        const index = rowLength - 1 - j;
        result[FrozenCellType.BOTTOM].push({
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
  frozenOpts: FrozenOpts,
  colLength: number,
  rowLength: number,
) => {
  const {
    frozenColCount,
    frozenRowCount,
    frozenTrailingColCount,
    frozenTrailingRowCount,
  } = frozenOpts;

  const centerIndexes: Indexes = [...indexes];

  // Cut off frozen cells from centerIndexes
  if (centerIndexes[0] < frozenColCount) {
    centerIndexes[0] = frozenColCount;
  }

  if (
    frozenTrailingColCount > 0 &&
    centerIndexes[1] >= colLength - frozenTrailingColCount
  ) {
    centerIndexes[1] = colLength - frozenTrailingColCount - 1;
  }

  if (centerIndexes[2] < frozenRowCount) {
    centerIndexes[2] = frozenRowCount;
  }

  if (
    frozenTrailingRowCount > 0 &&
    centerIndexes[3] >= rowLength - frozenTrailingRowCount
  ) {
    centerIndexes[3] = rowLength - frozenTrailingRowCount - 1;
  }

  // Calculate indexes for four frozen groups
  const frozenRowIndexes: Indexes = [...centerIndexes];
  frozenRowIndexes[2] = 0;
  frozenRowIndexes[3] = frozenRowCount - 1;

  const frozenColIndexes: Indexes = [...centerIndexes];
  frozenColIndexes[0] = 0;
  frozenColIndexes[1] = frozenColCount - 1;

  const frozenTrailingRowIndexes: Indexes = [...centerIndexes];
  frozenTrailingRowIndexes[2] = rowLength - frozenTrailingRowCount;
  frozenTrailingRowIndexes[3] = rowLength - 1;

  const frozenTrailingColIndexes: Indexes = [...centerIndexes];
  frozenTrailingColIndexes[0] = colLength - frozenTrailingColCount;
  frozenTrailingColIndexes[1] = colLength - 1;

  return {
    center: centerIndexes,
    frozenRow: frozenRowIndexes,
    frozenCol: frozenColIndexes,
    frozenTrailingCol: frozenTrailingColIndexes,
    frozenTrailingRow: frozenTrailingRowIndexes,
  };
};
