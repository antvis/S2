import { Aggregation, PivotSheet, S2DataConfig, S2Options } from '@antv/s2';

fetch(
  'https://render.alipay.com/p/yuyan/180020010001215413/s2/total-group.json',
)
  .then((res) => res.json())
  .then(async (data) => {
    const container = document.getElementById('container');
    const s2DataConfig: S2DataConfig = {
      fields: {
        rows: [],
        columns: ['province', 'city', 'type'],
        values: ['price', 'cost'],
        valueInCols: false,
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
      // 配置行小计总计显示,且按维度分组（列小计总计同理）
      totals: {
        col: {
          showGrandTotals: true,
          showSubTotals: true,
          reverseGrandTotalsLayout: true,
          reverseSubTotalsLayout: true,
          subTotalsDimensions: ['province'],
          calcGrandTotals: {
            // 设置总计汇总计算方式为求和
            aggregation: Aggregation.SUM,
          },
          calcSubTotals: {
            // 设置小计汇总计算方式为求和
            aggregation: Aggregation.SUM,
          },
          // 总计分组下，city 城市维度会出现分组
          grandTotalsGroupDimensions: ['city'],
          // 小计维度下，type 类别维度下会出现分组
          subTotalsGroupDimensions: ['type'],
        },
      },
    };

    const s2 = new PivotSheet(container, s2DataConfig, s2Options);

    await s2.render();
  });
