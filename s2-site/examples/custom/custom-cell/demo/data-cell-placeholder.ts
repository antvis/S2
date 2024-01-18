import { PivotSheet, CornerCell } from '@antv/s2';

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
      meta: res.meta,
      data: res.data.map((item, i) => {
        return {
          ...item,
          number: i < 5 ? item.number : null,
        };
      }),
    };
    const s2Options = {
      width: 600,
      height: 480,
      // 默认 "-"
      // placeholder: '',
      placeholder: (cell) => {
        // 或者根据当前单元格动态设置
        console.log('cell: ', cell);
        if (cell.cellType === 'dataCell') {
          return '*****';
        }

        // 返回 null, 使用默认值 ("-")
        return null;
      },
    };
    const s2 = new PivotSheet(container, s2DataConfig, s2Options);

    s2.render();
  });
