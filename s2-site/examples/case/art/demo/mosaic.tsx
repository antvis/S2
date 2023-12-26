import React from 'react';
import ReactDOM from 'react-dom';
import { SheetComponent, SheetComponentOptions } from '@antv/s2-react';
import '@antv/s2-react/dist/style.min.css';
import { ThemeCfg } from '@antv/s2';

// more Info https://observablehq.com/@pearmini/mosaic-antv-s2

fetch(
  'https://gw.alipayobjects.com/os/bmw-prod/7f6ebbb4-ffeb-4f6c-a763-6faa8c0ccf7a.json',
)
  .then((res) => res.json())
  .then((dataCfg) => {
    const s2Options: SheetComponentOptions = {
      width: 700,
      height: 575,
      frozen: {
        rowHeader: false,
      },
      conditions: {
        background: [
          {
            field: 'color',
            mapping: (fill) => ({ fill }),
          },
        ],
      },
      interaction: {
        hoverHighlight: false,
        hoverFocus: false,
      },
      style: {
        layoutWidthType: 'compact',
        colCell: {
          height: 0,
          widthByField: {
            color: 23,
          },
        },
        dataCell: {
          height: 23,
        },
      },
    };

    const customTheme: ThemeCfg['theme'] = {
      rowCell: {
        cell: {
          backgroundColor: dataCfg.data[0].color,
          horizontalBorderColorOpacity: 0,
          verticalBorderColorOpacity: 0,
        },
      },
      dataCell: {
        text: {
          opacity: 0,
        },
        cell: {
          horizontalBorderColorOpacity: 0,
          verticalBorderColorOpacity: 0,
        },
      },
      splitLine: {
        horizontalBorderColorOpacity: 0,
        verticalBorderColorOpacity: 0,
      },
      background: {
        color: dataCfg.data[0].color,
      },
      scrollBar: {
        size: 0,
      },
    };

    ReactDOM.render(
      <SheetComponent
        dataCfg={dataCfg}
        options={s2Options}
        themeCfg={{ theme: customTheme }}
      />,
      document.getElementById('container'),
    );
  });
