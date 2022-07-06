import { EXTRA_COLUMN_FIELD, type S2DataConfig } from '@antv/s2';

const getKPIMockData = () => {
  return {
    'measure-a': {
      originalValues: {
        measure: 0.75,
        target: 0.8,
      },
      values: {
        measure: '0.75',
        target: '0.8',
      },
    },
    'measure-b': {
      originalValues: {
        measure: 0.25,
        target: 0.8,
      },
      values: {
        measure: '0.25',
        target: '0.8',
      },
    },
    'measure-c': {
      originalValues: {
        measure: 1,
        target: 0.3,
      },
      values: {
        measure: '1',
        target: '0.3',
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
        measure: 0.68,
        target: 0.8,
      },
      values: {
        measure: '0.68',
        target: '0.8',
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

const getMiniChartMockData = () => {
  return {
    'measure-a': {
      values: {
        type: 'line',
        data: [
          { year: '2018', value: 15468 },
          { year: '2019', value: 16100 },
          { year: '2020', value: 15900 },
          { year: '2021', value: 17409 },
          { year: '2022', value: 17000 },
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
          { year: '2017', value: 368 },
          { year: '2018', value: 168 },
          { year: '2019', value: 160 },
          { year: '2020', value: 290 },
          { year: '2021', value: 149 },
          { year: '2022', value: 300 },
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
          { year: '2018', value: 154 },
          { year: '2019', value: 161 },
          { year: '2020', value: 159 },
          { year: '2021', value: 174 },
          { year: '2022', value: 170 },
        ],
        encode: {
          x: 'year',
          y: 'value',
        },
      },
    },
    'measure-d': {
      values: {
        type: 'line',
        data: [
          { year: '2018', value: 68 },
          { year: '2019', value: 100 },
          { year: '2020', value: 900 },
          { year: '2021', value: 409 },
          { year: '2022', value: 300 },
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
          { year: '2017', value: 568 },
          { year: '2018', value: 368 },
          { year: '2019', value: 550 },
          { year: '2020', value: 900 },
          { year: '2021', value: 409 },
          { year: '2022', value: 230 },
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
  data: [
    // 普通数值+同环比数据
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
      date: '2021',
      [EXTRA_COLUMN_FIELD]: JSON.stringify(['数值', '环比', '同比']),
    },
    // 净增目标完成度子弹图数据
    getKPIMockData(),
    // 趋势图数据
    getMiniChartMockData(),
    {
      'measure-a': {
        originalValues: [[377, '', 0.02]],
        values: [[377, '', '0.02']],
      },
      'measure-b': {
        originalValues: [[377, 324, 0.02]],
        values: [[377, 324, '0.02']],
      },
      'measure-c': {
        originalValues: [[null, 324, 0.02]],
        values: [[null, 324, '0.02']],
      },
      'measure-d': {
        originalValues: [[377, 324, 0.02]],
        values: [[377, 324, '0.02']],
      },
      'measure-f': {
        originalValues: [[377, 324, 0.02]],
        values: [[377, 324, '0.02']],
      },
      date: '2022',
      [EXTRA_COLUMN_FIELD]: JSON.stringify(['数值', '环比', '同比']),
    },
  ],
  meta: [
    {
      field: 'date',
      name: '时间',
    },
  ],
  fields: {
    columns: ['date', EXTRA_COLUMN_FIELD],
    values: [
      'measure-a',
      'measure-b',
      'measure-c',
      'measure-d',
      'measure-e',
      'measure-f',
    ],
    customTreeItems: [
      {
        key: 'custom-node-1',
        title: '自定义节点A',
        description: '自定义节点A描述',
        children: [
          {
            key: 'measure-a',
            title: '指标A',
            description: '指标A描述',
            children: [
              {
                key: 'measure-b',
                title: '指标B',
                children: [],
                description: '指标B描述',
              },
              {
                key: 'custom-node-2',
                title: '自定义节点B',
                description: '自定义节点B描述',
                children: [],
              },
              {
                key: 'measure-c',
                title: '指标C',
                description: '指标C描述',
                children: [],
              },
              {
                key: 'measure-d',
                title: '指标D',
                description: '指标D描述',
                children: [],
              },
            ],
          },
          {
            key: 'custom-node-5',
            title: '自定义节点E',
            description: '自定义节点E描述',
            children: [],
          },
        ],
      },
      {
        key: 'measure-e',
        title: '指标E',
        description: '指标E描述',
        children: [
          {
            key: 'custom-node-3',
            title: '自定义节点C',
            description: '自定义节点C描述',
            children: [],
          },
          {
            key: 'custom-node-4',
            title: '自定义节点D',
            description: '自定义节点D描述',
            children: [
              {
                key: 'measure-f',
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
