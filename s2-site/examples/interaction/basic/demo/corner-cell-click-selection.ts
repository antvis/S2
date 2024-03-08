import { PivotSheet, S2Event, S2Options } from '@antv/s2';

fetch(
  'https://gw.alipayobjects.com/os/bmw-prod/2a5dbbc8-d0a7-4d02-b7c9-34f6ca63cff6.json',
)
  .then((res) => res.json())
  .then(async (dataCfg) => {
    const container = document.getElementById('container');

    /**
     * 试一试点击角头:
     * 点击列角头 (类别/子类别): 会选中对应的列头
     * 点击行角头 (省份/城市): 会选中对应的行头
     * 点击序号角头: 会选中对应的序号列
     */
    const s2Options: S2Options = {
      width: 600,
      height: 480,
      seriesNumber: {
        enable: true,
      },
      interaction: {
        hoverHighlight: true,
      },
    };

    const s2 = new PivotSheet(container, dataCfg, s2Options);

    s2.on(S2Event.CORNER_CELL_CLICK, (event) => {
      console.log('corner cell click:', event);
    });

    s2.on(S2Event.GLOBAL_SELECTED, (cells) => {
      console.log('selected', cells);
    });

    await s2.render();
  });
