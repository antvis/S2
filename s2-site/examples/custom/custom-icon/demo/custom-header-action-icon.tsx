import React from 'react';
import { PivotSheet } from '@antv/s2';

const CornerTooltip = <div>CornerTooltip</div>;

const RowTooltip = <div>RowTooltip</div>;

const ColTooltip = <div>ColTooltip</div>;

fetch(
  'https://gw.alipayobjects.com/os/bmw-prod/2a5dbbc8-d0a7-4d02-b7c9-34f6ca63cff6.json',
)
  .then((res) => res.json())
  .then((data) => {
    const container = document.getElementById('container');
    const s2DataConfig = {
      fields: {
        rows: ['province', 'city'],
        columns: ['type'],
        values: ['price', 'cost'],
      },
      meta: [
        {
          field: 'province',
          name: '省份',
        },
        {
          field: 'city',
          name: '城市',
        },
        {
          field: 'type',
          name: '商品类别',
        },
        {
          field: 'price',
          name: '价格',
        },
        {
          field: 'cost',
          name: '成本',
        },
      ],
      data,
    };

    const s2Options = {
      width: 600,
      height: 480,
      tooltip: {
        showTooltip: true,
      },
      customSVGIcons: [
        {
          name: 'Filter',
          svg: 'https://gw.alipayobjects.com/zos/antfincdn/gu1Fsz3fw0/filter%26sort_filter.svg',
        },
      ],
      showDefaultHeaderActionIcon: false,
      headerActionIcons: [
        {
          iconNames: ['Filter'],
          belongsCell: 'colCell',
          displayCondition: (meta) => meta.id === 'root[&]纸张[&]price',
          action: (props) => {
            const { meta, event } = props;
            meta.spreadsheet.tooltip.show({
              position: { x: event.clientX, y: event.clientY },
              element: ColTooltip,
            });
          },
        },
        {
          iconNames: ['SortDown'],
          belongsCell: 'colCell',
          displayCondition: (meta) => meta.id === 'root[&]笔[&]price',
          action: (props) => {
            const { meta, event } = props;
            meta.spreadsheet.tooltip.show({
              position: { x: event.clientX, y: event.clientY },
              element: ColTooltip,
            });
          },
        },
        {
          iconNames: ['SortUp'],
          belongsCell: 'cornerCell',
          action: (props) => {
            const { meta, event } = props;
            meta.spreadsheet.tooltip.show({
              position: { x: event.clientX, y: event.clientY },
              element: CornerTooltip,
            });
          },
        },
        {
          iconNames: ['DrillDownIcon'],
          belongsCell: 'rowCell',
          action: (props) => {
            const { meta, event } = props;
            meta.spreadsheet.tooltip.show({
              position: { x: event.clientX, y: event.clientY },
              element: RowTooltip,
            });
          },
        },
      ],
    };
    const s2 = new PivotSheet(container, s2DataConfig, s2Options);

    s2.render();
  });
