import { isObject } from 'lodash';
import { DataItem, MultiData } from 'src/common/interface';

export const isMultiValue = (value: DataItem): value is MultiData => {
  return isObject(value) && 'value' in value;
};
