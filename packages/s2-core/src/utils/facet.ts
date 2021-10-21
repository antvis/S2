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
