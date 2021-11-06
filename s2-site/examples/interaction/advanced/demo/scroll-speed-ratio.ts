import { TableSheet } from '@antv/s2';
import '@antv/s2/dist/s2.min.css';
import insertCss from 'insert-css';

const defaultScrollSpeedRatio = 1;

function createSlider(s2) {
  const slider = document.createElement('input');
  slider.type = 'range';
  slider.max = '5';
  slider.min = '0';
  slider.value = `${defaultScrollSpeedRatio}`;
  slider.step = '0.1';
  slider.title = `当前滚动速率: ${defaultScrollSpeedRatio}`;

  slider.addEventListener('input', (e) => {
    const ratio = e.target.value;
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
  document.querySelector('#container > canvas').before(slider);
}

fetch('../data/basic.json')
  .then((res) => res.json())
  .then((data) => {
    const container = document.getElementById('container');
    const s2DataConfig = {
      fields: {
        columns: ['province', 'city', 'type', 'price'],
      },
      data,
    };

    const s2options = {
      width: 600,
      height: 400,
      interaction: {
        scrollSpeedRatio: {
          vertical: defaultScrollSpeedRatio,
          horizontal: defaultScrollSpeedRatio,
        },
      },
    };

    const s2 = new TableSheet(container, s2DataConfig, s2options);

    s2.render();

    createSlider(s2);
  });

insertCss(`
  input[type='range'] {
    display: block;
    margin-left: 120px;
    margin-bottom: 20px;
  }

  input[type='range']::before {
    content: attr(title);
    position: absolute;
    left: 15px;
  }
`);
