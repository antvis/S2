import { Node, type FrozenFacet } from '@antv/s2';

function getNodesByRange(
  nodes: Node[],
  key: 'rowIndex' | 'colIndex',
  minIndex: number,
  maxIndex: number,
) {
  return nodes.filter((node) => node[key] >= minIndex && node[key] <= maxIndex);
}

export function getExtraFrozenColAxisNodes(facet: FrozenFacet, nodes: Node[]) {
  const extraNodes: Node[] = [];

  const { colCount, trailingColCount } = facet.getFrozenOptions();

  if (colCount) {
    const frozenLeafNodes = getNodesByRange(
      nodes,
      'colIndex',
      0,
      colCount - 1,
    )!;

    frozenLeafNodes.forEach((leafNode) => {
      const newLeafNode = leafNode.clone();

      newLeafNode.isFrozenHead = true;
      extraNodes.push(newLeafNode);
    });
  }

  if (trailingColCount) {
    const total = nodes.length;
    const frozenLeafNodes = getNodesByRange(
      nodes,
      'colIndex',
      total - trailingColCount,
      total - 1,
    )!;

    frozenLeafNodes.forEach((leafNode) => {
      const newLeafNode = leafNode.clone();

      newLeafNode.isFrozenTrailing = true;
      extraNodes.push(newLeafNode);
    });
  }

  return extraNodes;
}

export function getExtraFrozenRowAxisNodes(facet: FrozenFacet, nodes: Node[]) {
  const extraNodes: Node[] = [];

  const { start, end } = facet.getCellRange();
  const { rowCount, trailingRowCount } = facet.getFrozenOptions();

  if (rowCount) {
    const frozenLeafNodes = getNodesByRange(
      nodes,
      'rowIndex',
      start,
      start + rowCount - 1,
    )!;

    frozenLeafNodes.forEach((leafNode) => {
      const newLeafNode = leafNode.clone();

      newLeafNode.isFrozenHead = true;
      extraNodes.push(newLeafNode);
    });
  }

  if (trailingRowCount) {
    const frozenLeafNodes = getNodesByRange(
      nodes,
      'rowIndex',
      end - trailingRowCount + 1,
      end,
    )!;

    frozenLeafNodes.forEach((leafNode) => {
      const newLeafNode = leafNode.clone();

      newLeafNode.isFrozenTrailing = true;
      extraNodes.push(newLeafNode);
    });
  }

  return extraNodes;
}
