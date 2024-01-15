import {
  PivotSheet,
  EXTRA_FIELD,
  TOTAL_VALUE,
  S2DataConfig,
  S2Options,
} from '@antv/s2';

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
      data,
      sortParams: [
        {
          // province 依据行（`province-小计`）与列（`总计-price`）交叉的数据升序排序
          sortFieldId: 'province',
          sortMethod: 'ASC',
          sortByMeasure: TOTAL_VALUE,
          query: {
            [EXTRA_FIELD]: 'price',
          },
        },
        {
          // type 依据行（`浙江-小计`）与列（`type-小计`）交叉的数据倒序排序
          sortFieldId: 'type',
          sortMethod: 'DESC',
          sortByMeasure: TOTAL_VALUE,
          query: {
            province: '浙江',
            [EXTRA_FIELD]: 'price',
          },
        },
      ],
    };

    const s2Options: S2Options = {
      width: 600,
      height: 480,
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
