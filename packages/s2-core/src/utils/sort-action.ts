import { isNumber } from 'lodash';
import { SortMethod } from 'src/common/interface';
import { DataType } from 'src/data-set/interface';

/**
 * 执行排序
 * @param list - 待排序数组
 * @param sortMethod - 升、降序
 * @param key - 根据key数值排序
 */
export const sortAction = (
  list: Array<string | DataType>,
  sortMethod?: SortMethod,
  key?: string,
) => {
  const sort = sortMethod === 'ASC' ? 1 : -1;
  return list?.sort((pre: string | DataType, next: string | DataType) => {
    let a = pre;
    let b = next;
    if (key) {
      a = pre[key];
      b = next[key];
    }
    if (isNumber(a) && isNumber(b)) {
      return (a - b) * sort;
    }
    if (Number(a) || Number(b)) {
      // 数值比较，解决 '2' > '11' 场景
      return (Number(a) - Number(b)) * sort;
    }
    if (a && b) {
      // 数据健全兼容，用户数据不全时，能够展示.
      return a.toString().localeCompare(b.toString(), 'zh') * sort;
    }
    return sort;
  });
};
