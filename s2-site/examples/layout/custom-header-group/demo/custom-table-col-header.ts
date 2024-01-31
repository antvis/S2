import { CustomTreeNode, TableSheet, S2DataConfig, S2Options } from '@antv/s2';

export const tableSheetMultipleColumns: CustomTreeNode[] = [
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

fetch('https://assets.antv.antgroup.com/s2/basic-table-mode.json')
  .then((res) => res.json())
  .then(async (data) => {
    const container = document.getElementById('container');
    const s2DataConfig: S2DataConfig = {
      fields: {
        columns: tableSheetMultipleColumns,
      },
      data,
      // 自定义节点默认使用 `title` 作为展示名, 也可以通过 meta 来统一进行格式化
      meta: [
        {
          field: 'area',
          formatter: (value) => '当前节点自定义名称1',
        },
        {
          field: 'number',
          formatter: (value) => '1',
        },
      ],
    };

    const s2Options: S2Options = {
      width: 600,
      height: 480,
      seriesNumber: {
        enable: true
      }
    };

    const s2 = new TableSheet(container, s2DataConfig, s2Options);

    await s2.render();
  });
