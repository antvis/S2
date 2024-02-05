import { S2Event, PivotSheet, S2Options, InterceptType } from '@antv/s2';
import '@antv/s2/dist/style.min.css';

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
        autoResetSheetStyle: true,
        hoverHighlight: true,
        hoverFocus: true,
      },
      tooltip: {
        enable: true,
        getContainer() {
          return document.getElementById('container');
        },
      },
    };

    const s2 = new PivotSheet(container, dataCfg, s2Options);

    s2.on(S2Event.CORNER_CELL_CLICK, (event) => {
      s2.interaction.addIntercepts([InterceptType.HOVER, InterceptType.CLICK]);

      s2.showTooltip({
        position: {
          x: event.clientX,
          y: event.clientY,
        },
        options: {
          forceRender: true,
        },
        content:
          '点击角头后, 整个表格不再响应 click 和 hover 事件, 在按下 ESC, 或点击空白处关闭 tooltip 后, 移除屏蔽',
      });
    });

    s2.on(S2Event.GLOBAL_RESET, () => {
      s2.interaction.removeIntercepts([
        InterceptType.HOVER,
        InterceptType.CLICK,
      ]);
      s2.hideTooltip();
    });

    s2.on(S2Event.GLOBAL_SELECTED, (cells) => {
      console.log('selected:', cells);
    });

    s2.on(S2Event.GLOBAL_HOVER, (event) => {
      console.log('hover:', event);
    });

    s2.on(S2Event.LAYOUT_DESTROY, () => {
      s2.hideTooltip();
    });

    await s2.render();
  });
