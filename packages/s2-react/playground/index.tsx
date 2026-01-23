import { PivotSheet, S2Options } from '@antv/s2';

fetch(
  'https://gw.alipayobjects.com/os/bmw-prod/2a5dbbc8-d0a7-4d02-b7c9-34f6ca63cff6.json',
)
  .then((res) => res.json())
  .then(async (dataCfg) => {
    const container = document.getElementById('container');

    const s2Options: S2Options = {
      width: 600,
      height: 480,
      // grid-tree 模式：平铺布局 + 展开折叠
      // 每个维度层级有独立的列，同时支持展开/折叠子节点
      hierarchyType: 'grid-tree',
      style: {
        rowCell: {
          // 默认展开第 1 层 (从 0 开始)
          expandDepth: 1,

          // 折叠全部
          // collapseAll: true,

          // 折叠指定节点
          // collapseFields: {
          //   'root[&]浙江省': true,
          // },
        },
      },
    };

    const s2 = new PivotSheet(container!, dataCfg, s2Options);

    await s2.render();
  });
