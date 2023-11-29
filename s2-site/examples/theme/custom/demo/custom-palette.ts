import { PivotSheet } from '@antv/s2';

fetch(
  'https://render.alipay.com/p/yuyan/180020010001215413/s2/basic.json',
)
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
    };

    const s2Options = {
      width: 600,
      height: 480,
    };

    const s2Palette = {
      basicColors: [
        '#FFFFFF',
        '#F8F5FE',
        '#EDE1FD',
        '#873BF4',
        '#7232CF',
        '#7232CF',
        '#7232CF',
        '#AB76F7',
        '#FFFFFF',
        '#DDC7FC',
        '#9858F5',
        '#B98EF8',
        '#873BF4',
        '#282B33',
        '#121826',
      ],

      // ---------- semantic colors ----------
      semanticColors: {
        red: '#FF4D4F',
        green: '#29A294',
      },
    };

    const s2 = new PivotSheet(container, s2DataConfig, s2Options);

    s2.setThemeCfg({ palette: s2Palette });
    s2.render();
  });
