import React from 'react';
import ReactDOM from 'react-dom';
import { SheetComponent, SheetComponentOptions } from '@antv/s2-react';
import '@antv/s2-react/dist/style.min.css';

const CornerTooltip = () => <div>CornerTooltip</div>;

const RowTooltip = () => <div>RowTooltip</div>;

const ColTooltip = () => <div>ColTooltip</div>;

fetch(
  'https://gw.alipayobjects.com/os/bmw-prod/2a5dbbc8-d0a7-4d02-b7c9-34f6ca63cff6.json',
)
  .then((res) => res.json())
  .then((dataCfg) => {
    const s2Options: SheetComponentOptions = {
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
              content: <ColTooltip />,
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
              content: <CornerTooltip />,
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
                  content: <RowTooltip />,
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

                meta.spreadsheet.tooltip.show({
                  position: { x: event.clientX, y: event.clientY },
                  content: <RowTooltip />,
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

    ReactDOM.render(
      <SheetComponent dataCfg={dataCfg} options={s2Options} />,
      document.getElementById('container'),
    );
  });
