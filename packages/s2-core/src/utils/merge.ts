import { isArray, isEmpty, mergeWith } from 'lodash';
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

  return mergeWith({}, ...args);
};

export const getSafetyDataConfig = (dataConfig: Partial<S2DataConfig>) => {
  const result = customMerge(DEFAULT_DATA_CONFIG, dataConfig) as S2DataConfig;

  // 自定义树和数值为空的场景, 关闭 数值置于列头
  if (
    !isEmpty(result.fields.customTreeItems) ||
    isEmpty(result.fields.values)
  ) {
    result.fields.valueInCols = false;
  }
  return result;
};

export const getSafetyOptions = (options: Partial<S2Options>) =>
  customMerge(DEFAULT_OPTIONS, options);
