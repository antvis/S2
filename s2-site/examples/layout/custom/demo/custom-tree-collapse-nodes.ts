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
      hierarchyType: 'tree',
      style: {
        rowCell: {
          // 方式 1: 折叠浙江省下面所有的城市 (根据节点 id)
          collapseFields: { 'root[&]浙江省': true },

          // 方式 2: 折叠所有城市 (根据维度, 即 (S2DataConfig.fields.rows 配置的维度))
          // collapseFields: { city: true },

          // 方式 3: 配置展开层级 (优先级小于 collapseFields, 当 collapseFields 未配置, 或为 null 时有效)
          // expandDepth: 0,

          // 方式 4: 折叠所有 (优先级小于 collapseFields, expandDepth,  当 collapseFields 和 expandDepth 未配置, 或为 null 时有效)
          // collapseAll: true,
        },
      },
    };

    const s2 = new PivotSheet(container, dataCfg, s2Options);

    await s2.render();
  });
