export const customTreeFields = {
  rows: [],
  columns: ['type', 'sub_type'],
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
      children: [
        {
          key: 'measure-a',
          title: '指标A',
          children: [
            {
              key: 'measure-b',
              title: '指标B',
              children: [],
            },
            {
              key: 'custom-node-2',
              title: '自定义节点B',
              children: [],
            },
            {
              key: 'measure-c',
              title: '指标C',
              children: [],
            },
          ],
        },
        {
          key: 'custom-node-5',
          title: '自定义节点E',
          children: [],
        },
      ],
    },
    {
      key: 'measure-e',
      title: '指标E',
      children: [
        {
          key: 'custom-node-3',
          title: '自定义节点C',
          children: [],
        },
        {
          key: 'custom-node-4',
          title: '自定义节点D',
          children: [
            {
              key: 'measure-f',
              title: '指标F',
              children: [],
            },
          ],
          collapsed: true,
        },
      ],
    },
  ],
  valueInCols: false,
};
