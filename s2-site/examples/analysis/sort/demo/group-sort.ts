import { PivotSheet } from '@antv/s2';
import '@antv/s2/dist/s2.min.css';

fetch(
  'https://gw.alipayobjects.com/os/bmw-prod/6531b95e-a955-4735-91d6-e63fc32b3f34.json',
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
      height: 600,
      showDefaultHeaderActionIcon: true, // 默认打开
    };
    const s2 = new PivotSheet(container, s2DataConfig, s2options);

    s2.render();
  });
