import { findIndex } from 'lodash';
import { Node } from '@/facet/layout/node';

export const getSubTotalNodeWidthOrHeightByLevel = (
  sampleNodesForAllLevels: Node[],
  level: number,
  key: 'width' | 'height',
) => {
  return sampleNodesForAllLevels
    .filter((node: Node) => node.level >= level)
    .map((value) => value[key])
    .reduce((sum, current) => sum + current, 0);
};

/**
 * 根据视窗高度计算需要展示的数据数组下标
 * 如有2个节点，每个高度30
 * @param heights 所有单元格的高度偏移量数组 [0, 30, 60]
 * @param minHeight 视窗高度起点
 * @param maxHeight 视窗高度终点
 * @returns
 */
export const getIndexRangeWithOffsets = (
  heights: number[],
  minHeight: number,
  maxHeight: number,
) => {
  if (maxHeight <= 0) {
    return {
      start: 0,
      end: 0,
    };
  }

  let yMin = findIndex(
    heights,
    (height: number, idx: number) => {
      const y = minHeight;
      return y >= height && y < heights[idx + 1];
    },
    0,
  );

  yMin = Math.max(yMin, 0);

  let yMax = findIndex(
    heights,
    (height: number, idx: number) => {
      const y = maxHeight;
      return y > height && y <= heights[idx + 1];
    },
    yMin,
  );
  yMax = Math.min(yMax === -1 ? Infinity : yMax, heights.length - 2);

  return {
    start: yMin,
    end: yMax,
  };
};
