import { TableSheet } from '@antv/s2';
import '@antv/s2/dist/s2.min.css';

fetch(
  'https://gw.alipayobjects.com/os/bmw-prod/52e8d832-87c1-4657-b958-948b016c480a.json',
)
  .then((res) => res.json())
  .then((data) => {
    const container = document.getElementById('container');
    const s2DataConfig = {
      fields: {
        columns: ['city', 'type', 'price', 'cost'],
      },
      data,
    };

    const s2options = {
      width: 800,
      height: 600,
      hoverHighlight: false,
      conditions: {
        text: [
          {
            field: 'price',
            mapping(fieldValue, data) {
              return {
                fill: '#30BF78',
              };
            },
          },
          {
            field: 'cost',
            mapping(fieldValue, data) {
              return {
                fill: '#F4664A',
              };
            },
          },
        ],
      },
    };
    const s2 = new TableSheet(container, s2DataConfig, s2options);

    s2.render();
  });
