import type { CustomTreeNode, S2DataConfig } from '@antv/s2';

const headerFields: CustomTreeNode[] = [
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
            title: '指标1',
            description: '指标1描述',
            children: [],
          },
          {
            field: 'measure-2',
            title: '指标2',
            description: '指标2描述',
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

export const customRowGridSimpleFields: S2DataConfig['fields'] = {
  columns: ['type', 'sub_type'],
  rows: headerFields,
  values: ['measure-1', 'measure-2'],
  valueInCols: false,
};

export const customColGridSimpleFields: S2DataConfig['fields'] = {
  rows: ['type', 'sub_type'],
  columns: headerFields,
  values: ['measure-1', 'measure-2'],
  valueInCols: true,
};
