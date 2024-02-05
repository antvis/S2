/* eslint-disable max-lines-per-function */
import { S2DataConfig, S2Options, S2Theme, TableSheet } from '@antv/s2';

fetch(
  'https://render.alipay.com/p/yuyan/180020010001215413/s2/basic.json',
)
  .then((res) => res.json())
  .then(async (data) => {
    const container = document.getElementById('container');
    const s2DataConfig: S2DataConfig = {
      fields: {
        columns: ['province', 'city', 'type', 'price', 'cost'],
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
          field: 'type',
          name: '商品类别',
        },
        {
          field: 'price',
          name: '价格',
        },
        {
          field: 'cost',
          name: '成本',
        },
      ],
      data,
    };

    const s2Options: S2Options = {
      width: 600,
      height: 480,
    };

    const BORDER_COLOR = 'rgb(39, 44, 65)';
    const BACK_COLOR = 'rgb(67, 72, 91)';
    const HEADER_BACK_COLOR = '#353c59';
    const CELL_ACTIVE_BACK_COLOR = '#434c6c';

    const customTheme: S2Theme = {
      background: {
        color: HEADER_BACK_COLOR,
      },
      cornerCell: {
        cell: {
          horizontalBorderColor: BORDER_COLOR,
          verticalBorderColor: BORDER_COLOR,
          padding: {
            top: 12,
            right: 8,
            bottom: 12,
            left: 8,
          },
          backgroundColor: HEADER_BACK_COLOR,
        },
        text: {
          fill: '#fff',
        },
        bolderText: {
          fill: '#fff',
          opacity: 0.4,
        },
      },
      splitLine: {
        horizontalBorderColor: BORDER_COLOR,
        horizontalBorderColorOpacity: 1,
        horizontalBorderWidth: 2,
        verticalBorderColor: BORDER_COLOR,
        verticalBorderColorOpacity: 1,
        verticalBorderWidth: 2,
        showShadow: true,
        shadowWidth: 10,
        shadowColors: {
          left: 'rgba(0,0,0,0.1)',
          right: 'rgba(0,0,0,0)',
        },
      },
      colCell: {
        cell: {
          horizontalBorderColor: BORDER_COLOR,
          verticalBorderColor: BORDER_COLOR,
          verticalBorderWidth: 2,
          horizontalBorderWidth: 2,
          padding: {
            top: 12,
            right: 8,
            bottom: 12,
            left: 8,
          },
          backgroundColor: HEADER_BACK_COLOR,
          interactionState: {
            hover: {
              backgroundColor: CELL_ACTIVE_BACK_COLOR,
              backgroundOpacity: 1,
            },
            selected: {
              backgroundColor: 'rgb(63, 69, 97)',
            },
          },
        },
        text: {
          fill: '#fff',
        },
        bolderText: {
          fill: '#fff',
          opacity: 0.4,
        },
      },
      dataCell: {
        icon: {
          size: 14,
          margin: {
            left: 10,
          },
        },
        cell: {
          interactionState: {
            hover: {
              backgroundColor: CELL_ACTIVE_BACK_COLOR,
              backgroundOpacity: 1,
            },
            hoverFocus: {
              backgroundColor: CELL_ACTIVE_BACK_COLOR,
              backgroundOpacity: 1,
              borderColor: 'blue',
            },
            selected: {
              backgroundColor: CELL_ACTIVE_BACK_COLOR,
              backgroundOpacity: 1,
            },
            unselected: {
              backgroundOpacity: 1,
              opacity: 1,
            },
            prepareSelect: {
              borderColor: CELL_ACTIVE_BACK_COLOR,
            },
          },
          horizontalBorderColor: BORDER_COLOR,
          verticalBorderColor: BORDER_COLOR,
          verticalBorderWidth: 2,
          horizontalBorderWidth: 2,
          padding: {
            top: 0,
            right: 8,
            bottom: 2,
            left: 0,
          },
          backgroundColorOpacity: 0.9,
          backgroundColor: BACK_COLOR,
          crossBackgroundColor: BACK_COLOR,
        },
        text: {
          fill: '#fff',
        },
      },
    };

    const s2 = new TableSheet(container, s2DataConfig, s2Options);

    s2.setTheme(customTheme);

    await s2.render();
  });
