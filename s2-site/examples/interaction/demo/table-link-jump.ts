import { S2Event, TableSheet } from '@antv/s2';
import '@antv/s2/dist/s2.min.css';

fetch(
  'https://gw.alipayobjects.com/os/bmw-prod/94a016a4-6672-41b1-aef3-8f6094cd2c18.json',
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
