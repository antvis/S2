import { S2DataConfig, S2Event, S2Options, TableSheet } from '@antv/s2';

fetch('https://assets.antv.antgroup.com/s2/basic-table-mode.json')
  .then((res) => res.json())
  .then(async (data) => {
    const container = document.getElementById('container');
    const s2DataConfig: S2DataConfig = {
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

    const s2Options: S2Options = {
      width: 600,
      height: 480,
      interaction: {
        linkFields: ['type', 'province', 'price'],
      },
    };

    const s2 = new TableSheet(container, s2DataConfig, s2Options);

    s2.on(S2Event.GLOBAL_LINK_FIELD_JUMP, (jumpData) => {
      console.log('jumpData:', jumpData);

      const { field, record } = jumpData;
      const value = record?.[field];
      const a = document.createElement('a');

      a.target = '_blank';
      a.href = `https://s2.antv.antgroup.com/zh/docs/manual/introduction?${field}=${value}`;
      a.click();
      a.remove();
    });

    await s2.render();
  });
