import { SortMethod, TableSheet } from '@antv/s2';
import '@antv/s2/dist/s2.min.css';

fetch('../data/basic.json')
  .then((res) => res.json())
  .then((data) => {
    const container = document.getElementById('container');
    const canConvertToNumber = (sortKey: string) =>
      data.every((item) => {
        const v = item[sortKey];
        return typeof v === 'string' && !Number.isNaN(Number(v));
      });
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
      sortParams: [
        {
          sortFieldId: 'price',
          sortBy: (obj) =>
            canConvertToNumber('price') ? Number(obj.price) : obj.price,
          sortMethod: 'DESC',
        },
      ],
    };

    const s2Options = {
      width: 600,
      height: 480,
    };
    const s2 = new TableSheet(container, s2DataConfig, s2Options);

    s2.render();
  });
