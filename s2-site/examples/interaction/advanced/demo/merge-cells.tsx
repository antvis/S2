import { PivotSheet, S2Event, MergedCell } from '@antv/s2';
import React from 'react';
import '@antv/s2/dist/s2.min.css';

fetch(
  'https://gw.alipayobjects.com/os/bmw-prod/cd9814d0-6dfa-42a6-8455-5a6bd0ff93ca.json',
)
  .then((res) => res.json())
  .then((res) => {
    const container = document.getElementById('container');

    const TooltipComponent = (
      <button
        key={'button'}
        onClick={() => {
          s2.interaction.mergeCells();
        }}
      >
        合并单元格
      </button>
    );

    const mergedCellsTooltip = (mergedCell: MergedCell) => (
      <button
        onClick={() => {
          s2.interaction.unmergeCell(mergedCell);
        }}
      >
        取消合并单元格
      </button>
    );

    const s2DataConfig = {
      fields: {
        rows: ['province', 'city'],
        columns: ['type', 'sub_type'],
        values: ['number'],
      },
      data: res.data,
      meta: res.meta,
    };

    const s2Options = {
      width: 600,
      height: 480,
      selectedCellsSpotlight: true,
      tooltip: {
        tooltipComponent: TooltipComponent,
      },
      mergedCellsInfo: [
        [
          { colIndex: 1, rowIndex: 6, showText: true },
          { colIndex: 1, rowIndex: 7 },
          { colIndex: 2, rowIndex: 6 },
          { colIndex: 2, rowIndex: 7 },
          { colIndex: 3, rowIndex: 6 },
          { colIndex: 3, rowIndex: 7 },
        ],
      ],
    };

    const s2 = new PivotSheet(container, s2DataConfig, s2Options);

    s2.on(S2Event.MERGED_CELLS_CLICK, (event) => {
      const cell: MergedCell = s2.getCell(event.target);
      s2.tooltip.show({
        position: { x: event.clientX, y: event.clientY },
        element: mergedCellsTooltip(cell),
      });
    });

    s2.render();
  });
