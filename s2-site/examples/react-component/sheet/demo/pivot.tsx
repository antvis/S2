import React from 'react';
import ReactDOM from 'react-dom';
import { SheetComponent } from '@antv/s2';
import '@antv/s2/dist/s2.min.css';

fetch('../data/basic.json')
  .then((res) => res.json())
  .then((res) => {
    const s2options = {
      width: 600,
      height: 400,
    };

    const s2DataConfig = {
      fields: {
        rows: ['province', 'city'],
        columns: ['type'],
        values: ['price'],
      },
      data: res,
    };

    ReactDOM.render(
      <SheetComponent dataCfg={s2DataConfig} options={s2options} />,
      document.getElementById('container'),
    );
  });
