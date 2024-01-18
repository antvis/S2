import { S2DataConfig, S2Options, TableSheet } from '@antv/s2';

fetch('https://render.alipay.com/p/yuyan/180020010001215413/s2/basic.json')
  .then((res) => res.json())
  .then((data) => {
    // 详情请查看: https://s2.antv.antgroup.com/zh/docs/manual/advanced/custom/cell-size
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
      style: {
        // 列头宽度始终和数值单元格一致
        dataCell: {
          width: 200,
          height: 50,
        },
        colCell: {
          height: 50,
        },
        // 明细表每一行根据行序号单独设置
        rowCell: {
          heightByField: {
            '1': 130,
            '3': 60,
            '10': 80,
            '15': 20,
          },
        },
      },
    };
    const s2 = new TableSheet(container, s2DataConfig, s2Options);

    s2.render();
  });
