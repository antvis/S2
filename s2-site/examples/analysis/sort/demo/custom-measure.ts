import { PivotSheet, S2DataConfig, EXTRA_FIELD } from '@antv/s2';
import '@antv/s2/dist/s2.min.css';

fetch(
  'https://gw.alipayobjects.com/os/bmw-prod/6531b95e-a955-4735-91d6-e63fc32b3f34.json',
)
  .then((res) => res.json())
  .then((data) => {
    const container = document.getElementById('container');
    const s2DataConfig: S2DataConfig = {
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
      sortParams: [
        {
          // type 依据 浙江-舟山-price 升序 排序
          sortFieldId: 'type',
          sortMethod: 'ASC',
          sortByMeasure: 'price',
          query: {
            province: '浙江',
            city: '舟山',
            [EXTRA_FIELD]: 'price',
          },
        },
        {
          // city 依据 纸张-price 降序 排序
          sortFieldId: 'city',
          sortMethod: 'DESC',
          sortByMeasure: 'price',
          query: {
            type: '纸张',
            [EXTRA_FIELD]: 'price',
          },
        },
      ],
    };

    const s2Options = {
      width: 600,
      height: 480,
    };
    const s2 = new PivotSheet(container, s2DataConfig, s2Options);

    s2.render();
  });
