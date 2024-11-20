import { find, forEach, includes, isEqual } from 'lodash';
import type { DataCell } from '../../cell';

/**
 *  according to the coordinates of the starting point of the rectangle,
 * return the four sides of the rectangle in a clockwise direction.
 * [TopLeft] --- [TopRight]
 *    |               |
 * [BottomLeft] -[BottomRight]
 * @param x
 * @param y
 * @param width
 * @param height
 */
export const getRectangleEdges = (
  x: number,
  y: number,
  width: number,
  height: number,
) => {
  const topLeft: [number, number] = [x, y];

  const topRight: [number, number] = [x + width, y];

  const bottomRight: [number, number] = [x + width, y + height];

  const bottomLeft: [number, number] = [x, y + height];

  return [
    [topLeft, topRight],
    [topRight, bottomRight],
    [bottomRight, bottomLeft],
    [bottomLeft, topLeft],
  ];
};

/**
 * return the edges without overlapping edges
 * @param edges the collection of edges
 */
export const unique = (edges: [number, number][][]) => {
  const result: [number, number][][] = [];

  forEach(edges, (edge) => {
    const reverseEdge = [edge[1], edge[0]];

    if (!JSON.stringify(edges).includes(JSON.stringify(reverseEdge))) {
      result.push(edge);
    }
  });

  return result;
};

/**
 * return the edge according to the  coordinate of current edge
 * eg: curEdge: [[0,0], [100,0]] then the next edge: [[100, 0 ], [100, 100]]
 * @param curEdge the  coordinate of current edge
 * @param edges the collection of edges
 */
export const getNextEdge = (
  curEdge: [number, number][],
  edges: [number, number][][],
): [number, number][] | undefined =>
  find(edges, (edge) => isEqual(edge[0], curEdge[1]));
/**
 * return all the points of the polygon
 * @param cells the collection of information of cells which needed be merged
 */
export const getPolygonPoints = (cells: DataCell[]) => {
  let allEdges: [number, number][][] = [];

  cells.forEach((cell) => {
    const meta = cell.getMeta();
    const { x, y, width, height } = meta;

    allEdges = allEdges.concat(getRectangleEdges(x, y, width, height));
  });
  allEdges = unique(allEdges);

  let allPoints: [number, number][] = [];
  const startEdge = allEdges[0];
  let curEdge = startEdge;
  let nextEdge: [number, number][] | undefined = [];

  while (!isEqual(startEdge, nextEdge)) {
    allPoints = allPoints.concat(curEdge);
    nextEdge = getNextEdge(curEdge, allEdges);
    curEdge = nextEdge!;
  }

  return allPoints;
};

export const getRightAndBottomCells = (cells: DataCell[]) => {
  const right: DataCell[] = [];
  const bottom: DataCell[] = [];
  const bottomRightCornerCell: DataCell[] = [];

  cells.forEach((cell) => {
    const [row, col] = cell.position || [];

    if (
      !find(
        cells,
        (temp) => temp.position?.[0] === row + 1 && temp.position?.[1] === col,
      )
    ) {
      bottom.push(cell);
    }

    if (
      !find(
        cells,
        (temp) => temp.position?.[1] === col + 1 && temp.position?.[0] === row,
      )
    ) {
      right.push(cell);
    }
  });

  // 在绘制了 right border 后，如果它上面的 cell 也是 merge cell 中的，且无需绘制 right 时，需要单独为其位置 bottomRight corner 的 border，反正连线会断
  right.forEach((cell) => {
    const [row, col] = cell.position || [];
    const top = find(
      cells,
      (temp) => temp.position?.[0] === row - 1 && temp.position?.[1] === col,
    );

    if (top && !includes(right, top)) {
      bottomRightCornerCell.push(top);
    }
  });

  return {
    bottom,
    right,
    bottomRightCornerCell,
  };
};
