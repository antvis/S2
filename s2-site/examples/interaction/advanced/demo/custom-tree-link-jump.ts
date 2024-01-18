import { S2Event, PivotSheet } from '@antv/s2';

fetch(
  'https://render.alipay.com/p/yuyan/180020010001215413/s2/custom-tree.json',
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
          'measure-f',
        ],
        customTreeItems: res.customTreeItem,
        valueInCols: false,
      },
      data: res.data,
    };
    const s2Options = {
      width: 600,
      height: 480,
      hierarchyType: 'customTree',
      interaction: {
        linkFields: [
          'custom-node-1',
          'custom-node-2',
          'custom-node-3',
          'custom-node-4',
          'custom-node-5',
          'measure-a',
          'measure-b',
          'measure-c',
          'measure-d',
          'measure-e',
          'measure-f',
        ],
      },
    };
    const s2 = new PivotSheet(container, s2DataConfig, s2Options);

    s2.on(S2Event.GLOBAL_LINK_FIELD_JUMP, (data) => {
      console.log(data);

      const { key, record } = data;
      const value = record[key];
      const a = document.createElement('a');
      a.target = '_blank';
      a.href = `https://antv-s2.gitee.io/zh/docs/manual/introduction?${key}=${value}`;
      a.click();
      a.remove();
    });

    s2.render();
  });
