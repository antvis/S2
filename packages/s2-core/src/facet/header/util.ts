import { FrozenGroupPosition, ROOT_NODE_ID } from '../../common';
import type { FrozenGroupPositions } from '../../common/interface/frozen';
import type { SpreadSheet } from '../../sheet-type';
import type { FrozenFacet } from '../frozen-facet';
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

export const getExtraFrozenNodes = (spreadsheet: SpreadSheet) => {
  const extraNodes: Node[] = [];

  function getAllParents(nodes: Node[]) {
    const parents = nodes.reduce((pre, leaf) => {
      let parent = leaf.parent;

      while (parent && parent.id !== ROOT_NODE_ID) {
        // eslint-disable-next-line no-loop-func
        if (!pre.find((node) => node.id === parent!.id)) {
          pre.push(parent);
        }

        parent = parent.parent;
      }

      return pre;
    }, [] as Node[]);

    return parents;
  }

  const facet = spreadsheet.facet as FrozenFacet;

  const { start, end } = facet.getCellRange();
  const { rowCount, trailingRowCount } = facet.getRealFrozenOptions();

  if (rowCount) {
    const { y, height } = facet.frozenGroupPositions[FrozenGroupPosition.Row];

    const frozenLeafNodes = facet.getRowLeafNodeByRange(
      start,
      start + rowCount - 1,
    )!;

    frozenLeafNodes.forEach((leafNode) => {
      const newLeafNode = leafNode.clone();

      newLeafNode.isFrozen = true;
      extraNodes.push(newLeafNode);
    });

    const parents = getAllParents(frozenLeafNodes);

    parents.forEach((parent) => {
      const newParent = parent.clone();

      newParent.isFrozen = true;

      if (newParent.y < y) {
        newParent.height -= y - newParent.y;
        newParent.y = y;
      }

      if (newParent.y + newParent.height > y + height) {
        newParent.height -= newParent.y + newParent.height - y - height;
      }

      extraNodes.push(newParent);
    });
  }

  if (trailingRowCount) {
    const { y, height } =
      facet.frozenGroupPositions[FrozenGroupPosition.TrailingRow];

    const frozenLeafNodes = facet.getRowLeafNodeByRange(
      end - trailingRowCount + 1,
      end,
    )!;

    frozenLeafNodes.forEach((leafNode) => {
      const newLeafNode = leafNode.clone();

      newLeafNode.isFrozenTrailing = true;
      extraNodes.push(newLeafNode);
    });

    const parents = getAllParents(frozenLeafNodes);

    parents.forEach((parent) => {
      const newParent = parent.clone();

      newParent.isFrozenTrailing = true;

      if (newParent.y + newParent.height > y + height) {
        newParent.height -= newParent.y + newParent.height - y - height;
      }

      if (newParent.y < y) {
        newParent.height -= y - newParent.y;
        newParent.y = y;
      }

      extraNodes.push(newParent);
    });
  }

  return extraNodes;
};

export const getFrozenTrailingColOffset = (
  frozenGroupPositions: FrozenGroupPositions,
  viewportWidth: number,
) => {
  const trailingCol = frozenGroupPositions[FrozenGroupPosition.TrailingCol];
  const trailingColWidth = trailingCol.x! + trailingCol.width!;
  const trailingColOffset =
    viewportWidth > trailingColWidth ? 0 : trailingColWidth - viewportWidth;

  return trailingColOffset;
};

export const getFrozenTrailingRowOffset = (
  frozenGroupPositions: FrozenGroupPositions,
  viewportHeight: number,
  paginationScrollY: number,
) => {
  const trailingRow = frozenGroupPositions[FrozenGroupPosition.TrailingRow];
  const trailingRowHeight =
    trailingRow.y! + trailingRow.height! - paginationScrollY;
  const trailingRowOffset =
    viewportHeight > trailingRowHeight
      ? paginationScrollY
      : paginationScrollY + trailingRowHeight - viewportHeight;

  return trailingRowOffset;
};
