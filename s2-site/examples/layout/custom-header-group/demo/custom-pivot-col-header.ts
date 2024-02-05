import { CustomTreeNode, PivotSheet, S2DataConfig, S2Options } from '@antv/s2';

const customTree: CustomTreeNode[] = [
  {
    field: 'a-1',
    title: '自定义节点 a-1',
    description: 'a-1 描述',
    children: [
      {
        field: 'a-1-1',
        title: '自定义节点 a-1-1',
        description: 'a-1-1 描述',
        children: [
          {
            field: 'measure-1',
            title: '指标 1',
            description: '指标 1 描述',
            children: [],
          },
          {
            field: 'measure-2',
            title: '指标 2',
            description: '指标 2 描述',
            children: [],
          },
        ],
      },
      {
        field: 'a-1-2',
        title: '自定义节点 a-1-2',
        description: 'a-1-2 描述',
        children: [],
      },
    ],
  },
  {
    field: 'a-2',
    title: '自定义节点 a-2',
    description: 'a-2 描述',
    children: [],
  },
];

const data = [
  {
    'measure-1': 13,
    'measure-2': 2,
    type: '家具',
    sub_type: '桌子',
  },
  {
    'measure-1': 11,
    'measure-2': 8,
    type: '家具',
    sub_type: '椅子',
  },
];

async function render() {
  const container = document.getElementById('container');

  const s2DataConfig: S2DataConfig = {
    fields: {
      columns: customTree,
      rows: ['type', 'sub_type'],
      values: ['measure-1', 'measure-2'],
      valueInCols: true,
    },
    data,
    // 自定义节点默认使用 `title` 作为展示名, 也可以通过 meta 来统一进行格式化
    meta: [
      {
        field: 'type',
        formatter: (value) => '商品类别',
      },
      {
        field: 'sub_type',
        formatter: (value) => '商品子类别',
      },
      {
        field: 'a-1',
        name: '角头1',
      },
      {
        field: 'a-1-1',
        name: '角头2',
      },
      // 自定义格式化数值
      // {
      //   field: 'measure-1',
      //   formatter: (value, record, meta) => `指标: ${value}`,
      // },
    ],
  };

  const s2Options: S2Options = {
    width: 600,
    height: 480,
    hierarchyType: 'grid',
  };

  const s2 = new PivotSheet(container, s2DataConfig, s2Options);

  await s2.render();
}

render();
