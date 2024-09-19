/* eslint-disable no-console */
// organize-imports-ignore
import React from 'react';
import { PlusCircleFilled } from '@ant-design/icons';
import { SheetComponent, SheetComponentOptions } from '@antv/s2-react';
import { Menu } from 'antd';
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
          menu: {
            // 需要指定 UI 组件, 如 Ant Design <Menu/> 组件: https://ant-design.antgroup.com/components/menu-cn#api
            render(props) {
              return <Menu {...props} />;
            },
            onClick(info, cell) {
              console.log('菜单项点击: ', info, cell);
            },
            items: [
              {
                key: 'custom-a',
                label: '操作1',
                icon: 'Trend',
                onClick: (info, cell) => {
                  console.log('操作1点击:', info, cell);
                },
                children: [
                  {
                    key: 'custom-a-a',
                    label: '操作 1-1',
                    // 支持内置的 icon 和 ReactNode
                    icon: 'Trend',
                    // icon: <PlusCircleFilled />,
                    onClick: (info, cell) => {
                      console.log('操作1-1点击:', info, cell);
                    },
                  },
                ],
              },
              {
                key: 'custom-b',
                label: '操作2',
                icon: 'EyeOutlined',
                onClick: (info, cell) => {
                  console.log('操作2点击:', info, cell);
                },
              },
              {
                key: 'custom-c',
                label: '操作3',
                icon: 'EyeOutlined',
                visible: false,
                onClick: (info, cell) => {
                  console.log('操作3点击:', info, cell);
                },
              },
              {
                key: 'custom-d',
                label: '操作4',
                icon: 'EyeOutlined',
                visible: (cell) => {
                  // 叶子节点才显示
                  const meta = cell.getMeta();

                  return meta.isLeaf;
                },
                onClick: (info, cell) => {
                  console.log('操作4点击:', info, cell);
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
