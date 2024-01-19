import { PivotSheet, S2Event, S2Options } from '@antv/s2';

fetch(
  'https://gw.alipayobjects.com/os/bmw-prod/2a5dbbc8-d0a7-4d02-b7c9-34f6ca63cff6.json',
)
  .then((res) => res.json())
  .then(async (dataCfg) => {
    const container = document.getElementById('container');

    const s2Options: S2Options = {
      width: 600,
      height: 480,
      // 布局类型, 可选 'tree' | 'grid'
      hierarchyType: 'tree',
      frozen: {
        // 默认开启行头冻结, 关闭后滚动区域为整个表格
        rowHeader: true,
        // 冻结行头时, 行头宽度占表格的 1/2, 支持动态调整 (0 - 1)
        // rowHeader: 0.2,
      },
      style: {
        rowCell: {
          width: 400,
        },
        colCell: {
          width: 200,
        },
      },
    };

    const s2 = new PivotSheet(container, dataCfg, s2Options);

    s2.on(S2Event.GLOBAL_SCROLL, (e) => {
      console.log('scroll', e);
    });

    s2.on(S2Event.ROW_CELL_SCROLL, (e) => {
      console.log('row cell scroll', e);
    });

    await s2.render();
  });
