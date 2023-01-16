import { PivotSheet, S2Event } from '@antv/s2';

fetch(
  'https://gw.alipayobjects.com/os/bmw-prod/2a5dbbc8-d0a7-4d02-b7c9-34f6ca63cff6.json',
)
  .then((res) => res.json())
  .then((dataCfg) => {
    const container = document.getElementById('container');

    const s2Options = {
      width: 600,
      height: 480,
      interaction: {
        // 透视表默认隐藏需要指定唯一列头id
        // 可通过 `s2.getColumnNodes()` 获取列头节点查看id
        hiddenColumnFields: ['root[&]家具[&]沙发[&]number'],
      },
      tooltip: {
        showTooltip: true,
        operation: {
          // 开启手动隐藏, 叶子节点有效
          hiddenColumns: true,
        },
      },
    };
    const s2 = new PivotSheet(container, dataCfg, s2Options);

    s2.on(S2Event.LAYOUT_COLS_EXPANDED, (cell) => {
      console.log('列头展开', cell);
    });
    s2.on(
      S2Event.LAYOUT_COLS_HIDDEN,
      (currentHiddenColumnsInfo, hiddenColumnsDetail) => {
        console.log('列头隐藏', currentHiddenColumnsInfo, hiddenColumnsDetail);
      },
    );

    s2.render();
  });
