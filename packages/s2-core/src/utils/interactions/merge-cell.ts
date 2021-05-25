import { find, isEqual, forEach } from 'lodash';
import { BaseSpreadSheet } from 'src';
import { SelectedStateName } from 'src/common/constant/interatcion';
import { SelectedState, Cell } from 'src/common/interface/interaction';
import { MergedCells } from 'src/cell/merged-cells';

/**
 *  according to the coordinates of the starting point of the rectangle,
 * return the four sides of the rectangle in a clockwise direction.
 * [TopLeft] --- [TopRight]
 *    |               |
 * [BottoLeft] -[BottomRight]
 * @param x
 * @param y
 * @param width
 * @param height
 */
const getRectangleEdges = (
  x: number,
  y: number,
  width: number,
  height: number,
) => {
  const topLeft = [x, y];

  const topRight = [x + width, y];

  const bottomRight = [x + width, y + height];

  const bottomLeft = [x, y + height];

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
const unique = (edges: number[][]) => {
  const result = [];
  forEach(edges, (edge) => {
    const reverseEdge = [edge[1], edge[0]];
    if (!JSON.stringify(edges).includes(JSON.stringify(reverseEdge))) {
      result.push(edge);
    }
  });
  return result;
};

/**
 * return the edge according to the  coordinate of current dedge
 * eg: curEdge: [[0,0], [100,0]] then the next edge: [[100, 0 ], [100, 100]]
 * @param curEdge the  coordinate of current edge
 * @param edges the collection of edges
 */
const getNextEdge = (curEdge: number[], edges: number[][]) => {
  const result = find(edges, (edge) => isEqual(edge[0], curEdge[1]));
  return result;
};

/**
 * return all the points of the polygon
 * @param cells the collection of information of cells which needed be merged
 */
export const getPolygonPoints = (cells: Cell[]) => {
  let allEdges = [];

  cells.forEach((cell) => {
    const meta = cell?.meta;
    const { x, y, width, height } = meta;
    allEdges = allEdges.concat(getRectangleEdges(x, y, width, height));
  });
  allEdges = unique(allEdges);

  let allPoints = [];
  const startEdge = allEdges[0];
  let curEdge = startEdge;
  let nextEdge = [];

  while (!isEqual(startEdge, nextEdge)) {
    allPoints = allPoints.concat(curEdge);
    nextEdge = getNextEdge(curEdge, allEdges);
    curEdge = nextEdge;
  }
  return allPoints;
};

/**
 * draw the background of the merged cell
 * @param sheet the base sheet instance
 * @param curSelectedState
 */
export const drawMergeCellBg = (
  sheet: BaseSpreadSheet,
  curSelectedState: SelectedState,
) => {
  const { stateName, cells } = curSelectedState;
  // const allPoints = getPolygonPoints(cells);
  if (stateName === SelectedStateName.SELECTED) {
    // const cellTheme = sheet.theme.view.cell;
    sheet.facet.panelGroup.add(new MergedCells(cells, sheet ));
  }
};
