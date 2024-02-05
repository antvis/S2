import { PivotSheet, S2DataConfig, S2Options, S2Theme } from '@antv/s2';

fetch(
  'https://render.alipay.com/p/yuyan/180020010001215413/s2/basic.json',
)
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
    };

    const s2Options: S2Options = {
      width: 600,
      height: 480,
    };

    const cellTheme = {
      cell: {
        backgroundColorOpacity: 0,
        verticalBorderColorOpacity: 0,
        horizontalBorderColorOpacity: 0,
      },
    };

    // https://s2.antv.antgroup.com/zh/docs/api/general/S2Theme#s2theme
    const s2Theme: S2Theme = {
      background: {
        opacity: 0,
      },
      rowCell: cellTheme,
      colCell: cellTheme,
      dataCell: cellTheme,
      cornerCell: cellTheme,
    };

    const s2 = new PivotSheet(container, s2DataConfig, s2Options);

    s2.setTheme(s2Theme);

    await s2.render();
  });
