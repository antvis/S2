import { PivotSheet } from '@antv/s2';
import '@antv/s2/dist/s2.min.css';

// 可借助 tinygradient 完成功能更全面的颜色过渡
function getGradient(rate, startColor, endColor) {
  function toGgb(color) {
    color = color.slice(1);
    const r = parseInt(color.substring(0, 2), 16);
    const g = parseInt(color.substring(2, 4), 16);
    const b = parseInt(color.substring(4, 6), 16);
    return [r, g, b];
  }
  const start = toGgb(startColor);
  const end = toGgb(endColor);
  const r = start[0] + (end[0] - start[0]) * rate;
  const g = start[1] + (end[1] - start[1]) * rate;
  const b = start[2] + (end[2] - start[2]) * rate;
  return `rgb(${r},${g},${b})`;
}

fetch(
  'https://gw.alipayobjects.com/os/bmw-prod/2a5dbbc8-d0a7-4d02-b7c9-34f6ca63cff6.json',
)
  .then((res) => res.json())
  .then((data) => {
    const container = document.getElementById('container');
    const s2DataConfig = {
      fields: {
        rows: ['province', 'city'],
        columns: ['type'],
        values: ['price', 'cost'],
      },
      meta: [
        {
          field: 'province',
          name: '省份',
        },
        {
          field: 'city',
          name: '城市',
        },
        {
          field: 'type',
          name: '商品类别',
        },
        {
          field: 'price',
          name: '价格',
        },
        {
          field: 'cost',
          name: '成本',
        },
      ],
      data,
    };

    const s2Options = {
      width: 600,
      height: 480,
      interaction: {
        hoverHighlight: false,
      },
      conditions: {
        interval: [
          {
            field: 'price',
            mapping(fieldValue) {
              const maxValue = 20;
              const minValue = 0;
              const rage = (fieldValue - minValue) / (maxValue - minValue);

              const color = getGradient(rage, '#95F0FF', '#3A9DBF');
              return {
                fill: `l(0) 0:#95F0FF 1:${color}`,
                isCompare: true,
                maxValue,
              };
            },
          },
        ],
      },
    };
    const s2 = new PivotSheet(container, s2DataConfig, s2Options);

    s2.render();
  });
