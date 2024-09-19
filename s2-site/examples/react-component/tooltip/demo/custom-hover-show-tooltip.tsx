/* eslint-disable no-console */
// organize-imports-ignore
import React from 'react';
import { SpreadSheet } from '@antv/s2';
import {
  SheetComponent,
  SheetComponentOptions,
  SheetComponentProps,
} from '@antv/s2-react';
import { Menu } from 'antd';
import '@antv/s2-react/dist/s2-react.min.css';

fetch(
  'https://gw.alipayobjects.com/os/bmw-prod/2a5dbbc8-d0a7-4d02-b7c9-34f6ca63cff6.json',
)
  .then((res) => res.json())
  .then((dataCfg) => {
    const CustomColCellTooltip = () => <div>col cell tooltip</div>;
    const CustomRowCellTooltip = () => <div>row cell tooltip</div>;
    const CustomDataCellTooltip = () => <div>data cell tooltip</div>;

    const s2Options: SheetComponentOptions = {
      width: 600,
      height: 480,
      tooltip: {
        enable: true,
        operation: {
          menu: {
            render(props) {
              return <Menu {...props} />;
            },
          },
        },
      },
      interaction: {
        // 禁用默认的悬停聚焦效果, 防止出现默认的 tooltip (hover 在数值单元格 800ms 后, 会显示 tooltip)
        hoverFocus: false,
      },
    };

    const App = () => {
      const s2Ref = React.useRef<SpreadSheet>();

      const onColCellHover: SheetComponentProps['onColCellHover'] = ({
        event,
      }) => {
        // 查看更多配置项: https://s2.antv.antgroup.com/api/basic-class/base-tooltip#tooltipshowoptions
        s2Ref.current?.showTooltip({
          position: {
            x: event.clientX,
            y: event.clientY,
          },
          content: <CustomColCellTooltip />,
          // 自定义操作项
          options: {
            operator: {
              menu: {
                items: [
                  {
                    key: 'custom-a',
                    label: '操作1',
                    icon: 'Trend',
                    onClick: (info, cell) => {
                      console.log('操作1点击', info, cell);
                    },
                    children: [
                      {
                        key: 'custom-a-a',
                        label: '操作 1-1',
                        icon: 'Trend',
                        onClick: (info, cell) => {
                          console.log('操作 1-1 点击', info, cell);
                        },
                      },
                    ],
                  },
                ],
              },
            },
          },
        });
      };

      const onRowCellHover: SheetComponentProps['onRowCellHover'] = ({
        event,
      }) => {
        s2Ref.current?.showTooltip({
          position: {
            x: event.clientX,
            y: event.clientY,
          },
          content: <CustomRowCellTooltip />,
        });
      };

      const onDataCellHover: SheetComponentProps['onDataCellHover'] = ({
        event,
      }) => {
        s2Ref.current?.showTooltip({
          position: {
            x: event.clientX,
            y: event.clientY,
          },
          content: <CustomDataCellTooltip />,
        });
      };

      return (
        <SheetComponent
          sheetType="pivot"
          ref={s2Ref}
          adaptive={false}
          dataCfg={dataCfg}
          options={s2Options}
          onColCellHover={onColCellHover}
          onRowCellHover={onRowCellHover}
          onDataCellHover={onDataCellHover}
        />
      );
    };

    reactDOMClient
      .createRoot(document.getElementById('container'))
      .render(<App />);
  });
