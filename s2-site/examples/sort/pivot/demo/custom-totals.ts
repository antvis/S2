import { PivotSheet, S2DataConfig, EXTRA_FIELD, TOTAL_VALUE } from '@antv/s2';
import '@antv/s2/dist/s2.min.css';

fetch('./data/basic-totals.json')
  .then((res) => res.json())
  .then((data) => {
    const container = document.getElementById('container');
    const s2DataConfig: S2DataConfig = {
      fields: {
        rows: ['province', 'city'],
        columns: ['type'],
        values: ['price'],
      },
      data,
      sortParams: [
        {
          // province 依据（ province - 小计 ）&（ 总计 - price ）& 升序 排序
          sortFieldId: 'province',
          sortMethod: 'ASC',
          sortByMeasure: TOTAL_VALUE,
          query: {
            [EXTRA_FIELD]: 'price',
          },
        },
        {
          // type 依据 （ 浙江 - 小计 ）&（ price ）& 降序 排序
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

    const s2options = {
      width: 800,
      height: 600,
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
    const s2 = new PivotSheet(container, s2DataConfig, s2options);

    s2.render();
  });
