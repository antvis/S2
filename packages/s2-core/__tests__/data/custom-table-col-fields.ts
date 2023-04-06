import type { CustomTreeNode } from '../../src/common';

export const customColSimpleColumns: CustomTreeNode[] = [
  {
    field: 'area',
    title: '地区',
    children: [
      { field: 'province', title: '省份' },
      { field: 'city', title: '城市' },
    ],
  },
  {
    field: 'type',
    title: '类型',
  },
  {
    field: 'money',
    title: '金额',
    children: [
      { field: 'price', title: '价格', description: '价格描述' },
      { field: 'number', title: '数量' },
    ],
  },
];

export const customColMultipleColumns: CustomTreeNode[] = [
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
            field: 'province',
            title: '指标1',
            description: '指标1描述',
            children: [],
          },
          {
            field: 'city',
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
