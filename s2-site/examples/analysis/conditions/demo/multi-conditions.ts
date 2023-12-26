import { PivotSheet, S2Options } from '@antv/s2';

// 可借助 tinygradient 完成功能更全面的颜色过渡
function getGradient(rate: number, startColor: string, endColor: string) {
  function toGgb(color: string) {
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
  .then(async (dataCfg) => {
    const container = document.getElementById('container');
    const s2DataConfig = dataCfg;

    const s2Options: S2Options = {
      width: 600,
      height: 480,
      interaction: {
        hoverHighlight: false,
      },
      conditions: {
        text: [
          {
            field: 'number',
            mapping() {
              return {
                fill: '#142C61',
              };
            },
          },
        ],
        icon: [
          {
            field: 'number',
            position: 'right',
            mapping() {
              return {
                icon: 'Trend',
                fill: '#142C61',
              };
            },
          },
        ],
        background: [
          {
            field: 'number',
            mapping() {
              return {
                fill: '#E0E9FD',
              };
            },
          },
        ],
        interval: [
          {
            field: 'number',
            mapping(fieldValue) {
              const maxValue = 7789;
              const minValue = 0;
              const rage = (fieldValue - minValue) / (maxValue - minValue);

              const color = getGradient(rage, '#5083F5', '#F7B46F');

              return {
                fill: `l(0) 0:#5083F5 1:${color}`,
                isCompare: true,
                maxValue,
              };
            },
          },
        ],
      },
    };

    const s2 = new PivotSheet(container, s2DataConfig, s2Options);

    s2.setThemeCfg({ name: 'colorful' });
    await s2.render();
  });
