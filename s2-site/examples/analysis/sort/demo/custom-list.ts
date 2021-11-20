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
        { sortFieldId: 'province', sortBy: ['吉林', '浙江'] },
        { sortFieldId: 'city', sortBy: ['舟山', '杭州', '白山', '丹东'] },
        { sortFieldId: 'type', sortBy: ['纸张', '笔'] },
      ],
    };

    const s2Options = {
      width: 600,
      height: 480,
    };
    const s2 = new PivotSheet(container, s2DataConfig, s2Options);

    s2.render();
  });
