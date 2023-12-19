import React from 'react';
import ReactDOM from 'react-dom';
import { SheetComponent, SheetComponentOptions } from '@antv/s2-react';
import '@antv/s2-react/dist/style.min.css';

/**
 * 该示例为 React 版本的趋势分析表
 * 如何在普通图表中使用, 请查看: https://s2.antv.antgroup.com/zh/examples/custom/custom-cell#mini-chart
 */

fetch(
  'https://gw.alipayobjects.com/os/bmw-prod/b942d973-7364-4fad-a10a-369426a61376.json',
)
  .then((res) => res.json())
  .then((dataCfg) => {
    const s2Options: SheetComponentOptions = {
      width: 1000,
      height: 480,
      cornerText: '指标层级',
      hierarchyType: 'customTree',
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
