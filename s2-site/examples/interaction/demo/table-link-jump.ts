import { S2Event, TableSheet } from '@antv/s2';
import '@antv/s2/dist/s2.min.css';

fetch('./data/basic.json')
  .then((res) => res.json())
  .then((data) => {
    const container = document.getElementById('container');
    const s2DataConfig = {
      fields: {
        columns: ['type', 'price', 'province', 'city'],
      },
      data,
    };

    const s2options = {
      width: 800,
      height: 600,
      linkFieldIds: ['type', 'price', 'province'],
    };
    const s2 = new TableSheet(container, s2DataConfig, s2options);

    s2.on(S2Event.ROW_CELL_TEXT_CLICK, (data) => {
      console.log(data);
      const { key, record } = data;
      const a = document.createElement('a');
      a.target = '_blank';
      a.href = `https://s2.antv.vision/${key}=${record[key]}`;
      a.click();
      a.remove();
    });

    s2.render();
  });
