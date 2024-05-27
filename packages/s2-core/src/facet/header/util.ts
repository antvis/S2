import type { PointLike } from '@antv/g-lite';
import { FrozenGroupArea, ROOT_NODE_ID } from '../../common';
import type { SpreadSheet } from '../../sheet-type';
import type { FrozenFacet } from '../frozen-facet';
import type { Hierarchy } from '../layout/hierarchy';
import { Node } from '../layout/node';
import { Frame } from './frame';

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

export const getExtraFrozenRowNodes = (facet: FrozenFacet) => {
  const extraNodes: Node[] = [];

  const { start, end } = facet.getCellRange();
  const { rowCount, trailingRowCount } = facet.getFrozenOptions();

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

export const getExtraFrozenColNodes = (facet: FrozenFacet) => {
  const extraNodes: Node[] = [];

  const { colCount, trailingColCount } = facet.getFrozenOptions();

  if (colCount) {
    const { x, width } = facet.frozenGroupAreas[FrozenGroupArea.Col];

    const frozenLeafNodes = facet.getColLeafNodesByRange(0, colCount - 1)!;

    frozenLeafNodes.forEach((leafNode) => {
      const newLeafNode = leafNode.clone();

      newLeafNode.isFrozenHead = true;
      extraNodes.push(newLeafNode);
    });

    const parents = getAllParents(frozenLeafNodes);

    parents.forEach((parent) => {
      const newParent = parent.clone();

      newParent.isFrozenHead = true;

      if (newParent.x < x) {
        newParent.width -= x - newParent.x;
        newParent.x = x;
      }

      if (newParent.x + newParent.width > x + width) {
        newParent.width -= newParent.x + newParent.width - x - width;
      }

      extraNodes.push(newParent);
    });
  }

  if (trailingColCount) {
    const { x, width } = facet.frozenGroupAreas[FrozenGroupArea.TrailingCol];

    const total = facet.getColLeafNodes().length;
    const frozenLeafNodes = facet.getColLeafNodesByRange(
      total - trailingColCount,
      total - 1,
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

      if (newParent.x + newParent.width > x + width) {
        newParent.width -= newParent.x + newParent.width - x - width;
      }

      if (newParent.x < x) {
        newParent.width -= x - newParent.x;
        newParent.x = x;
      }

      extraNodes.push(newParent);
    });
  }

  return extraNodes;
};

export const getFrozenColOffset = (
  facet: FrozenFacet,
  cornerWidth: number = 0,
  scrollX: number = 0,
) => {
  const isFrozenRowHeader = facet.spreadsheet.isFrozenRowHeader();

  if (isFrozenRowHeader) {
    return 0;
  }

  return scrollX <= cornerWidth ? scrollX : cornerWidth;
};

export const getFrozenTrailingColOffset = (
  facet: FrozenFacet,
  viewportWidth: number,
) => {
  const trailingCol = facet.frozenGroupAreas[FrozenGroupArea.TrailingCol];
  const trailingColWidth = trailingCol.x + trailingCol.width;
  const trailingColOffset =
    viewportWidth > trailingColWidth ? 0 : trailingColWidth - viewportWidth;

  return trailingColOffset;
};

export const getFrozenTrailingRowOffset = (
  facet: FrozenFacet,
  viewportHeight: number,
  paginationScrollY: number,
) => {
  const trailingRow = facet.frozenGroupAreas[FrozenGroupArea.TrailingRow];
  const trailingRowHeight =
    trailingRow.y + trailingRow.height - paginationScrollY;
  const trailingRowOffset =
    viewportHeight > trailingRowHeight
      ? paginationScrollY
      : paginationScrollY + trailingRowHeight - viewportHeight;

  return trailingRowOffset;
};

export const getScrollGroupClip = (facet: FrozenFacet, position: PointLike) => {
  const isFrozenRowHeader = facet.spreadsheet.isFrozenRowHeader();

  const frozenGroupAreas = facet.frozenGroupAreas;

  const frozenColGroupWidth = frozenGroupAreas[FrozenGroupArea.Col].width;
  const frozenTrailingColGroupWidth =
    frozenGroupAreas[FrozenGroupArea.TrailingCol].width;

  let x;

  if (isFrozenRowHeader) {
    x = position.x + frozenColGroupWidth;
  } else if (frozenColGroupWidth) {
    x = Frame.getVerticalBorderWidth(facet.spreadsheet) + frozenColGroupWidth;
  } else {
    x = 0;
  }

  const viewportWidth = facet.panelBBox.viewportWidth;

  return {
    x,
    width:
      (isFrozenRowHeader ? viewportWidth : position.x + viewportWidth) -
      frozenColGroupWidth -
      frozenTrailingColGroupWidth,
  };
};
