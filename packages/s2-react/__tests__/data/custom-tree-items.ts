export const customTreeItems = [
  {
    title: '自定义节点A',
    key: 'custom-node-1',
    children: [
      {
        title: '指标A',
        key: 'measure-a',
        children: [
          { title: '指标B', key: 'measure-b' },
          { title: '自定义节点B', key: 'custom-node-2' },
          { title: '指标C', key: 'measure-c' },
        ],
      },
      {
        title: '自定义节点E',
        key: 'custom-node-5',
      },
    ],
  },
  {
    title: '指标E',
    key: 'measure-e',
    children: [
      { title: '自定义节点C', key: 'custom-node-3' },
      {
        title: '自定义节点D',
        key: 'custom-node-4',
        collapsed: true,
        children: [{ title: '指标F', key: 'measure-f' }],
      },
    ],
  },
];
