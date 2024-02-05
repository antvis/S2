import { PivotSheet, S2Event, S2Options, SpreadSheet } from '@antv/s2';

function createRadioGroup(s2: SpreadSheet) {
  [
    [0, '展开一级节点（省份）'],
    [1, '展开二级节点（城市）'],
    [2, '展开三级节点（类别）'],
  ].forEach(([value, text]) => {
    const radio = document.createElement('input');

    radio.type = 'radio';
    radio.name = 'expandDepth';
    radio.value = value;
    radio.checked = value === 0;

    radio.addEventListener('click', async (e) => {
      const value = e.target.value;
      const updated = !s2.options.interaction.resize[value];

      radio.checked = updated;

      s2.setOptions({
        style: {
          rowCell: {
            expandDepth: Number(value),
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
  'https://gw.alipayobjects.com/os/bmw-prod/e254339f-46df-4be0-81b0-a3b1e26b39ff.json',
)
  .then((res) => res.json())
  .then(async (dataCfg) => {
    const container = document.getElementById('container');

    const s2Options: S2Options = {
      width: 600,
      height: 480,
      hierarchyType: 'tree',
      style: {
        rowCell: {
          // 默认展开一级维度的子节点
          expandDepth: 0,
          // 收起全部
          // collapseAll: true,
        },
      },
    };

    const s2 = new PivotSheet(container, dataCfg, s2Options);

    s2.on(S2Event.ROW_CELL_COLLAPSED, (data) => {
      console.log('row-cell:collapsed', data);
    });

    s2.on(S2Event.ROW_CELL_ALL_COLLAPSED, (data) => {
      console.log('row-cell:all-collapsed', data);
    });

    await s2.render();

    createRadioGroup(s2);
  });
