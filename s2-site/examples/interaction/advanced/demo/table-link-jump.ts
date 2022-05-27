import { S2Event, TableSheet } from '@antv/s2';

fetch(
  '../data/basic-table-mode.json',
)
  .then((res) => res.json())
  .then((data) => {
    const container = document.getElementById('container');
    const s2DataConfig = {
      fields: {
        columns: ['type', 'province', 'city', 'price', 'cost'],
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
        linkFields: ['type', 'province', 'price'],
      },
    };

    const s2 = new TableSheet(container, s2DataConfig, s2Options);

    s2.on(S2Event.GLOBAL_LINK_FIELD_JUMP, (data) => {
      console.log(data);

      const { key, record } = data;
      const value = record[key];
      const a = document.createElement('a');
      a.target = '_blank';
      a.href = `https://antv-s2.gitee.io/zh/docs/manual/introduction?${key}=${value}`;
      a.click();
      a.remove();
    });

    s2.render();
  });
