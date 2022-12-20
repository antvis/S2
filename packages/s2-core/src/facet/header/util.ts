import { isNil } from 'lodash';
import type { SpreadSheet } from '../../sheet-type';
import type { Hierarchy } from '../layout/hierarchy';
import { Node } from '../layout/node';

export const getCellPadding = () => {
  const padding = [12, 4, 12, 4];
  const left = isNil(padding[3]) ? 0 : padding[3];
  const right = isNil(padding[1]) ? 0 : padding[1];
  const top = isNil(padding[0]) ? 0 : padding[0];
  const bottom = isNil(padding[2]) ? 0 : padding[2];
  return {
    left,
    right,
    top,
    bottom,
  };
};

export const getSeriesNumberNodes = (
  rowsHierarchy: Hierarchy,
  seriesNumberWidth: number,
  spreadsheet: SpreadSheet,
) => {
  const isHierarchyTreeType = spreadsheet.isHierarchyTreeType();
  const rootNodes = rowsHierarchy.getNodes(0);

  return rootNodes.map((node: Node, idx: number) => {
    const sNode = new Node({
      id: '',
      field: '',
      rowIndex: idx,
      value: `${idx + 1}`,
    });
    sNode.x = node.x;
    sNode.y = node.y;
    sNode.width = seriesNumberWidth;
    sNode.height = isHierarchyTreeType
      ? node.getTotalHeightForTreeHierarchy()
      : node.height;
    return sNode;
  });
};
