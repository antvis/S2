import { PivotSheet, S2Options } from '@antv/s2';

fetch(
  'https://gw.alipayobjects.com/os/bmw-prod/2a5dbbc8-d0a7-4d02-b7c9-34f6ca63cff6.json',
)
  .then((res) => res.json())
  .then((dataCfg) => {
    const container = document.getElementById('container');

    const s2Options: S2Options = {
      width: 600,
      height: 480,
      hierarchyType: 'tree',
      style: {
        rowCell: {
          // 方式1: 折叠浙江省下面所有的城市 (根据节点 id)
          collapsedFields: ['root[&]浙江省'],

          // 方式2: 折叠所有城市 (根据维度, 即 (S2DataConfig.fields.rows 配置的维度))
          // collapsedFields: ['city'],

          // 方式3: 配置展开层级 (优先级小于 collapsedFields, 当 collapsedFields 未配置, 或为 undefined 时有效)
          // expandDepth: 0,

          // 方式4: 折叠所有 (优先级小于 collapsedFields, expandDepth,  当 collapsedFields 和 expandDepth 未配置, 或为 undefined 时有效)
          // collapseAll: true,
        },
      },
    };

    const s2 = new PivotSheet(container, dataCfg, s2Options);
    s2.render();
  });
