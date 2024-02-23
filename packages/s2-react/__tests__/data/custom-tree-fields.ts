import type { S2DataConfig } from '@antv/s2';

export const customTreeFields: S2DataConfig['fields'] = {
  columns: ['type', 'sub_type'],
  values: [
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
      collapsed: false,
      children: [
        {
          field: 'measure-a',
          title: '指标A',
          description: '指标A描述',
          children: [
            {
              field: 'measure-b',
              title: '指标B',
              description: '指标B描述',
              children: [],
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
      title: '自定义节点E',
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
          collapsed: false,
        },
      ],
    },
  ],
  valueInCols: false,
};
