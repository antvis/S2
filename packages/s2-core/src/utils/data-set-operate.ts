import { filter, isUndefined, keys, get, reduce, every } from 'lodash';
import { Data } from '@/common/interface/s2DataConfig';
import { Fields } from '@/common/interface/index';

/**
 * get intersections between two arrs
 *
 */
export const getIntersections = (arr1: string[], arr2: string[]) => {
  return arr1.filter((item) => arr2.includes(item));
};

export const filterUndefined = (values: string[]) => {
  return filter(values, (t) => !isUndefined(t));
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
