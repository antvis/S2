import type { S2DataConfig, S2Options } from '@antv/s2';
import { PivotChartSheet } from '@antv/s2/extends';

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
        valueInCols: true, // 试试数据置于行头
      },
      meta: res.meta,
      data: res.data,
    };

    const s2Options: S2Options = {
      width: 1200,
      height: 1000,
      chart: {
        dataCellSpec: {
          type: 'point',
          encode: {
            size: 8,
          },
        },
        axisRowCellSpec: {
          title: '竖轴 title',
          labelStroke: 'red',
        },
        axisColCellSpec: {
          title: '横轴 title',
          labelStroke: 'blue',
        },
      },
    };

    const s2 = new PivotChartSheet(container, s2DataConfig, s2Options);

    await s2.render();
  });
