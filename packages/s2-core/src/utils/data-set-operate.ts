import { every, flatMap, has, isArray, reduce } from 'lodash';
import {
  DataSelectType,
  DEFAULT_TOTAL_SELECTIONS,
} from '../common/constant/total';
import type { TotalSelectionsOfMultiData } from '..';
import { TOTAL_VALUE } from '../common/constant/basic';
import type {
  RawData,
  Fields,
  Totals,
  TotalsStatus,
} from '../common/interface';
import { customMerge } from './merge';

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

export const filterTotal = (values: string[] = []) => {
  return values.filter((v) => v !== TOTAL_VALUE);
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
export const isTotalData = (ids: string[], data: RawData): boolean => {
  return !every(ids, (id) => has(data, id));
};

/**
 * split total data from origin list data.
 */
export function splitTotal(rawData: RawData[], fields: Fields): RawData[] {
  const { rows, columns } = fields;

  return reduce(
    rawData,
    (result: RawData[], data: RawData) => {
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

export function getTotalSelection(totals = {} as TotalSelectionsOfMultiData) {
  return customMerge(DEFAULT_TOTAL_SELECTIONS, totals);
}

export function flattenIndexesData(
  data: RawData[][] | RawData[] | RawData,
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
