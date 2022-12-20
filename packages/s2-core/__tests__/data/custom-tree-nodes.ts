export const customTreeNodes = [
  {
    title: '自定义节点A',
    field: 'custom-node-1',
    children: [
      {
        title: '指标A',
        field: 'measure-a',
        children: [
          { title: '指标B', field: 'measure-b' },
          { title: '自定义节点B', field: 'custom-node-2' },
          { title: '指标C', field: 'measure-c' },
        ],
      },
      {
        title: '自定义节点E',
        field: 'custom-node-5',
      },
    ],
  },
  {
    title: '指标E',
    field: 'measure-e',
    children: [
      { title: '自定义节点C', field: 'custom-node-3' },
      {
        title: '自定义节点D',
        field: 'custom-node-4',
        collapsed: true,
        children: [{ title: '指标F', field: 'measure-f' }],
      },
    ],
  },
];
