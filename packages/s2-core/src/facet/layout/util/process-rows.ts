import { BaseFacet } from "src/facet";
import { Hierarchy } from '../hierarchy';
import { Node } from '../node';
import buildHeaderHierarchy from './build-header-hierarchy';
import buildTreeRowsHierarchy, {
  TreeParams,
} from './build-tree-rows-hierarchy';

export interface RowsResult {
  // all row leaf nodes
  rowLeafNodes: Node[];
  // row's hierarchy
  rowsHierarchy: Hierarchy;
}

export default function processRows(facet: BaseFacet) {
  const { cfg } = facet;
  const { rows } = cfg;
  const rowsHierarchy = new Hierarchy();
  rowsHierarchy.rows = rows;
  const rootNode = Node.rootNode();
  // the all leaf nodes
  let rowLeafNodes: Node[] = [];
  if (cfg.spreadsheet.isHierarchyTreeType()) {
    buildTreeRowsHierarchy({
      parent: rootNode,
      field: rows[0],
      fields: rows,
      cfg,
      hierarchy: rowsHierarchy,
      dataSet: facet.spreadsheet.dataSet,
      inCollapseNode: false,
    } as TreeParams);
    rowLeafNodes = rowsHierarchy.getNodes();
  } else {
    buildHeaderHierarchy(rootNode, rows[0], rows, cfg, rowsHierarchy);
    rowLeafNodes = rowsHierarchy.getLeafs();
  }
  return {
    rowLeafNodes,
    rowsHierarchy,
  } as RowsResult;
}
