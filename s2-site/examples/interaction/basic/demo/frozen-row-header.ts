import { PivotSheet, S2Event, S2Options } from '@antv/s2';

fetch(
  'https://gw.alipayobjects.com/os/bmw-prod/2a5dbbc8-d0a7-4d02-b7c9-34f6ca63cff6.json',
)
  .then((res) => res.json())
  .then((dataCfg) => {
    const container = document.getElementById('container');

    const s2Options: S2Options = {
      width: 600,
      height: 480,
      hierarchyType: 'tree', // 'tree' | 'grid'
      // 默认开启行头冻结, 关闭后滚动区域为整个表格
      frozenRowHeader: true,
      style: {
        rowCfg: {
          treeRowsWidth: 400,
          width: 200,
        },
        colCfg: {
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

    s2.render();
  });
