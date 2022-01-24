import { data, totalData, meta } from 'tests/data/mock-dataset.json';
import {
  DEFAULT_OPTIONS,
  S2DataConfig,
  S2Options,
  DEFAULT_DATA_CONFIG,
} from '@/index';
import { customMerge } from '@/utils';

export const assembleOptions = (...options: Partial<S2Options>[]) =>
  customMerge(
    DEFAULT_OPTIONS,
    { debug: true, width: 600, height: 600 },
    ...options,
  );

export const assembleDataCfg = (...dataCfg: Partial<S2DataConfig>[]) =>
  customMerge(
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
  );

export const TOTALS_OPTIONS = {
  row: {
    showGrandTotals: true,
    showSubTotals: true,
    subTotalsDimensions: ['province', 'city'],
  },
  col: {
    showGrandTotals: true,
    showSubTotals: true,
    subTotalsDimensions: ['type', 'sub_type'],
  },
};
