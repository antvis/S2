import {
  PivotSheet,
  DataCell,
  S2DataConfig,
  S2Event,
  S2Options,
} from '@antv/s2';
import { renderToMountedElement, stdlib } from '@antv/g2';

// 自定义 `DataCell`, 如果是图表数据, 则不渲染默认的文本

class ChartSheetDataCell extends DataCell {
  drawTextShape(options) {
    if (this.isMultiData()) {
      return null;
    }

    super.drawTextShape(options);
  }
}

const s2Options: S2Options = {
  width: 1000,
  height: 900,
  style: {
    colCell: {
      hideValue: true,
    },
    rowCell: {
      width: 100,
    },
    // 适当增加单元格宽高, 以便于展示 G2 图表
    dataCell: {
      width: 400,
      height: 400,
    },
  },
  dataCell: (viewMeta) =>
    new ChartSheetDataCell(viewMeta, viewMeta.spreadsheet),
};

const s2DataConfig: S2DataConfig = {
  fields: {
    rows: ['province', 'city'],
    columns: ['type', 'sub_type'],
    values: ['number'],
  },
  meta: [
    {
      field: 'number',
      name: '数据',
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
  // 数据源类型为 https://s2.antv.antgroup.com/api/general/s2-data-config#multidata 支持`普通数值单元格`和`图表单元格` 共存.
  data: [
    // 普通数据
    {
      number: 1343,
      province: '浙江省',
      city: '杭州市',
      type: '办公用品',
      sub_type: '纸张',
    },
    {
      number: {
        // G2 图表数据 (Spec) https://g2.antv.antgroup.com/examples/general/interval/#column
        values: {
          type: 'view',
          autoFit: true,
          padding: 0,
          axis: false,
          children: [
            {
              type: 'image',
              style: {
                src: 'https://gw.alipayobjects.com/zos/rmsportal/NeUTMwKtPcPxIFNTWZOZ.png',
                x: '50%',
                y: '50%',
                width: '100%',
                height: '100%',
              },
              tooltip: false,
            },
            {
              type: 'heatmap',
              data: {
                type: 'fetch',
                value: 'https://assets.antv.antgroup.com/g2/heatmap.json',
              },
              encode: { x: 'g', y: 'l', color: 'tmp' },
              style: { opacity: 0 },
              tooltip: false,
            },
          ],
        },
      },
      province: '浙江省',
      city: '舟山市',
      type: '办公用品',
      sub_type: '笔',
    },
  ],
};

const container = document.getElementById('container');

const s2 = new PivotSheet(container, s2DataConfig, s2Options);

// 监听数值单元格渲染完成后, 使用 `G2` 提供的 `renderToMountedElement` 将图表挂载在 `S2` 单元格实例上
s2.on(S2Event.DATA_CELL_RENDER, (cell) => {
  // 获取 G2 渲染到 S2 单元格内所需配置
  const chartOptions = cell.getRenderChartOptions();

  renderToMountedElement(chartOptions, {
    // 指定渲染容器为当前单元格
    group: cell,
    // 根据渲染的图表, 自行选择 G2 library: https://g2.antv.antgroup.com/manual/extra-topics/bundle#g2stdlib
    library: stdlib(),
  });
});

s2.render();
