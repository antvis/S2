import { PivotSheet } from '@antv/s2';
import '@antv/s2/dist/s2.min.css';

fetch(
  'https://gw.alipayobjects.com/os/bmw-prod/52e8d832-87c1-4657-b958-948b016c480a.json',
)
  .then((res) => res.json())
  .then((data) => {
    const container = document.getElementById('container');
    const s2DataConfig = {
      fields: {
        rows: ['province', 'city'],
        columns: ['type'],
        values: ['price', 'cost'],
      },
      data,
    };

    const s2options = {
      width: 800,
      height: 600,
      hoverHighlight: false,
      conditions: {
        icon: [
          {
            field: 'price',
            position: 'right',
            mapping(fieldValue, data) {
              return {
                // icon 用于指定图标条件格式所使用的 icon 类型
                icon: 'CellUp',
                fill: '#30BF78',
              };
            },
          },
          {
            field: 'cost',
            position: 'left',
            mapping(fieldValue, data) {
              return {
                icon: 'CellDown',
                fill: '#F4664A',
              };
            },
          },
        ],
      },
    };
    const s2 = new PivotSheet(container, s2DataConfig, s2options);

    s2.render();
  });
