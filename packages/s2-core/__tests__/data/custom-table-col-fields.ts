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
