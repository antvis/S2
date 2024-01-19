import { PivotSheet, S2Options } from '@antv/s2';

fetch(
  'https://gw.alipayobjects.com/os/bmw-prod/2a5dbbc8-d0a7-4d02-b7c9-34f6ca63cff6.json',
)
  .then((res) => res.json())
  .then(async (dataCfg) => {
    const container = document.getElementById('container');

    // 详情请查看: https://s2.antv.antgroup.com/zh/docs/manual/advanced/custom/cell-size
    const s2Options: S2Options = {
      width: 600,
      height: 480,
      hierarchyType: 'grid',
      style: {
        rowCell: {
          // 固定配置: 行头单元格 100px
          // width: 100,
          // 动态配置: 叶子节点 300px, 非叶子节点 200px
          width: (node) => {
            console.log('rowNode: ', node);

            return node?.isLeaf ? 300 : 200;
          },
        },
        colCell: {
          // 固定配置: 每列 100px
          // width: 100,
          // 动态配置: 偶数列 100px, 奇数列 200px
          width: (node) => {
            console.log('colNode: ', node);

            return node?.colIndex % 2 === 0 ? 100 : 200;
          },
        },
        dataCell: {
          height: 50,
        },
      },
    };

    const s2 = new PivotSheet(container, dataCfg, s2Options);

    await s2.render();
  });
