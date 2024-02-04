import React from 'react';
import { SheetComponent, SheetComponentOptions } from '@antv/s2-react';
import { S2DataConfig } from '@antv/s2';
import '@antv/s2-react/dist/style.min.css';

fetch('https://render.alipay.com/p/yuyan/180020010001215413/s2/basic.json')
  .then((res) => res.json())
  .then((data) => {
    const dataCfg: S2DataConfig = {
      meta: [
        {
          field: 'price',
          name: '价格',
          description: '价格说明。。',
        },
        {
          field: 'province',
          name: '省份',
          description: '省份说明。。',
        },
        {
          field: 'city',
          name: '城市',
          description: '城市说明。。',
        },
        {
          field: 'type',
          name: '类别',
          description: '类别说明。。',
        },
      ],
      fields: {
        rows: ['province', 'city'],
        columns: ['type'],
        values: ['price'],
        valueInCols: true,
      },
      data,
    };

    const s2Options: SheetComponentOptions = {
      width: 600,
      height: 480,
      tooltip: {
        enable: true,
      },
    };

    reactDOMClient
      .createRoot(document.getElementById('container'))
      .render(
        <SheetComponent
          sheetType="pivot"
          dataCfg={dataCfg}
          options={s2Options}
        />,
      );
  });
