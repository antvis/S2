import { PivotSheet, S2Event } from '@antv/s2';
import '@antv/s2/dist/s2.min.css';
import React from 'react';
import { Button } from 'antd';
import { MergedCells } from '@antv/s2/src';

fetch(
  'https://gw.alipayobjects.com/os/bmw-prod/cd9814d0-6dfa-42a6-8455-5a6bd0ff93ca.json',
)
  .then((res) => res.json())
  .then((res) => {
    const container = document.getElementById('container');
    const s2DataConfig = {
      fields: {
        rows: [ 'province', 'city' ],
        columns: [ 'type', 'sub_type' ],
        values: [ 'number' ],
      },
      data: res.data,
      meta: res.meta,
    };
    const TooltipComponent = (
      <Button
        key={ 'button' }
        onClick={ () => {
          s2.interaction.mergeCells();
        } }
      >
        合并单元格
      </Button>
    );

    const mergedCellsTooltip = (mergedCell: MergedCells) => (
      <div>
        合并后的tooltip
        <Button
          onClick={() => {
            s2.interaction.unmergeCell(mergedCell);
          }}
        >
          取消合并单元格
        </Button>
      </div>
    );

    const s2options = {
      width: 800,
      height: 600,
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
    const s2 = new PivotSheet(container, s2DataConfig, s2options);
    s2.render();

    s2.on(S2Event.MERGED_CELLS_CLICK, (event) => {
      const cell: MergedCells = s2.getCell(event.target);
      s2.tooltip.show({
        position: { x: event.clientX, y: event.clientY },
        element: mergedCellsTooltip(cell),
      });
    });
  });
