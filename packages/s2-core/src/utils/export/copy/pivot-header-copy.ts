import { filter, isEmpty, map, max, repeat, zip } from 'lodash';
import type { ColCell, RowCell } from '../../../cell';
import type { CopyableList } from '../interface';
import { getAllLevels, getHeaderList } from '../method';
import { matrixHtmlTransformer, matrixPlainTextTransformer } from '../copy';
import { CellTypes, NODE_ID_SEPARATOR } from '../../../common';

/**
 * 过滤出 intersection cell 中所有叶子节点的 cellMeta
 * @param interactedCells
 * @param maxLevel
 * @returns {CellMeta[]}
 */
function getLastLevelCells(
  interactedCells: RowCell[] | ColCell[],
  maxLevel: number,
) {
  return filter(interactedCells, (cell: RowCell | ColCell) => {
    const meta = cell.getMeta();
    const isLastLevel = meta.level === maxLevel;
    const isLastTotal = meta.isTotals && isEmpty(meta.children);

    return isLastLevel || isLastTotal;
  });
}

/**
 * 获取表头圈选后的 header cells 值矩阵
 * @param lastLevelCells
 * @param maxLevel
 * @param allLevel
 * @returns {string[][]}
 */
function getHeaderCellMatrix(
  lastLevelCells: Array<RowCell | ColCell>,
  maxLevel: number,
  allLevel: Set<number>,
): string[][] {
  return map(lastLevelCells, (cell: RowCell | ColCell) => {
    const meta = cell.getMeta();
    const { id, value, isTotals, level } = meta;
    let cellId = id;

    // 为总计小计补齐高度
    if (isTotals && level !== maxLevel) {
      cellId = id + NODE_ID_SEPARATOR + repeat(value, maxLevel - level);
    }

    return getHeaderList(cellId, allLevel.size);
  });
}

/**
 * 获取表头圈选后的 header cells 值矩阵
 * @param {RowCell[] | ColCell[]} interactedCells
 * @return {CopyableList}
 */
export function getBrushHeaderCopyable(
  interactedCells: RowCell[] | ColCell[],
): CopyableList {
  // 获取圈选的层级有哪些
  const allLevels = getAllLevels(interactedCells);
  const maxLevel = max(Array.from(allLevels)) ?? 0;
  // 获取最后一层的 cell
  const lastLevelCells = getLastLevelCells(interactedCells, maxLevel) as Array<
    RowCell | ColCell
  >;

  // 拼接选中行列头的内容矩阵
  const isCol = interactedCells[0].cellType === CellTypes.COL_CELL;
  let cellMatrix = getHeaderCellMatrix(lastLevelCells, maxLevel, allLevels);

  // 如果是列头，需要转置
  if (isCol) {
    cellMatrix = zip(...cellMatrix) as string[][];
  }

  return [
    matrixPlainTextTransformer(cellMatrix),
    matrixHtmlTransformer(cellMatrix),
  ];
}
