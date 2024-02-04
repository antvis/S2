import { PivotSheet, S2DataConfig, S2Options } from '@antv/s2';

fetch(
  'https://render.alipay.com/p/yuyan/180020010001215413/s2/total-group.json',
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
      // 从  @antv/s2 1.53.0-alpha 开始，如果是多度量的场景，我们期望同一个数据里就包含了多个 values 属性，即：
      // [{ province: "四川", city: "成都", type: "商品", price: 100, cost: 80 }]
      // 而不是：
      // [{ province: "四川", city: "成都", type: "商品", price: 100}, {province: "四川", city: "成都", type: "商品", price: 100 }]
      data,
    };

    const s2Options: S2Options = {
      width: 600,
      height: 480,
      tooltip: {
        enable: true,
      },
      interaction: {
        copy: { enable: true },
        selectedCellsSpotlight: true,
        hoverHighlight: true,
      },
      // 配置小计总计显示
      totals: {
        row: {
          showGrandTotals: true,
          showSubTotals: true,
          reverseGrandTotalsLayout: true,
          reverseSubTotalsLayout: true,
          subTotalsDimensions: ['province'],
        },
        col: {
          showGrandTotals: true,
          showSubTotals: true,
          reverseGrandTotalsLayout: true,
          reverseSubTotalsLayout: true,
          subTotalsDimensions: ['type'],
        },
      },
    };

    const s2 = new PivotSheet(container, s2DataConfig, s2Options);

    await s2.render();
  });
