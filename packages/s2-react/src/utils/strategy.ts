import { isNumber } from 'lodash';

export const isUpDerivedValue = (value: number | string): boolean => {
  if (isNumber(value)) {
    return value >= 0;
  }

  return !/^-/.test(value);
};
