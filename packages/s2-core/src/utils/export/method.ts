import { forEach } from 'lodash';
import type { ColCell, RowCell } from '../../cell';
import type { DataItem } from '../../common';
import { NODE_ID_SEPARATOR } from '../../common';

export const newLine = '\r\n';
export const newTab = '\t';

export function getCsvString(v: any): string {
  if (!v) {
    return v;
  }

  if (typeof v === 'string') {
    const out = v;
    // 需要替换", https://en.wikipedia.org/wiki/Comma-separated_values#Example
    return `"${out.replace(/"/g, '""')}"`;
  }

  return `"${v}"`;
}

export function keyEqualTo(key: string, compareKey: string) {
  if (!key || !compareKey) {
    return false;
  }
  return String(key).toLowerCase() === String(compareKey).toLowerCase();
}

export const convertString = (value: DataItem) => {
  if (/\n/.test(value as string)) {
    // 单元格内换行 替换双引号 防止内容存在双引号 导致内容换行出错
    return (
      '"' + (value as string).replace(/\r\n?/g, '\n').replace(/"/g, "'") + '"'
    );
  }
  return value;
};

/**
 * 获取 intersection cell 所有的层级
 * @param {(RowCell | ColCell)[]} interactedCells
 * @returns { Set<number>} allLevels
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
  headerList.shift(); // 去除 root
  return headerList;
};
