import { PivotSheet, S2Event } from '@antv/s2';
import '@antv/s2/dist/s2.min.css';

function addEvents(s2) {
  [
    S2Event.DATA_CELL_CLICK,
    S2Event.DATA_CELL_DOUBLE_CLICK,
    S2Event.GLOBAL_SELECTED,
  ].forEach((name) => {
    s2.on(name, (...args) => {
      console.log(name, ...args);
    });
  });
}

fetch(
  'https://gw.alipayobjects.com/os/bmw-prod/d62448ea-1f58-4498-8f76-b025dd53e570.json',
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
      width: 800,
      height: 600,
      selectedCellsSpotlight: true,
      hoverHighlight: true,
      tooltip: {
        showTooltip: true,
      },
    };
    const s2 = new PivotSheet(container, s2DataConfig, s2options);

    s2.render();

    addEvents(s2);
  });
