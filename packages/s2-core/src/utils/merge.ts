import { isArray, isEmpty, mergeWith, uniq, isEqual, isString } from 'lodash';
import { DEFAULT_DATA_CONFIG } from '../common/constant/dataConfig';
import { DEFAULT_OPTIONS } from '../common/constant/options';
import type { S2DataConfig, S2Options, Fields } from '../common/interface';

export const customMerge = (...objects: unknown[]) => {
  const customize = (origin: unknown, updated: unknown) => {
    if (isArray(origin) && isArray(updated)) {
      return updated;
    }
  };
  const args = [...objects, customize] as [unknown, unknown];

  return mergeWith({}, ...args);
};

const uniqueFields = (fields: Fields) => {
  const keys = ['rows', 'columns', 'values'] as const;
  const result: Partial<Fields> = keys.reduce((r, key) => {
    const list = fields[key];
    const unique = uniq(list);
    if (!isEqual(unique, list)) {
      // eslint-disable-next-line no-console
      console.warn(`fields.${key}:[${list}] should be unique`);
    }
    r[key] = unique;
    return r;
  }, {});

  return {
    ...fields,
    ...result,
  };
};

export const getSafetyDataConfig = (...dataConfig: Partial<S2DataConfig>[]) => {
  const mergedDataCfg = customMerge(
    DEFAULT_DATA_CONFIG,
    ...dataConfig,
  ) as S2DataConfig;

  // fields 去重
  mergedDataCfg.fields = uniqueFields(mergedDataCfg.fields);

  // 自定义树和数值为空的场景, 关闭 数值置于列头
  const isCustomRows = mergedDataCfg.fields.rows.some(
    (field) => !isString(field),
  );
  const isEmptyValues = isEmpty(mergedDataCfg.fields.values);

  if (isCustomRows || isEmptyValues) {
    mergedDataCfg.fields.valueInCols = false;
  }

  return mergedDataCfg;
};

export const getSafetyOptions = (options: Partial<S2Options>) =>
  customMerge(DEFAULT_OPTIONS, options);
