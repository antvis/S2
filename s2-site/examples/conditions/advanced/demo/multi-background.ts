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
        values: ['price'],
      },
      data,
    };

    const s2options = {
      width: 600,
      height: 600,
      hoverHighlight: false,
      conditions: {
        text: [
          {
            field: 'price',
            mapping(fieldValue) {
              if (fieldValue >= 15) {
                return {
                  fill: '#fff',
                };
              }
            },
          },
        ],
        background: [
          {
            field: 'price',
            mapping(fieldValue) {
              if (fieldValue <= 2) {
                return {
                  fill: '#B8E1FF',
                };
              } else if (fieldValue <= 5) {
                return {
                  fill: '#9AC5FF',
                };
              } else if (fieldValue <= 10) {
                return {
                  fill: '#7DAAFF',
                };
              } else if (fieldValue <= 15) {
                return {
                  fill: '#5B8FF9',
                };
              } else if (fieldValue <= 20) {
                return {
                  fill: '#3D76DD',
                };
              }
              return {
                fill: '#085EC0',
              };
            },
          },
        ],
      },
    };
    const s2 = new PivotSheet(container, s2DataConfig, s2options);

    s2.render();
  });
