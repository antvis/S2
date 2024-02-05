import {
  PivotSheet,
  EXTRA_FIELD,
  QueryDataType,
  S2Options,
  S2DataConfig,
} from '@antv/s2';

fetch(
  'https://gw.alipayobjects.com/os/bmw-prod/4347c2dd-6554-451b-9d44-15b04e5de657.json',
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
      interaction: {
        selectedCellsSpotlight: true,
        hoverHighlight: true,
        copy: { enable: true },
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

    // 获取所有浙江下的数据
    const allData = s2.dataSet.getCellMultiData({
      query: {
        province: '浙江',
        [EXTRA_FIELD]: 'price',
      },
      queryType: QueryDataType.All,
    });

    console.log('所有数据', allData);

    // 获取所有浙江下的明细数据
    const detailData = s2.dataSet.getCellMultiData({
      query: {
        province: '浙江',
        [EXTRA_FIELD]: 'price',
      },
      queryType: QueryDataType.DetailOnly,
    });

    console.log('所有明细数据', detailData);
  });
