import React from 'react';
import { SheetComponent, SheetComponentOptions } from '@antv/s2-react';
import '@antv/s2-react/dist/style.min.css';
import { S2DataConfig } from '@antv/s2';

fetch(
  'https://gw.alipayobjects.com/os/bmw-prod/cd9814d0-6dfa-42a6-8455-5a6bd0ff93ca.json',
)
  .then((res) => res.json())
  .then((res) => {
    const s2Options: SheetComponentOptions = {
      width: 600,
      height: 480,
      interaction: {
        copy: { enable: true },
      },
    };

    const s2DataConfig: S2DataConfig = {
      fields: {
        rows: ['province', 'city'],
        columns: ['type', 'sub_type'],
        values: ['number'],
      },
      meta: res.meta,
      data: res.data,
    };

    reactDOMClient.createRoot(document.getElementById('container')).render(
      <SheetComponent
        dataCfg={s2DataConfig}
        options={s2Options}
        header={{
          export: {
            open: true,
          },
        }}
        adaptive={false}
      />,
    );
  });
