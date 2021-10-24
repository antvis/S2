import { PivotSheet, EXTRA_FIELD } from '@antv/s2';
import '@antv/s2/dist/s2.min.css';

fetch('./data/basic.json')
  .then((res) => res.json())
  .then((data) => {
    const container = document.getElementById('container');
    const s2DataConfig = {
      fields: {
        rows: ['province', 'city'],
        columns: ['type'],
        values: ['price'],
      },
      data,
      sortParams: [
        {
          // sortFieldId 为维度值时，params.data 为维度值列表
          sortFieldId: 'province',
          sortFunc: (params) => {
            const { data } = params;
            return (data as string[])?.sort((a, b) => a?.localeCompare(b));
          },
        },
        {
          // sortFieldId 为度量值时，需传入 query 定位数值列表，params.data 为带有度量值的 data 列表
          sortFieldId: 'city',
          sortByMeasure: 'price',
          sortFunc: function (params) {
            const { data, sortByMeasure, sortFieldId } = params || {};
            return data
              ?.sort((a, b) => b[sortByMeasure] - a[sortByMeasure])
              ?.map((item) => item[sortFieldId]);
          },
          query: { type: '纸张', [EXTRA_FIELD]: 'price' },
        },
      ],
    };

    const s2options = {
      width: 800,
      height: 600,
    };
    const s2 = new PivotSheet(container, s2DataConfig, s2options);

    s2.render();
  });
