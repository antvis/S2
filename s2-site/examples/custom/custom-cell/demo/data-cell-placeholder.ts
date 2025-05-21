import { PivotSheet, S2DataConfig, S2Options } from '@antv/s2';

fetch(
  'https://gw.alipayobjects.com/os/bmw-prod/cd9814d0-6dfa-42a6-8455-5a6bd0ff93ca.json',
)
  .then((res) => res.json())
  .then(async (res) => {
    const container = document.getElementById('container');
    const s2DataConfig: S2DataConfig = {
      fields: {
        rows: ['province', 'city'],
        columns: ['type', 'sub_type'],
        values: ['number'],
      },
      meta: res.meta,
      data: [{
        number: 7789,
        province: null,
        city: null,
        type: null,
        sub_type: null,
      }].concat(res.data.map((item, i) => {
        return {
          ...item,
          number: i < 5 ? item.number : null,
        };
      })),
    };

    const s2Options: S2Options = {
      width: 600,
      height: 480,
      // 默认配置影响所有单元格
      // placeholder: {
      //   cell: '',
      // },
      placeholder: {
        cell: (meta) => {
          // 仅影响数值单元格
          if (meta.valueField) {
            return '*****';
          }
          return null;
        },
      },
    };

    const s2 = new PivotSheet(container, s2DataConfig, s2Options);

    await s2.render();
  });
