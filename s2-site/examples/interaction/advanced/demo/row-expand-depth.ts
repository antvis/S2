import { PivotSheet } from '@antv/s2';

function createRadioGroup(s2) {
  [
    [0, '展开一级节点（省份）'],
    [1, '展开二级节点（城市）'],
    [2, '展开三级节点（类别）'],
  ].forEach(([value, text]) => {
    const radio = document.createElement('input');

    radio.type = 'radio';
    radio.name = 'rowExpandDepth';
    radio.value = value;
    radio.checked = value === 0;

    radio.addEventListener('click', (e) => {
      const value = e.target.value;
      const updated = !s2.options.interaction.resize[value];
      radio.checked = updated;

      s2.setOptions({
        style: {
          rowExpandDepth: Number(value),
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
      hierarchyType: 'tree',
      style: {
        rowExpandDepth: 0, // 展开一级维度的子节点
      },
    };

    const s2 = new PivotSheet(
      container,
      {
        ...dataCfg,
        fields: {
          rows: ['province', 'city', 'type', 'sub_type'],
          columns: [],
          values: ['number'],
          valueInCols: true,
        },
      },
      s2Options,
    );

    s2.render();

    createRadioGroup(s2);
  });
