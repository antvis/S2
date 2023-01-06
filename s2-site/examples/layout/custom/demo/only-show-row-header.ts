import { S2DataConfig, S2Options } from '@antv/s2';
import { PivotSheet } from '@antv/s2';

fetch('https://assets.antv.antgroup.com/s2/basic.json')
  .then((res) => res.json())
  .then((data) => {
    const container = document.getElementById('container');
    const s2DataConfig: S2DataConfig = {
      fields: {
        rows: ['province', 'city'],
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
          field: 'price',
          name: '价格',
        },
      ],
      data,
    };

    const s2Options: S2Options = {
      width: 600,
      height: 480,
      style: {
        colCfg: {
          // 当只有行头和数值时, 隐藏数值, 可以让表格只显示行头
          hideMeasureColumn: true,
        },
      },
    };
    const s2 = new PivotSheet(container, s2DataConfig, s2Options);

    s2.render();
  });
