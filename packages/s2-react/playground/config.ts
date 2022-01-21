import type { S2DataConfig, S2Options } from '@antv/s2';
import type { SliderSingleProps } from 'antd';
import React from 'react';
import { data, totalData, meta } from '../__tests__/data/mock-dataset.json';

export const tableSheetDataCfg: Partial<S2DataConfig> = {
  data,
  totalData,
  meta: [
    {
      field: 'number',
      name: '数量数量数量数量数量数量数量数量数量数量数量数量数量数量数量数量',
      formatter: (v) => {
        return `${v} 元`;
      },
    },
    {
      field: 'province',
      name: '省份',
    },
    {
      field: 'city',
      name: '城市',
    },
    {
      field: 'type',
      name: '类别',
    },
    {
      field: 'sub_type',
      name: '子类别',
    },
  ],
  fields: {
    columns: ['province', 'city', 'type', 'sub_type', 'number'],
    valueInCols: true,
  },
};

export const pivotSheetDataCfg: S2DataConfig = {
  data,
  totalData,
  meta: [
    {
      field: 'number',
      name: '数量',
      formatter: (v) => {
        return `${v} 元`;
      },
    },
    {
      field: 'province',
      name: '省份',
    },
    {
      field: 'city',
      name: '城市',
    },
    {
      field: 'type',
      name: '类别',
    },
    {
      field: 'sub_type',
      name: '子类别',
    },
  ],
  fields: {
    rows: ['province', 'city'],
    columns: ['type', 'sub_type'],
    values: ['number'],
    valueInCols: true,
  },
};

export const s2Options: S2Options<React.ReactNode> = {
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
