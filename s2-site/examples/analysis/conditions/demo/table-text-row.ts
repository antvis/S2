import { S2Options, TableSheet } from '@antv/s2';

fetch(
  'https://gw.alipayobjects.com/os/bmw-prod/986d48ce-cfdf-475d-980c-553762770928.json',
)
  .then((res) => res.json())
  .then((data) => {
    const container = document.getElementById('container');
    const s2DataConfig = {
      fields: {
        columns: ['province', 'city', 'type', 'price', 'cost'],
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

    const s2Options: S2Options = {
      width: 600,
      height: 480,
      interaction: {
        hoverHighlight: true,
      },
      conditions: {
        text: [
          {
            // 使用正则, 匹配所有数据
            field: /.*/,
            mapping(value, record) {
              console.log(value, record);

              // 如果价格低于 10, 整行标记
              if (record.price < 10) {
                return {
                  fill: '#30BF78',
                };
              }

              // 如果价格高于 20, 整行标记
              if (record.price > 20) {
                return {
                  fill: '#FF4D4F',
                };
              }

              return '#000';
            },
          },
        ],
      },
    };

    // 透视表同理, 请举一反三
    const s2 = new TableSheet(container, s2DataConfig, s2Options);

    s2.render();
  });
