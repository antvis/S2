import { PivotSheet, S2DataConfig, S2Options } from '@antv/s2';

fetch(
  'https://gw.alipayobjects.com/os/bmw-prod/af54ea12-01d7-4696-a51c-c4d5e4ede28e.json',
)
  .then((res) => res.json())
  .then((res) => {
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

    s2.render();
  });
