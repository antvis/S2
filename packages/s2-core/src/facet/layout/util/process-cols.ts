import { Hierarchy } from '../hierarchy';
import { Node } from '../node';
import buildHeaderHierarchy from './build-header-hierarchy';
import { BaseFacet } from "src/facet";

export interface ColsResult {
  // all column leaf nodes
  colLeafNodes: Node[];
  // column's hierarchy
  colsHierarchy: Hierarchy;
}

export default function processCols(facet: BaseFacet) {
  const rootNode = Node.rootNode();
  const { cfg } = facet;
  const cols = cfg.cols;
  const colsHierarchy = new Hierarchy();
  buildHeaderHierarchy(rootNode, cols[0], cols, cfg, colsHierarchy);
  const colLeafNodes = colsHierarchy.getLeafs();
  return {
    colLeafNodes,
    colsHierarchy,
  } as ColsResult;
}
