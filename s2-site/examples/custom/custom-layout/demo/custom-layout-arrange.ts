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
      data: res.data,
      meta: [
        {
          field: 'number',
          name: '数量',
        },
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
          name: '类别',
        },
        {
          field: 'sub_type',
          name: '子类别',
        },
      ],
    };

    const s2Options: S2Options = {
      width: 600,
      height: 480,
      layoutArrange: (s2, parent, field, fieldValues) => {
        console.log(fieldValues);
        if (field === 'city' && parent.value === '浙江省') {
          // layoutArrange 可手动设置行、列顺序，适用于局部调整，非规则调整。
          // 手动设置浙江省内部市的顺序，比如指定「宁波市」在第一位。
          const keyIndex = fieldValues.indexOf('宁波市');

          fieldValues.splice(keyIndex, 1);
          fieldValues.unshift('宁波市');
        }

        return fieldValues;
      },
    };

    const s2 = new PivotSheet(container, s2DataConfig, s2Options);

    await s2.render();
  });
