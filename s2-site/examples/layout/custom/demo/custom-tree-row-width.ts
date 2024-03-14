import { PivotSheet, S2Options } from '@antv/s2';

fetch(
  'https://gw.alipayobjects.com/os/bmw-prod/2a5dbbc8-d0a7-4d02-b7c9-34f6ca63cff6.json',
)
  .then((res) => res.json())
  .then(async (dataCfg) => {
    const container = document.getElementById('container');

    // 详情请查看: https://s2.antv.antgroup.com/zh/docs/manual/advanced/custom/cell-size
    const s2Options: S2Options = {
      width: 600,
      height: 480,
      hierarchyType: 'tree',
      frozen: {
        // 默认冻结行头, 行头和数值区域都会展示滚动条
        // rowHeader: false,
        // 冻结行头时, 默认行头宽度占表格的 1/2, 支持动态调整 (0 - 1)
        rowHeader: 0.5,
      },
      style: {
        // 和平铺模式配置一致
        rowCell: {
          width: 200,
        },
      },
    };

    const s2 = new PivotSheet(container, dataCfg, s2Options);

    await s2.render();
  });
