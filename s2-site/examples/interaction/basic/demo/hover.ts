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
        // 悬停高亮
        hoverHighlight: true,
        // 等同于
        // hoverHighlight: {
        //   rowHeader = true, // 高亮悬停格子所在行头
        //   colHeader = true, // 高亮悬停格子所在列头
        //   currentRow = true, // 高亮悬停格子所在行
        //   currentCol = true, // 高亮悬停格子所在列
        // },
      },
      tooltip: {
        showTooltip: true,
      },
    };
    const s2 = new PivotSheet(container, dataCfg, s2Options);

    // 关闭悬停单元格时出现的 "黑色边框"
    // s2.setTheme({
    //   dataCell: {
    //     cell: {
    //       interactionState: {
    //         hoverFocus: {
    //           // 边框设置为透明
    //           borderColor: 'transparent'
    //           // 或者边框透明度设置为 0
    //           // borderOpacity: 0
    //         }
    //       }
    //     }
    //   }
    // })

    s2.render();
  });
