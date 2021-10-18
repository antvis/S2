import { PivotSheet } from '@antv/s2';
import '@antv/s2/dist/s2.min.css';

fetch(
  'https://gw.alipayobjects.com/os/bmw-prod/ad982192-a708-4732-99af-153f422e7b75.json',
)
  .then((res) => res.json())
  .then((data) => {
    const container = document.getElementById('container');
    const s2DataConfig = {
      fields: {
        rows: ['province', 'city'],
        columns: ['type'],
        values: ['price'],
      },
      data,
    };

    const s2options = {
      width: 660,
      height: 600,
      selectedCellsSpotlight: true,
      hoverHighlight: true,
      hierarchyType: 'tree',
      tooltip: {
        showTooltip: true,
      },
      totals: {
        row: {
          showGrandTotals: true,
          showSubTotals: true,
          reverseLayout: true,
          reverseSubLayout: true,
          subTotalsDimensions: ['province'],
        },
        col: {
          showGrandTotals: true,
          showSubTotals: true,
          reverseLayout: true,
          reverseSubLayout: true,
          subTotalsDimensions: ['type'],
        },
      },
      enableCopy: true,
    };
    const s2 = new PivotSheet(container, s2DataConfig, s2options);

    s2.render();
  });
