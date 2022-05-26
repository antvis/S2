import { EXTRA_COLUMN_FIELD, S2DataConfig } from '@antv/s2';

export const customTree: S2DataConfig = {
  data: [
    {
      'measure-a': {
        originalValues: [[3877, 4324, 0.42]],
        values: [[3877, 4324, '42%']],
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
    rows: [],
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
