import { SimpleBBox, Group, IGroup } from "@antv/g-canvas";
import { findIndex, isNil } from 'lodash';

import { Indexes } from '../utils/indexes';

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
  heights: number[],
  viewport: SimpleBBox,
  rowRemainWidth?: number,
): Indexes => {
  // 算法逻辑：https://yuque.antfin-inc.com/eva-engine/specs/virtualized-scroll
  // 1. 计算 x min、max
  let xMin = findIndex(
    widths,
    (width: number, idx: number) => {
      const x = scrollX - (isNil(rowRemainWidth) ? 0 : rowRemainWidth);
      return (
        x >= width &&
        x < widths[idx + 1]
      );
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

  // 2. 计算 y min、max
  let yMin = findIndex(
    heights,
    (height: number, idx: number) => {
      const y = scrollY;
      return y >= height && y < heights[idx + 1];
    },
    0,
  );

  yMin = Math.max(yMin, 0);

  let yMax = findIndex(
    heights,
    (height: number, idx: number) => {
      const y = viewport.height + scrollY;
      return y >= height && y < heights[idx + 1];
    },
    yMin,
  );
  yMax = Math.min(yMax === -1 ? Infinity : yMax, heights.length - 2);

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
  // eslint-disable-next-line no-bitwise
  const preX = matrix?.[6] ?? 0;
  // eslint-disable-next-line no-bitwise
  const preY = matrix?.[7] ?? 0;
  group.translate(scrollX - preX, scrollY - preY);
};
