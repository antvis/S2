import { PivotSheet, S2Options, SpreadSheet } from '@antv/s2';
import insertCSS from 'insert-css';

function createRadioGroup(s2: SpreadSheet) {
  [
    ['rowCellVertical', '行头 resize 热区'],
    ['cornerCellHorizontal', '角头 resize 热区'],
    ['colCellHorizontal', '列头水平方向 resize 热区'],
    ['colCellVertical', '列头垂直方向 resize 热区'],
  ].forEach(([value, text]) => {
    const radio = document.createElement('input');

    radio.type = 'radio';
    radio.name = value;
    radio.value = value;
    radio.checked = true;

    radio.addEventListener('click', async (e) => {
      const value = e.target.value;
      const updated = !s2.options.interaction?.resize?.[value];

      radio.checked = updated;

      s2.setOptions({
        interaction: {
          resize: {
            [value]: updated,
          },
        },
      });

      await s2.render(false);
    });

    const label = document.createElement('label');

    label.innerText = text;
    label.htmlFor = 'name';

    document.querySelector('#container > canvas')?.before(radio);
    document.querySelector('#container > canvas')?.before(label);
  });
}

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
        resize: {
          rowCellVertical: true,
          cornerCellHorizontal: true,
          colCellHorizontal: true,
          colCellVertical: true,
        },
      },
    };

    const s2 = new PivotSheet(container, dataCfg, s2Options);

    // 这里默认将热区显示, 仅供演示使用, 请勿无脑复制.
    s2.setTheme({
      resizeArea: {
        backgroundOpacity: 1,
      },
    });

    await s2.render();

    createRadioGroup(s2);
  });

insertCSS(`
  input[type='radio'] {
    margin-bottom: 20px;
    margin-right: 4px;
  }

  label{
    margin-right: 10px
  }
`);
