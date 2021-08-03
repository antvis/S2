import { SortMethod } from 'src/common/interface';
import { DataType } from 'src/data-set/interface';

/**
 * 执行排序
 * @param list - 待排序数组
 * @param sortMethod - 升、降序
 * @param key - 根据key数值排序，如果有key代表根据维度值排序，故按数字排，如果没有按照字典排
 */
export const sortAction = (
  list: Array<string | number | DataType>,
  sortMethod?: SortMethod,
  key?: string,
) => {
  const sort = sortMethod === 'ASC' ? 1 : -1;
  const specialValues = ['-', undefined];
  return list?.sort(
    (pre: string | number | DataType, next: string | number | DataType) => {
      let a = pre;
      let b = next;
      if (key) {
        a = pre[key];
        b = next[key];
        if (Number(a) && Number(b)) {
          return (Number(a) - Number(b)) * sort;
        }
        if (specialValues?.includes(a.toString())) {
          return -sort;
        }
        if (Number(a) && specialValues?.includes(b.toString())) {
          return sort;
        }
      }
      if (a && b) {
        // 数据健全兼容，用户数据不全时，能够展示.
        return a.toString().localeCompare(b.toString(), 'zh') * sort;
      }
      return -sort;
    },
  );
};
