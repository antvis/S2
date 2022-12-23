import React from 'react';
import ReactDOM from 'react-dom';
import { SheetComponent, SheetComponentOptions } from '@antv/s2-react';
import '@antv/s2-react/dist/style.min.css';
import { CellTypes } from '@antv/s2';

fetch(
  'https://gw.alipayobjects.com/os/bmw-prod/2a5dbbc8-d0a7-4d02-b7c9-34f6ca63cff6.json',
)
  .then((res) => res.json())
  .then((dataCfg) => {
    const s2Options: SheetComponentOptions = {
      width: 600,
      height: 480,
      tooltip: {
        operation: {
          hiddenColumns: true,
          menus: [
            {
              key: 'trend',
              text: '趋势',
              icon: 'Trend',
              // 数值单元格展示
              visible: (cell) => cell.cellType === CellTypes.DATA_CELL,
              onClick: (cell) => {
                console.log('趋势图 icon 点击: ', cell);
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
