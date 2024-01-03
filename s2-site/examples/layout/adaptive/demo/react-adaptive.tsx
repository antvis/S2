import { SheetComponent, SheetComponentOptions } from '@antv/s2-react';
import React from 'react';
import { createRoot } from 'react-dom';

fetch(
  'https://gw.alipayobjects.com/os/bmw-prod/2a5dbbc8-d0a7-4d02-b7c9-34f6ca63cff6.json',
)
  .then((res) => res.json())
  .then((dataCfg) => {
    const s2Options: SheetComponentOptions = {
      width: 600,
      height: 480,
    };

    createRoot(document.getElementById('container')).render(
      <SheetComponent
        dataCfg={dataCfg}
        options={s2Options}
        adaptive={{
          width: true,
          height: false,
          getContainer: () => document.getElementById('container'),
        }}
      />,
    );
  });
