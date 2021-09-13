import { isObject } from 'lodash';
import { DataItem, MultiData } from '@/common/interface';

export const isMultiDataItem = (value: DataItem): value is MultiData => {
  return isObject(value) && 'values' in value;
};
