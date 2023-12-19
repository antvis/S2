import { every, flatMap, flattenDeep, get, has, isArray, keys } from 'lodash';
import { TOTAL_VALUE } from '../common/constant/basic';
import {
  DataSelectType,
  DEFAULT_TOTAL_SELECTIONS
} from '../common/constant/total';
import type {
  CalcTotals, CustomHeaderFields, FlattingIndexesData, RawData,
  Totals,
  TotalsStatus
} from '../common/interface';
import type { TotalSelectionsOfMultiData } from '../data-set/interface';
import { filterExtraDimension } from './dataset/pivot-data-set';
import { customMerge } from './merge';

export const getListBySorted = (
  list: string[],
  sorted: string[],
  mapValue?: (val: string) => string,
) =>
  list.sort((a, b) => {
    if (mapValue) {
      a = mapValue(a);
      b = mapValue(b);
    }

    const ia = sorted.indexOf(a);
    const ib = sorted.indexOf(b);

    if (ia === -1 && ib === -1) {
      return 0;
    }

    if (ia === -1) {
      return 1;
    }

    if (ib === -1) {
      return -1;
    }

    return ia - ib;
  });

export const filterTotal = (values: string[] = []) =>
  values.filter((v) => v !== TOTAL_VALUE);

export const getFieldKeysByDimensionValues = (
  dimensionValues: string[] | undefined[],
  dimensions: CustomHeaderFields,
) => {
  const result: string[] = [];

  dimensionValues?.forEach((item, index) => {
    if (item === undefined) {
      if (dimensions[index]) {
        result.push(dimensions[index] as string);
      }
    }
  });

  return result;
};

<<<<<<< HEAD
/**
 * arr1包含arr2，将arr2排到最后
 *
 */
export const sortByItems = (arr1: string[], arr2: string[]) =>
  arr1?.filter((item) => !arr2?.includes(item))?.concat(arr2);

export function getAggregationAndCalcFuncByQuery(
  totalsStatus: TotalsStatus,
  totalsOptions?: Totals,
) {
  const { isRowTotal, isRowSubTotal, isColTotal, isColSubTotal } = totalsStatus;
  const { row, col } = totalsOptions || {};
  const {
    calcGrandTotals: rowCalcTotals = {},
    calcSubTotals: rowCalcSubTotals = {},
  } = row || {};
  const {
    calcGrandTotals: colCalcTotals = {},
    calcSubTotals: colCalcSubTotals = {},
  } = col || {};

  const getCalcTotals = (dimensionTotals: CalcTotals, isTotal: boolean) => {
    if ((dimensionTotals.aggregation || dimensionTotals.calcFunc) && isTotal) {
      return {
        aggregation: dimensionTotals.aggregation!,
        calcFunc: dimensionTotals.calcFunc,
      };
    }
  };

  // 优先级: 列总计/小计 > 行总计/小计
  return (
    getCalcTotals(colCalcTotals, isColTotal) ||
    getCalcTotals(colCalcSubTotals, isColSubTotal) ||
    getCalcTotals(rowCalcTotals, isRowTotal) ||
    getCalcTotals(rowCalcSubTotals, isRowSubTotal)
  );
}

/**
 * 判断是普通单元格数据还是总计或小计
 * @param ids
 * @param data
 * @returns
 */
export function isTotalData(ids: string[], data: RawData): boolean {
  return !every(filterExtraDimension(ids), (id) => has(data, id));
}

export function getTotalSelection(totals = {} as TotalSelectionsOfMultiData) {
  return customMerge<TotalSelectionsOfMultiData>(
    DEFAULT_TOTAL_SELECTIONS,
    totals,
  );
}

export function flattenIndexesData(
  data: FlattingIndexesData,
  selectType: DataSelectType = DataSelectType.All,
) {
  if (!isArray(data)) {
    return [data];
  }

  return flatMap(data, (dimensionData) => {
    if (!isArray(dimensionData)) {
      return [dimensionData];
    }

    // 数组的第 0 项是总计/小计专位，从第 1 项开始是明细数据
    const startIdx = selectType === DataSelectType.DetailOnly ? 1 : 0;
    const length = selectType === DataSelectType.TotalOnly ? 1 : undefined;

    return dimensionData.slice(startIdx, length).filter(Boolean);
  });
}

export const flatten = (data: Record<any, any>[] | Record<any, any>) => {
  const result = [];

  if (Array.isArray(data)) {
    // 总计小计在数组里面，以 undefine作为key, 直接forEach的话会漏掉总计小计
    const containsTotal = 'undefined' in data;
    const itemLength = data.length + (containsTotal ? 1 : 0);

    let i = 0;

    while (i < itemLength) {
      // eslint-disable-next-line dot-notation
      const current =
        i === data.length ? data['undefined' as unknown as number] : data[i];

      i++;

      if (current && 'undefined' in current) {
        keys(current).forEach((ki) => {
          result.push(current[ki]);
        });
      } else if (Array.isArray(current)) {
        result.push(...current);
      } else {
        result.push(current);
      }
    }
  } else {
    result.push(data);
  }
=======
export const filterOutDetail = (values: string[] = []) => {
  return values.filter(
    (v) => v !== TOTAL_VALUE && v !== EMPTY_EXTRA_FIELD_PLACEHOLDER,
  );
};
export const customFlattenDeep = (
  data: Record<any, any>[] | Record<any, any>,
) => {
  if (!isArray(data)) {
    return [data];
  }
  return flattenDeep(data);
};

export const getFieldKeysByDimensionValues = (
  dimensionValues: string[] | undefined[],
  dimensions: string[] | undefined[],
) => {
  const result = [];
  dimensionValues?.forEach((item, index) => {
    if (item === undefined) {
      if (dimensions[index]) {
        result.push(dimensions[index]);
      }
    }
  });
>>>>>>> origin/master

  return result;
};

export const flattenDeep = (data: Record<any, any>[] | Record<any, any>) =>
  keys(data)?.reduce((pre, next) => {
    const item = get(data, next);

<<<<<<< HEAD
    if (Array.isArray(item)) {
      pre = pre.concat(flattenDeep(item));
    } else {
      pre?.push(item as unknown as never);
=======
export function getAggregationAndCalcFuncByQuery(
  totalsStatus: TotalsStatus,
  totalsOptions: Totals,
) {
  const { isRowTotal, isRowSubTotal, isColTotal, isColSubTotal } = totalsStatus;
  const { row, col } = totalsOptions || {};
  const {
    calcTotals: rowCalcTotals = {},
    calcSubTotals: rowCalcSubTotals = {},
  } = row || {};
  const {
    calcTotals: colCalcTotals = {},
    calcSubTotals: colCalcSubTotals = {},
  } = col || {};
  const getCalcTotals = (dimensionTotals, totalType) => {
    if (
      (dimensionTotals.aggregation || dimensionTotals.calcFunc) &&
      totalType
    ) {
      return {
        aggregation: dimensionTotals.aggregation,
        calcFunc: dimensionTotals.calcFunc,
      };
>>>>>>> origin/master
    }

    return pre;
  }, []);
