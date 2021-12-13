import { keys, has, map, toUpper, endsWith, uniq } from 'lodash';
import { SortMethod, SortParam } from '@/common/interface';
import { DataType, SortActionParams } from '@/data-set/interface';
import { EXTRA_FIELD, TOTAL_VALUE } from '@/common/constant';
import { sortByItems, getListBySorted } from '@/utils/data-set-operate';
import { getDimensionsWithParentPath } from '@/utils/dataset/pivot-data-set';

export const isAscSort = (sortMethod) => toUpper(sortMethod) === 'ASC';

export const isDescSort = (sortMethod) => toUpper(sortMethod) === 'DESC';

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
  const sort = isAscSort(sortMethod) ? 1 : -1;
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
        if (a && specialValues?.includes(a?.toString())) {
          return -sort;
        }
        if (Number(a) && specialValues?.includes(b?.toString())) {
          return sort;
        }
      }
      if (a && b) {
        // 数据健全兼容，用户数据不全时，能够展示.
        return a.toString().localeCompare(b.toString(), 'zh') * sort;
      }
      if (a) {
        return sort;
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
  if (asc) {
    // 如果是升序，需要将无数据的项放到前面
    return sortByItems(originValues, uniq(sortedValues));
  }
  return [...new Set([...sortedValues, ...originValues])];
};

export const sortByFunc = (params: SortActionParams): string[] => {
  const { originValues, measureValues, sortParam } = params;
  const { sortFunc } = sortParam;
  return sortFunc({ data: measureValues, ...sortParam }) || originValues;
};

export const sortByCustom = (params: SortActionParams): string[] => {
  const { sortByValues, originValues } = params;
  const sortedListWithPre = sortByValues.map(
    (item) => originValues?.find((i) => endsWith(i, item)) || item,
  );
  return getListBySorted(originValues, sortedListWithPre);
};

export const sortByMethod = (params: SortActionParams): string[] => {
  const { sortParam, measureValues, originValues, dataSet } = params;
  const { sortByMeasure, query, sortFieldId, sortMethod } = sortParam;
  const { rows, columns } = dataSet.fields;
  const isInRows = rows.includes(sortFieldId);
  let result = originValues;

  if (sortByMeasure) {
    const dimensions = sortAction(
      measureValues,
      sortMethod,
      sortByMeasure === TOTAL_VALUE ? query[EXTRA_FIELD] : sortByMeasure,
    ) as Record<string, DataType>[];

    result = getDimensionsWithParentPath(
      sortFieldId,
      isInRows ? rows : columns,
      dimensions,
    );
  } else {
    result = map(sortAction(measureValues, sortMethod)) as string[];
  }

  return mergeDataWhenASC(result, originValues, isAscSort(sortMethod));
};

export const processSort = (params: SortActionParams): string[] => {
  const { sortParam, originValues, measureValues, dataSet } = params;
  const { sortFunc, sortMethod, sortBy } = sortParam;

  let result = [];
  const sortActionParams = {
    originValues,
    measureValues,
    sortParam,
    dataSet,
  };
  if (sortFunc) {
    result = sortByFunc(sortActionParams);
  } else if (sortBy) {
    // 自定义列表
    result = sortByCustom({ sortByValues: sortBy, originValues });
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
    dataSet,
  });
};

export const getSortTypeIcon = (sortParam: SortParam, isSortCell?: boolean) => {
  if (sortParam?.sortMethod) {
    if (isAscSort(sortParam?.sortMethod)) {
      return 'groupAsc';
    }
    if (isDescSort(sortParam?.sortMethod)) {
      return 'groupDesc';
    }
  }
  if (isSortCell) {
    return 'SortDown';
  }
};
