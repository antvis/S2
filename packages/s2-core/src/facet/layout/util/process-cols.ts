import { Hierarchy } from '../hierarchy';
import { Node } from '../node';
import { BaseFacet } from "src/facet";
import { buildHeaderHierarchy } from "src/facet/layout/build-header-hierarchy";

export interface ColsResult {
  // all column leaf nodes
  colLeafNodes: Node[];
  // column's hierarchy
  colsHierarchy: Hierarchy;
}

export default function processCols(facet: BaseFacet) {
  const { hierarchy, leafNodes } = buildHeaderHierarchy({
    isRowHeader: false,
    facetCfg: facet.cfg,
  });
  return {
    colLeafNodes: leafNodes,
    colsHierarchy: hierarchy,
  } as ColsResult;
}
