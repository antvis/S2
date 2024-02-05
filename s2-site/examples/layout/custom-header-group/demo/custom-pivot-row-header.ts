import {
  CustomTreeNode,
  PivotSheet,
  S2DataConfig,
  S2Options,
  SpreadSheet,
} from '@antv/s2';

const customTree: CustomTreeNode[] = [
  {
    field: 'a-1',
    title: '自定义节点 a-1',
    description: 'a-1 描述',
    children: [
      {
        field: 'a-1-1',
        title: '自定义节点 a-1-1',
        description: 'a-1-1 描述',
        children: [
          {
            field: 'measure-1',
            title: '指标 1',
            description: '指标 1 描述',
            children: [],
          },
          {
            field: 'measure-2',
            title: '指标 2',
            description: '指标 2 描述',
            children: [],
          },
        ],
      },
      {
        field: 'a-1-2',
        title: '自定义节点 a-1-2',
        description: 'a-1-2 描述',
        children: [],
      },
    ],
  },
  {
    field: 'a-2',
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

function createCheckbox(s2: SpreadSheet) {
  const canvas = document.querySelector('#container > canvas');
  const checkbox = document.createElement('input');

  checkbox.type = 'checkbox';

  const text = document.createElement('span');

  text.style.marginLeft = '5px';
  text.className = 'hierarchy-type';
  text.innerHTML = '树状模式';

  checkbox.addEventListener('change', async () => {
    const hierarchyType = checkbox.checked ? 'tree' : 'grid';

    s2.setOptions({
      hierarchyType,
    });
    await s2.render(false);
  });

  canvas?.before(checkbox);
  canvas?.before(text);
}

async function render() {
  const container = document.getElementById('container');

  const s2DataConfig: S2DataConfig = {
    fields: {
      rows: customTree,
      columns: ['type', 'sub_type'],
      values: ['measure-1', 'measure-2'],
      valueInCols: false,
    },
    data,
    // 自定义节点默认使用 `title` 作为展示名, 角头默认使用行头每一列的第一个节点作为展示名, 也可以通过 meta 来统一进行格式化
    meta: [
      {
        field: 'a-1',
        name: '角头名称1',
        formatter: (value) => '当前节点自定义名称1',
      },
      {
        field: 'a-1-1',
        name: '角头名称2',
        formatter: (value) => '当前节点自定义名称2',
      },
      // 自定义格式化数值
      // {
      //   field: 'measure-1',
      //   formatter: (value, record, meta) => `指标: ${value}`,
      // },
    ],
  };

  const s2Options: S2Options = {
    width: 600,
    height: 480,
    hierarchyType: 'grid',
    // cornerText: '自定义角头标题',
  };

  const s2 = new PivotSheet(container, s2DataConfig, s2Options);

  await s2.render();

  createCheckbox(s2);
}

render();
