import { isArray, isEmpty, mergeWith, uniq, isEqual, forEach } from 'lodash';
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

/**
 * 当用户将 DataCfg 的属性设置为 undefined 时，使用默认值
 * @param dataCfg
 */
export const dataCfgPatch = (
  dataCfg: Partial<S2DataConfig>,
): Partial<S2DataConfig> => {
  const newDataCfg = {};
  forEach(dataCfg, (value, key) => {
    if (value === undefined) {
      newDataCfg[key] = DEFAULT_DATA_CONFIG[key];
    } else {
      newDataCfg[key] = value;
    }
  });
  return newDataCfg;
};

export const getSafetyDataConfig = (...dataConfig: Partial<S2DataConfig>[]) => {
  const result = customMerge(
    DEFAULT_DATA_CONFIG,
    ...dataConfig,
  ) as S2DataConfig;

  // fields 去重
  result.fields = uniqueFields(result.fields);

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
