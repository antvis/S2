import { PivotSheet } from '@antv/s2';

fetch('../data/basic.json')
  .then((res) => res.json())
  .then((data) => {
    const container = document.getElementById('container');
    const s2DataConfig = {
      fields: {
        rows: ['province', 'city'],
        columns: ['type'],
        values: ['price'],
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
      data,
    };

    const s2Options = {
      width: 600,
      height: 480,
      // 配置小计总计显示
      totals: {
        row: {
          showGrandTotals: true,
          showSubTotals: true,
          reverseLayout: true,
          reverseSubLayout: true,
          subTotalsDimensions: ['province'],
          calcTotals: {
            aggregation: 'SUM',
          },
          calcSubTotals: {
            aggregation: 'SUM',
          },
        },
        col: {
          showGrandTotals: true,
          showSubTotals: true,
          reverseLayout: true,
          reverseSubLayout: true,
          subTotalsDimensions: ['type'],
          calcTotals: {
            aggregation: 'SUM',
          },
          calcSubTotals: {
            aggregation: 'SUM',
          },
        },
      },
    };
    const s2 = new PivotSheet(container, s2DataConfig, s2Options);

    s2.render();
  });
