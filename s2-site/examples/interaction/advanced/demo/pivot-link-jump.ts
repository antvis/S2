import { S2Event, PivotSheet, S2Options } from '@antv/s2';

fetch(
  'https://gw.alipayobjects.com/os/bmw-prod/2a5dbbc8-d0a7-4d02-b7c9-34f6ca63cff6.json',
)
  .then((res) => res.json())
  .then(async (dataCfg) => {
    const container = document.getElementById('container');

    const s2Options: S2Options = {
      width: 600,
      height: 480,
      interaction: {
        linkFields: ['city', 'number'],
      },
    };

    const s2 = new PivotSheet(container, dataCfg, s2Options);

    s2.on(S2Event.GLOBAL_LINK_FIELD_JUMP, (jumpData) => {
      console.log('jumpData:', jumpData);

      const { field, record } = jumpData;
      const value = record?.[field];
      const a = document.createElement('a');

      a.target = '_blank';
      a.href = `https://antv-s2.gitee.io/zh/docs/manual/introduction?${field}=${value}`;
      a.click();
      a.remove();
    });

    await s2.render();
  });
