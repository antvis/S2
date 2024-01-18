import { PivotSheet, EXTRA_FIELD } from '@antv/s2';

fetch('https://render.alipay.com/p/yuyan/180020010001215413/s2/basic.json')
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
      sortParams: [
        {
          // sortFieldId 为维度值时，params.data 为维度值列表
          sortFieldId: 'province',
          sortFunc: (params) => {
            const { data } = params;
            return data?.sort((a, b) => a?.localeCompare(b));
          },
        },
        {
          // 支持使用度量值进行自定义计算
          sortFieldId: 'city',
          sortByMeasure: 'price',
          // 当使用 sortByMeasure 时，可以传入 query 定位数值列表
          // 如下方限定 params.data 为 type=纸张, 数值=price 的数据
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

    const s2Options = {
      width: 600,
      height: 480,
    };
    const s2 = new PivotSheet(container, s2DataConfig, s2Options);

    s2.render();
  });
