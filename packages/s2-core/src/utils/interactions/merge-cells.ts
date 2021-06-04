import {
  find,
  isEqual,
  forEach,
  isEmpty,
  filter,
  merge,
  isArray,
} from 'lodash';
import BaseSpreadSheet from '@/sheet-type/base-spread-sheet';
import { S2CellType } from '@/common/interface/interaction';
import { MergedCellInfo } from '@/common/interface/index';
import { MergedCells } from '@/cell/merged-cells';

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

/** return the collections of cells depended by the merged cells information
 * @param cellsInfos
 * @param allCells
 */
const getCellsByInfo = (
  cellsInfos: MergedCellInfo[],
  allCells: S2CellType[],
) => {
  if (!isArray(cellsInfos)) return;
  const cells = [];
  let cellsMeta;
  forEach(cellsInfos, (cellInfo: MergedCellInfo) => {
    const findCell = find(allCells, (cell: S2CellType) => {
      const meta = cell?.getMeta();
      if (
        meta?.colIndex === cellInfo?.colIndex &&
        meta?.rowIndex === cellInfo?.rowIndex
      ) {
        return cell;
      }
    }) as S2CellType;
    if (findCell) {
      cells.push(findCell);
      if (cellInfo?.showText) cellsMeta = findCell?.getMeta();
    }
  });

  if (!isEmpty(cells) && !cellsMeta) {
    cellsMeta = cells[0]?.meta; // 如果没有指定合并后的文本绘制的位置，默认画在选择的第一个单元格内
  }

  return {
    cells: cells,
    viewMeta: cellsMeta,
  };
};

/**
 * draw the background of the merged cell
 * @param sheet the base sheet instance
 * @param curSelectedState
 * @param hideData
 */
export const mergeCells = (
  sheet: BaseSpreadSheet,
  cellsInfo: MergedCellInfo[],
  hideData?: boolean,
) => {
  const allCells = filter(
    sheet.panelGroup.getChildren(),
    (child) => !(child instanceof MergedCells),
  ) as unknown as S2CellType[];
  const { cells, viewMeta } = getCellsByInfo(cellsInfo, allCells);

  if (!isEmpty(cells)) {
    const mergedCellsInfo = sheet.options?.mergedCellsInfo || [];
    mergedCellsInfo.push(cellsInfo);
    sheet.setOptions(
      merge(sheet.options, { mergedCellsInfo: mergedCellsInfo }),
    );
    const value = hideData ? '' : viewMeta;
    sheet.facet.panelGroup.add(new MergedCells(value, sheet, cells));
  }
};

/**
 * rentern overlap items of a and b
 * @param a
 * @param b
 */
const getOverlap = (a: any[], b: any[]) => {
  const res = [];
  a.forEach((item) => {
    if (find(b, item)) res.push(item);
  });
  return res;
};

const removeMergedCells = (cells: S2CellType[], mergedCells: MergedCells) => {
  const findOne = find(mergedCells, (item: MergedCells) =>
    isEqual(cells, item.cells),
  ) as MergedCells;
  findOne?.remove(true);
};

/**
 * upddate the merge
 * @param sheet the base sheet instance
 * @param curSelectedState
 */
export const updateMergedCells = (sheet: BaseSpreadSheet) => {
  const mergedCellsInfo = sheet.options?.mergedCellsInfo;
  if (isEmpty(mergedCellsInfo)) return;

  const allCells = filter(
    sheet.panelGroup.getChildren(),
    (child) => !(child instanceof MergedCells),
  ) as unknown as S2CellType[];
  if (isEmpty(allCells)) return;

  const allMergedCells = [];
  mergedCellsInfo.forEach((cellsInfo: MergedCellInfo[]) => {
    allMergedCells.push(getCellsByInfo(cellsInfo, allCells));
  });

  const oldMergedCells = filter(
    sheet.panelGroup.getChildren(),
    (child) => child instanceof MergedCells,
  ) as unknown as MergedCells;

  allMergedCells.forEach((mergedCell) => {
    const { cells, viewMeta } = mergedCell;
    const commonCells = getOverlap(cells, allCells);
    // 合并单元格已经不在当前可视区域内
    if (commonCells.length === 0) {
      removeMergedCells(mergedCell, oldMergedCells);
    } else if (commonCells.length > 0 && commonCells.length < cells.length) {
      // 合并的单元格部分在当前可视区域内
      removeMergedCells(mergedCell, oldMergedCells);
      sheet.facet.panelGroup.add(new MergedCells(viewMeta, sheet, cells));
    } else {
      const findOne = find(oldMergedCells, (item: MergedCells) =>
        isEqual(mergedCell, item.cells),
      ) as MergedCells;
      // 如果合并单元格完全在可视区域内，且之前没有添加道panelGroup中，需要重新添加
      if (!findOne)
        sheet.facet.panelGroup.add(new MergedCells(viewMeta, sheet, cells));
    }
  });
};
