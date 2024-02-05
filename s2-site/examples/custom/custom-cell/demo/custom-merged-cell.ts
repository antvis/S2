import { PivotSheet, MergedCell, S2Options, S2DataConfig } from '@antv/s2';

/**
 * 自定义 MergedCell，改变背景色
 * 查看更多方法 https://github.com/antvis/S2/blob/next/packages/s2-core/src/cell/merged-cell.ts
 */
class CustomMergedCell extends MergedCell {
  // 覆盖背景绘制，可覆盖或者增加绘制方法
  drawBackgroundShape() {
    super.drawBackgroundShape();
    this.backgroundShape.style.fill = 'red';
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
      },
      meta: res.meta,
      data: res.data,
    };

    const s2Options: S2Options = {
      width: 600,
      height: 480,
      interaction: {
        hoverHighlight: false,
      },
      mergedCellsInfo: [
        [
          // 此单元格的 meta 信息将作为合并单元的 meta 信息
          { colIndex: 1, rowIndex: 1, showText: true },
          { colIndex: 1, rowIndex: 2 },
          { colIndex: 2, rowIndex: 1 },
          { colIndex: 2, rowIndex: 2 },
        ],
      ],
      mergedCell: (spreadsheet, cells, meta) =>
        new CustomMergedCell(spreadsheet, cells, meta),
    };

    const s2 = new PivotSheet(container, s2DataConfig, s2Options);

    await s2.render();
  });
