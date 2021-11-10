import { PivotSheet } from '@antv/s2';
import '@antv/s2/dist/s2.min.css';

fetch(
  'https://gw.alipayobjects.com/os/bmw-prod/cd9814d0-6dfa-42a6-8455-5a6bd0ff93ca.json',
)
  .then((res) => res.json())
  .then((res) => {
    const container = document.getElementById('container');
    const s2DataConfig = {
      fields: {
        rows: ['province', 'city'],
        columns: ['type', 'sub_type'],
        values: ['number'],
      },
      data: res.data,
      meta: res.meta,
    };

    const s2options = {
      width: 600,
      height: 600,
      selectedCellsSpotlight: true,
      tooltip: {
        showTooltip: true,
      },
      mergedCellsInfo: [
        [
          { colIndex: 1, rowIndex: 7, showText: true },
          { colIndex: 2, rowIndex: 6 },
          { colIndex: 2, rowIndex: 7 },
          { colIndex: 3, rowIndex: 6 },
          { colIndex: 3, rowIndex: 7 },
        ],
      ],
    };
    const s2 = new PivotSheet(container, s2DataConfig, s2options);

    s2.render();
  });
