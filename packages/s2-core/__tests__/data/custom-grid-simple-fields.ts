import type { S2DataConfig } from '@antv/s2';

export const customGridSimpleFields: S2DataConfig['fields'] = {
  columns: ['type', 'sub_type'],
  rows: [
    {
      key: 'a-1',
      title: '自定义节点 a-1',
      description: 'a-1 描述',
      children: [
        {
          key: 'a-1-1',
          title: '自定义节点 a-1-1',
          description: 'a-1-1 描述',
          children: [
            {
              key: 'measure-1',
              title: '指标1',
              description: '指标1描述',
              children: [],
            },
            {
              key: 'measure-2',
              title: '指标2',
              description: '指标2描述',
              children: [],
            },
          ],
        },
        {
          key: 'a-1-2',
          title: '自定义节点 a-1-2',
          description: 'a-1-2 描述',
          children: [],
        },
      ],
    },
    {
      key: 'a-2',
      title: '自定义节点 a-2',
      description: 'a-2 描述',
      children: [],
    },
  ],
  values: ['measure-1', 'measure-2'],
  valueInCols: true,
};
