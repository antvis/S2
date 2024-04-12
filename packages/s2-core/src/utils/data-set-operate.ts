import { isArray, flattenDeep } from 'lodash';
import {
  EMPTY_EXTRA_FIELD_PLACEHOLDER,
  TOTAL_VALUE,
} from '../common/constant/field';
import type { Totals, TotalsStatus } from '../common/interface';

export const getListBySorted = (
  list: string[],
  sorted: string[],
  mapValue?: (val: string) => string,
) => {
  return list.sort((a, b) => {
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
};

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

/**
 * arr1包含arr2，将arr2排到最后
 *
 */
export const sortByItems = (arr1: string[], arr2: string[]) => {
  return arr1?.filter((item) => !arr2?.includes(item))?.concat(arr2);
};

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
