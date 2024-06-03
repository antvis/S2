import type { PointLike } from '@antv/g-lite';
import { isNumber } from 'lodash';
import { FrozenGroupArea, ROOT_NODE_ID } from '../../common';
import type { AreaBBox } from '../../common/interface/frozen';
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
    sNode.relatedNode = node;
    sNode.spreadsheet = spreadsheet;

    return sNode;
  });
};

const getAllParents = (nodes: Node[]) => {
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
};

const clipFrozenRowHeadNode = (
  node: Node,
  { y = 0, height = 0 }: Pick<AreaBBox, 'y' | 'height'>,
) => {
  if (node.y < y) {
    node.height -= y - node.y;
    node.y = y;
  }

  if (node.y + node.height > y + height) {
    node.height -= node.y + node.height - y - height;
  }
};

const clipFrozenTrailingRowHeadNode = (
  node: Node,
  { y = 0, height = 0 }: Pick<AreaBBox, 'y' | 'height'>,
) => {
  if (node.y + node.height > y + height) {
    node.height -= node.y + node.height - y - height;
  }

  if (node.y < y) {
    node.height -= y - node.y;
    node.y = y;
  }
};

export const getExtraFrozenRowNodes = (facet: FrozenFacet) => {
  const extraNodes: Node[] = [];

  const { start, end } = facet.getCellRange();
  const { rowCount, trailingRowCount } = facet.getFrozenOptions();

  if (rowCount) {
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

      clipFrozenRowHeadNode(
        newParent,
        facet.frozenGroupAreas[FrozenGroupArea.Row],
      );

      extraNodes.push(newParent);
    });
  }

  if (trailingRowCount) {
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

      clipFrozenTrailingRowHeadNode(
        newParent,
        facet.frozenGroupAreas[FrozenGroupArea.TrailingRow],
      );

      extraNodes.push(newParent);
    });
  }

  return extraNodes;
};

export const getExtraFrozenSeriesNodes = (
  facet: FrozenFacet,
  nodes: Node[],
) => {
  const extraNodes: Node[] = [];

  const { start, end } = facet.getCellRange();
  const { rowCount, trailingRowCount } = facet.getFrozenOptions();

  const includeChildInRowIndexRange = (node: Node, range: [number, number]) => {
    const rowIdx = node.rowIndex;

    if (isNumber(rowIdx) && rowIdx >= range[0] && rowIdx <= range[1]) {
      return true;
    }

    const children = node.children ?? [];

    for (let i = 0; i < children.length; i++) {
      if (includeChildInRowIndexRange(children[i], range)) {
        return true;
      }
    }

    return false;
  };

  if (rowCount) {
    const range: [number, number] = [start, start + rowCount - 1];

    nodes.forEach((node) => {
      if (
        node.relatedNode &&
        !includeChildInRowIndexRange(node.relatedNode, range)
      ) {
        return;
      }

      const newNode = node.clone();

      newNode.isFrozenHead = true;

      clipFrozenRowHeadNode(
        newNode,
        facet.frozenGroupAreas[FrozenGroupArea.Row],
      );

      extraNodes.push(newNode);
    });
  }

  if (trailingRowCount) {
    const range: [number, number] = [end - trailingRowCount + 1, end];

    nodes.forEach((node) => {
      if (
        node.relatedNode &&
        !includeChildInRowIndexRange(node.relatedNode, range)
      ) {
        return;
      }

      const newNode = node.clone();

      newNode.isFrozenTrailing = true;

      clipFrozenTrailingRowHeadNode(
        newNode,
        facet.frozenGroupAreas[FrozenGroupArea.TrailingRow],
      );

      extraNodes.push(newNode);
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
