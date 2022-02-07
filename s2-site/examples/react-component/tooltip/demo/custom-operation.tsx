import React from 'react';
import ReactDOM from 'react-dom';
import { SheetComponent } from '@antv/s2-react';
import '@antv/s2-react/dist/style.min.css';

fetch(
  'https://gw.alipayobjects.com/os/bmw-prod/2a5dbbc8-d0a7-4d02-b7c9-34f6ca63cff6.json',
)
  .then((res) => res.json())
  .then((dataCfg) => {
    const s2Options = {
      width: 600,
      height: 480,
      tooltip: {
        operation: {
          menus: [
            {
              key: 'custom-a',
              text: '操作1',
              icon: 'Trend',
              onClick: () => {
                console.log('操作1点击');
              },
            },
            {
              key: 'custom-a',
              text: '操作2',
              icon: 'EyeOutlined',
              onClick: () => {
                console.log('操作2点击');
              },
            },
          ],
        },
      },
    };

    ReactDOM.render(
      <SheetComponent
        sheetType="pivot"
        adaptive={false}
        dataCfg={dataCfg}
        options={s2Options}
      />,
      document.getElementById('container'),
    );
  });
