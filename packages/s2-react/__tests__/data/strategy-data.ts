/* eslint-disable no-console */
import type { RawData } from '@antv/s2';
import { EXTRA_COLUMN_FIELD, isUpDataValue, type S2DataConfig } from '@antv/s2';
import { isNil } from 'lodash';
import type { SheetComponentOptions } from '../../src';

const getKPIMockData = () => {
  return {
    'measure-a': {
      originalValues: {
        measure: 0.75,
        target: 0.8,
      },
      values: {
        measure: '0.00251',
        target: '0.76',
      },
    },
    'measure-b': {
      originalValues: {
        measure: -0.82607,
        target: 0.53022,
      },
      values: {
        measure: -0.82607,
        target: 0.53022,
      },
    },
    'measure-c': {
      originalValues: {
        measure: 10.73922,
        target: 0.54396,
      },
      values: {
        measure: 10.73922,
        target: 0.54396,
      },
    },
    'measure-d': {
      originalValues: {
        measure: 0.5,
        target: 0.3,
      },
      values: {
        measure: '0.5',
        target: '0.3',
      },
    },
    'measure-e': {
      originalValues: {
        measure: 0.09775,
        target: 0.1978,
      },
      values: {
        measure: 0.09775,
        target: 0.1978,
      },
    },
    'measure-f': {
      originalValues: {
        measure: 0.25,
        target: 0.9,
      },
      values: {
        measure: '0.25',
        target: '0.9',
      },
    },
    date: '2021年净增完成度',
    [EXTRA_COLUMN_FIELD]: '净增完成度',
  };
};

// eslint-disable-next-line max-lines-per-function
const getMiniChartMockData = () => {
  return {
    'custom-node-1': {
      values: {
        type: 'line',
        data: [
          { year: '2018', value: -1 },
          { year: '2019', value: 1 },
          { year: '2020', value: 2 },
          { year: '2021', value: -100 },
          { year: '2022', value: 2 },
        ],
        encode: {
          x: 'year',
          y: 'value',
        },
      },
    },
    'measure-a': {
      values: {
        type: 'line',
        data: [
          { year: '2018', value: 100 },
          { year: '2019', value: 100 },
          { year: '2020', value: 100 },
          { year: '2021', value: 100 },
          { year: '2022', value: 100 },
        ],
        encode: {
          x: 'year',
          y: 'value',
        },
      },
    },
    'measure-b': {
      values: {
        type: 'bar',
        data: [
          { year: '2017', value: -368 },
          { year: '2018', value: 368 },
          { year: '2019', value: 368 },
          { year: '2020', value: 368 },
          { year: '2021', value: 368 },
          { year: '2022', value: 368 },
        ],
        encode: {
          x: 'year',
          y: 'value',
        },
      },
    },
    'measure-c': {
      values: {
        type: 'line',
        data: [
          {
            date: '2022-06-30',
            value: 0,
          },
          {
            date: '2022-07-01',
            value: 0,
          },
          {
            date: '2022-07-02',
            value: 8,
          },
          {
            date: '2022-07-03',
            value: 8,
          },
          {
            date: '2022-07-04',
            value: 8,
          },
          {
            date: '2022-07-05',
            value: 8,
          },
          {
            date: '2022-07-06',
            value: 0,
          },
        ],
        encode: {
          x: 'date',
          y: 'value',
        },
      },
    },
    'measure-d': {
      values: {
        type: 'line',
        data: [
          { year: '2018', value: 0 },
          { year: '2019', value: 0 },
          { year: '2020', value: 0 },
          { year: '2021', value: 0 },
          { year: '2022', value: 0 },
        ],
        encode: {
          x: 'year',
          y: 'value',
        },
      },
    },
    'measure-e': {
      values: {
        type: 'bar',
        data: [
          { year: '2018', value: -5 },
          { year: '2019', value: -10 },
          { year: '2020', value: -5 },
          { year: '2021', value: -10 },
        ],
        encode: {
          x: 'year',
          y: 'value',
        },
      },
    },
    date: '趋势',
    [EXTRA_COLUMN_FIELD]: '趋势',
  };
};

export const StrategySheetDataConfig: S2DataConfig = {
  // 普通数值+同环比数据
  data: [
    {
      date: '2022-09',
      [EXTRA_COLUMN_FIELD]: JSON.stringify(['数值', '环比', '同比']),
    },
    {
      'measure-a': {
        originalValues: [[377, '']],
        values: [[377, '']],
      },
      'measure-b': {
        originalValues: [[377, 324]],
        values: [[377, 324]],
      },
      'measure-c': {
        originalValues: [[null, 324]],
        values: [[null, 324]],
      },
      'measure-d': {
        originalValues: [[377, 324]],
        values: [[377, 324]],
      },
      'measure-f': {
        originalValues: [[377, 324]],
        values: [[377, 324]],
      },
      date: '2022-10',
      [EXTRA_COLUMN_FIELD]: JSON.stringify(['数值', '环比']),
    },
    {
      'measure-a': {
        originalValues: [[3877, 4324, 0.42]],
        values: [
          [3877, 4324, '42%'],
          [877, 324, '2%'],
        ],
      },
      'measure-b': {
        originalValues: [[377, 324, -0.02]],
        values: [[377, 324, '-0.02']],
      },
      'measure-c': {
        originalValues: [[377, 0, null]],
        values: [[377, 0, null]],
      },
      'measure-d': {
        originalValues: [[377, 324, 0.02]],
        values: [[377, 324, '0.02']],
      },
      'measure-e': {
        originalValues: [[377, 324, 0.02]],
        values: [[377, 324, '0.02']],
      },
      'measure-f': {
        originalValues: [[377, 324, 0.02]],
        values: [[377, 324, '0.02']],
      },
      date: '2022-11',
      [EXTRA_COLUMN_FIELD]: JSON.stringify(['数值', '环比', '同比']),
    },

    // 净增目标完成度子弹图数据
    getKPIMockData() as unknown as RawData,

    // 趋势图数据
    getMiniChartMockData() as unknown as RawData,
    {
      'measure-a': {
        originalValues: [[377, '']],
        values: [[377, '']],
      },
      'measure-b': {
        originalValues: [[377, 324]],
        values: [[377, 324]],
      },
      'measure-c': {
        originalValues: [[null, 324]],
        values: [[null, 324]],
      },
      'measure-d': {
        originalValues: [[377, 324]],
        values: [[377, 324]],
      },
      'measure-f': {
        originalValues: [[377, 324]],
        values: [[377, 324]],
      },
      date: '2022',
      [EXTRA_COLUMN_FIELD]: JSON.stringify(['数值', '环比']),
    },
  ],
  meta: [
    {
      field: 'date',
      name: '日期',
    },
  ],
  fields: {
    columns: ['date', EXTRA_COLUMN_FIELD],
    values: [
      'custom-node-1',
      'measure-a',
      'measure-b',
      'measure-c',
      'measure-d',
      'measure-e',
      'measure-f',
    ],
    rows: [
      {
        field: 'custom-node-1',
        title: '自定义节点A',
        description: '自定义节点A描述',
        children: [
          {
            field: 'measure-a',
            title: '指标A',
            description: '指标A描述',
            children: [
              {
                field: 'measure-b',
                title: '指标B',
                children: [],
                description: '指标B描述',
              },
              {
                field: 'custom-node-2',
                title: '自定义节点B',
                description: '自定义节点B描述',
                children: [],
              },
              {
                field: 'measure-c',
                title: '指标C',
                description: '指标C描述',
                children: [],
              },
              {
                field: 'measure-d',
                title: '指标D',
                description: '指标D描述',
                children: [],
              },
            ],
          },
          {
            field: 'custom-node-5',
            title: '自定义节点E',
            description: '自定义节点E描述',
            children: [],
          },
        ],
      },
      {
        field: 'measure-e',
        title: '指标E',
        description: '指标E描述',
        children: [
          {
            field: 'custom-node-3',
            title: '自定义节点C',
            description: '自定义节点C描述',
            children: [],
          },
          {
            field: 'custom-node-4',
            title: '自定义节点D',
            description: '自定义节点D描述',
            children: [
              {
                field: 'measure-f',
                title: '指标F',
                description: '指标F描述',
                children: [],
              },
            ],
            collapsed: true,
          },
        ],
      },
    ],
  },
};

export const StrategyOptions: SheetComponentOptions = {
  height: 800,
  cornerText: '指标',
  placeholder: (v) => (v?.['fieldValue'] ? '-' : ''),
  interaction: {
    selectedCellsSpotlight: true,
    resize: {
      disable: (resizeInfo) => {
        return (
          resizeInfo.meta.value === '净增完成度' &&
          resizeInfo.resizedWidth! <= 280
        );
      },
    },
  },
  headerActionIcons: [
    {
      icons: ['Trend'],
      belongsCell: 'rowCell',
      defaultHide: true,
      onHover: (params) => {
        console.log('trend icon hover:', params);
      },
      onClick: (params) => {
        console.log('trend icon click:', params);
      },
    },
  ],
  conditions: {
    text: [
      {
        mapping: (value, cellInfo) => {
          const { colIndex } = cellInfo;
          const isNilValue = isNil(value) || value === '';

          if (colIndex === 0 || isNilValue) {
            return {
              fill: '#000',
            };
          }

          return {
            fill: isUpDataValue(value) ? '#FF4D4F' : '#29A294',
          };
        },
      },
    ],
    icon: [
      {
        field: 'number',
        position: 'left',
        mapping(value, cellInfo) {
          const { colIndex } = cellInfo;

          if (colIndex === 0) {
            return null;
          }

          return isUpDataValue(value)
            ? {
                // icon 用于指定图标条件格式所使用的 icon 类型
                icon: 'CellUp',
                fill: '#FF4D4F',
              }
            : {
                icon: 'CellDown',
                fill: '#29A294',
              };
        },
      },
    ],
  },
  style: {
    dataCell: {
      height: 76,
      valuesCfg: {
        originalValueField: 'originalValues',
      },
    },
  },
};
