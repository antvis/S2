import { PivotSheet, S2Event, S2Options } from '@antv/s2';

fetch(
  'https://gw.alipayobjects.com/os/bmw-prod/2a5dbbc8-d0a7-4d02-b7c9-34f6ca63cff6.json',
)
  .then((res) => res.json())
  .then(async (dataCfg) => {
    const container = document.getElementById('container');

    // 试试选中一个单元格, 然后按住 Shift 选中另一个单元格
    const s2Options: S2Options = {
      width: 600,
      height: 480,
      interaction: {
        // 高亮选中单元格
        selectedCellsSpotlight: true,
        // 区间多选 (按住 Shift), 默认开启
        rangeSelection: true,
      },
    };

    const s2 = new PivotSheet(container, dataCfg, s2Options);

    // 也可以监听全局的选中事件
    s2.on(S2Event.GLOBAL_SELECTED, (cells) => {
      console.log('selected', cells);
    });

    await s2.render();
  });
