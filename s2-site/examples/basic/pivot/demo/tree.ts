import { PivotSheet, S2Options } from '@antv/s2';

fetch(
  'https://gw.alipayobjects.com/os/bmw-prod/2a5dbbc8-d0a7-4d02-b7c9-34f6ca63cff6.json',
)
  .then((res) => res.json())
  .then(async (dataCfg) => {
    const container = document.getElementById('container');

    const s2Options: S2Options = {
      width: 600,
      height: 480,
      hierarchyType: 'tree',
      style: {
        rowCell: {
          // 自定义树状模式下行头宽度
          // width: 80,

          // 折叠全部
          // collapseAll: true,

          // 折叠浙江省下面所有的城市
          collapseFields: {
            'root[&]浙江省': true,
          },
        },
      },

      // 冻结行头
      // frozenRowHeader: true
    };

    const s2 = new PivotSheet(container, dataCfg, s2Options);

    await s2.render();
  });
