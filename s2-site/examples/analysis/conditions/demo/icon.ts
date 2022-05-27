import { PivotSheet } from '@antv/s2';

fetch(
  'https://gw.alipayobjects.com/os/bmw-prod/2a5dbbc8-d0a7-4d02-b7c9-34f6ca63cff6.json',
)
  .then((res) => res.json())
  .then((dataCfg) => {
    const container = document.getElementById('container');

    const s2Options = {
      width: 600,
      height: 480,
      interaction: {
        hoverHighlight: false,
      },
      conditions: {
        icon: [
          {
            field: 'number',
            position: 'right',
            mapping(fieldValue, data) {
              return {
                // icon 用于指定图标条件格式所使用的 icon 类型
                icon: 'CellUp',
                fill: '#30BF78',
              };
            },
          },
        ],
      },
    };
    const s2 = new PivotSheet(container, dataCfg, s2Options);

    s2.render();
  });
