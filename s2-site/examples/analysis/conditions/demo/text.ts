import { PivotSheet, EXTRA_FIELD, S2Options } from '@antv/s2';

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
        hoverHighlight: false,
      },
      conditions: {
        text: [
          // 行头
          {
            // 支持正则: /^city+$/,
            field: 'city',
            mapping(fieldValue, data, cell) {
              const meta = cell.getMeta();

              // 根据单元格信息动态标记
              if (meta.rowIndex === 2) {
                return {
                  textAlign: 'left',
                };
              }

              // 根据维值动态标记
              if (fieldValue === '成都市') {
                return {
                  fill: '#327039',
                  fontSize: 14,
                  textAlign: 'left',
                };
              }

              return {
                // fill 是文本字段标记下唯一必须的字段，用于指定文本颜色
                fill: '#DB6BCF',
                // 其他配置同文本主题: https://s2.antv.antgroup.com/api/general/s2-theme#texttheme
                fontSize: 16,
                opacity: 0.8,
                textAlign: 'right',
              };
            },
          },
          // 列头
          {
            field: 'sub_type',
            mapping(fieldValue, data) {
              return {
                fill: '#025DF4',
              };
            },
          },
          // 单独控制角头
          {
            field: 'type',
            mapping(fieldValue, data) {
              if (fieldValue === '类别') {
                return {
                  fill: '#327039',
                };
              }
            },
          },
          // 单独配置指标名
          {
            field: EXTRA_FIELD,
            mapping(fieldValue, data) {
              return {
                fill: '#5B8FF9',
              };
            },
          },
          // 配置数据单元格
          {
            field: 'number',
            mapping(fieldValue, data) {
              // 根据单元格数据动态标记
              if (data.number < 1000) {
                return {
                  fill: '#cf2f2fd9',
                };
              }

              return {
                fill: '#2498D1',
              };
            },
          },
        ],
      },
    };

    const s2 = new PivotSheet(container, dataCfg, s2Options);

    await s2.render();
  });
