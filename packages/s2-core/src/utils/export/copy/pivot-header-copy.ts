import { filter, isEmpty, map, max, min, repeat, zip } from 'lodash';
import type { ColCell, RowCell } from '../../../cell';
import { CellType, NODE_ID_SEPARATOR, type SimpleData } from '../../../common';
import type { CopyableList } from '../../../common/interface/export';
import {
  getAllLevels,
  getHeaderList,
  getHeaderMeasureFieldNames,
} from '../method';
import {
  getNodeFormatData,
  matrixHtmlTransformer,
  matrixPlainTextTransformer,
} from './common';

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
 * @param withFormat
 * @returns {SimpleData[][]}
 */
function getHeaderCellMatrix(
  lastLevelCells: Array<RowCell | ColCell>,
  maxLevel: number,
  allLevel: Set<number>,
  withFormat: boolean,
): SimpleData[][] {
  return map(lastLevelCells, (cell: RowCell | ColCell) => {
    const node = cell.getMeta();

    if (withFormat) {
      const formatNames = getNodeFormatData(node);
      const minLevel = min(Array.from(allLevel)) ?? 0;

      return formatNames.slice(minLevel, maxLevel + 1);
    }

    // 保持原有的不格式化逻辑 (仅使用原始值)
    const { id, value, isTotals, level, spreadsheet } = node;
    let cellId = id;

    // 为总计小计补齐高度
    if (isTotals && level !== maxLevel) {
      cellId = id + NODE_ID_SEPARATOR + repeat(value, maxLevel - level);
    }

    return getHeaderMeasureFieldNames(
      getHeaderList(cellId, allLevel.size),
      spreadsheet,
      false,
    );
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
  const isCol = interactedCells[0].cellType === CellType.COL_CELL;
  const { spreadsheet } = interactedCells[0].getMeta();
  // 1. 从配置中读取 withFormat，这是让组件响应配置的第一步
  const withFormat = spreadsheet.options.interaction?.copy?.withFormat ?? false;
  const headerCellMatrix = getHeaderCellMatrix(
    lastLevelCells,
    maxLevel,
    allLevels,
    withFormat,
  );
  // 如果是列头，需要转置
  const cellMatrix = isCol ? zip(...headerCellMatrix) : headerCellMatrix;

  return [
    matrixPlainTextTransformer(cellMatrix),
    matrixHtmlTransformer(cellMatrix),
  ];
}
