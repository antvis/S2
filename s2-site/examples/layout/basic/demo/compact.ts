import { PivotSheet, S2Options } from '@antv/s2';

fetch(
  'https://gw.alipayobjects.com/os/bmw-prod/2a5dbbc8-d0a7-4d02-b7c9-34f6ca63cff6.json',
)
  .then((res) => res.json())
  .then(async (dataCfg) => {
    // 增加几条长度不一致的 mock 数据
    dataCfg.data.at(0).number = 11111111;
    dataCfg.data.at(6).number = 7777;
    dataCfg.data.at(-1).number = 666666;

    const container = document.getElementById('container');

    const s2Options: S2Options = {
      width: 600,
      height: 480,
      style: {
        // 了解更多: https://s2.antv.antgroup.com/api/general/s2-options#style
        layoutWidthType: 'compact',
      },
    };

    const s2 = new PivotSheet(container, dataCfg, s2Options);

    // 紧凑模式下, 列头宽度为实际内容宽度 (取当前列最大值, 采样每一列前 50 条数据)
    s2.setTheme({
      dataCell: {
        text: {
          fontSize: 16,
        },
      },
    });

    await s2.render();
  });
