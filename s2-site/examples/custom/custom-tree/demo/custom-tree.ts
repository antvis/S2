import { PivotSheet } from '@antv/s2';

fetch(
  'https://render.alipay.com/p/yuyan/180020010001215413/s2/custom-tree.json',
)
  .then((res) => res.json())
  .then((res) => {
    const container = document.getElementById('container');
    const s2DataConfig = {
      fields: {
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
        customTreeItems: res.customTreeItem,
        valueInCols: false,
      },
      data: res.data,
    };
    const s2Options = {
      width: 600,
      height: 480,
      hierarchyType: 'customTree',
    };
    const s2 = new PivotSheet(container, s2DataConfig, s2Options);
    s2.render();
  });
