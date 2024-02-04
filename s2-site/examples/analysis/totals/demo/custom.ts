import { PivotSheet, VALUE_FIELD, S2DataConfig, S2Options } from '@antv/s2';

fetch('https://render.alipay.com/p/yuyan/180020010001215413/s2/basic.json')
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

    const calcFunc = (query, data) => {
      const sum = data.reduce((pre, next) => {
        return pre + next[VALUE_FIELD];
      }, 0);

      return sum * 2;
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
            calcFunc,
          },
          calcSubTotals: {
            calcFunc,
          },
        },
        col: {
          showGrandTotals: true,
          showSubTotals: true,
          reverseGrandTotalsLayout: true,
          reverseSubTotalsLayout: true,
          subTotalsDimensions: ['type'],
          calcGrandTotals: {
            calcFunc,
          },
          calcSubTotals: {
            calcFunc,
          },
        },
      },
    };

    const s2 = new PivotSheet(container, s2DataConfig, s2Options);

    await s2.render();
  });
