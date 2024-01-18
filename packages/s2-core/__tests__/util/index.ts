import { data, meta, totalData } from 'tests/data/mock-dataset.json';
import {
  DEFAULT_DATA_CONFIG,
  DEFAULT_OPTIONS,
  S2Event,
  SpreadSheet,
  type S2DataConfig,
  type S2Options,
} from '@/index';
import { customMerge } from '@/utils';

export const assembleOptions = (...options: Partial<S2Options>[]) => {
  const s2Options: S2Options = {
    debug: false,
    width: 600,
    height: 600,
  };

  return customMerge<S2Options>(DEFAULT_OPTIONS, s2Options, ...options);
};

export const assembleDataCfg = (...dataCfg: Partial<S2DataConfig>[]) => {
  const s2DataCfg: S2DataConfig = {
    fields: {
      rows: ['province', 'city'],
      columns: ['type', 'sub_type'],
      values: ['number'],
      valueInCols: true,
    },
    meta,
    data: data.concat(totalData as any),
  };

  return customMerge<S2DataConfig>(DEFAULT_DATA_CONFIG, s2DataCfg, ...dataCfg);
};

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

/**
 * 等待 render 异步执行工具函数
 * @param spreadsheet 表格实例
 * @param executeBlock 会触发 render 的执行代码块
 */
export const waitForRender = async (
  spreadsheet: SpreadSheet,
  executeBlock: () => void | Promise<void>,
) => {
  const renderPromise = new Promise((r) => {
    spreadsheet.once(S2Event.LAYOUT_AFTER_RENDER, () => r(true));
  });

  await executeBlock();

  return renderPromise;
};
