import { PivotSheet, SpreadSheet, Node } from '@antv/s2';
import '@antv/s2/dist/s2.min.css';

fetch(
  'https://gw.alipayobjects.com/os/bmw-prod/cd9814d0-6dfa-42a6-8455-5a6bd0ff93ca.json',
)
  .then((res) => res.json())
  .then((res) => {
    const container = document.getElementById('container');
    const s2DataConfig = {
      fields: {
        rows: ['province', 'city'],
        columns: ['type', 'sub_type'],
        values: ['number'],
      },
      data: res.data,
    };

    const s2Options = {
      width: 600,
      height: 480,
      layoutArrange: (s2, parent, field, fieldValues) => {
        console.log(fieldValues);
        if (field === 'city' && parent.label === '浙江省') {
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

    s2.render();
  });
