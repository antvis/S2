import { Pivot } from '../../../data-set';
import { SpreadsheetFacetCfg } from '../../../common/interface';
import { Hierarchy } from '../hierarchy';
import { Node } from '../node';
import buildHeaderHierarchy from './build-header-hierarchy';

export interface ColsResult {
  // all column leaf nodes
  colLeafNodes: Node[];
  // column's hierarchy
  colsHierarchy: Hierarchy;
}

export default function processCols(
  pivot: Pivot,
  cfg: SpreadsheetFacetCfg,
  cols: string[],
) {
  const rootNode = Node.rootNode();
  const colsHierarchy = new Hierarchy();
  buildHeaderHierarchy(pivot, rootNode, cols[0], cols, cfg, colsHierarchy);
  const colLeafNodes = colsHierarchy.getLeafs();
  return {
    colLeafNodes,
    colsHierarchy,
  } as ColsResult;
}
