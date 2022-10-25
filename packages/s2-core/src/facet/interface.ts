import type { Hierarchy } from './layout/hierarchy';
import type { Node } from './layout/node';

export interface AdjustLeafNodesParams {
  leafNodes: Node[];
  hierarchy: Hierarchy;
}
