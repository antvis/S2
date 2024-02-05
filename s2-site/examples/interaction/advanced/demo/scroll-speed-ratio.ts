import { S2DataConfig, S2Options, SpreadSheet, TableSheet } from '@antv/s2';

import insertCSS from 'insert-css';

const defaultScrollSpeedRatio = 1;

function createSlider(s2: SpreadSheet) {
  const slider = document.createElement('input');

  slider.type = 'range';
  slider.max = '5';
  slider.min = '0';
  slider.value = `${defaultScrollSpeedRatio}`;
  slider.step = '0.1';
  slider.title = `当前滚动速率: ${defaultScrollSpeedRatio}`;

  slider.addEventListener('input', (e) => {
    const ratio = e.target?.value || 1;

    console.log('ratio: ', ratio);

    s2.setOptions({
      interaction: {
        scrollSpeedRatio: {
          vertical: ratio,
        },
      },
    });
    slider.title = `当前滚动速率: ${ratio}`;
  });

  document.querySelector('#container > canvas')?.before(slider);
}

fetch('https://render.alipay.com/p/yuyan/180020010001215413/s2/basic.json')
  .then((res) => res.json())
  .then(async (data) => {
    const container = document.getElementById('container');

    const s2DataConfig: S2DataConfig = {
      fields: {
        columns: ['province', 'city', 'type', 'price', 'cost'],
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

    const s2Options: S2Options = {
      width: 600,
      height: 300,
      style: {
        dataCell: {
          height: 200,
        },
      },
      interaction: {
        scrollSpeedRatio: {
          vertical: defaultScrollSpeedRatio,
          horizontal: defaultScrollSpeedRatio,
        },
      },
    };

    const s2 = new TableSheet(container, s2DataConfig, s2Options);

    await s2.render();

    createSlider(s2);
  });

insertCSS(`
  input[type='range'] {
    display: block;
    width: 300px;
    background-color: #bdc3c7;
    margin-left: 120px;
    margin-bottom: 20px;
    -webkit-appearance: none;
    height: 5px;
    border-radius: 5px;
    outline: 0;
  }

  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    background-color: #2C60D3;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    border: 2px solid white;
    cursor: pointer;
    transition: .3s ease-in-out;
  }​

  input[type="range"]::-webkit-slider-thumb:hover {
    background-color: white;
    border: 2px solid #2C60D3;
  }

  input[type="range"]::-webkit-slider-thumb:active {
    transform: scale(1.5);
  }

  input[type='range']::before {
    content: attr(title);
    position: absolute;
    left: 0;
    top: -10px;
  }
`);
