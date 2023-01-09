import type { CustomTreeNode, S2DataConfig } from '@antv/s2';

export const customGridTreeNodes: CustomTreeNode[] = [
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
            field: 'a-1-1-1',
            title: '自定义节点 a-1-1-1',
            description: 'a-1-1-1 描述',
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
    children: [
      {
        field: 'a-2-1',
        title: '自定义节点 a-2-1',
        description: 'a-2-1 描述',
        children: [],
      },
      {
        field: 'a-2-2',
        title: '自定义节点 a-2-2',
        description: 'a-2-2 描述',
        children: [
          {
            field: 'measure-3',
            title: '指标3',
            description: '指标3描述',
            children: [],
          },
        ],
        collapsed: false,
      },
    ],
  },
  {
    field: 'a-3',
    title: '自定义节点 a-3',
    description: 'a-3 描述',
    children: [
      {
        field: 'a-3-1',
        title: '自定义节点 a-3-1',
        description: 'a-3-1 描述',
        children: [],
      },
      {
        field: 'a-3-2',
        title: '自定义节点 a-3-2',
        description: 'a-3-2 描述',
        children: [
          {
            field: 'measure-4',
            title: '指标4',
            description: '指标4描述',
            children: [],
          },
        ],
        collapsed: false,
      },
      {
        field: 'measure-5',
        title: '指标5',
        description: '指标5描述',
        children: [],
      },
    ],
  },
];

export const customRowGridFields: S2DataConfig['fields'] = {
  columns: ['type', 'sub_type'],
  rows: customGridTreeNodes,
  values: ['measure-1', 'measure-2', 'measure-3', 'measure-4', 'measure-5'],
  valueInCols: false,
};

export const customColGridFields: S2DataConfig['fields'] = {
  rows: ['type', 'sub_type'],
  columns: customGridTreeNodes,
  values: ['measure-1', 'measure-2', 'measure-3', 'measure-4', 'measure-5'],
  valueInCols: true,
};
