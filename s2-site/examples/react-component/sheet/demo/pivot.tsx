// organize-imports-ignore
import React from 'react';
import type { S2RenderOptions, SpreadSheet } from '@antv/s2';
import { SheetComponent, SheetComponentOptions } from '@antv/s2-react';
import '@antv/s2-react/dist/s2-react.min.css';

fetch(
  'https://gw.alipayobjects.com/os/bmw-prod/2a5dbbc8-d0a7-4d02-b7c9-34f6ca63cff6.json',
)
  .then((res) => res.json())
  .then((dataCfg) => {
    const s2Options: SheetComponentOptions = {
      width: 600,
      height: 480,
    };

    const onMounted = (spreadsheet: SpreadSheet) => {
      console.log('onMounted:', spreadsheet);
    };

    const onUpdate = (renderOptions: S2RenderOptions) => {
      console.log('onUpdate:', renderOptions);

      return renderOptions;
    };

    const onUpdateAfterRender = (renderOptions: S2RenderOptions) => {
      console.log('onUpdateAfterRender:', renderOptions);
    };

    reactDOMClient
      .createRoot(document.getElementById('container'))
      .render(
        <SheetComponent
          dataCfg={dataCfg}
          options={s2Options}
          onMounted={onMounted}
          onUpdate={onUpdate}
          onUpdateAfterRender={onUpdateAfterRender}
        />,
      );
  });
