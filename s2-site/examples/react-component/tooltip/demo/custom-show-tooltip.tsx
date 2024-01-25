import React from 'react';
import { SheetComponent, SheetComponentOptions } from '@antv/s2-react';
import insertCSS from 'insert-css';
import '@antv/s2-react/dist/style.min.css';

fetch(
  'https://gw.alipayobjects.com/os/bmw-prod/2a5dbbc8-d0a7-4d02-b7c9-34f6ca63cff6.json',
)
  .then((res) => res.json())
  .then((dataCfg) => {
    const s2Options: SheetComponentOptions = {
      width: 600,
      height: 480,
    };

    const App = () => (
      <SheetComponent
        dataCfg={dataCfg}
        options={s2Options}
        onMounted={(instance) => {
          instance.showTooltip = (tooltipOptions) => {
            const { position, data = {}, options } = tooltipOptions;
            const name = `${data.name} - 测试`;
            const infos = '按住 Shift 多选或框选，查看多个数据点';
            const tips = '说明：这是个说明';
            const customSummaries = (data.summaries || []).map((item) => {
              return { ...item, name: `${item.name} - 测试` };
            });
            const { cols = [], rows = [] } = data.headInfo || {};
            const customCols = cols.map((item) => {
              return { ...item, value: `${item.value} - 测试` };
            });
            const customDetails = (data.details || []).map((item) => {
              return {
                name: `${item.name} - 测试`,
                value: `${item.value} - w`,
              };
            });
            const customOperator = {
              menu: {
                onClick: (info, cell) => {
                  console.log('任意菜单项点击', info, cell);
                },
                items: [
                  {
                    id: 'trend',
                    icon: 'trend',
                    text: '趋势',
                    onClick: (info, cell) => {
                      console.log('当前菜单项点击:', info, cell);
                    },
                  },
                ],
              },
            };

            const customOptions = {
              ...tooltipOptions,
              position: { x: position.x + 1, y: position.y + 1 },
              data: {
                ...data,
                name: data.name ? name : '',
                infos,
                tips,
                summaries: customSummaries,
                headInfo: { rows, cols: customCols },
                details: customDetails,
              },
              options: {
                ...options,
                operator: customOperator,
              },
            };

            instance.tooltip.show(customOptions);
          };
        }}
      />
    );

    reactDOMClient
      .createRoot(document.getElementById('container'))
      .render(<App />);
  });

insertCSS(`
  .tooltip-custom-component {
    padding: 12px;
    height: 50px;
  }
`);
