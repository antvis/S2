import { PivotSheet } from '@antv/s2';

fetch(
  'https://gw.alipayobjects.com/os/bmw-prod/4e49b398-5121-4f00-9607-4854aedd5a21.json',
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
        bidirectionalInterval: true,
        interval: [
          {
            field: 'delta',
            mapping() {
              return {
                fill: '#80BFFF',
                negativeFill: '#F4664A',
              };
            },
          },
        ],
      },
    };
    const s2 = new PivotSheet(container, dataCfg, s2Options);

    s2.render();
  });
