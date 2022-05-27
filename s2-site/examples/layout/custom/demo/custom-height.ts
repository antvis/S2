import { TableSheet } from '@antv/s2';

fetch('../data/basic.json')
  .then((res) => res.json())
  .then((data) => {
    const container = document.getElementById('container');
    const s2DataConfig = {
      fields: {
        rows: [],
        columns: ['type', 'province', 'city', 'price', 'cost'],
        values: [],
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
      style: {
        rowCfg: {
          heightByField: {
            '1': 130,
            '3': 60,
            '10': 80,
            '15': 20,
          },
        },
      },
    };
    const s2 = new TableSheet(container, s2DataConfig, s2Options);

    s2.render();
  });
