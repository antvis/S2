// import { PivotSheet, transformCustomTreeItems } from '@antv/s2';
import { PivotSheet } from '@antv/s2';
import '@antv/s2/dist/s2.min.css';

// @TODO 等下个版本发布了把上面注释打开
const transformCustomTreeItems = (itemConfig) => {
    if (itemConfig) {
        return itemConfig.map((config) => {
        return {
            key: config.key,
            title: config.title,
            children: transformCustomTreeItems(config.children),
            collapsed: config.collapsed,
            description: config.description,
        };
        });
    }
    return [];
};
fetch(
  'https://gw.alipayobjects.com/os/bmw-prod/af54ea12-01d7-4696-a51c-c4d5e4ede28e.json',
)
  .then((res) => res.json())
  .then((res) => {
    const container = document.getElementById('container');
    const s2DataConfig = {
      fields: {
        rows: [],
        columns: ['type', 'sub_type'],
        values: [
            'measure-a',
            'measure-b',
            'measure-c',
            'measure-d',
            'measure-e',
            'measure-f'
        ],
        customTreeItems: transformCustomTreeItems(res.customTreeItem),
        valueInCols: false,
      },
      data: res.data,
    };
    const s2Options = {
      width: 600,
      height: 480,
      hierarchyType: 'customTree',
    };
    const s2 = new PivotSheet(container, s2DataConfig, s2Options);
    s2.render();
  });
