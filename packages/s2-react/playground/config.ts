import { S2DataConfig, S2Options } from '@antv/s2';
import { SliderSingleProps } from 'antd';
import { data, totalData, meta } from '../__tests__/data/mock-dataset.json';

export const tableSheetDataCfg: Partial<S2DataConfig> = {
  data,
  totalData,
  meta,
  fields: {
    columns: ['province', 'city', 'type', 'sub_type', 'number'],
    valueInCols: true,
  },
};

export const pivotSheetDataCfg: S2DataConfig = {
  data,
  totalData,
  meta,
  fields: {
    rows: ['province', 'city'],
    columns: ['type', 'sub_type'],
    values: ['number'],
    valueInCols: true,
  },
};

export const s2Options: S2Options = {
  debug: true,
  width: 600,
  height: 600,
};

export const sliderOptions: SliderSingleProps = {
  min: 0,
  max: 10,
  step: 0.1,
  marks: {
    0.2: '0.2',
    1: '1 (默认)',
    2: '2',
    10: '10',
  },
};
