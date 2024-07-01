// organize-imports-ignore
import React from 'react';
import { S2DataConfig, type S2RenderOptions, type SpreadSheet } from '@antv/s2';
import { SheetComponent, SheetComponentOptions } from '@antv/s2-react';
import '@antv/s2-react/dist/s2-react.min.css';

fetch('https://assets.antv.antgroup.com/s2/basic-table-mode.json')
  .then((res) => res.json())
  .then((res) => {
    const s2Options: SheetComponentOptions = {
      width: 600,
      height: 480,
    };

    const s2DataConfig: S2DataConfig = {
      fields: {
        columns: ['province', 'city', 'type', 'price', 'cost'],
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
          dataCfg={s2DataConfig}
          options={s2Options}
          sheetType="table"
          onMounted={onMounted}
          onUpdate={onUpdate}
          onUpdateAfterRender={onUpdateAfterRender}
        />,
      );
  });
