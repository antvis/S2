import React from 'react';
import { SheetComponent, SheetComponentOptions } from '@antv/s2-react';
import { CellType } from '@antv/s2';
import '@antv/s2-react/dist/style.min.css';

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
          // 内置操作项
          hiddenColumns: true,
          menu: {
            // 支持透传 Ant Design <Menu/> 组件 API: https://ant-design.antgroup.com/components/menu-cn#api
            // mode: 'vertical',
            onClick(info, cell) {
              console.log('菜单项点击:', info, cell);
            },
            items: [
              {
                key: 'trend',
                label: '趋势',
                icon: 'Trend',
                // 数值单元格展示
                visible: (cell) => cell.cellType === CellType.DATA_CELL,
                onClick: (info, cell) => {
                  console.log('趋势图 icon 点击: ', info, cell);
                },
              },
            ],
          },
        },
      },
    };

    reactDOMClient
      .createRoot(document.getElementById('container'))
      .render(
        <SheetComponent
          sheetType="pivot"
          adaptive={false}
          dataCfg={dataCfg}
          options={s2Options}
        />,
      );
  });
