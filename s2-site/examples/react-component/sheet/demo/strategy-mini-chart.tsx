import React from 'react';
import ReactDOM from 'react-dom';
import { SheetComponent } from '@antv/s2-react';
import '@antv/s2-react/dist/style.min.css';

fetch(
  'https://gw.alipayobjects.com/os/bmw-prod/b942d973-7364-4fad-a10a-369426a61376.json',
)
  .then((res) => res.json())
  .then((dataCfg) => {
    const s2Options = {
      width: 1000,
      height: 480,
      cornerText: '指标层级',
      hierarchyType: 'customTree',
      conditions: {
        text: [
          {
            field: 'number',
            mapping: (value, cellInfo) => {
              const { meta } = cellInfo;
              if (
                meta?.fieldValue?.values[0][0] === value ||
                !value ||
                !meta?.fieldValue
              ) {
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
        cellCfg: {
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
