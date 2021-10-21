import { isArray, isEmpty, merge, mergeWith } from 'lodash';
import { DEFAULT_OPTIONS } from '../common/constant/options';
import { S2DataConfig, S2Options } from '@/common/interface';
import { DEFAULT_DATA_CONFIG } from '@/common/constant/dataConfig';

export const customMerge = (...objects: unknown[]) => {
  const customize = (origin: unknown, updated: unknown) => {
    if (isArray(origin) && isArray(updated)) {
      return updated;
    }
  };
  const args = [...objects, customize] as [unknown, unknown];

  return mergeWith(...args);
};

export const getSafetyDataConfig = (dataConfig: Partial<S2DataConfig>) => {
  const result = merge({}, DEFAULT_DATA_CONFIG, dataConfig) as S2DataConfig;
  if (!isEmpty(result.fields.customTreeItems)) {
    // when there are custom tree config, valueInCols must be false
    result.fields.valueInCols = false;
  }
  return result;
};

export const getSafetyOptions = (options: Partial<S2Options>) =>
  merge({}, DEFAULT_OPTIONS, options);
