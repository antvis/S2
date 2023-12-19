import { PivotSheet, EXTRA_FIELD, S2Options } from '@antv/s2';

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
      },
      conditions: {
        text: [
          // 行头
          {
            field: 'city',
            mapping(value, record) {
              return {
                // fill 是文本字段标记下唯一必须的字段，用于指定文本颜色
                fill: '#DB6BCF',
              };
            },
          },
          // 列头
          {
            field: 'sub_type',
            mapping(value, record) {
              return {
                fill: '#025DF4',
              };
            },
          },
          // 单独控制角头
          {
            field: 'type',
            mapping(value, record) {
              if (value === '类别') {
                return {
                  fill: '#327039',
                };
              }
            },
          },
          // 单独配置指标名
          {
            field: EXTRA_FIELD,
            mapping(value, record) {
              return {
                fill: '#5B8FF9',
              };
            },
          },
          // 配置数据单元格
          {
            field: 'number',
            mapping(value, record) {
              return {
                fill: '#2498D1',
              };
            },
          },
        ],
      },
    };

    const s2 = new PivotSheet(container, dataCfg, s2Options);

    s2.render();
  });
