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
      style: {
        dataCell: {
          // 让表格显示滚动条
          width: 200,
          height: 100,
        },
      },
      interaction: {
        // 关闭浏览器默认的滚动边界行为, 同时设置表格不同的滚动边界行为, 可尝试在不同的设备上滚动看效果
        // 设置为 'none' | 'contain' 时, 表格滚动到顶部/底部时, 不再触发父容器滚动
        // 可选项: 'none' | 'contain' | 'auto'
        overscrollBehavior: 'none',
      },
    };

    const s2 = new PivotSheet(container, dataCfg, s2Options);

    await s2.render();
  });
