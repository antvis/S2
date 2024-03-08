import { PivotSheet, S2Options, S2DataConfig } from '@antv/s2';

fetch(
  'https://gw.alipayobjects.com/os/bmw-prod/cd9814d0-6dfa-42a6-8455-5a6bd0ff93ca.json',
)
  .then((res) => res.json())
  .then(async (res) => {
    const container = document.getElementById('container');
    const s2DataConfig: S2DataConfig = {
      fields: {
        rows: ['province', 'city'],
        columns: ['type', 'sub_type'],
        values: ['number'],
      },
      meta: res.meta,
      data: res.data,
    };

    const s2Options: S2Options = {
      width: 600,
      height: 480,
      hierarchyType: 'tree',
      // 覆盖掉默认的展开 (Plus) 收起 (Minus) 图标
      customSVGIcons: [
        {
          name: 'Plus',
          svg: 'https://gw.alipayobjects.com/zos/antfincdn/kXgP1pnClS/plus.svg',
        },
        {
          name: 'Minus',
          svg: 'https://gw.alipayobjects.com/zos/antfincdn/2aWYZ7%26rQF/minus-circle.svg',
        },
      ],
    };

    const s2 = new PivotSheet(container, s2DataConfig, s2Options);

    await s2.render();
  });
