import {
  filter,
  find,
  forEach,
  includes,
  isArray,
  isEmpty,
  isEqual,
  isEqualWith,
  merge,
} from 'lodash';
import { MergedCells } from '@/cell/merged-cells';
import { MergedCellInfo } from '@/common/interface';
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
 * @param allVisibleCells
 * @param sheet
 */
const getCellsByInfo = (
  cellsInfos: MergedCellInfo[],
  allVisibleCells: S2CellType[],
  sheet?: SpreadSheet,
) => {
  if (!isArray(cellsInfos)) return;
  const cells = [];
  let cellsMeta;
  const outsideVisibleCellInfo: MergedCellInfo[] = [];
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
      if (cellInfo?.showText) cellsMeta = findCell?.getMeta();
    } else {
      outsideVisibleCellInfo.push(cellInfo);
    }
  });
  // generate cellData outside the visible area of the merged cell
  if (
    outsideVisibleCellInfo?.length > 0 &&
    outsideVisibleCellInfo.length < cellsInfos.length
  ) {
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
  }

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
 * @param cellsInfo
 * @param hideData
 */
export const mergeCells = (
  sheet: SpreadSheet,
  cellsInfo: MergedCellInfo[],
  hideData?: boolean,
) => {
  const allCells = filter(
    sheet.panelScrollGroup.getChildren(),
    (child) => !(child instanceof MergedCells),
  ) as unknown as S2CellType[];
  const { cells, viewMeta } = getCellsByInfo(cellsInfo, allCells, sheet);

  if (!isEmpty(cells)) {
    const mergedCellsInfo = sheet.options?.mergedCellsInfo || [];
    mergedCellsInfo.push(cellsInfo);
    sheet.setOptions(
      merge(sheet.options, { mergedCellsInfo: mergedCellsInfo }),
    );
    const value = hideData ? '' : viewMeta;
    sheet.panelScrollGroup.add(new MergedCells(value, sheet, cells));
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

/**
 *
 * @param cells 组成某个 mergedCells 的 DateCell[]
 * @param mergedCellsList 某个 mergedCells
 */
const removeMergedCells = (
  cells: S2CellType[],
  mergedCellsList: MergedCells[],
) => {
  const findOne = find(mergedCellsList, (item: MergedCells) =>
    isEqual(cells, item.cells),
  ) as MergedCells;
  findOne?.remove(true);
};

const removeMergedCellsInfo = (
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

export const removeCell = (mergedCells: MergedCells, sheet: SpreadSheet) => {
  if (mergedCells) {
    const newMergedCellsInfo = removeMergedCellsInfo(
      mergedCells,
      sheet.options.mergedCellsInfo,
    );
    if (newMergedCellsInfo?.length !== sheet.options?.mergedCellsInfo?.length) {
      // zc-todo:  2. 下面表格不在可视区域，销毁表格是有问题的。
      //  3. getCellsByInfo 有一个需求问题，到底是整体只有一个合并单元格，还是移动到哪里有就先合并出一个单元格。 3. 这块感觉有点乱，需要重构。
      sheet.setOptions({
        ...sheet.options,
        mergedCellsInfo: newMergedCellsInfo,
      });
      mergedCells.remove(true);
    }
  }
};

/**
 * upddate the merge
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

  // allMergedCells  是将 MergedCellInfo 进行合并
  const allMergedCells = [];
  mergedCellsInfo.forEach((cellsInfo: MergedCellInfo[]) => {
    allMergedCells.push(getCellsByInfo(cellsInfo, allCells, sheet));
  });
  const oldMergedCells = filter(
    sheet.panelScrollGroup.getChildren(),
    (child) => child instanceof MergedCells,
  ) as unknown as MergedCells[];

  allMergedCells.forEach((mergedCell) => {
    const { cells, viewMeta } = mergedCell;
    // console.log(cells, 'merged cells');
    // allCells: 除 mergedCell 以外的其他 DataCell, cells: , commonCells: 代表共同部分。
    const commonCells = getOverlap(cells, allCells);

    // 合并单元格已经不在当前可视区域内
    if (commonCells.length === 0) {
      // removeMergedCells(mergedCell, oldMergedCells);
    } else if (commonCells.length > 0 && commonCells.length < cells.length) {
      // 合并的单元格部分在当前可视区域内
      // removeMergedCells(mergedCell, oldMergedCells);
      // sheet.panelScrollGroup.add(new MergedCells(viewMeta, sheet, cells));
    } else if (commonCells.length === cells.length) {
      const findOne = find(oldMergedCells, (item) => {
        if (!item) {
          // eslint-disable-next-line no-console
          console.warn(item, "mergedCell doesn't exist!");
        }
        return isEqual(cells, item.cells);
      });
      // 如果合并单元格完全在可视区域内，且之前没有添加道panelGroup中，需要重新添加
      if (!findOne)
        sheet.panelScrollGroup.add(new MergedCells(viewMeta, sheet, cells));
    }
  });
};
