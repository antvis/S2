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

export const getIndexRangeWithOffsets = (
  heights: number[],
  minHeight: number,
  maxHeight: number,
) => {
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
      return y >= height && y < heights[idx + 1];
    },
    yMin,
  );
  yMax = Math.min(yMax === -1 ? Infinity : yMax, heights.length - 2);

  return {
    start: yMin,
    end: yMax,
  };
};
