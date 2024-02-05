import { PivotSheet, S2DataConfig, S2Options } from '@antv/s2';

fetch('https://render.alipay.com/p/yuyan/180020010001215413/s2/basic.json')
  .then((res) => res.json())
  .then(async (data) => {
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
        // 拼音首字母倒序：浙江-z、吉林-j
        { sortFieldId: 'province', sortMethod: 'DESC' },
        // 拼音首字母正序：杭州-h、舟山-z；白山-b、长春-c
        { sortFieldId: 'city', sortMethod: 'ASC' },
        // 拼音首字母倒序：纸张-z、笔-b
        { sortFieldId: 'type', sortMethod: 'DESC' },
      ],
    };

    const s2Options: S2Options = {
      width: 600,
      height: 480,
    };

    const s2 = new PivotSheet(container, s2DataConfig, s2Options);

    await s2.render();
  });
