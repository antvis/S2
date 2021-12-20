import { get, reduce } from 'lodash';

type DataItem = Record<string, any>;

export const isNotNumber = (value: unknown) => {
  return Number.isNaN(Number(value));
};

/**
 * 浮点数加法，解决精度问题
 * 因为乘法也有精度问题，故用字符串形式
 * TODO：因为暂时只支持加法，自己先实现，如果有其他场景考虑用现有库
 * @param arg1
 * @param arg2
 */
export function accAdd(arg1: number, arg2: number) {
  const [pre1, next1 = ''] = arg1?.toString()?.split('.');
  const [pre2, next2 = ''] = arg2?.toString()?.split('.');
  const r1 = next1?.length || 0;
  const r2 = next2?.length || 0;
  const m = Math.pow(10, Math.max(r1, r2));
  const suffix = Array(Math.abs(r1 - r2))
    .fill('0')
    ?.join('');
  const number1 = r2 > r1 ? `${pre1}${next1}${suffix}` : `${pre1}${next1}`;
  const number2 = r1 > r2 ? `${pre2}${next2}${suffix}` : `${pre2}${next2}`;

  return (Number.parseInt(number1, 10) + Number.parseInt(number2, 10)) / m;
}

/**
 * calculate sum value
 */
export const getDataSumByField = (data: DataItem[], field: string): number => {
  const sum = reduce(
    data,
    (pre, next) => {
      const fieldValue = get(next, field, 0);
      const v = isNotNumber(fieldValue)
        ? 0
        : Number.parseFloat(fieldValue) || Number(fieldValue);
      return accAdd(pre, v);
    },
    0,
  );
  return sum;
};
