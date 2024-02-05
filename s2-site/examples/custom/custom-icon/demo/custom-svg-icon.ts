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
      customSVGIcons: [
        {
          name: 'customKingIcon',
          // 1. 字符串
          // svg: `<?xml version="1.0" encoding="UTF-8"?><svg t="1634603945212" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="558" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200"><defs><style type="text/css"></style></defs><path d="M605.61 884.79h-24.26c-21.34 0-38.66 17.32-38.66 38.66 0 21.34 17.32 38.66 38.66 38.66h24.26c21.34 0 38.66-17.32 38.66-38.66 0-21.35-17.32-38.66-38.66-38.66z" fill="#040000" p-id="559"></path><path d="M950.47 419.76c-22.17-15.48-51.17-16.01-73.92-1.33L715.7 522.53 573.09 223.42c-10.95-22.98-33.55-37.43-58.97-37.75h-0.85c-25.09 0-47.67 13.84-59.05 36.29L302.25 521.82 154.9 419.61c-22-15.18-50.71-15.73-73.27-1.46-22.53 14.32-34.23 40.57-29.8 66.9l70.9 421.76c5.33 32.04 32.82 55.3 65.31 55.3h272.43c21.34 0 38.66-17.32 38.66-38.66 0-21.34-17.32-38.66-38.66-38.66H197.44l-64.99-386.62 136.17 94.46a66.14 66.14 0 0 0 54.01 9.79 66.097 66.097 0 0 0 42.81-34.28l147.54-291.11 138.35 290.2c8.21 17.19 23.41 30.03 41.76 35.19 18.37 5.24 38 2.21 53.99-8.1l148.62-96.17-87.74 386.65h-60.1c-21.34 0-38.66 17.32-38.66 38.66 0 21.34 17.32 38.66 38.66 38.66h68.96c31.16 0 57.71-21.22 64.58-51.57l95.72-421.86c5.97-26.39-4.47-53.42-26.65-68.93zM514.74 151.68c28.08 0 50.85-22.76 50.85-50.85s-22.77-50.85-50.85-50.85c-28.09 0-50.85 22.76-50.85 50.85s22.77 50.85 50.85 50.85zM973.15 277.37c-28.08 0-50.85 22.77-50.85 50.85 0 28.09 22.76 50.85 50.85 50.85 28.08 0 50.85-22.76 50.85-50.85 0-28.08-22.77-50.85-50.85-50.85zM101.69 328.22c0-28.08-22.76-50.85-50.85-50.85S0 300.14 0 328.22c0 28.09 22.76 50.85 50.85 50.85s50.84-22.77 50.84-50.85z" fill="#040000" p-id="560"></path></svg>`,

          // import Icon from '/path/to/icon.svg'
          // 2. 本地文件 (本质上也是字符串)
          // svg: Icon,

          // 3. 在线链接
          svg: 'https://gw.alipayobjects.com/zos/bmw-prod/f44eb1f5-7cea-45df-875e-76e825a6e0ab.svg',
        },
      ],
      // 使用刚定义的 icon
      headerActionIcons: [
        {
          icons: ['customKingIcon'],
          belongsCell: 'rowCell',
        },
      ],
    };

    const s2 = new PivotSheet(container, s2DataConfig, s2Options);

    await s2.render();
  });
