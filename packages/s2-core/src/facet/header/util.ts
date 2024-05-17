import { FrozenGroupArea, ROOT_NODE_ID } from '../../common';
import type { FrozenGroupAreas } from '../../common/interface/frozen';
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

export const getExtraFrozenRowNodes = (spreadsheet: SpreadSheet) => {
  const extraNodes: Node[] = [];

  const facet = spreadsheet.facet as FrozenFacet;

  const { start, end } = facet.getCellRange();
  const { rowCount, trailingRowCount } = facet.getRealFrozenOptions();

  if (rowCount) {
    const { y, height } = facet.frozenGroupAreas[FrozenGroupArea.Row];

    const frozenLeafNodes = facet.getRowLeafNodesByRange(
      start,
      start + rowCount - 1,
    )!;

    frozenLeafNodes.forEach((leafNode) => {
      const newLeafNode = leafNode.clone();

      newLeafNode.isFrozenHead = true;
      extraNodes.push(newLeafNode);
    });

    const parents = getAllParents(frozenLeafNodes);

    parents.forEach((parent) => {
      const newParent = parent.clone();

      newParent.isFrozenHead = true;

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
    const { y, height } = facet.frozenGroupAreas[FrozenGroupArea.TrailingRow];

    const frozenLeafNodes = facet.getRowLeafNodesByRange(
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

export const getExtraFrozenColNodes = (spreadsheet: SpreadSheet) => {
  const extraNodes: Node[] = [];

  const facet = spreadsheet.facet as FrozenFacet;

  const { colCount, trailingColCount } = facet.getRealFrozenOptions();

  function getFrozenNodes(range: [number, number], key: string) {
    const frozenLeafNodes = facet.getColLeafNodesByRange(range[0], range[1])!;

    frozenLeafNodes.forEach((leafNode) => {
      const newLeafNode = leafNode.clone();

      newLeafNode[key] = true;
      extraNodes.push(newLeafNode);
    });

    const parents = getAllParents(frozenLeafNodes);

    parents.forEach((parent) => {
      const newParent = parent.clone();

      newParent[key] = true;

      extraNodes.push(newParent);
    });
  }

  if (colCount) {
    getFrozenNodes([0, colCount - 1], 'isFrozenHead');
  }

  if (trailingColCount) {
    const total = facet.getColLeafNodes().length;

    getFrozenNodes([total - trailingColCount, total - 1], 'isFrozenTrailing');
  }

  return extraNodes;
};

export const getFrozenTrailingColOffset = (
  frozenGroupAreas: FrozenGroupAreas,
  viewportWidth: number,
) => {
  const trailingCol = frozenGroupAreas[FrozenGroupArea.TrailingCol];
  const trailingColWidth = trailingCol.x! + trailingCol.width!;
  const trailingColOffset =
    viewportWidth > trailingColWidth ? 0 : trailingColWidth - viewportWidth;

  return trailingColOffset;
};

export const getFrozenTrailingRowOffset = (
  frozenGroupAreas: FrozenGroupAreas,
  viewportHeight: number,
  paginationScrollY: number,
) => {
  const trailingRow = frozenGroupAreas[FrozenGroupArea.TrailingRow];
  const trailingRowHeight =
    trailingRow.y! + trailingRow.height! - paginationScrollY;
  const trailingRowOffset =
    viewportHeight > trailingRowHeight
      ? paginationScrollY
      : paginationScrollY + trailingRowHeight - viewportHeight;

  return trailingRowOffset;
};
