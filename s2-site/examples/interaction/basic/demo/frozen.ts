import { TableSheet } from '@antv/s2';
import '@antv/s2/dist/s2.min.css';

fetch('../data/basic.json')
  .then((res) => res.json())
  .then((data) => {
    const container = document.getElementById('container');
    const s2DataConfig = {
      fields: {
        columns: ['province', 'city', 'type', 'price'],
      },
      data,
    };

    const s2options = {
      width: 450,
      height: 400,
      showSeriesNumber: true,
      frozenColCount: 1,
      frozenRowCount: 1,
      frozenTrailingColCount: 1,
      frozenTrailingRowCount: 1,
    };
    const s2 = new TableSheet(container, s2DataConfig, s2options);

    s2.render();
  });
