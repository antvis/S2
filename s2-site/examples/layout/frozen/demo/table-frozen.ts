import { S2DataConfig, S2Options, TableSheet } from '@antv/s2';

fetch('https://assets.antv.antgroup.com/s2/basic-table-mode.json')
  .then((res) => res.json())
  .then(async (res) => {
    const container = document.getElementById('container');

    const s2DataConfig: S2DataConfig = {
      fields: {
        columns: ['province', 'city', 'type', 'price'],
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
      ],
      data: res,
    };

    const s2Options: S2Options = {
      width: 450,
      height: 480,
      seriesNumber: {
        enable: true
      },
      frozen: {
        // 行头冻结数量
        rowCount: 1,
        // 列头冻结数量
        colCount: 1,
        // 列尾冻结数量
        trailingRowCount: 1,
        // 列尾冻结数量
        trailingColCount: 1,
      },
    };

    const s2 = new TableSheet(container, s2DataConfig, s2Options);

    await s2.render();
  });
