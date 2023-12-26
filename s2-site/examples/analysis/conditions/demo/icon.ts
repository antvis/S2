import { PivotSheet, S2Options } from '@antv/s2';

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
        hoverHighlight: false,
      },
      conditions: {
        icon: [
          // 行头
          {
            field: 'city',
            mapping() {
              return {
                // icon 用于指定图标条件格式所使用的 icon 类型
                icon: 'Trend',
                fill: '#DB6BCF',
              };
            },
          },
          // 列头
          {
            field: 'sub_type',
            mapping(fieldValue) {
              if (fieldValue !== '子类别') {
                return {
                  icon: 'CellDown',
                  fill: '#025DF4',
                };
              }
            },
          },
          // 配置数据单元格
          {
            field: 'number',
            position: 'left',
            mapping() {
              return {
                icon: 'CellUp',
                fill: '#2498D1',
              };
            },
          },
        ],
      },
    };

    const s2 = new PivotSheet(container, dataCfg, s2Options);

    await s2.render();
  });
