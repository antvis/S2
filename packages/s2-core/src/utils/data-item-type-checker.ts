import { isObject } from 'lodash';
import type { DataItem, MultiData } from '../common/interface';

export const isMultiDataItem = (value: DataItem): value is MultiData =>
  isObject(value) && 'values' in value;
