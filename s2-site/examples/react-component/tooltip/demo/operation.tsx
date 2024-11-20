/* eslint-disable no-console */
// organize-imports-ignore
import { PlusCircleFilled } from '@ant-design/icons';
import React from 'react';
import { CellType } from '@antv/s2';
import { Menu } from 'antd';
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
      tooltip: {
        operation: {
          // 内置操作项
          hiddenColumns: true,
          // 自定义操作项
          menu: {
            // 需要指定 UI 组件, 如 Ant Design <Menu/> 组件: https://ant-design.antgroup.com/components/menu-cn#api
            render(props) {
              return <Menu {...props} />;
            },
            onClick(info, cell) {
              console.log('菜单项点击:', info, cell);
            },
            items: [
              {
                key: 'trend',
                label: '趋势',
                // 支持内置的 icon 和 ReactNode
                icon: 'Trend',
                // icon: <PlusCircleFilled />,
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
