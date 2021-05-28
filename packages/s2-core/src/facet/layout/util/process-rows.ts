import { BaseFacet } from "src/facet";
import { Hierarchy } from '../hierarchy';
import { Node } from '../node';
import buildTreeRowsHierarchy, {
  TreeParams,
} from './build-tree-rows-hierarchy';
import { buildHeaderHierarchy } from "src/facet/layout/build-header-hierarchy";

export interface RowsResult {
  // all row leaf nodes
  rowLeafNodes: Node[];
  // row's hierarchy
  rowsHierarchy: Hierarchy;
}

export default function processRows(facet: BaseFacet) {
  const { cfg } = facet;
  const { hierarchy, leafNodes } = buildHeaderHierarchy({
    isRowHeader: true,
    facetCfg: facet.cfg,
  });
  return {
    rowLeafNodes: leafNodes,
    rowsHierarchy: hierarchy,
  } as RowsResult;
}
