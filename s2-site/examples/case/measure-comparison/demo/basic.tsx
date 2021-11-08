import React from 'react';
import ReactDOM from 'react-dom';
import { SheetComponent } from '@antv/s2';
import '@antv/s2/dist/s2.min.css';

fetch('../data/index-comparison.json')
  .then((res) => res.json())
  .then((data) => {
    const s2DataConfig = {
      fields: {
        rows: ['province', 'city'],
        columns: ['type'],
        values: ['price'],
      },
      data,
    };

    const s2options = {
      width: 800,
      height: 600,
    };

    ReactDOM.render(
      <SheetComponent
        dataCfg={s2DataConfig}
        options={s2options}
        sheetType="pivot"
      />,
      document.getElementById('container'),
    );
  });
