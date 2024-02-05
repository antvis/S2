import { PivotSheet, S2Event, S2Options } from '@antv/s2';

fetch(
  'https://gw.alipayobjects.com/os/bmw-prod/2a5dbbc8-d0a7-4d02-b7c9-34f6ca63cff6.json',
)
  .then((res) => res.json())
  .then(async (dataCfg) => {
    const container = document.getElementById('container');

    // 支持滚动圈选, 试试圈选时鼠标向下
    const s2Options: S2Options = {
      width: 600,
      height: 480,
      interaction: {
        hoverHighlight: true,
        // 高亮选中单元格
        selectedCellsSpotlight: true,
        // 关闭圈选
        // brushSelection: false,
      },
      style: {
        dataCell: {
          height: 100,
        },
      },
    };

    const s2 = new PivotSheet(container, dataCfg, s2Options);

    s2.on(S2Event.DATA_CELL_BRUSH_SELECTION, (cells) => {
      console.log('dataCelBrushSelection', cells);
    });

    await s2.render();
  });
