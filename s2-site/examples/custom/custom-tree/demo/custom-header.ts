import { PivotSheet } from '@antv/s2';

const customTree = [
  {
    key: 'a-1',
    title: '自定义节点 a-1',
    description: 'a-1 描述',
    children: [
      {
        key: 'a-1-1',
        title: '自定义节点 a-1-1',
        description: 'a-1-1 描述',
        children: [
          {
            key: 'measure-1',
            title: '指标 1',
            description: '指标 1 描述',
            children: [],
          },
          {
            key: 'measure-2',
            title: '指标 2',
            description: '指标 2 描述',
            children: [],
          },
        ],
      },
      {
        key: 'a-1-2',
        title: '自定义节点 a-1-2',
        description: 'a-1-2 描述',
        children: [],
      },
    ],
  },
  {
    key: 'a-2',
    title: '自定义节点 a-2',
    description: 'a-2 描述',
    children: [],
  },
];

const data = [
  {
    'measure-1': 13,
    'measure-2': 2,
    type: '家具',
    sub_type: '桌子',
  },
  {
    'measure-1': 11,
    'measure-2': 8,
    type: '家具',
    sub_type: '椅子',
  },
];

function render() {
  const container = document.getElementById('container');

  const s2DataConfig = {
    fields: {
      rows: customTree,
      columns: ['type', 'sub_type'],
      values: ['measure-1', 'measure-2'],
      valueInCols: false,
    },
    data,
  };

  const s2Options = {
    width: 600,
    height: 480,
    hierarchyType: 'grid',
  };

  const s2 = new PivotSheet(container, s2DataConfig, s2Options);
  s2.render();

  createCheckbox(s2);
}

function createCheckbox(s2) {
  const canvas = document.querySelector('#container > canvas');
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';

  const text = document.createElement('span');
  text.style.marginLeft = '5px';
  text.className = 'hierarchy-type';
  text.innerHTML = '树状模式';

  checkbox.addEventListener('change', () => {
    const type = document.querySelector('.hierarchy-type');
    const hierarchyType = checkbox.checked ? 'tree' : 'grid';
    s2.setOptions({
      hierarchyType,
    });
    s2.render(false);
  });

  canvas?.before(checkbox);
  canvas?.before(text);
}

render();
