import { PivotSheet, S2Options, EXTRA_FIELD } from '@antv/s2';

fetch(
  'https://gw.alipayobjects.com/os/bmw-prod/2a5dbbc8-d0a7-4d02-b7c9-34f6ca63cff6.json',
)
  .then((res) => res.json())
  .then(async (dataCfg) => {
    const container = document.getElementById('container');

    const s2Options: S2Options = {
      width: 600,
      height: 480,
      hierarchyType: 'grid',
      style: {
        colCell: {
          // 隐藏全部列头
          height: 0,
          heightByField: {
            // 隐藏部分维度 (类别/子类别)
            // type: 0,
            // sub_type: 0,
            // EXTRA_FIELD 对应 [数量] 这一虚拟维度列
            [EXTRA_FIELD]: 30,
          },
        },
      },
    };

    const s2 = new PivotSheet(container, dataCfg, s2Options);

    // 默认列头有一条分割线, 如果不需要的话将分割线的透明度设置为 0
    s2.setTheme({
      splitLine: {
        horizontalBorderColorOpacity: 0.2,
      },
    });

    await s2.render();
  });
