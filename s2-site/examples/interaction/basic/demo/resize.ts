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
          // 行高调整时，影响全部行
          rowResizeType: ResizeType.ALL,
          // 列宽调整时，只影响当前列
          colResizeType: ResizeType.CURRENT,
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
        // 交互状态
        interactionState: {
          // 热区 hover 时的背景色和透明度
          hover: {
            backgroundColor: '#326EF4',
            backgroundOpacity: 1,
          },
        },
      },
    });

    await s2.render();
  });
