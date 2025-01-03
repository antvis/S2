import { floor as innerFloor, round as innerRound, isNumber } from 'lodash';

export function floor(value: number, precision = 2) {
  return innerFloor(value, precision);
}

export function round(value: number) {
  if (!isNumber(value)) {
    return value;
  }

  return innerRound(value);
}
