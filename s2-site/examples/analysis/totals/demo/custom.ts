import { PivotSheet, EXTRA_FIELD, QueryDataType } from '@antv/s2';

fetch('https://render.alipay.com/p/yuyan/180020010001215413/s2/basic.json')
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

    const calcFunc = (query, data, spreadsheet) => {
      const allData = spreadsheet.dataSet.getMultiData(query, {
        queryType: QueryDataType.All,
      });

      console.log('data (明细数据):', data);
      console.log('data (全部数据, 含汇总):', allData);

      const sum = data.reduce((pre, next) => {
        return pre + next[next[EXTRA_FIELD]];
      }, 0);
      return sum * 2;
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
            calcFunc,
          },
          calcSubTotals: {
            calcFunc,
          },
        },
        col: {
          showGrandTotals: true,
          showSubTotals: true,
          reverseLayout: true,
          reverseSubLayout: true,
          subTotalsDimensions: ['type'],
          calcTotals: {
            calcFunc,
          },
          calcSubTotals: {
            calcFunc,
          },
        },
      },
    };
    const s2 = new PivotSheet(container, s2DataConfig, s2Options);

    s2.render();
  });
