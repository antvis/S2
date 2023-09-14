import { PivotSheet, S2Options } from '@antv/s2';

fetch(
  'https://gw.alipayobjects.com/os/bmw-prod/2a5dbbc8-d0a7-4d02-b7c9-34f6ca63cff6.json',
)
  .then((res) => res.json())
  .then((dataCfg) => {
    const container = document.getElementById('container');

    const s2Options: S2Options = {
      width: 600,
      height: 480,
      interaction: {
        hoverHighlight: true,
        selectedCellHighlight: true,
        selectedCellsSpotlight: true,
      },
      tooltip: {
        showTooltip: true,
      },
    };
    const s2 = new PivotSheet(container, dataCfg, s2Options);

    s2.setTheme({
      prepareSelectMask: {
        backgroundColor: '#ccc',
      },
      dataCell: {
        cell: {
          interactionState: {
            // 悬停聚焦: 关闭悬停单元格时出现的 "黑色边框"
            hoverFocus: {
              // 边框设置为透明
              borderColor: 'transparent',
              // 或者边框透明度设置为 0
              // borderOpacity: 0
            },
            // 悬停
            hover: {
              backgroundOpacity: 0.2,
            },
            // 选中背景色/边框
            selected: {
              backgroundColor: 'pink',
              borderWidth: 3,
            },
            // 高亮效果
            highlight: {
              textOpacity: 0.2,
              backgroundColor: '#f63',
            },
            // 预选 (刷选)
            prepareSelect: {
              borderColor: '#396',
            },
          },
        },
      },
    });

    s2.render();
  });
