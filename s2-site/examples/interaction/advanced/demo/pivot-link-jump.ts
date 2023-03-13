import { S2Event, PivotSheet } from '@antv/s2';

fetch(
  'https://gw.alipayobjects.com/os/bmw-prod/2a5dbbc8-d0a7-4d02-b7c9-34f6ca63cff6.json',
)
  .then((res) => res.json())
  .then((dataCfg) => {
    const container = document.getElementById('container');

    const s2Options = {
      width: 600,
      height: 480,
      interaction: {
        linkFields: ['city', 'number'],
      },
    };
    const s2 = new PivotSheet(container, dataCfg, s2Options);

    s2.on(S2Event.GLOBAL_LINK_FIELD_JUMP, (data) => {
      console.log(data);

      const { key, record } = data;
      const value = record[key];
      const a = document.createElement('a');
      a.target = '_blank';
      a.href = `https://antv-s2.gitee.io/zh/docs/manual/introduction?${key}=${value}`;
      a.click();
      a.remove();
    });

    s2.render();
  });
