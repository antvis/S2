import { filter, isUndefined, keys, get, reduce, every } from 'lodash';
import { Data } from '@/common/interface/s2DataConfig';
import { Fields, TotalsStatus, Totals } from '@/common/interface/index';

export const getListBySorted = (list: string[], sorted: string[]) => {
  return list.sort((a, b) => {
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

export const filterUndefined = (values: string[]) => {
  return filter(values, (t) => !isUndefined(t) && t !== 'undefined');
};

export const flattenDeep = (data: Record<any, any>[] | Record<any, any>) =>
  keys(data)?.reduce((pre, next) => {
    const item = get(data, next);
    if (Array.isArray(item)) {
      pre = pre.concat(flattenDeep(item));
    } else {
      pre?.push(item);
    }

    return pre;
  }, []);

export const flatten = (data: Record<any, any>[] | Record<any, any>) => {
  let result = [];
  if (Array.isArray(data)) {
    keys(data)?.forEach((item) => {
      const current = get(data, item);
      if (keys(current)?.includes('undefined')) {
        keys(current)?.forEach((ki) => {
          result.push(current[ki]);
        });
      } else {
        result = result.concat(current);
      }
    });
  } else {
    result = result.concat(data);
  }
  return result;
};

export const isEveryUndefined = (data: string[] | undefined[]) => {
  return data?.every((item) => isUndefined(item));
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

  return result;
};

/**
 * arr1包含arr2，将arr2排到最后
 *
 */
export const sortByItems = (arr1: string[], arr2: string[]) => {
  return arr1?.filter((item) => !arr2?.includes(item))?.concat(arr2);
};

/**
 * 判断是普通单元格数据还是总计或小计
 * @param ids
 * @param data
 * @returns
 */
export const isTotalData = (ids: string[], data: Data): boolean => {
  return !every(ids, (id) => data[id]);
};

/**
 * split total data from origin list data.
 */
export function splitTotal(rawData: Data[], fields: Fields): Data[] {
  const { rows, columns } = fields;

  return reduce(
    rawData,
    (result: Data[], data: Data) => {
      if (isTotalData([].concat(rows).concat(columns), data)) {
        result.push(data);
      }
      return result;
    },
    [],
  );
}

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
