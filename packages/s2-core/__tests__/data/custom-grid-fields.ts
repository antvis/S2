import type { CustomTreeItem, S2DataConfig } from '@antv/s2';

export const customGridFields: CustomTreeItem[] = [
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
            key: 'a-1-1-1',
            title: '自定义节点 a-1-1-1',
            description: 'a-1-1-1 描述',
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
    children: [
      {
        key: 'a-2-1',
        title: '自定义节点 a-2-1',
        description: 'a-2-1 描述',
        children: [],
      },
      {
        key: 'a-2-2',
        title: '自定义节点 a-2-2',
        description: 'a-1-2 描述',
        children: [
          {
            key: 'measure-3',
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
    key: 'a-3',
    title: '自定义节点 a-3',
    description: 'a-3 描述',
    children: [
      {
        key: 'a-3-1',
        title: '自定义节点 a-3-1',
        description: 'a-3-1 描述',
        children: [],
      },
      {
        key: 'a-3-2',
        title: '自定义节点 a-3-2',
        description: 'a-3-2 描述',
        children: [
          {
            key: 'measure-4',
            title: '指标4',
            description: '指标4描述',
            children: [],
          },
        ],
        collapsed: false,
      },
      {
        key: 'measure-5',
        title: '指标5',
        description: '指标5描述',
        children: [],
      },
    ],
  },
];

export const customRowGridFields: S2DataConfig['fields'] = {
  columns: ['type', 'sub_type'],
  rows: customGridFields,
  values: ['measure-1', 'measure-2', 'measure-3', 'measure-4', 'measure-5'],
  valueInCols: false,
};

export const customColGridFields: S2DataConfig['fields'] = {
  rows: ['type', 'sub_type'],
  columns: customGridFields,
  values: ['measure-1', 'measure-2', 'measure-3', 'measure-4', 'measure-5'],
  valueInCols: true,
};
