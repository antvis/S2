import { PivotSheet, S2DataConfig, S2Options } from '@antv/s2';

fetch(
  'https://gw.alipayobjects.com/os/bmw-prod/cd9814d0-6dfa-42a6-8455-5a6bd0ff93ca.json',
)
  .then((res) => res.json())
  .then(async (res) => {
    const container = document.getElementById('container');
    const s2DataConfig: S2DataConfig = {
      fields: {
        rows: ['province', 'city'],
        columns: ['type', 'sub_type'],
        values: ['number'],
      },
      data: res.data,
    };

    const s2Options: S2Options = {
      width: 600,
      height: 480,
      layoutCoordinate: (spreadsheet, rowNode, colNode) => {
        // layoutCoordinate 用于改变行列叶子结点的尺寸（长、宽）和坐标（x、y）
        // 改变「宁波市」节点高度
        console.log(rowNode);
        console.log(colNode);
        if (rowNode?.value === '宁波市') {
          rowNode.height = 100;
        }
      },
    };

    const s2 = new PivotSheet(container, s2DataConfig, s2Options);

    await s2.render();
  });
