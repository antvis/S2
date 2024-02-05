import { PivotSheet, S2Options } from '@antv/s2';

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
        selectedCellHighlight: true,
        selectedCellsSpotlight: true,
        multiSelection: true,
        selectedCellMove: true,
        rangeSelection: true,
        brushSelection: {
          rowCell: true,
          colCell: true,
          dataCell: true,
        },
      },
      style: {
        rowCell: {
          width: 100,
        },
        dataCell: {
          width: 120,
        },
      },
    };

    const s2 = new PivotSheet(container, dataCfg, s2Options);

    s2.setTheme({
      // 刷选 (预选中遮罩框)
      prepareSelectMask: {
        backgroundColor: '#ccc',
      },
      // 宽高调整 (热区, 参考线)
      resizeArea: {
        // 热区大小, 背景色
        size: 4,
        background: 'rgba(0,0,0, 0.5)',
        backgroundOpacity: 0,

        // 参考线
        guideLineColor: 'pink',
        guideLineDisableColor: 'yellow',
        guideLineDash: [4, 4],
      },
      // 滚动条
      scrollBar: {
        trackColor: 'rgba(0,0,0,0.01)',
        thumbHoverColor: 'rgba(0,0,0,0.25)',
        thumbColor: 'rgba(0,0,0,0.15)',
        // 滑块最小宽度
        thumbHorizontalMinSize: 32,
        thumbVerticalMinSize: 32,
        size: 6,
        hoverSize: 10,
        lineCap: 'round',
      },
      // 数值单元格 (其他单元格同理)
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
            // 十字悬停
            hover: {
              backgroundOpacity: 0.2,
              borderColor: 'transparent',
              borderOpacity: 1,
            },
            // 选中背景色/边框
            selected: {
              backgroundColor: 'pink',
              borderWidth: 3,
              borderColor: '#dcdcdc',
              borderOpacity: 1,
            },
            // 未选中背景色/边框
            unselected: {
              backgroundOpacity: 0.5,
              textOpacity: 0.1,
              opacity: 0.1,
            },
            // 高亮效果
            highlight: {
              textOpacity: 0.2,
              backgroundColor: '#f63',
              borderColor: '#f63',
              borderOpacity: 1,
            },
            // 预选 (刷选)
            prepareSelect: {
              borderColor: '#396',
              borderOpacity: 1,
            },
          },
        },
      },
    });

    await s2.render();
  });
