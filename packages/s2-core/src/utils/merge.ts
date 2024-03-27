import { isArray, isEmpty, isEqual, isString, mergeWith, uniq } from 'lodash';
import { DEFAULT_DATA_CONFIG } from '../common/constant/dataConfig';
import { DEFAULT_OPTIONS, LayoutWidthType } from '../common/constant/options';
import type {
  CustomHeaderFields,
  Fields,
  S2DataConfig,
  S2Options,
} from '../common/interface';

export const customMerge = <T = unknown>(...objects: unknown[]): T => {
  const customize = (origin: unknown, updated: unknown) => {
    if (isArray(origin) && isArray(updated)) {
      return updated;
    }
  };
  const args = [...objects, customize] as [unknown, unknown];

  return mergeWith({}, ...args);
};

const uniqueFields = (fields: Fields): Fields => {
  const keys = ['rows', 'columns', 'values'] as const;
  const result: Partial<Fields> = keys.reduce<Fields>((r, key) => {
    const list = fields[key];
    const unique = uniq(list) as CustomHeaderFields & string[];

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

export const setupDataConfig = (
  ...dataConfig: (Partial<S2DataConfig> | null | undefined)[]
): S2DataConfig => {
  const mergedDataCfg = customMerge<S2DataConfig>(
    DEFAULT_DATA_CONFIG,
    ...dataConfig,
  );

  // fields 去重
  mergedDataCfg.fields = uniqueFields(mergedDataCfg.fields);

  // 自定义树和数值为空的场景, 关闭 数值置于列头
  const isCustomRows = mergedDataCfg.fields.rows?.some(
    (field) => !isString(field),
  );
  const isEmptyValues = isEmpty(mergedDataCfg.fields.values);

  if (isCustomRows || isEmptyValues) {
    mergedDataCfg.fields.valueInCols = false;
  }

  return mergedDataCfg;
};

export const setupOptions = (
  options: Partial<S2Options> | null | undefined,
): S2Options => {
  const mergedOptions = customMerge<S2Options>(DEFAULT_OPTIONS, options);

  if (
    mergedOptions.style?.layoutWidthType === LayoutWidthType.Compact &&
    mergedOptions.style?.dataCell!.maxLines! <= 1
  ) {
    mergedOptions.style.dataCell!.wordWrap = false;
  }

  return mergedOptions;
};
