import {
  differenceWith,
  filter,
  find,
  forEach,
  isEmpty,
  isEqual,
  map,
} from 'lodash';
import { MergedCell } from '@/cell/merged-cell';
import { MergedCellInfo, TempMergedCell, ViewMeta } from '@/common/interface';
import { S2CellType } from '@/common/interface/interaction';
import { SpreadSheet } from '@/sheet-type';
import { CellTypes } from '@/common/constant';

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
export const unique = (edges: number[][][]) => {
  const result: number[][][] = [];
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
  curEdge: number[][],
  edges: number[][][],
): number[][] => {
  return find(edges, (edge) => isEqual(edge[0], curEdge[1]));
};

/**
 * return all the points of the polygon
 * @param cells the collection of information of cells which needed be merged
 */
export const getPolygonPoints = (cells: S2CellType[]) => {
  let allEdges: number[][][] = [];

  cells.forEach((cell) => {
    const meta = cell.getMeta();
    const { x, y, width, height } = meta;
    allEdges = allEdges.concat(getRectangleEdges(x, y, width, height));
  });
  allEdges = unique(allEdges);

  let allPoints: number[][] = [];
  const startEdge = allEdges[0];
  let curEdge = startEdge;
  let nextEdge: number[][] = [];

  while (!isEqual(startEdge, nextEdge)) {
    allPoints = allPoints.concat(curEdge);
    nextEdge = getNextEdge(curEdge, allEdges);
    curEdge = nextEdge;
  }
  return allPoints;
};

/**
 * get cells on the outside of visible area through mergeCellInfo
 * @param invisibleCellInfo
 * @param sheet
 */
export const getInvisibleInfo = (
  invisibleCellInfo: MergedCellInfo[],
  sheet: SpreadSheet,
) => {
  const cells: S2CellType[] = [];
  let viewMeta: ViewMeta | undefined;
  forEach(invisibleCellInfo, (cellInfo) => {
    const meta = sheet?.facet?.layoutResult?.getCellMeta(
      cellInfo.rowIndex,
      cellInfo.colIndex,
    );
    if (meta) {
      const cell = sheet?.facet?.cfg.dataCell(meta);
      viewMeta = cellInfo?.showText ? meta : viewMeta;
      cells.push(cell);
    }
  });
  return { cells, cellsMeta: viewMeta };
};

/**
 * get { cells, invisibleCellInfo, cellsMeta } in the inside of visible area through mergeCellInfo
 * @param cellsInfos
 * @param allVisibleCells
 * @returns { cells, invisibleCellInfo, cellsMeta }
 */
export const getVisibleInfo = (
  cellsInfos: MergedCellInfo[],
  allVisibleCells: S2CellType[],
) => {
  const cells: S2CellType[] = [];
  const invisibleCellInfo: MergedCellInfo[] = [];
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
      cellsMeta = cellInfo?.showText
        ? (findCell?.getMeta() as ViewMeta)
        : cellsMeta;
    } else {
      invisibleCellInfo.push(cellInfo);
    }
  });
  return { cells, invisibleCellInfo, cellsMeta };
};

/**
 * get the data cell and meta that make up the mergedCell
 * @param cellsInfos
 * @param allVisibleCells
 * @param sheet
 */
export const getTempMergedCell = (
  allVisibleCells: S2CellType[],
  sheet?: SpreadSheet,
  cellsInfos: MergedCellInfo[] = [],
): TempMergedCell => {
  const { cellsMeta, cells, invisibleCellInfo } = getVisibleInfo(
    cellsInfos,
    allVisibleCells,
  );
  let viewMeta: ViewMeta | Node = cellsMeta;
  let mergedAllCells: S2CellType[] = cells;
  // some cells are invisible and some cells are visible
  const isPartiallyVisible =
    invisibleCellInfo?.length > 0 &&
    invisibleCellInfo.length < cellsInfos.length;
  // 当 MergedCell 只有部分在可视区域时，在此获取 MergedCell 不在可视区域内的 cells
  if (isPartiallyVisible) {
    const { cells: invisibleCells, cellsMeta: invisibleMeta } =
      getInvisibleInfo(invisibleCellInfo, sheet);
    viewMeta = viewMeta || invisibleMeta;
    mergedAllCells = cells.concat(invisibleCells);
  }

  if (!isEmpty(cells) && !viewMeta) {
    viewMeta = mergedAllCells[0]?.getMeta() as ViewMeta; // 如果没有指定合并后的文本绘制的位置，默认画在选择的第一个单元格内
  }
  return {
    cells: mergedAllCells,
    viewMeta: viewMeta as ViewMeta,
    isPartiallyVisible,
  };
};

/**
 * get the active cells' info as the default info of merged cells
 * @param sheet
 */
export const getActiveCellsInfo = (sheet: SpreadSheet) => {
  const { interaction } = sheet;
  const cells = interaction.getActiveCells();
  const mergedCellsInfo: MergedCellInfo[] = [];
  forEach(cells, (cell, index) => {
    const meta = cell.getMeta();
    // 在合并单元格中，第一个单元格被标标记为展示数据。
    const showText = index === 0 ? { showText: true } : {};
    mergedCellsInfo.push({
      ...showText,
      colIndex: meta?.colIndex,
      rowIndex: meta?.rowIndex,
    });
  });
  return mergedCellsInfo;
};

/**
 * draw the background of the merged cell
 * @param sheet the base sheet instance
 * @param cellsInfo
 * @param hideData
 */
export const mergeCell = (
  sheet: SpreadSheet,
  cellsInfo?: MergedCellInfo[],
  hideData?: boolean,
) => {
  const mergeCellInfo = cellsInfo || getActiveCellsInfo(sheet);

  if (mergeCellInfo?.length <= 1) {
    // eslint-disable-next-line no-console
    console.error('then merged cells must be more than one');
    return;
  }

  const allVisibleCells = filter(
    sheet.panelScrollGroup.getChildren(),
    (child) => !(child instanceof MergedCell),
  ) as unknown as S2CellType[];
  const { cells, viewMeta, isPartiallyVisible } = getTempMergedCell(
    allVisibleCells,
    sheet,
    mergeCellInfo,
  );
  if (!isEmpty(cells)) {
    const mergedCellInfoList = sheet.options?.mergedCellsInfo || [];
    mergedCellInfoList.push(mergeCellInfo);
    sheet.setOptions({
      mergedCellsInfo: mergedCellInfoList,
    });
    const meta = hideData ? undefined : viewMeta;
    sheet.panelScrollGroup.add(
      new MergedCell(sheet, cells, meta, isPartiallyVisible),
    );
  }
};

/**
 * remove unmergedCells Info, return new mergedCell info
 * @param removeMergedCell
 * @param mergedCellsInfo
 */
export const removeUnmergedCellsInfo = (
  removeMergedCell: MergedCell,
  mergedCellsInfo: MergedCellInfo[][],
): MergedCellInfo[][] => {
  const removeCellInfo = map(removeMergedCell.cells, (cell: S2CellType) => {
    return {
      colIndex: cell.getMeta().colIndex,
      rowIndex: cell.getMeta().rowIndex,
    };
  });
  return filter(mergedCellsInfo, (mergedCellInfo) => {
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
export const unmergeCell = (sheet: SpreadSheet, removedCells: MergedCell) => {
  if (!removedCells || removedCells.cellType !== CellTypes.MERGED_CELL) {
    // eslint-disable-next-line no-console
    console.error(`unmergeCell: the ${removedCells} is not a MergedCell`);
    return;
  }
  const newMergedCellsInfo = removeUnmergedCellsInfo(
    removedCells,
    sheet.options?.mergedCellsInfo,
  );
  if (newMergedCellsInfo?.length !== sheet.options?.mergedCellsInfo?.length) {
    sheet.setOptions({
      mergedCellsInfo: newMergedCellsInfo,
    });
    removedCells.remove(true);
  }
};

/**
 * 合并 TempMergedCell, 通过 cell.viewMeta.id 判断 TempMergedCell 是否是同一个。
 * @param TempMergedCells
 * @param otherTempMergedCells
 */
export const mergeTempMergedCell = (
  TempMergedCells: TempMergedCell[],
  otherTempMergedCells: TempMergedCell[],
) => {
  const mergedTempMergedCells: Record<string, TempMergedCell> = {};
  [...TempMergedCells, ...otherTempMergedCells].forEach((cell) => {
    mergedTempMergedCells[cell.viewMeta.id] = cell;
  });
  return Object.values(mergedTempMergedCells);
};

/**
 * 将 MergedCell 转换成 TempMergedCell
 * @param oldMergedCells
 * @constructor
 */
export const MergedCellConvertTempMergedCells = (
  oldMergedCells: MergedCell[],
) => {
  return map(oldMergedCells, (mergedCell) => {
    return {
      cells: mergedCell.cells,
      viewMeta: mergedCell.getMeta(),
      isPartiallyVisible: mergedCell.isPartiallyVisible,
    };
  });
};

/**
 * 对比两个TempMergedCell，返回 mainTempMergedCells 中存在的，但是 otherTempMergedCells 中不存在的的 TempMergedCell
 * 因为 g-base 无法渲染不在可视区域内的图形，所以 isPartiallyVisible 为 true 时也需要重新渲染
 * @param mainTempMergedCells
 * @param compareTempMergedCells
 */
export const differenceTempMergedCells = (
  mainTempMergedCells: TempMergedCell[],
  compareTempMergedCells: TempMergedCell[],
): TempMergedCell[] => {
  return differenceWith(
    mainTempMergedCells,
    compareTempMergedCells,
    (main, compare) => {
      return (
        isEqual(main.viewMeta.id, compare.viewMeta.id) &&
        !main.isPartiallyVisible
      );
    },
  );
};

/**
 * update the mergedCell
 * @param sheet the base sheet instance
 */
export const updateMergedCells = (sheet: SpreadSheet) => {
  const mergedCellsInfo = sheet.options?.mergedCellsInfo;
  if (isEmpty(mergedCellsInfo)) return;

  // 可见区域的所有cells
  const allCells = filter(
    sheet.panelScrollGroup.getChildren(),
    (child) => !(child instanceof MergedCell),
  ) as unknown as S2CellType[];
  if (isEmpty(allCells)) return;

  // allVisibleTempMergedCells 所有可视区域的 mergedCell
  const allVisibleTempMergedCells: TempMergedCell[] = [];
  mergedCellsInfo.forEach((cellsInfo: MergedCellInfo[]) => {
    const tempMergedCell = getTempMergedCell(allCells, sheet, cellsInfo);
    if (tempMergedCell.cells.length > 0) {
      allVisibleTempMergedCells.push(tempMergedCell);
    }
  });
  // 获取 oldTempMergedCells 便用后续进行 diff 操作
  const oldMergedCells = filter(
    sheet.panelScrollGroup.getChildren(),
    (child) => child instanceof MergedCell,
  ) as unknown as MergedCell[];

  const oldTempMergedCells: TempMergedCell[] =
    MergedCellConvertTempMergedCells(oldMergedCells);

  // compare oldTempMergedCells and allTempMergedCells, find remove MergedCells and add MergedCells
  const removeTempMergedCells = differenceTempMergedCells(
    oldTempMergedCells,
    allVisibleTempMergedCells,
  );

  const addTempMergedCells = differenceTempMergedCells(
    allVisibleTempMergedCells,
    oldTempMergedCells,
  );
  // remove old MergedCells
  forEach(removeTempMergedCells, (tempMergedCell) => {
    const oldMergedCell = find(oldMergedCells, (mergedCell) => {
      return isEqual(mergedCell.getMeta().id, tempMergedCell.viewMeta.id);
    });
    oldMergedCell?.remove(true);
  });
  // add new MergedCells
  forEach(addTempMergedCells, ({ cells, viewMeta, isPartiallyVisible }) => {
    sheet.panelScrollGroup.add(
      new MergedCell(sheet, cells, viewMeta, isPartiallyVisible),
    );
  });
};
