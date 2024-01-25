import { PivotSheet, S2DataConfig, S2Options } from '@antv/s2';

// TODO: 目前没有导出 PivotFacet
// class CustomFacet extends PivotFacet {}
class CustomFacet {}

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
        valueInCols: true,
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
      // facet: (spreadsheet) => new CustomFacet(spreadsheet),
    };

    const s2 = new PivotSheet(container, s2DataConfig, s2Options);

    await s2.render();
  });
