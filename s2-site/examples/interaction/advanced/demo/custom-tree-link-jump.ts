import { S2Event, PivotSheet, S2DataConfig, S2Options } from '@antv/s2';

// 临时处理老数据格式
function process(children) {
  return children?.map((item) => {
    return {
      ...item,
      field: item.key,
      children: process(item.children),
    };
  });
}

fetch(
  'https://render.alipay.com/p/yuyan/180020010001215413/s2/custom-tree.json',
)
  .then((res) => res.json())
  .then(async (res) => {
    const container = document.getElementById('container');
    const s2DataConfig: S2DataConfig = {
      fields: {
        rows: process(res.customTreeItem),
        columns: ['type', 'sub_type'],
        values: [
          'measure-a',
          'measure-b',
          'measure-c',
          'measure-d',
          'measure-e',
          'measure-f',
        ],
        valueInCols: false,
      },
      data: res.data,
    };

    const s2Options: S2Options = {
      width: 600,
      height: 480,
      hierarchyType: 'tree',
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

    s2.on(S2Event.GLOBAL_LINK_FIELD_JUMP, (jumpData) => {
      console.log('jumpData:', jumpData);

      const { field, record } = jumpData;
      const value = record?.[field];
      const a = document.createElement('a');

      a.target = '_blank';
      a.href = `https://antv-s2.gitee.io/zh/docs/manual/introduction?${field}=${value}`;
      a.click();
      a.remove();
    });

    await s2.render();
  });
