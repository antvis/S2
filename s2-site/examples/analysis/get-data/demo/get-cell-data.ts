import { PivotSheet, EXTRA_FIELD } from '@antv/s2';

fetch(
  'https://gw.alipayobjects.com/os/bmw-prod/4347c2dd-6554-451b-9d44-15b04e5de657.json',
)
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

    // 获取明细单元格
    const cellData = s2.dataSet.getCellData({
      query: {
        province: '浙江',
        city: '杭州',
        type: '笔',
        [EXTRA_FIELD]: 'price',
      },
    });

    console.log('单个数据', cellData);

    // 获取小计数据
    const subTotalData = s2.dataSet.getCellData({
      query: {
        province: '浙江',
        type: '笔',
        [EXTRA_FIELD]: 'price',
      },
      isTotals: true,
    });

    console.log('小计数据', subTotalData);
  });
