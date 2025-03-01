/**
 * 导出和复制的公共方法，这里的方法都比较纯，参数中都不包含 spreadsheet 对象
 */
import { flow, forEach, map } from 'lodash';
import type { ColCell, RowCell } from '../../cell';
import {
  CellType,
  NODE_ID_SEPARATOR,
  SERIES_NUMBER_FIELD,
  type CellMeta,
  type SimpleData,
} from '../../common';
import type { Node } from '../../facet/layout/node';
import type { SpreadSheet } from '../../sheet-type';
import { resolveNillString } from '../layout';
import { replaceEmptyFieldValue } from '../text';

export function keyEqualTo(key: string, compareKey: string) {
  if (!key || !compareKey) {
    return false;
  }

  return String(key).toLowerCase() === String(compareKey).toLowerCase();
}

/**
 * 获取 intersection cell 所有的层级
 * @param {(RowCell | ColCell)[]} interactedCells
 */
export function getAllLevels(interactedCells: (RowCell | ColCell)[]) {
  const allLevels = new Set<number>();

  forEach(interactedCells, (cell: RowCell | ColCell) => {
    const level = cell.getMeta().level;

    if (allLevels.has(level)) {
      return;
    }

    allLevels.add(level);
  });

  return allLevels;
}

/**
 * https://en.wikipedia.org/wiki/Comma-separated_values#Example
 * 根据 CSV、Excel 规范，按以下规则处理字段内容：
 * 若字段包含 ,、"、\r、\n 或 \t → 用双引号包裹字段。
 * 字段中的双引号 → 转义为两个双引号 ""。
 * 为了兼容直接粘贴纯文本到Excel单元格保持换行的场景，把\n替换成\r\n。但是\r\n不做替换
 * @param field
 */
export const escapeField = (field: SimpleData): SimpleData => {
  if (typeof field !== 'string') {
    return field;
  }

  // 检查是否需要转义：包含逗号、双引号或换行符
  if (/[",\r\n\t]/.test(field)) {
    // 转义双引号 -> 两个双引号
    // 为了兼容直接粘贴纯文本到Excel单元格保持换行的场景，把\n替换成\r\n。但是\r\n不做替换
    // 在ios 14.8.1中正则前瞻和后顾存在兼容问题
    const newField = field
      .replace(/"/g, '""')
      .replace(/\r\n/g, '\n')
      .replace(/\n/g, '\r\n');

    // 用双引号包裹字段
    return `"${newField}"`;
  }

  return field;
};

export const getHeaderMeasureFieldNames = (
  fields: string[],
  spreadsheet: SpreadSheet,
  formatHeader: boolean = true,
): SimpleData[] => {
  return map(fields, (field) => {
    // https://github.com/antvis/S2/issues/2755
    if (field === SERIES_NUMBER_FIELD) {
      return spreadsheet.getSeriesNumberText();
    }

    // https://github.com/antvis/S2/issues/2688
    // https://github.com/antvis/S2/pull/2829
    if (!formatHeader) {
      return flow(resolveNillString, replaceEmptyFieldValue)(field);
    }

    return spreadsheet.dataSet.getFieldName(field);
  });
};

/**
 * 根据 id 计算出行头或者列头展示的文本数组
 * 将 id : root[&]家具[&]桌子[&]price"
 * startLevel 不传, 转换为 List: ['家具', '桌子', 'price']
 * startLevel = 1, 转换为 List: ['家具', '桌子', 'price']
 * @param headerId
 * @param startLevel 层级
 */
export const getHeaderList = (headerId: string, startLevel?: number) => {
  const headerList = headerId.split(NODE_ID_SEPARATOR);

  if (startLevel) {
    return headerList.slice(headerList.length - startLevel);
  }

  // 去除 root
  headerList.shift();

  return headerList;
};

/**
 * 获取 col node 对应的 field。e.g. field: age
 * @param {() => boolean} isPivotMode
 * @param {Node} colNode
 * @return {string | undefined}
 */
export const getColNodeFieldFromNode = (
  isPivotMode: () => boolean,
  colNode?: Node,
): string | undefined => {
  if (isPivotMode()) {
    return colNode?.value;
  }

  return colNode?.field;
};

export const getSelectedCols = (cells: CellMeta[]) =>
  cells.filter(({ type }) => type === CellType.COL_CELL);

export const getSelectedRows = (cells: CellMeta[]) =>
  cells.filter(({ type }) => type === CellType.ROW_CELL);
