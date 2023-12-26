import React from 'react';
import ReactDOM from 'react-dom';
import { SheetComponent, SheetComponentOptions } from '@antv/s2-react';
import '@antv/s2-react/dist/style.min.css';

fetch(
  'https://gw.alipayobjects.com/os/bmw-prod/b942d973-7364-4fad-a10a-369426a61376.json',
)
  .then((res) => res.json())
  .then((dataCfg) => {
    const s2Options: SheetComponentOptions = {
      width: 1000,
      height: 480,
      cornerText: '指标层级',
      hierarchyType: 'tree',
      conditions: {
        text: [
          {
            field: 'number',
            mapping: (value, cellInfo) => {
              const { meta, colIndex } = cellInfo;

              if (colIndex === 0 || !value || !meta?.fieldValue) {
                return {
                  fill: '#000',
                };
              }

              return {
                fill: value > 0 ? '#FF4D4F' : '#29A294',
              };
            },
          },
        ],
      },
      style: {
        dataCell: {
          valuesCfg: {
            originalValueField: 'originalValues',
          },
        },
      },
    };

    ReactDOM.render(
      <SheetComponent
        dataCfg={dataCfg}
        options={s2Options}
        sheetType="strategy"
      />,
      document.getElementById('container'),
    );
  });
