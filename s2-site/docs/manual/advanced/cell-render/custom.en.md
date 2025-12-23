---
title: Custom Rendering
order: 22
---

### Drawing G Custom Shapes

Each cell in S2 corresponds to a [Group](https://g.antv.antgroup.com/api/basic/group) of [`AntV/G`](https://g.antv.antgroup.com/). Therefore, you can add any G shape, or even any G-based chart library like [`AntV/G2`](https://g2.antv.antgroup.com/), inside a cell.

<Playground path='custom/custom-shape-and-chart/demo/custom-g-shape.ts' rid='custom-g-shape' height='400'></playground>

#### 1. Customize the cell, override the drawing logic, and add any shape

```ts | pure
import { Image as GImage } from '@antv/g';
import { CornerCell } from '@antv/s2';

class CustomCornerCell extends CornerCell {
  initCell()
    super.initCell()

    // Draw any shape
    this.appendChild(...)
  }

  drawBackgroundShape() {
    const url = 'https://gw.alipayobjects.com/zos/antfincdn/og1XQOMyyj/1e3a8de1-3b42-405d-9f82-f92cb1c10413.png';

    this.backgroundShape = this.appendChild(
      new GImage({
        style: {
          ...this.getBBoxByType(),
          src: url,
        },
      }),
    );

    this.drawTextShape();
  }
}

const s2Options = {
  cornerCell: (node, spreadsheet, headerConfig) => {
    return new CustomCornerCell(node, spreadsheet, headerConfig);
  }
};
```

#### 2. Draw any shape directly on the table (Canvas)

Get the `Canvas` instance of `G` through `s2.getCanvas()`.

```ts | pure
import { Rect } from '@antv/g';

await s2.render();

// Draw any shape directly on the table (Canvas)
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
```

#### 3. Manually get the specified cell instance (Group) and then draw any shape

```ts | pure
import { Rect } from '@antv/g';

await s2.render();

const targetCell = s2.facet.getDataCells()[0];

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
```

#### 4. Manually get the specified cell instance (Group) and then draw an icon

The `Icon` in the table is also a special shape. You can generate an icon instance through `GuiIcon` and then draw it.

```ts
import { GuiIcon } from '@antv/s2';

await s2.render();

const targetCell = s2.facet.getDataCells()[0];

const size = 12;
const meta = targetCell.getMeta();

// Example: Draw in the bottom right corner
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
```

#### 5. Effect

<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*X2KJSI-po1sAAAAAAAAAAAAADmJ7AQ/original" alt="preview" width="600"/>

[View Example](/examples/custom/custom-shape-and-chart/#custom-g-shape)
