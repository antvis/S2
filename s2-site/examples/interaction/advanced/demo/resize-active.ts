import { PivotSheet } from '@antv/s2';
import insertCss from 'insert-css';

function createRadioGroup(s2) {
  [
    ['rowCellVertical', '行头热区'],
    ['cornerCellHorizontal', '角头热区'],
    ['colCellHorizontal', '列头水平方向resize热区'],
    ['colCellVertical', '列头垂直方向resize热区'],
  ].forEach(([value, text]) => {
    const radio = document.createElement('input');

    radio.type = 'radio';
    radio.name = value;
    radio.value = value;
    radio.checked = true;

    radio.addEventListener('click', (e) => {
      const value = e.target.value;
      const updated = !s2.options.interaction.resize[value];
      radio.checked = updated;

      s2.setOptions({
        interaction: {
          resize: {
            [value]: updated,
          },
        },
      });
      s2.render(false);
    });

    const label = document.createElement('label');
    label.innerText = text;
    label.htmlFor = 'name';

    document.querySelector('#container > canvas').before(radio);
    document.querySelector('#container > canvas').before(label);
  });
}

fetch(
  'https://gw.alipayobjects.com/os/bmw-prod/2a5dbbc8-d0a7-4d02-b7c9-34f6ca63cff6.json',
)
  .then((res) => res.json())
  .then((dataCfg) => {
    const container = document.getElementById('container');

    const s2Options = {
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

    s2.render();

    createRadioGroup(s2);
  });

insertCss(`
  input[type='radio'] {
    margin-bottom: 20px;
    margin-right: 4px;
  }

  label{
    margin-right: 10px
  }
`);  