import React from 'react';
import ReactDOM from 'react-dom';
import { SheetComponent, SheetComponentOptions } from '@antv/s2-react';
import '@antv/s2-react/dist/style.min.css';

const CornerTooltip = <div>CornerTooltip</div>;

const RowTooltip = <div>RowTooltip</div>;

const ColTooltip = <div>ColTooltip</div>;

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
          iconNames: ['SortDown'],
          belongsCell: 'colCell',
          displayCondition: (meta) => meta.level > 0,
          onClick: (props) => {
            const { meta, event } = props;
            console.log(meta);
            meta.spreadsheet.handleGroupSort(event, meta);
          },
        },
        {
          iconNames: ['Filter'],
          belongsCell: 'colCell',
          displayCondition: (meta) => meta.id === 'root[&]家具',
          onClick: (props) => {
            const { meta, event } = props;
            meta.spreadsheet.tooltip.show({
              position: { x: event.clientX, y: event.clientY },
              content: ColTooltip,
            });
          },
        },
        {
          iconNames: ['SortUp'],
          belongsCell: 'cornerCell',
          onClick: (props) => {
            const { meta, event } = props;
            meta.spreadsheet.tooltip.show({
              position: { x: event.clientX, y: event.clientY },
              content: CornerTooltip,
            });
          },
        },
        {
          iconNames: ['DrillDownIcon'],
          belongsCell: 'rowCell',
          onClick: (props) => {
            const { meta, event } = props;
            meta.spreadsheet.tooltip.show({
              position: { x: event.clientX, y: event.clientY },
              content: RowTooltip,
            });
          },
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
