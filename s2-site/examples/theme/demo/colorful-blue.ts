import { PivotSheet } from '@antv/s2';
import '@antv/s2/dist/s2.min.css';

fetch(
  'https://gw.alipayobjects.com/os/bmw-prod/d5eee4f7-7c09-4162-8651-9f0a16090a7c.json',
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
      width: 600,
      height: 300,
    };
    const s2 = new PivotSheet(container, s2DataConfig, s2options);

    s2.setThemeCfg({ name: 'colorful' });

    s2.render();
  });
