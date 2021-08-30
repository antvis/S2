import { Data, DataItem, SortMethod } from 'src/common/interface';
import { DataType, SortActionParams } from 'src/data-set/interface';
import { EXTRA_FIELD, SortMethodType, TOTAL_VALUE } from '@/common/constant';
import { keys, has, uniq } from 'lodash';
import { sortByItems } from '@/utils/data-set-operate';

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

const mergeDataWhenASC = (
  sortedValues: string[],
  originValues: string[],
  asc: boolean,
) => {
  let sortList = uniq(sortedValues);
  if (asc) {
    // 如果是升序，需要将无数据的项放到前面
    sortList = sortByItems(originValues, sortList);
  }
  return sortList;
};

export const sortByFunc = (params: SortActionParams): string[] => {
  const { originValues, measureValues, sortParam } = params;
  const { sortFunc } = sortParam;
  return sortFunc({ data: measureValues, ...sortParam }) || originValues;
};

export const sortByCustom = (params: SortActionParams): string[] => {
  const { sortByValues } = params;
  return sortByValues;
};

export const sortByMethod = (params: SortActionParams): string[] => {
  const { sortParam, measureValues, originValues } = params;
  const { sortByMeasure, query, sortFieldId, sortMethod } = sortParam;
  const result = sortAction(
    measureValues,
    sortMethod,
    sortByMeasure === TOTAL_VALUE ? query[EXTRA_FIELD] : sortByMeasure,
  )?.map((item) => item[sortFieldId]);
  return mergeDataWhenASC(result, originValues, sortMethod === 'ASC');
};

export const processSort = (params: SortActionParams): string[] => {
  const { sortParam, originValues, measureValues } = params;
  const { sortFunc, sortMethod, sortBy } = sortParam;

  let result = [];
  const sortActionParams = {
    originValues,
    measureValues,
    sortParam,
  };
  if (sortFunc) {
    result = sortByFunc(sortActionParams);
  } else if (sortBy) {
    // 自定义列表
    result = sortByCustom({ sortByValues: sortBy });
  } else if (sortMethod) {
    // 如果是升序，需要将无数据的项放到前面
    result = sortByMethod(sortActionParams);
  }
  return result;
};

export const handleSortAction = (params: SortActionParams): string[] => {
  const { dataSet, sortParam, originValues, isSortByMeasure } = params;
  const { fields } = dataSet;
  const { sortByMeasure, query, sortFieldId } = sortParam;
  let measureValues;
  if (isSortByMeasure) {
    // 根据指标排序，需要首先找到指标的对应的值
    if (sortByMeasure === TOTAL_VALUE) {
      // 按小计，总计排序
      const isRow =
        fields?.columns?.includes(sortFieldId) &&
        keys(query)?.length === 1 &&
        has(query, EXTRA_FIELD);
      measureValues = dataSet.getMultiData(query, true, isRow);
    } else {
      measureValues = dataSet.getMultiData(query);
    }
  } else {
    // 其他都是维度本身的排序方式
    measureValues = originValues;
  }
  return processSort({
    sortParam,
    originValues,
    measureValues,
  });
};

// table-fact quick sort
const compareFunction = (
  a: DataItem,
  b: DataItem,
  sortMethod: SortMethod = 'ASC',
) => (sortMethod === 'ASC' ? a < b : a > b);

export const quickSort = (
  originalData: Data[],
  sortInfo: {
    sortKey: string;
    sortMethod: SortMethod;
    compareFunc;
  },
) => {
  const {
    sortKey,
    sortMethod = SortMethodType.ASC,
    compareFunc = compareFunction,
  } = sortInfo;
  if (originalData.length <= 1) return originalData;
  const pivotIndex = Math.floor(originalData.length / 2);
  const list = [...originalData];
  const pivot = list.splice(pivotIndex, 1)[0];
  const [left, right] = [[], []];
  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    if (compareFunc(item[sortKey], pivot[sortKey], sortMethod)) {
      left.push(item);
    } else {
      right.push(item);
    }
  }

  return [...quickSort(left, sortInfo), pivot, ...quickSort(right, sortInfo)];
};
