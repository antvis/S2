import { floor as innerFloor } from 'lodash';

export function floor(value: number, precision = 2) {
  return innerFloor(value, precision);
}
