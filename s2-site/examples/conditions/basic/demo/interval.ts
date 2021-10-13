import { PivotSheet } from '@antv/s2';
import '@antv/s2/dist/s2.min.css';

fetch(
  'https://gw.alipayobjects.com/os/bmw-prod/52e8d832-87c1-4657-b958-948b016c480a.json',
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
                fill: '#61DDAA',
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
                fill: '#F6BD16',
              };
            },
          },
        ],
      },
    };
    const s2 = new PivotSheet(container, s2DataConfig, s2options);

    s2.render();
  });
