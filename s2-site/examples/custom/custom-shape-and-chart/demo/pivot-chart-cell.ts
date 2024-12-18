import type { S2DataConfig, S2Options } from '@antv/s2';
import {
  AxisColCell,
  AxisRowCell,
  PivotChartDataCell,
  PivotChartSheet,
} from '@antv/s2/extends';

class CustomDataCell extends PivotChartDataCell {
  getChartOptions() {
    const origin = super.getChartOptions();
    console.log('🚀 ~ origin:', origin);
    return {
      ...origin,
      type: 'area',
      encode: {
        x: origin.encode.x,
        y: origin.encode.y,
        shape: 'area',
      },
      style: {
        opacity: 0.2,
      },
    };
  }
}

class CustomRowCell extends AxisRowCell {
  getChartOptions() {
    const origin = super.getChartOptions();
    return {
      ...origin,
      title: '竖轴 title',
      labelStroke: 'red',
    };
  }
}

class CustomColCell extends AxisColCell {
  getChartOptions() {
    const origin = super.getChartOptions();
    return {
      ...origin,
      title: '横轴 title',
      labelStroke: 'blue',
    };
  }
}

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
      dataCell: (viewMeta, spreadsheet) =>
        new CustomDataCell(viewMeta, spreadsheet),
      axisRowCell: (node, s2, headConfig) => {
        return new CustomRowCell(node, s2, headConfig);
      },
      axisColCell: (node, s2, headConfig) => {
        return new CustomColCell(node, s2, headConfig);
      },
    };

    const s2 = new PivotChartSheet(container, s2DataConfig, s2Options);

    await s2.render();
  });
