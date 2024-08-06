/* eslint-disable no-console */
/* eslint-disable max-classes-per-file */
import { Image as GImage, Polygon, Polyline, Rect } from '@antv/g';
import {
  ColCell,
  CornerCell,
  DataCell,
  GuiIcon,
  PivotSheet,
  RowCell,
  S2DataConfig,
  S2Options,
  renderIcon,
} from '@antv/s2';

/**
 * 自定义图片: https://g.antv.antgroup.com/api/basic/image
 * 更多 G 的图形请查阅相关文档: https://g.antv.antgroup.com/api/basic/concept
 * 明细表需要继承 TableCornerCell: https://github.com/antvis/S2/blob/next/packages/s2-core/src/cell/table-corner-cell.ts
 */
class CustomCornerCell extends CornerCell {
  drawBackgroundShape() {
    const url =
      'https://gw.alipayobjects.com/zos/antfincdn/og1XQOMyyj/1e3a8de1-3b42-405d-9f82-f92cb1c10413.png';

    this.backgroundShape = this.appendChild(
      new GImage({
        style: {
          ...this.getBBoxByType(),
          src: url,
        },
      }),
    );
  }
}

/**
 * 自定义图标: https://s2.antv.antgroup.com/manual/advanced/custom/custom-icon
 * 更多 G 的图形请查阅相关文档: https://g.antv.antgroup.com/api/basic/concept
 * 明细表需要继承 TableColCell: https://github.com/antvis/S2/blob/next/packages/s2-core/src/cell/table-col-cell.ts
 */
class CustomColCell extends ColCell {
  initCell() {
    super.initCell();

    const { x, y, width, height } = this.meta;

    // 左上角绘制
    renderIcon(this, {
      name: 'Plus',
      x,
      y,
      width: 14,
      height: 14,
    });

    // 右下角绘制
    const icon = renderIcon(this, {
      name: 'Trend',
      x: x + width - 10,
      y: y + height - 10,
      width: 10,
      height: 10,
      cursor: 'pointer',
    });

    // 绑定事件
    icon.addEventListener('click', (event) => {
      console.log('clicked:', event);
    });
  }
}

/**
 * 自定义 Polygon 多边形: https://g.antv.antgroup.com/api/basic/polygon
 */
class CustomDataCell extends DataCell {
  drawBackgroundShape() {
    if (this.meta.colIndex > 0) {
      return super.drawBackgroundShape();
    }

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
          zIndex: 999,
        },
      }),
    );
  }
}

/**
 * 自定义 Polyline 折线: https://g.antv.antgroup.com/api/basic/polyline
 */
class CustomRowCell extends RowCell {
  initCell() {
    super.initCell();

    // 绘制任意图形...
    // this.appendChild(...)
  }

  drawBackgroundShape() {
    if (this.meta.rowIndex > 0) {
      return super.drawBackgroundShape();
    }

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
          zIndex: 999,
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
      // 1. 自定义单元格, 重写绘制逻辑, 添加任意图形
      cornerCell: (node, spreadsheet, headerConfig) => {
        return new CustomCornerCell(node, spreadsheet, headerConfig);
      },
      rowCell: (node, spreadsheet, headerConfig) => {
        return new CustomRowCell(node, spreadsheet, headerConfig);
      },
      colCell: (node, spreadsheet, headerConfig) => {
        return new CustomColCell(node, spreadsheet, headerConfig);
      },
      dataCell: (viewMeta, spreadsheet) => {
        return new CustomDataCell(viewMeta, spreadsheet);
      },
    };

    const s2 = new PivotSheet(container, s2DataConfig, s2Options);

    await s2.render();

    // 2. 直接在表格 (Canvas) 上绘制任意图形
    s2.getCanvas().appendChild(
      new Rect({
        style: {
          x: 300,
          y: 200,
          width: 100,
          height: 100,
          fill: '#1890FF',
          fillOpacity: 0.8,
          stroke: '#F04864',
          strokeOpacity: 0.8,
          lineWidth: 4,
          radius: 100,
          zIndex: 999,
        },
      }),
    );

    // 3. 手动获取指定单元格实例 (Group) 后绘制任意图形
    const targetCell = s2.facet.getDataCells()[3];

    targetCell?.appendChild(
      new Rect({
        style: {
          x: 0,
          y: 100,
          width: 20,
          height: 20,
          fill: '#396',
          fillOpacity: 0.8,
          stroke: '#ddd',
          strokeOpacity: 0.8,
          lineWidth: 4,
          radius: 10,
          zIndex: 999,
        },
      }),
    );

    // 4. 手动获取指定单元格实例 (Group) 后绘制任意图标
    const size = 12;
    const meta = targetCell.getMeta();
    const icon = new GuiIcon({
      x: meta.x + meta.width - size,
      y: meta.y + meta.height - size,
      name: 'Trend',
      width: size,
      height: size,
      fill: 'red',
    });

    icon.addEventListener('click', (e) => {
      console.log('trend icon click:', e);
    });

    targetCell.appendChild(icon);
  });
