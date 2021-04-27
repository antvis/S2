import {
  Data,
  DerivedValue,
  Fields,
  Meta,
  SortParams,
  StrategyValue,
} from 'src/common/interface/index';
import { merge } from 'lodash';
/**
 * Create By Bruce Too
 * On 2021/4/27
 */
export interface S2DataConfig {
  // origin detail data
  data: Record<string, string | number>[];
  // total data(grandTotal, subTotal)
  totalData: Record<string, string | number>[];
  // data keys for render row,columns,values etc
  fields: Fields;
  // data keys mata info
  meta?: Meta[];
  // field sort info
  sortParams?: SortParams;
  // extra config
  [key: string]: any;
}

export const defaultDataConfig = {
  data: [],
  fields: {
    rows: [],
    columns: [],
    values: [],
    derivedValues: [],
  },
  meta: [],
  sortParams: [],
} as S2DataConfig;

export const safetyDataConfig = (dataConfig: S2DataConfig) =>
  merge({}, defaultDataConfig, dataConfig);
