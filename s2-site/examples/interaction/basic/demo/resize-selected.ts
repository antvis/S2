import { PivotSheet, ResizeType, S2Options } from '@antv/s2';

fetch(
  'https://gw.alipayobjects.com/os/bmw-prod/2a5dbbc8-d0a7-4d02-b7c9-34f6ca63cff6.json',
)
  .then((res) => res.json())
  .then(async (dataCfg) => {
    const container = document.getElementById('container');

    const s2Options: S2Options = {
      width: 600,
      height: 480,
      interaction: {
        resize: {
          // 行高调整时，影响全部行 (可选 'all' | 'current' | 'selected')
          rowResizeType: ResizeType.SELECTED,
          // 列宽调整时，只影响当前列
          colResizeType: ResizeType.SELECTED,
        },
      },
    };

    const s2 = new PivotSheet(container, dataCfg, s2Options);

    await s2.render();
  });
