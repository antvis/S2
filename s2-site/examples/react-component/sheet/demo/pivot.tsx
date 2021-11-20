import React from 'react';
import ReactDOM from 'react-dom';
import { SheetComponent } from '@antv/s2-react';
import '@antv/s2-react/dist/style.min.css';

fetch('../data/basic.json')
  .then((res) => res.json())
  .then((res) => {
    const s2Options = {
      width: 600,
      height: 480,
    };

    const s2DataConfig = {
      fields: {
        rows: ['province', 'city'],
        columns: ['type'],
        values: ['price', 'cost'],
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
      data: res,
    };

    ReactDOM.render(
      <SheetComponent dataCfg={s2DataConfig} options={s2Options} />,
      document.getElementById('container'),
    );
  });
