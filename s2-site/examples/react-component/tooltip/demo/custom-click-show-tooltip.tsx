import React from 'react';
import {
  SheetComponent,
  SheetComponentOptions,
  SheetComponentsProps,
} from '@antv/s2-react';
import '@antv/s2-react/dist/style.min.css';

const CustomColCellTooltip = () => <div>col cell</div>;

fetch(
  'https://gw.alipayobjects.com/os/bmw-prod/2a5dbbc8-d0a7-4d02-b7c9-34f6ca63cff6.json',
)
  .then((res) => res.json())
  .then((dataCfg) => {
    const s2Options: SheetComponentOptions = {
      width: 600,
      height: 480,
      tooltip: {
        enable: true,
        rowCell: {
          enable: false,
        },
      },
    };

    const onColCellClick: SheetComponentsProps['onColCellClick'] = ({
      viewMeta,
      event,
    }) => {
      if (!viewMeta) {
        return;
      }

      const { spreadsheet, id } = viewMeta;

      // 点击列头的 [家具] 试试
      if (id === 'root[&]家具') {
        const position = {
          x: event.clientX,
          y: event.clientY,
        };

        // 查看更多配置项: https://s2.antv.antgroup.com/api/basic-class/base-tooltip#tooltipshowoptions
        spreadsheet.showTooltip({
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

    reactDOMClient
      .createRoot(document.getElementById('container'))
      .render(
        <SheetComponent
          sheetType="pivot"
          adaptive={false}
          dataCfg={dataCfg}
          options={s2Options}
          onColCellClick={onColCellClick}
        />,
      );
  });
