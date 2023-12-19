import { PivotSheet, S2Options } from '@antv/s2';

fetch(
  'https://gw.alipayobjects.com/os/bmw-prod/2a5dbbc8-d0a7-4d02-b7c9-34f6ca63cff6.json',
)
  .then((res) => res.json())
  .then((dataCfg) => {
    const container = document.getElementById('container');

<<<<<<< HEAD
    const s2Options: S2Options = {
      width: 600,
      height: 480,
      hierarchyType: 'tree',
    };

=======
    const s2Options = {
      width: 600,
      height: 480,
      hierarchyType: 'tree',
      style: {
        // 折叠全部
        // hierarchyCollapse: true,

        // 折叠浙江省下面所有的城市
        collapsedRows: {
          'root[&]浙江省': true,
        },
      },

      // 冻结行头
      // frozenRowHeader: true
    };

>>>>>>> origin/master
    const s2 = new PivotSheet(container, dataCfg, s2Options);

    s2.render();
  });
