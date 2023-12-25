import Decimal from 'decimal.js';
import { CellData } from '../data-set/cell-data';
import { Aggregation, type ViewMetaData } from '../common/interface';

export const isNotNumber = (value: unknown) => {
  if (typeof value === 'number') {
    return Number.isNaN(value);
  }

  if (!value) {
    return true;
  }

  if (typeof value === 'string') {
    return Number.isNaN(Number(value));
  }

  return true;
};

export const canConvertToNumber = (a?: string | number) => !isNotNumber(a);

/**
 * 预处理原始数据为 Decimal 对象数组
 * 所有不能转为 number 的数据默认为 0
 * @param data 原始数据数组
 * @param field 值字段
 * @param filterIllegalValue 是否过滤非法值？过滤后，包装后的数据数组短于原始数组长度
 * @returns 经过 Decimal 包装后的值数组
 */
const processFieldValues = (
  data: ViewMetaData[],
  field: string,
  filterIllegalValue = false,
) => {
  if (!data?.length) {
    return [];
  }

  return data.reduce<Array<Decimal>>((resultArr, item) => {
    const fieldValue = CellData.getFieldValue(item, field) as string | number;

    const notNumber = isNotNumber(fieldValue);

    if (filterIllegalValue && notNumber) {
      // 过滤非法值
      return resultArr;
    }

    const val = notNumber ? 0 : fieldValue;

    resultArr.push(new Decimal(val));

    return resultArr;
  }, []);
};

/**
 * 计算数据项的和
 * @param data 数据项
 * @param field 值字段
 * @returns 算术和
 */
export const getDataSumByField = (
  data: ViewMetaData[],
  field: string,
): number => {
  const fieldValues = processFieldValues(data, field);

  if (!fieldValues.length) {
    return 0;
  }

  return Decimal.sum(...fieldValues).toNumber();
};

/**
 * 计算数据项的极值
 * @param method 最大值(max)或最小值(min)
 * @param data 数据项
 * @param field 值字段
 * @returns 最值
 */
export const getDataExtremumByField = (
  method: 'min' | 'max',
  data: ViewMetaData[],
  field: string,
): number | undefined => {
  // 防止预处理时默认值 0 影响极值结果，处理时需过滤非法值
  const fieldValues = processFieldValues(data, field, true);

  if (!fieldValues?.length) {
    return;
  }

  return Decimal[method](...fieldValues).toNumber();
};

/**
 * 计算数据项的平均值
 * @param data 数据项
 * @param field 值字段
 * @returns 算术平均值
 */
export const getDataAvgByField = (
  data: ViewMetaData[],
  field: string,
): number => {
  const fieldValues = processFieldValues(data, field);

  if (!fieldValues?.length) {
    return 0;
  }

  return Decimal.sum(...fieldValues)
    .dividedBy(fieldValues.length)
    .toNumber();
};

/**
 * totals 计算方法集合
 */
export const calcActionByType: {
  [type in Aggregation]: (
    data: ViewMetaData[],
    field: string,
  ) => number | undefined;
} = {
  [Aggregation.SUM]: getDataSumByField,
  [Aggregation.MIN]: (data, field) =>
    getDataExtremumByField('min', data, field),
  [Aggregation.MAX]: (data, field) =>
    getDataExtremumByField('max', data, field),
  [Aggregation.AVG]: getDataAvgByField,
};
