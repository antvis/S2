import { PivotSheet, S2Options } from '@antv/s2';

fetch(
  'https://gw.alipayobjects.com/os/bmw-prod/2a5dbbc8-d0a7-4d02-b7c9-34f6ca63cff6.json',
)
  .then((res) => res.json())
  .then(async (dataCfg) => {
    const container = document.getElementById('container');

    const s2Options: S2Options = {
      width: 600,
      height: 480,
      interaction: {
        hoverHighlight: false,
      },
      conditions: {
        text: [
          {
            field: 'number',
            mapping(fieldValue) {
              if (fieldValue >= 7000) {
                return {
                  fill: '#fff',
                };
              }
            },
          },
        ],
        background: [
          {
            field: 'number',
            mapping(fieldValue) {
              if (fieldValue <= 1397) {
                return {
                  fill: '#B8E1FF',
                };
              }

              if (fieldValue <= 2797) {
                return {
                  fill: '#9AC5FF',
                };
              }

              if (fieldValue <= 4191) {
                return {
                  fill: '#7DAAFF',
                };
              }

              if (fieldValue <= 5588) {
                return {
                  fill: '#5B8FF9',
                };
              }

              if (fieldValue <= 6985) {
                return {
                  fill: '#3D76DD',
                };
              }

              return {
                fill: '#085EC0',
              };
            },
          },
        ],
      },
    };

    const s2 = new PivotSheet(container, dataCfg, s2Options);

    await s2.render();
  });
