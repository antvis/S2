import { S2Event, TableSheet } from '@antv/s2';
import '@antv/s2/dist/s2.min.css';

fetch(
  'https://gw.alipayobjects.com/os/bmw-prod/d62448ea-1f58-4498-8f76-b025dd53e570.json',
)
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
      linkFields: ['type', 'price', 'province'],
    };
    const s2 = new TableSheet(container, s2DataConfig, s2options);

    s2.on(S2Event.GLOBAL_LINK_FIELD_JUMP, (data) => {
      console.log(data);
      const { key, record } = data;
      const value = record[key];
      const a = document.createElement('a');
      a.target = '_blank';
      a.href = `https://s2.antv.vision/${key}=${value}`;
      a.click();
      a.remove();
    });

    s2.render();
  });
