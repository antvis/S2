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

fetch('../data/basic.json')
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
      width: 800,
      height: 600,
      conditions: {
        interval: [
          {
            field: 'price',
            mapping(fieldValue, data) {
              const maxValue = 20;
              const minValue = 0;
              const rage = (fieldValue - minValue) / (maxValue - minValue);

              const color = getGradient(rage, '#fff1b8', '#faad14');
              return {
                fill: `l(0) 0:#fff1b8 1:${color}`,
                isCompare: true,
                maxValue,
              };
            },
          },
        ],
      },
    };
    const s2 = new PivotSheet(container, s2DataConfig, s2options);

    s2.render();
  });
