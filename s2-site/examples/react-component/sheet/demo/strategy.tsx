import React from 'react';
import ReactDOM from 'react-dom';
import { SheetComponent } from '@antv/s2-react';
import '@antv/s2-react/dist/style.min.css';

fetch(
  'https://gw.alipayobjects.com/os/bmw-prod/3c2009ce-8c2a-451d-b29a-619a796c7903.json',
)
  .then((res) => res.json())
  .then((dataCfg) => {
    const s2DataCfg = {
      ...dataCfg,
      fields: {
        ...dataCfg.fields,
        rows: dataCfg.customTreeItems,
      },
    };

    const s2Options = {
      width: 600,
      height: 480,
      cornerText: '指标层级',
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
            // 非必填: 指定原始字段, 用于 导出和 tooltip 展示
            originalValueField: 'originalValues',
            // 非必填: 是否显示原始值
            showOriginalValue: true,
          },
        },
      },
    };

    ReactDOM.render(
      <SheetComponent
        sheetType="strategy"
        dataCfg={s2DataCfg}
        options={s2Options}
      />,
      document.getElementById('container'),
    );
  });
