import { PivotSheet, S2Options } from '@antv/s2';
import '@antv/s2/dist/style.min.css';

fetch(
  'https://gw.alipayobjects.com/os/bmw-prod/2a5dbbc8-d0a7-4d02-b7c9-34f6ca63cff6.json',
)
  .then((res) => res.json())
  .then(async (dataCfg) => {
    const container = document.getElementById('container');

    const s2Options: S2Options = {
      width: 600,
      height: 480,
      customSVGIcons: [
        {
          name: 'Filter',
          svg: 'https://gw.alipayobjects.com/zos/antfincdn/gu1Fsz3fw0/filter%26sort_filter.svg',
        },
      ],
      showDefaultHeaderActionIcon: false,
      headerActionIcons: [
        {
          icons: ['SortDown'],
          belongsCell: 'colCell',
          defaultHide: false,
          displayCondition: (meta) => meta.level > 0,
          onClick: (options) => {
            console.log(options);
            const { meta, event } = options;

            meta.spreadsheet.handleGroupSort(event, meta);
          },
        },
        {
          icons: ['Filter', { name: 'CellUp', position: 'left' }],
          belongsCell: 'colCell',
          displayCondition: (meta) => meta.id === 'root[&]家具',
          onClick: (options) => {
            const { meta, event } = options;

            meta.spreadsheet.tooltip.show({
              position: { x: event.clientX, y: event.clientY },
              content: `<div>ColTooltip</div>`,
            });
          },
        },
        {
          icons: ['SortUp'],
          belongsCell: 'cornerCell',
          defaultHide: true,
          onClick: (options) => {
            const { meta, event } = options;

            meta.spreadsheet.tooltip.show({
              position: { x: event.clientX, y: event.clientY },
              content: `<div>CornerTooltip</div>`,
            });
          },
        },
        {
          icons: [
            {
              name: 'DrillDownIcon',
              position: 'right',
              fill: '#000',
              onClick: (options) => {
                const { meta, event } = options;

                meta.spreadsheet.tooltip.show({
                  position: { x: event.clientX, y: event.clientY },
                  content: `<div>RowTooltip</div>`,
                });
              },
            },
            {
              name: 'Plus',
              position: 'left',
              fill: '#06a',
              displayCondition: (meta) => meta.rowIndex > 2,
              onHover: (options) => {
                const { meta, event } = options;
                const content = document.createElement('div');

                content.innerHTML = '我是 RowTooltip 自定义内容';

                meta.spreadsheet.tooltip.show({
                  position: { x: event.clientX, y: event.clientY },
                  content,
                });
              },
            },
          ],
          belongsCell: 'rowCell',
        },
      ],
      style: {
        colCell: {
          hideValue: true,
        },
      },
    };

    const s2 = new PivotSheet(container, dataCfg, s2Options);

    await s2.render();
  });
