import type { ViewCellHeights } from '../facet/layout/interface';
import type { Node } from '../facet/layout/node';

export const getColsForGrid = (
  colMin: number,
  colMax: number,
  colNodes: Node[],
) => colNodes.slice(colMin, colMax + 1).map((item) => item.x + item.width);

export const getRowsForGrid = (
  rowMin: number,
  rowMax: number,
  viewCellHeights: ViewCellHeights,
) => {
  const rows = [];

  for (let index = rowMin; index < rowMax + 1; index++) {
    rows.push(viewCellHeights.getCellOffsetY(index + 1));
  }

  return rows;
};

export const getFrozenRowsForGrid = (
  rowMin: number,
  rowMax: number,
  startY: number,
  viewCellHeights: ViewCellHeights,
) => {
  const rows = getRowsForGrid(rowMin, rowMax, viewCellHeights);
  const baseY = viewCellHeights.getCellOffsetY(rowMin);

  return rows.map((r) => r - baseY + startY);
};
