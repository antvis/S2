import { PivotSheet, S2Options, S2DataConfig } from '@antv/s2';

fetch(
  'https://gw.alipayobjects.com/os/bmw-prod/cd9814d0-6dfa-42a6-8455-5a6bd0ff93ca.json',
)
  .then((res) => res.json())
  .then(async (res) => {
    const container = document.getElementById('container');
    const s2DataConfig: S2DataConfig = {
      fields: {
        rows: ['province', 'city'],
        columns: ['type', 'sub_type'],
        values: ['number'],
      },
      meta: res.meta,
      data: res.data,
    };

    const s2Options: S2Options = {
      width: 600,
      height: 480,
      showDefaultHeaderActionIcon: false,
      headerActionIcons: [
        // 对一组 icon 统一配置展示逻辑
        {
          icons: ['SortDown', 'Plus'],
          belongsCell: 'colCell',
          // defaultHide: true,
          // 是否默认隐藏 (鼠标 hover 到对应单元格时才展示)
          defaultHide(meta, iconName) {
            return true;
          },
          // 根据单元格信息判断是否展示
          displayCondition(meta, iconName) {
            return meta.level >= 1;
          },
        },
        // 对单个 icon 独立配置展示逻辑
        {
          icons: [
            {
              name: 'SortDown',
              position: 'left',
              fill: '#396',
              defaultHide(meta, iconName) {
                return true;
              },
              displayCondition(meta, iconName) {
                return true;
              },
            },
            {
              name: 'SortUp',
              position: 'right',
              fill: '#06a',
              defaultHide(meta, iconName) {
                return true;
              },
              displayCondition(meta, iconName) {
                return meta.isLeaf;
              },
            },
          ],
          belongsCell: 'rowCell',
        },
      ],
    };

    const s2 = new PivotSheet(container, s2DataConfig, s2Options);

    await s2.render();
  });
