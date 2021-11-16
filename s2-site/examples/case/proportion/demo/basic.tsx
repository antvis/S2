import React from 'react';
import ReactDOM from 'react-dom';
import { SheetComponent } from '@antv/s2';
import '@antv/s2/dist/s2.min.css';

fetch(
  'https://gw.alipayobjects.com/os/bmw-prod/8c5cf927-1e22-4f8e-9d1a-f8a6d25790a5.json',
)
  .then((res) => res.json())
  .then((data) => {
    const s2DataConfig = data;
    const s2options = {
      width: 600,
      height: 600,
      style: {
        cellCfg: {
          width: 250,
          height: 130,
          minorMeasureRowIndex: 3,
          firstDerivedMeasureRowIndex: 2,
        },
      },
    };

    ReactDOM.render(
      <SheetComponent
        dataCfg={s2DataConfig}
        options={s2options}
        sheetType="gridAnalysis"
        header={{ title: '人群网络分析' }}
      />,
      document.getElementById('container'),
    );
  });
