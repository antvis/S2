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
      headerActionIcons: [
        {
          icons: ['ArrowUp'],
          belongsCell: 'rowCell',
        },
        {
          icons: ['CellUp'],
          belongsCell: 'colCell',
        },
        {
          icons: ['CellDown'],
          belongsCell: 'cornerCell',
        },
      ],
      conditions: {
        icon: [
          {
            field: 'city',
            mapping() {
              return {
                icon: 'Trend',
                fill: '#DB6BCF',
              };
            },
          },
          {
            field: 'sub_type',
            position: 'left',
            mapping(fieldValue) {
              if (fieldValue !== '子类别') {
                return {
                  icon: 'CellDown',
                  fill: '#025DF4',
                };
              }
            },
          },
        ],
      },
    };

    const s2 = new PivotSheet(container, dataCfg, s2Options);

    await s2.render();
  });
