import { PivotSheet, S2Options, CornerCell } from '@antv/s2';

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
        text: [
          // 行头
          {
            field: 'city',
            mapping(fieldValue) {
              // 如果是角头，fieldValue 就是 城市
              if (fieldValue === '城市') {
                return {
                  fill: 'red',
                };
              }

              return {
                fill: '#DB6BCF',
              };
            },
          },
          {
            field: 'type',
            mapping(fieldValue, data) {
              // 非数据单元格的 data 返回的都是 cell 的 meta 信息
              // 角头单元格独有 cornerType 属性
              if (data.cornerType) {
                return {
                  fill: 'blue',
                };
              }

              return {
                fill: '#327039',
              };
            },
          },
          {
            field: 'sub_type',
            mapping(fieldValue, data, cell) {
              // cell 是对应当前格子的实例
              if (cell instanceof CornerCell) {
                return {
                  fill: '#BBDEDE',
                };
              }

              return {
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
