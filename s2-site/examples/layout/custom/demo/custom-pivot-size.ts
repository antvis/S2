import { PivotSheet, S2Options, EXTRA_FIELD } from '@antv/s2';

fetch(
  'https://gw.alipayobjects.com/os/bmw-prod/2a5dbbc8-d0a7-4d02-b7c9-34f6ca63cff6.json',
)
  .then((res) => res.json())
  .then(async (dataCfg) => {
    const container = document.getElementById('container');

    // 详情请查看: https://s2.antv.antgroup.com/zh/docs/manual/advanced/custom/cell-size
    const s2Options: S2Options = {
      width: 600,
      height: 480,
      hierarchyType: 'grid',
      style: {
        dataCell: {
          width: 100,
          height: 90,
        },
        rowCell: {
          width: 100,
          // width: (rowNode) => 100,
          // height: (rowNode) => 100,
          heightByField: {
            // 特定维度 (如: 城市)
            city: 50,
            // 特定维值
            'root[&]浙江省[&]杭州市': 30,
            'root[&]浙江省[&]宁波市': 100,
          },
        },
        colCell: {
          // width: (colNode) => 100,
          // height: (colNode) => 100,
          widthByField: {
            // 默认 [数值挂列头], EXTRA_FIELD 为内部虚拟数值列
            [EXTRA_FIELD]: 60,
            // 特定维值
            'root[&]家具[&]沙发[&]number': 120,
          },
          heightByField: {
            // 特定维度 (如: 类别)
            type: 50,
            [EXTRA_FIELD]: 80,
          },
        },
      },
    };

    const s2 = new PivotSheet(container, dataCfg, s2Options);

    await s2.render();
  });
