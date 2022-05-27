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
              onClick: (cell) => {
                console.log('操作1点击', cell);
              },
              children: [
                {
                  key: 'custom-a-a',
                  text: '操作 1-1',
                  icon: 'Trend',
                  onClick: () => {
                    console.log('操作 1-1 点击');
                  },
                },
              ],
            },
            {
              key: 'custom-b',
              text: '操作2',
              icon: 'EyeOutlined',
              onClick: () => {
                console.log('操作2点击');
              },
            },
            {
              key: 'custom-c',
              text: '操作3',
              icon: 'EyeOutlined',
              visible: false,
              onClick: () => {
                console.log('操作3点击');
              },
            },
            {
              key: 'custom-c',
              text: '操作4',
              icon: 'EyeOutlined',
              visible: (cell) => {
                // 叶子节点才显示
                const meta = cell.getMeta();
                return meta.isLeaf;
              },
              onClick: () => {
                console.log('操作4点击');
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
