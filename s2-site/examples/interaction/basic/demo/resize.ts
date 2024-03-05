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
        hoverHighlight: true,
        // resize: true,
        resize: {
          // 热区是否展示
          visible: (cell) => true,
          // 是否禁用拖拽
          disable: (resizeInfo) => {
            return resizeInfo.meta.id === 'root[&]家具[&]桌子[&]数量';
          },
          // 行高调整时，影响全部行 (可选 'all' | 'current' | 'selected')
          rowResizeType: ResizeType.ALL,
          // 列宽调整时，只影响当前列
          colResizeType: ResizeType.CURRENT,
          // 单元格可拖拽最小宽度
          minCellWidth: 20,
          // 单元格可拖拽最小高度
          minCellHeight: 20,
        },
      },
    };

    const s2 = new PivotSheet(container, dataCfg, s2Options);

    // 支持通过调整主题修改热区大小/颜色
    s2.setTheme({
      resizeArea: {
        // 这里默认将热区显示, 仅供演示使用, 请勿无脑复制.
        backgroundOpacity: 1,

        // 热区大小
        size: 3,
        // 热区背景色
        background: '#326EF4',
        // 拖拽参考线颜色
        guideLineColor: '#326EF4',
        // 拖拽参考线禁用颜色
        guideLineDisableColor: 'rgba(0,0,0,0.25)',
        //  参考线间隔
        guideLineDash: [3, 3],
      },
    });

    await s2.render();
  });
