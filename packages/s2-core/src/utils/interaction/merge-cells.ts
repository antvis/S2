import { filter, find, forEach, isEmpty, isEqual } from 'lodash';
import { MergedCells } from '@/cell/merged-cells';
import { MergedCellInfo, TempMergedCell, ViewMeta } from '@/common/interface';
import { S2CellType } from '@/common/interface/interaction';
import { SpreadSheet } from '@/sheet-type';

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
  return find(edges, (edge) => isEqual(edge[0], curEdge[1]));
};

/**
 * return all the points of the polygon
 * @param cells the collection of information of cells which needed be merged
 */
export const getPolygonPoints = (cells: S2CellType[]) => {
  let allEdges = [];

  cells.forEach((cell) => {
    const meta = cell.getMeta();
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
 * get cells in the outside of visible area through mergeCellInfo
 * @param outsideVisibleCellInfo
 * @param sheet
 */
function getOutsideVisibleInfo(
  outsideVisibleCellInfo: MergedCellInfo[],
  sheet: SpreadSheet,
) {
  const cells: S2CellType[] = [];
  forEach(outsideVisibleCellInfo, (c) => {
    const meta = sheet?.facet?.layoutResult?.getCellMeta(
      c.rowIndex,
      c.colIndex,
    );
    if (meta) {
      const cell = sheet?.facet?.cfg.dataCell(meta);
      cells.push(cell);
    }
  });
  return cells;
}

/**
 * get { cells, outsideVisibleCellInfo, cellsMeta } in the inside of visible area through mergeCellInfo
 * @param cellsInfos
 * @param allVisibleCells
 * @returns { cells, outsideVisibleCellInfo, cellsMeta }
 */
function getInsideVisibleInfo(
  cellsInfos: MergedCellInfo[],
  allVisibleCells: S2CellType[],
) {
  const cells: S2CellType[] = [];
  const outsideVisibleCellInfo: MergedCellInfo[] = [];
  let cellsMeta: ViewMeta | Node | undefined;
  forEach(cellsInfos, (cellInfo: MergedCellInfo) => {
    const findCell = find(allVisibleCells, (cell: S2CellType) => {
      const meta = cell?.getMeta?.();
      if (
        meta?.colIndex === cellInfo?.colIndex &&
        meta?.rowIndex === cellInfo?.rowIndex
      ) {
        return cell;
      }
    }) as S2CellType;
    if (findCell) {
      cells.push(findCell);
      if (cellInfo?.showText) cellsMeta = findCell?.getMeta() as ViewMeta;
    } else {
      outsideVisibleCellInfo.push(cellInfo);
    }
  });
  return { cells, outsideVisibleCellInfo, cellsMeta };
}

/**
 * return the collections of cells depended by the merged cells information
 * @param cellsInfos
 * @param allVisibleCells
 * @param sheet
 */
const getCellsByInfo = (
  allVisibleCells: S2CellType[],
  sheet?: SpreadSheet,
  cellsInfos: MergedCellInfo[] = [],
): TempMergedCell => {
  const { cellsMeta, cells, outsideVisibleCellInfo } = getInsideVisibleInfo(
    cellsInfos,
    allVisibleCells,
  );
  let viewMeta: ViewMeta | Node = cellsMeta;
  let allCells: S2CellType<ViewMeta>[] = cells;
  // 当 MergedCell 只有部分在可视区域时，在此获取 MergedCell 不在可视区域内的 cells
  if (
    outsideVisibleCellInfo?.length > 0 &&
    outsideVisibleCellInfo.length < cellsInfos.length
  ) {
    allCells = cells.concat(
      getOutsideVisibleInfo(outsideVisibleCellInfo, sheet),
    );
  }

  if (!isEmpty(cells) && !cellsMeta) {
    viewMeta = cells[0]?.getMeta() as ViewMeta; // 如果没有指定合并后的文本绘制的位置，默认画在选择的第一个单元格内
  }
  return {
    cells: allCells,
    viewMeta: viewMeta as ViewMeta,
  };
};

/**
 * draw the background of the merged cell
 * @param sheet the base sheet instance
 * @param cellsInfo
 */
export const mergeCells = (
  sheet: SpreadSheet,
  cellsInfo: MergedCellInfo[],
  // hideData?: boolean,
) => {
  const allVisibleCells = filter(
    sheet.panelScrollGroup.getChildren(),
    (child) => !(child instanceof MergedCells),
  ) as unknown as S2CellType[];
  const { cells, viewMeta } = getCellsByInfo(allVisibleCells, sheet, cellsInfo);
  if (!isEmpty(cells)) {
    const mergedCellsInfo = sheet.options?.mergedCellsInfo || [];
    mergedCellsInfo.push(cellsInfo);
    sheet.setOptions({
      ...sheet.options,
      mergedCellsInfo: mergedCellsInfo,
    });
    sheet.panelScrollGroup.add(new MergedCells(viewMeta, sheet, cells));
  }
};

/**
 * remove unmergedCells Info, return new mergedCell info
 * @param removeMergedCell
 * @param MergedCellsInfo
 */
const removeUnmergedCellsInfo = (
  removeMergedCell: MergedCells,
  MergedCellsInfo: MergedCellInfo[][],
) => {
  const removeCellInfo = removeMergedCell.cells.map((cell: S2CellType) => {
    return {
      colIndex: cell.getMeta().colIndex,
      rowIndex: cell.getMeta().rowIndex,
    };
  });

  return MergedCellsInfo.filter((mergedCellInfo) => {
    const newMergedCellInfo = mergedCellInfo.map((info) => {
      if (info.showText) {
        return {
          colIndex: info.colIndex,
          rowIndex: info.rowIndex,
        };
      }
      return info;
    });
    return !isEqual(newMergedCellInfo, removeCellInfo);
  });
};

/**
 * unmerge MergedCell
 * @param removedCells
 * @param sheet
 */
export const unmergeCell = (removedCells: MergedCells, sheet: SpreadSheet) => {
  if (removedCells) {
    const newMergedCellsInfo = removeUnmergedCellsInfo(
      removedCells,
      sheet.options.mergedCellsInfo,
    );
    if (newMergedCellsInfo?.length !== sheet.options?.mergedCellsInfo?.length) {
      sheet.setOptions({
        ...sheet.options,
        mergedCellsInfo: newMergedCellsInfo,
      });
      removedCells.remove(true);
    }
  }
};

/**
 * update the merge
 * @param sheet the base sheet instance
 */
export const updateMergedCells = (sheet: SpreadSheet) => {
  const mergedCellsInfo = sheet.options?.mergedCellsInfo;
  if (isEmpty(mergedCellsInfo)) return;
  // 可见区域的所有cells
  const allCells = filter(
    sheet.panelScrollGroup.getChildren(),
    (child) => !(child instanceof MergedCells),
  ) as unknown as S2CellType[];
  if (isEmpty(allCells)) return;

  // allMergedCells 所有可视区域的mergedCell
  const allVisibleMergedCells: TempMergedCell[] = [];
  mergedCellsInfo.forEach((cellsInfo: MergedCellInfo[]) => {
    const MergedCell = getCellsByInfo(allCells, sheet, cellsInfo);
    if (MergedCell.cells.length > 0) allVisibleMergedCells.push(MergedCell);
  });
  const oldMergedCells = filter(
    sheet.panelScrollGroup.getChildren(),
    (child) => child instanceof MergedCells,
  ) as unknown as MergedCells[];
  // 移除所有旧的合并单元格，重新添加可视区域的合并单元格。（ stone-todo: 后续优化,没有使用 diff 差量删减
  oldMergedCells.forEach((oldMergedCell) => {
    oldMergedCell.remove(true);
  });
  allVisibleMergedCells.forEach(({ cells, viewMeta }) => {
    sheet.panelScrollGroup.add(new MergedCells(viewMeta, sheet, cells));
  });
};
