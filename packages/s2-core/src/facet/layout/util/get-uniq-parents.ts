import { each } from '@antv/util';
import { Hierarchy } from '../hierarchy';

export default function getUniqParents(nodes: Hierarchy[]) {
  const result = [];
  const tokenCache = {};
  each(nodes, (node) => {
    const parent = node.parent;
    if (!tokenCache[parent.id]) {
      result.push(parent);
      tokenCache[parent.id] = true;
    }
  });
  return result;
}
