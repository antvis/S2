import { floor as innerFloor, isNumber } from 'lodash';

export function floor(value: number, precision = 2) {
  return innerFloor(value, precision);
}

/**
 * 向下取整, 避免向上取整后宽度超过实际宽度, 出现滚动条
 */
export function round(value: number) {
  if (!isNumber(value)) {
    return value;
  }

  return floor(value, 0);
}
