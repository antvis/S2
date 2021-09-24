import { PivotSheet } from '@antv/s2';
import '@antv/s2/dist/s2.min.css';

fetch('../data/basic.json')
  .then((res) => res.json())
  .then((data) => {
    const container = document.getElementById('container');
    const s2DataConfig = {
      fields: {
        rows: ['province', 'city'],
        columns: ['type'],
        values: ['price'],
      },
      data,
    };

    const s2options = {
      width: 600,
      height: 600,
      conditions: {
        text: [
          {
            field: 'price',
            mapping() {
              return {
                fill: 'white',
              };
            },
          },
        ],
        background: [
          {
            field: 'price',
            mapping(fieldValue, data) {
              if (fieldValue <= 2) {
                return {
                  fill: '#bae7ff',
                };
              } else if (fieldValue <= 5) {
                return {
                  fill: '#69c0ff',
                };
              } else if (fieldValue <= 10) {
                return {
                  fill: '#40a9ff',
                };
              } else if (fieldValue <= 15) {
                return {
                  fill: '#1890ff',
                };
              } else if (fieldValue <= 20) {
                return {
                  fill: '#096dd9',
                };
              }
              return {
                fill: '#002766',
              };
            },
          },
        ],
      },
    };
    const s2 = new PivotSheet(container, s2DataConfig, s2options);

    s2.render();
  });
