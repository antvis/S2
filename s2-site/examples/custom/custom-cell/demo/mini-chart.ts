/* eslint-disable max-lines-per-function */
import {
  PivotSheet,
  DataCell,
  drawCustomContent,
  S2DataConfig,
  S2Options,
} from '@antv/s2';

/**
 * 自定义 DataCell，使用 drawCustomContent 绘制简易的 mini 图
 * 查看更多方法 https://github.com/antvis/S2/blob/next/packages/s2-core/src/cell/data-cell.ts
 */
class CustomDataCell extends DataCell {
  // 当数值为对象时，完全接管绘制, 使用内置的 `drawCustomContent` 根据不同的数据结构 (见下方) 绘制不同的图形
  drawTextShape() {
    if (this.isMultiData()) {
      return drawCustomContent(this);
    }

    super.drawTextShape();
  }
}

fetch(
  'https://gw.alipayobjects.com/os/bmw-prod/cd9814d0-6dfa-42a6-8455-5a6bd0ff93ca.json',
)
  .then((res) => res.json())
  .then((res) => {
    const container = document.getElementById('container')!;
    const s2DataConfig: S2DataConfig = {
      fields: {
        rows: ['province', 'city'],
        columns: ['type', 'sub_type'],
        values: ['number'],
      },
      meta: res.meta,
      data: [
        // 用于绘制 mini 图的数据, 数据结构请查阅: https://s2.antv.antgroup.com/manual/basic/analysis/strategy#%E9%85%8D%E7%BD%AE-mini-%E5%9B%BE
        {
          province: '海南省',
          city: '三亚市',
          type: '家具',
          sub_type: '桌子',
          number: {
            // 折线图
            values: {
              type: 'line',
              data: [
                {
                  year: '2017',
                  value: -368,
                },
                {
                  year: '2018',
                  value: 368,
                },
                {
                  year: '2019',
                  value: 368,
                },
                {
                  year: '2020',
                  value: 368,
                },
                {
                  year: '2021',
                  value: 268,
                },
                {
                  year: '2022',
                  value: 168,
                },
              ],
              encode: { x: 'year', y: 'value' },
            },
          },
        },
        {
          province: '海南省',
          city: '三亚市',
          type: '家具',
          sub_type: '沙发',
          number: {
            // 柱状图
            values: {
              type: 'bar',
              data: [
                {
                  year: '2017',
                  value: -368,
                },
                {
                  year: '2018',
                  value: 328,
                },
                {
                  year: '2019',
                  value: 38,
                },
                {
                  year: '2020',
                  value: 168,
                },
                {
                  year: '2021',
                  value: 268,
                },
                {
                  year: '2022',
                  value: 368,
                },
              ],
              encode: { x: 'year', y: 'value' },
            },
          },
        },
        {
          province: '海南省',
          city: '三亚市',
          type: '办公用品',
          sub_type: '笔',
          number: {
            // 多列文本
            values: [
              [3877, -4324, '42%'],
              [3877, 4324, '-42%'],
            ],
          },
        },
        {
          province: '海南省',
          city: '三亚市',
          type: '办公用品',
          sub_type: '纸张',
          number: {
            // 子弹图
            values: {
              measure: 0.3,
              target: 0.76,
            },
          },
        },
        ...res.data,
      ],
    };

    const s2Options: S2Options = {
      width: 1000,
      height: 680,
      style: {
        dataCell: {
          height: 40,
        },
      },
      conditions: {
        text: [
          {
            field: 'number',
            mapping: (value, cellInfo) => {
              const { meta, colIndex } = cellInfo || {};

              if (colIndex === 0 || !value || !meta?.fieldValue) {
                return {
                  fill: '#000',
                };
              }

              return {
                fill: value > 0 ? '#FF4D4F' : '#29A294',
              };
            },
          },
        ],
      },
      dataCell: (viewMeta) => {
        return new CustomDataCell(viewMeta, viewMeta?.spreadsheet);
      },
    };

    const s2 = new PivotSheet(container, s2DataConfig, s2Options);

    s2.render();
  });
