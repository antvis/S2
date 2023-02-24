import { TableSheet } from '@antv/s2';

fetch('https://assets.antv.antgroup.com/s2/basic-table-mode.json')
  .then((res) => res.json())
  .then((res) => {
    const container = document.getElementById('container');

    const s2DataConfig = {
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

    const s2Options = {
      width: 450,
      height: 480,
      showSeriesNumber: true,
      frozenRowCount: 1, // 行头冻结数量
      frozenColCount: 1, // 列头冻结数量
      frozenTrailingRowCount: 1, // 列尾冻结数量
      frozenTrailingColCount: 1, // 列尾冻结数量
    };

    const s2 = new TableSheet(container, s2DataConfig, s2Options);
    s2.render();
  });
