import { PivotSheet, CornerCell, S2Options, S2DataConfig } from '@antv/s2';
import { Image as GImage } from '@antv/g';

/**
 * 自定义 CornerCell，给角头添加背景图
 * 查看更多方法 https://github.com/antvis/S2/blob/next/packages/s2-core/src/cell/corner-cell.ts
 * 明细表需要继承 TableCornerCell  https://github.com/antvis/S2/blob/next/packages/s2-core/src/cell/table-corner-cell.ts
 */
class CustomCornerCell extends CornerCell {
  drawBackgroundShape() {
    const img = new Image();

    img.src =
      'https://gw.alipayobjects.com/zos/antfincdn/og1XQOMyyj/1e3a8de1-3b42-405d-9f82-f92cb1c10413.png';

    img.onload = () => {
      this.backgroundShape = this.appendChild(
        new GImage({
          style: {
            ...this.getBBoxByType(),
            img,
          },
        }),
      );

      this.drawTextShape();
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
      cornerCell: (node, s2, headConfig) => {
        return new CustomCornerCell(node, s2, headConfig);
      },
    };

    const s2 = new PivotSheet(container, s2DataConfig, s2Options);

    await s2.render();
  });
