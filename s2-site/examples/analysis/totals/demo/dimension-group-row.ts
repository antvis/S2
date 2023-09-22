import { PivotSheet } from '@antv/s2';

fetch('https://gw.alipayobjects.com/os/bmw-prod/6eede6eb-8021-4da8-bb12-67891a5705b7.json')
  .then((res) => res.json())
  .then((data) => {
    const container = document.getElementById('container');
    const s2DataConfig = {
      fields: {
        rows: ['province', 'city', 'type'],
        columns: [],
        values: ['price' ,'cost'],
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
      // 配置行小计总计显示,且按维度分组（列小计总计同理）
      totals: {
        row: {
          showGrandTotals: true,
          showSubTotals: true,
          reverseLayout: true,
          reverseSubLayout: true,
          subTotalsDimensions: ['province'],
          calcTotals: {
            // 设置总计汇总计算方式为求和
            aggregation: 'SUM',
          },
          calcSubTotals: {
            // 设置小计汇总计算方式为求和
            aggregation: 'SUM',
          },
          // 总计分组下，city 城市维度会出现分组
          totalsGroupDimensions: ['city'],
          // 小计维度下，type 类别维度下会出现分组
          subTotalsGroupDimensions: ['type'],
        },
      },
    };
    const s2 = new PivotSheet(container, s2DataConfig, s2Options);

    s2.render();
  });
