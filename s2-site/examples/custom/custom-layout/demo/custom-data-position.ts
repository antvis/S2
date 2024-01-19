import {
  PivotSheet,
  VALUE_FIELD,
  EXTRA_FIELD,
  S2DataConfig,
  S2Options,
} from '@antv/s2';

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
      data: res.data,
      meta: [
        {
          field: 'number',
          name: '数量',
        },
        {
          field: 'province',
          name: '省份',
        },
        {
          field: 'city',
          name: '城市',
        },
        {
          field: 'type',
          name: '类别',
        },
        {
          field: 'sub_type',
          name: '子类别',
        },
      ],
    };

    const s2Options: S2Options = {
      width: 600,
      height: 480,
      layoutCellMeta: (viewMeta) => {
        // 动态改变指定单元格数据, 修订某个或者某些格子的值
        // 下面以更改「浙江省-宁波市-家具-桌子」的单元格数据为例
        const { rowIndex, colIndex } = viewMeta;

        if (rowIndex === 2 && colIndex === 0) {
          return {
            ...viewMeta,
            data: {
              province: '浙江省',
              city: '宁波市',
              type: '家具',
              sub_type: '桌子',
              number: 999,
              [EXTRA_FIELD]: 'number',
              [VALUE_FIELD]: 999,
            },
            fieldValue: 999,
          };
        }

        return viewMeta;
      },
    };

    const s2 = new PivotSheet(container, s2DataConfig, s2Options);

    await s2.render();
  });
