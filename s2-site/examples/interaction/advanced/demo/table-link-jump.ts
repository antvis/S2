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
        /**
         * 由于明细表单列头的特殊性，为和透视表保持一致，同时兼容多列头的场景，明细表的标记会对列头和数值**同时生效**.
         * 如希望标记只对数值生效，可以参考自定义标记示例: https://s2.antv.antgroup.com/examples/interaction/advanced/#custom-link-jump
         */
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
