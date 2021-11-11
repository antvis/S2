import { isArray, mergeWith } from 'lodash';
import { data, totalData, meta } from '../data/mock-dataset.json';
import {
  DEFAULT_OPTIONS,
  S2DataConfig,
  S2Options,
  DEFAULT_DATA_CONFIG,
} from '@/index';

export const assembleOptions = (...options: Partial<S2Options>[]) =>
  mergeWith(
    {},
    DEFAULT_OPTIONS,
    { debug: true, width: 1000, height: 600 },
    ...options,
    (origin, updated) => {
      if (isArray(origin) && isArray(updated)) {
        return updated;
      }
    },
  );

export const assembleDataCfg = (...dataCfg: Partial<S2DataConfig>[]) =>
  mergeWith(
    {},
    DEFAULT_DATA_CONFIG,
    {
      fields: {
        rows: ['province', 'city'],
        columns: ['type', 'sub_type'],
        values: ['number'],
        valueInCols: true,
      },
      meta,
      data,
      totalData,
    },
    ...dataCfg,
    (origin, updated) => {
      if (isArray(origin) && isArray(updated)) {
        return updated;
      }
    },
  );
