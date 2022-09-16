import { PivotSheet } from '@antv/s2';

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
        hoverHighlight: true,
        // 设置行头，列头，单元格都可以进行圈选
        brushSelection: {
          data: true,
          row: true,
          col: true,
        },
        // 圈选功能 + 复制功能开启后，可以通过使用快捷键 `command/ctrl + c` 即可复制选中区域（局部复制）
        enableCopy: true,
      },
      tooltip: {
        showTooltip: true,
      },
    };
    const s2 = new PivotSheet(container, dataCfg, s2Options);

    s2.render();
  });
