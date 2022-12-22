import { data, totalData, meta } from 'tests/data/mock-dataset.json';
import {
  DEFAULT_OPTIONS,
  type S2DataConfig,
  type S2Options,
  DEFAULT_DATA_CONFIG,
} from '@/index';
import { customMerge } from '@/utils';

export const assembleOptions = (...options: Partial<S2Options>[]) =>
  customMerge<S2Options>(
    DEFAULT_OPTIONS,
    { debug: false, width: 600, height: 600 },
    ...options,
  );

export const assembleDataCfg = (...dataCfg: Partial<S2DataConfig>[]) =>
  customMerge<S2DataConfig>(
    DEFAULT_DATA_CONFIG,
    {
      fields: {
        rows: ['province', 'city'],
        columns: ['type', 'sub_type'],
        values: ['number'],
        valueInCols: true,
      },
      meta,
      data: data.concat(totalData as any),
    },
    ...dataCfg,
  );

export const TOTALS_OPTIONS: S2Options['totals'] = {
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
