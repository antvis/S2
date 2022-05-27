import { PivotSheet } from '@antv/s2';

fetch(
  'https://gw.alipayobjects.com/os/bmw-prod/cadff60b-363b-438a-b490-eb3367b998b3.json',
)
  .then((res) => res.json())
  .then((data) => {
    const container = document.getElementById('container');
    const s2DataConfig = {
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
      data,
    };

    const s2Options = {
      width: 600,
      height: 480,
      selectedCellsSpotlight: true,
      hoverHighlight: true,
      tooltip: {
        showTooltip: true,
      },
      interaction: {
        enableCopy: true,
      },
      // 配置小计总计显示
      totals: {
        row: {
          showGrandTotals: true,
          showSubTotals: true,
          reverseLayout: true,
          reverseSubLayout: true,
          subTotalsDimensions: ['province'],
        },
        col: {
          showGrandTotals: true,
          showSubTotals: true,
          reverseLayout: true,
          reverseSubLayout: true,
          subTotalsDimensions: ['type'],
        },
      },
    };
    const s2 = new PivotSheet(container, s2DataConfig, s2Options);

    s2.render();
  });
