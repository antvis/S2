import { PivotSheet } from '@antv/s2';
import '@antv/s2/dist/s2.min.css';

fetch(
  'https://gw.alipayobjects.com/os/bmw-prod/d62448ea-1f58-4498-8f76-b025dd53e570.json',
)
  .then((res) => res.json())
  .then((data) => {
    const container = document.getElementById('container');
    const s2DataConfig = {
      fields: {
        rows: ['province', 'city'],
        columns: ['type'],
        values: ['price', 'cost'],
      },

      data,
    };

    const s2options = {
      width: 800,
      height: 600,
      hoverHighlight: false,
      conditions: {
        interval: [
          {
            field: 'price',
            mapping(fieldValue, data) {
              return {
                fill: '#80BFFF',
                // 自定义柱状图范围
                isCompare: true,
                maxValue: 20,
                minValue: 5,
              };
            },
          },
          {
            field: 'cost',
            mapping(fieldValue, data) {
              return {
                fill: '#4DA6FF',
              };
            },
          },
        ],
      },
    };
    const s2 = new PivotSheet(container, s2DataConfig, s2options);

    s2.render();
  });
