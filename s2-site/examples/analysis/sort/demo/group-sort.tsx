import React from 'react';

import { SheetComponent, SheetComponentOptions } from '@antv/s2-react';
import '@antv/s2-react/dist/style.min.css';
import { S2DataConfig } from '@antv/s2';

fetch(
  'https://render.alipay.com/p/yuyan/180020010001215413/s2/basic.json',
)
  .then((res) => res.json())
  .then((data) => {
    const s2DataConfig: S2DataConfig = {
      fields: {
        rows: ['province', 'city'],
        columns: ['type'],
        values: ['price'],
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
      ],
      data,
    };

    const s2Options: SheetComponentOptions = {
      width: 600,
      height: 480,
      showDefaultHeaderActionIcon: true,
    };

    reactDOMClient
      .createRoot(document.getElementById('container'))
      .render(
        <SheetComponent
          sheetType="pivot"
          adaptive={false}
          dataCfg={s2DataConfig}
          options={s2Options}
        />,
      );
  });
