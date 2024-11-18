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

    const s2Options: SheetComponentOptions = {
      width: 600,
      height: 480,
      tooltip: {
        enable: true,
        rowCell: {
          enable: false,
        },
        operation: {
          menu: {
            render(props) {
              return <Menu {...props} />;
            },
          },
        },
      },
    };

    const App = () => {
      const s2Ref = React.useRef<SpreadSheet>();

      const onColCellClick: SheetComponentProps['onColCellClick'] = ({
        viewMeta,
        event,
      }) => {
        if (!viewMeta) {
          return;
        }

        const { id } = viewMeta;

        // 点击列头的 [家具] 试试
        if (id === 'root[&]家具') {
          const position = {
            x: event.clientX,
            y: event.clientY,
          };

          // 查看更多配置项: https://s2.antv.antgroup.com/api/basic-class/base-tooltip#tooltipshowoptions
          s2Ref.current?.showTooltip({
            position,
            content: <CustomColCellTooltip />,
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
        }
      };

      return (
        <SheetComponent
          sheetType="pivot"
          ref={s2Ref}
          adaptive={false}
          dataCfg={dataCfg}
          options={s2Options}
          onColCellClick={onColCellClick}
        />
      );
    };

    reactDOMClient
      .createRoot(document.getElementById('container'))
      .render(<App />);
  });
