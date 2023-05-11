import { TableSheet } from '@antv/s2';

fetch('https://assets.antv.antgroup.com/s2/basic-table-mode.json')
  .then((res) => res.json())
  .then((data) => {
    const container = document.getElementById('container');
    const s2DataConfig = {
      fields: {
        columns: [
          {
            key: 'area',
            children: [
              {
                rowSpan: 2,
                key: 'province',
              },
              {
                rowSpan: 2,
                key: 'city',
              },
            ],
          },
          'type',
          {
            key: 'money',
            rowSpan: 2,
            children: [
              {
                key: 'price',
              },
            ],
          },
        ],
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
        {
          field: 'area',
          name: '位置',
        },
        {
          field: 'money',
          name: '金额',
        },
      ],
      data,
    };

    const s2Options = {
      width: 600,
      height: 480,
      showSeriesNumber: true,
    };
    const s2 = new TableSheet(container, s2DataConfig, s2Options);

    s2.render();
  });
