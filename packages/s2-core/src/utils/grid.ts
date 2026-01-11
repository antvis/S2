import type { ViewCellHeights } from '../facet/layout/interface';
import type { Node } from '../facet/layout/node';

export const getColsForGrid = (
  colMin: number,
  colMax: number,
  colNodes: Node[],
) => colNodes.slice(colMin, colMax + 1).map((item) => item.x + item.width);

/**
 * 获取网格行的 Y 坐标
 * 返回相对坐标和偏移量，避免大数据量时绝对坐标超过 2^24 导致浮点数精度丢失
 * @see https://github.com/antvis/S2/issues/3285
 */
export const getRowsForGrid = (
  rowMin: number,
  rowMax: number,
  viewCellHeights: ViewCellHeights,
) => {
  const rows = [];
  // 使用起始行索引的 Y 坐标作为基准偏移量
  const baseY = viewCellHeights.getCellOffsetY(rowMin);

  for (let index = rowMin; index < rowMax + 1; index++) {
    // 返回相对坐标（相对于第一个可见行）
    rows.push(viewCellHeights.getCellOffsetY(index + 1) - baseY);
  }

  return {
    rows,
    offset: baseY,
  };
};

export const getFrozenRowsForGrid = (
  rowMin: number,
  rowMax: number,
  startY: number,
  viewCellHeights: ViewCellHeights,
) => {
  const { rows } = getRowsForGrid(rowMin, rowMax, viewCellHeights);

  return rows.map((r) => r + startY);
};
