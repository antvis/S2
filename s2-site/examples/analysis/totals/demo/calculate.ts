import { PivotSheet, S2DataConfig, S2Options, Aggregation } from '@antv/s2';

fetch(
  'https://render.alipay.com/p/yuyan/180020010001215413/s2/basic.json001215413-dev-S09001736318/s2/basic.json',
)
  .then((res) => res.json())
  .then(async (data) => {
    const container = document.getElementById('container');
    const s2DataConfig: S2DataConfig = {
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

    const s2Options: S2Options = {
      width: 600,
      height: 480,
      // 配置小计总计显示
      totals: {
        row: {
          showGrandTotals: true,
          showSubTotals: true,
          reverseGrandTotalsLayout: true,
          reverseSubTotalsLayout: true,
          subTotalsDimensions: ['province'],
          calcGrandTotals: {
            aggregation: Aggregation.SUM,
          },
          calcSubTotals: {
            aggregation: Aggregation.SUM,
          },
        },
        col: {
          showGrandTotals: true,
          showSubTotals: true,
          reverseGrandTotalsLayout: true,
          reverseSubTotalsLayout: true,
          subTotalsDimensions: ['type'],
          calcGrandTotals: {
            aggregation: Aggregation.SUM,
          },
          calcSubTotals: {
            aggregation: Aggregation.SUM,
          },
        },
      },
    };

    const s2 = new PivotSheet(container, s2DataConfig, s2Options);

    await s2.render();
  });
