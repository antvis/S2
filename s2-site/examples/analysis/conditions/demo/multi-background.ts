import { PivotSheet } from '@antv/s2';
import '@antv/s2/dist/s2.min.css';

fetch(
  'https://gw.alipayobjects.com/os/bmw-prod/2a5dbbc8-d0a7-4d02-b7c9-34f6ca63cff6.json',
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
          field: 'price',
          name: '价格',
        },
        {
          field: 'cost',
          name: '成本',
        },
      ],
      data,
    };

    const s2Options = {
      width: 600,
      height: 480,
      interaction: {
        hoverHighlight: false,
      },
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
    const s2 = new PivotSheet(container, s2DataConfig, s2Options);

    s2.render();
  });
