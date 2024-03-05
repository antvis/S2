/* eslint-disable max-classes-per-file */
import { Image as GImage, Path, Polygon, Polyline } from '@antv/g';
import {
  ColCell,
  CornerCell,
  DataCell,
  PivotSheet,
  RowCell,
  S2DataConfig,
  S2Options,
} from '@antv/s2';

/**
 * 自定义图片 https://g.antv.antgroup.com/api/basic/image
 * 更多 G 的图形请查阅相关文档: https://g.antv.antgroup.com/api/basic/concept
 * 明细表需要继承 TableCornerCell https://github.com/antvis/S2/blob/next/packages/s2-core/src/cell/table-corner-cell.ts
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

/**
 * 自定义 Polygon 多边形 https://g.antv.antgroup.com/api/basic/polygon
 */
class CustomDataCell extends DataCell {
  drawBackgroundShape() {
    this.backgroundShape = this.appendChild(
      new Polygon({
        style: {
          points: [
            [0, 0],
            [100, 0],
            [100, 100],
            [0, 100],
          ],
          stroke: '#1890FF',
          lineWidth: 2,
        },
      }),
    );
  }
}

/**
 * 自定义 Polyline 折线 https://g.antv.antgroup.com/api/basic/polyline
 */
class CustomRowCell extends RowCell {
  drawBackgroundShape() {
    this.backgroundShape = this.appendChild(
      new Polyline({
        style: {
          points: [
            [50, 50],
            [100, 50],
            [100, 100],
            [150, 100],
            [150, 150],
            [200, 150],
            [200, 200],
            [250, 200],
            [250, 250],
            [300, 250],
            [300, 300],
            [350, 300],
            [350, 350],
            [400, 350],
            [400, 400],
            [450, 400],
          ],
          stroke: '#1890FF',
          lineWidth: 2,
        },
      }),
    );
  }
}

/**
 * 自定义 Path 路径 https://g.antv.antgroup.com/api/basic/path
 */
class CustomColCell extends ColCell {
  drawBackgroundShape() {
    this.backgroundShape = this.appendChild(
      new Path({
        style: {
          path: [
            ['M', 100, 100],
            ['L', 200, 200],
          ],
          stroke: '#F04864',
        },
      }),
    );
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
      cornerCell: (node, spreadsheet, headerConfig) => {
        return new CustomCornerCell(node, spreadsheet, headerConfig);
      },
      colCell: (node, spreadsheet, headerConfig) => {
        return new CustomColCell(node, spreadsheet, headerConfig);
      },
      rowCell: (node, spreadsheet, headerConfig) => {
        return new CustomRowCell(node, spreadsheet, headerConfig);
      },
      dataCell: (viewMeta) => {
        return new CustomDataCell(viewMeta, viewMeta?.spreadsheet);
      },
    };

    const s2 = new PivotSheet(container, s2DataConfig, s2Options);

    await s2.render();
  });
