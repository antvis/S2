import { PivotSheet, S2DataConfig, S2Options } from '@antv/s2';

fetch(
  'https://render.alipay.com/p/yuyan/180020010001215413/s2/custom-tree.json',
)
  .then((res) => res.json())
  .then(async (res) => {
    const container = document.getElementById('container');
    const s2DataConfig: S2DataConfig = {
      fields: {
        rows: res.customTreeItem,
        columns: ['type', 'sub_type'],
        values: [
          'measure-a',
          'measure-b',
          'measure-c',
          'measure-d',
          'measure-e',
          'measure-f',
        ],
        valueInCols: false,
      },
      data: res.data,
    };

    const s2Options: S2Options = {
      width: 600,
      height: 480,
      hierarchyType: 'tree',
      // cornerText: '自定义角头标题',
    };

    const s2 = new PivotSheet(container, s2DataConfig, s2Options);

    await s2.render();
  });
