import type { SpreadSheet } from '../../sheet-type';
import type { Hierarchy } from '../layout/hierarchy';
import { Node } from '../layout/node';

export const getSeriesNumberNodes = (
  rowsHierarchy: Hierarchy,
  seriesNumberWidth: number,
  spreadsheet: SpreadSheet,
) => {
  const isHierarchyTreeType = spreadsheet.isHierarchyTreeType();
  const rootNodes = rowsHierarchy.getNodes(0);

  return rootNodes.map((node: Node, idx: number) => {
    const value = `${idx + 1}`;
    const sNode = new Node({
      id: value,
      field: '',
      rowIndex: idx,
      value,
    });

    sNode.x = node.x;
    sNode.y = node.y;
    sNode.width = seriesNumberWidth;
    sNode.height = isHierarchyTreeType
      ? node.getTotalHeightForTreeHierarchy()
      : node.height;
    sNode.isLeaf = true;
    sNode.spreadsheet = spreadsheet;

    return sNode;
  });
};
