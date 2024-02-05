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
      interaction: {
        hoverHighlight: true,
        // 设置行头，列头，数值单元格都可以进行圈选 (行头,列头默认关闭)
        brushSelection: {
          dataCell: true,
          rowCell: true,
          colCell: true,
        },
        // 圈选功能 + 复制功能开启后，可以通过使用快捷键 `command/ctrl + c` 即可复制选中区域（局部复制）
        copy: { enable: true },
      },
      style: {
        dataCell: {
          height: 100,
        },
      },
    };

    const s2 = new PivotSheet(container, dataCfg, s2Options);

    // 可以监听各自单元格区域的刷选事件
    s2.on(S2Event.DATA_CELL_BRUSH_SELECTION, (cells) => {
      console.log('dataCelBrushSelection', cells);
    });
    s2.on(S2Event.ROW_CELL_BRUSH_SELECTION, (cells) => {
      console.log('rowCellBrushSelection', cells);
    });
    s2.on(S2Event.COL_CELL_BRUSH_SELECTION, (cells) => {
      console.log('colCelBrushSelection', cells);
    });

    // 也可以监听全局的选中事件
    s2.on(S2Event.GLOBAL_SELECTED, (cells) => {
      console.log('selected', cells);
    });

    await s2.render();
  });
