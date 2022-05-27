import React from 'react';
import ReactDOM from 'react-dom';
import { SheetComponent } from '@antv/s2-react';
import '@antv/s2-react/dist/style.min.css';

fetch(
  'https://gw.alipayobjects.com/os/bmw-prod/cd9814d0-6dfa-42a6-8455-5a6bd0ff93ca.json',
)
  .then((res) => res.json())
  .then((res) => {
    const s2Options = {
      width: 600,
      height: 480,
      interaction: {
        enableCopy: true,
      },
    };

    const s2DataConfig = {
      fields: {
        rows: ['province', 'city'],
        columns: ['type', 'sub_type'],
        values: ['number'],
      },
      meta: res.meta,
      data: res.data,
    };

    ReactDOM.render(
      <SheetComponent
        dataCfg={s2DataConfig}
        options={s2Options}
        header={{
          exportCfg: {
            open: true,
          },
        }}
        adaptive={false}
      />,
      document.getElementById('container'),
    );
  });
