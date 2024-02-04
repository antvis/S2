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
      hierarchyType: 'tree',

      // 自定义角头标题 默认 "维值1/维值2"
      // cornerText: "指标",

      // 显示序号
      // seriesNumber: {
      //   enable: true,
      //   自定义序号列文本, 默认 "序号"
      //   text: '自定义序号标题',
      // },
      style: {
        rowCell: {
          // 自定义树状模式下行头宽度
          // width: 80,

          // 折叠全部
          // collapseAll: true,

          // 折叠浙江省下面所有的城市
          collapseFields: {
            'root[&]浙江省': true,
          },
        },
      },
      frozen: {
        // 默认冻结行头, 行头和数值区域都会展示滚动条
        // rowHeader: false,
        // 冻结行头时, 行头宽度占表格的 1/2, 支持动态调整 (0 - 1)
        // rowHeader: 0.2,
      },
    };

    const s2 = new PivotSheet(container, dataCfg, s2Options);

    await s2.render();
  });
