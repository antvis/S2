import { PivotSheet, S2Options } from '@antv/s2';

fetch(
  'https://gw.alipayobjects.com/os/bmw-prod/2a5dbbc8-d0a7-4d02-b7c9-34f6ca63cff6.json',
)
  .then((res) => res.json())
  .then(async (dataCfg) => {
    const container = document.getElementById('container');
    const s2DataConfig = {
      ...dataCfg,
      meta: [
        {
          field: 'province',
          name: '省份',
        },
        {
          field: 'city',
          name: '城市',
        },
        {
          field: 'type',
          name: '商品类别',
        },
        {
          field: 'sub_type',
          name: '子类别',
        },
        {
          field: 'number',
          name: '数量',
          // 自定义格式化
          // formatter: (value, record, meta) => {
          //   return `${value / 100} %`;
          // },
        },
      ],
    };

    const s2Options: S2Options = {
      width: 600,
      height: 480,
      hierarchyType: 'grid',
      interaction: {
        copy: { enable: true },
        withFormat: true,
        withHeader: true,
      },
      // 显示序号
      // seriesNumber: {
      //   enable: true,
      //   自定义序号列文本, 默认 "序号"
      //   text: '自定义序号标题', 
      //},
      frozen: {
        // 默认冻结行头, 行头和数值区域都会展示滚动条
        // rowHeader: false,
        // 冻结行头时, 行头宽度占表格的 1/2, 支持动态调整 (0 - 1)
        // rowHeader: 0.2,
      },
    };

    const s2 = new PivotSheet(container, s2DataConfig, s2Options);

    await s2.render();
  });
