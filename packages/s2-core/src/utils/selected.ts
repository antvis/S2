import * as _ from 'lodash';
import { Selected } from '../common/store';

const inRange = (idx: number, start: number, end: number) => {
  return idx >= start && idx <= end;
};

const inMultiple = (idx: number, arr: number[]) => {
  // 当做普通数值使用，每个参数都是唯一的id，去精准匹配单个数值中的id
  return arr.findIndex((value) => value === idx) !== -1;
};

/**
 * i，j 位置的单元格是否选中
 * @param i
 * @param j
 * @param selected
 */
export const isSelected = (
  i: number,
  j: number,
  selected: Selected,
): boolean => {
  if (_.isFunction(selected)) {
    return selected(i, j);
  }

  if (_.isObject(selected)) {
    const { type, indexes } = selected;
    const [ii, jj] = indexes;

    if (type === 'row') {
      return _.isNumber(ii) ? ii === i : inRange(i, ii[0], ii[1]);
    }
    if (type === 'column') {
      return _.isNumber(jj) ? jj === j : inRange(j, jj[0], jj[1]);
    }
    if (type === 'column-multiple') {
      return _.isNumber(jj) ? jj === j : inMultiple(j, jj);
    }
    if (type === 'cell') {
      return ii === i && jj === j;
    }
    if (type === 'brush') {
      return inRange(i, ii[0], ii[1]) && inRange(j, jj[0], jj[1]);
    }
    if (type === 'row&col') {
      return ii === i || jj === j;
    }
  }

  return false;
};
