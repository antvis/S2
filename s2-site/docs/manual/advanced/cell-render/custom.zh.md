---
title: 自定义渲染
order: 22
---

### 绘制 G 自定义图形

S2 的每一个单元格对应 [`AntV/G`](https://g.antv.antgroup.com/) 的一个 [Group 图形分组](https://g.antv.antgroup.com/api/basic/group). 所以可以在单元格内添加任意 G 的图形，甚至是任意基于 G 的图表库，比如 [`AntV/G2`](https://g2.antv.antgroup.com/).

<Playground path='custom/custom-shape-and-chart/demo/custom-g-shape.ts' rid='custom-g-shape' height='400'></playground>

#### 1 自定义单元格，重写绘制逻辑，添加任意图形

```ts | pure
import { Image as GImage } from '@antv/g';
import { CornerCell } from '@antv/s2';

class CustomCornerCell extends CornerCell {
  initCell()
    super.initCell()

    // 绘制任意图形
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

#### 2 直接在表格 (Canvas) 上绘制任意图形

通过 `s2.getCanvas()` 获取 `G` 的 `Canvas` 实例。

```ts | pure
import { Rect } from '@antv/g';

await s2.render();

//  直接在表格 (Canvas) 上绘制任意图形
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

#### 3 手动获取指定单元格实例 (Group) 后绘制任意图形

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

#### 4 手动获取指定单元格实例 (Group) 后绘制 icon

表格内的 `Icon` 也是一种特殊图形，可以通过 `GuiIcon` 生成图标实例，然后绘制。

```ts
import { GuiIcon } from '@antv/s2';

await s2.render();

const targetCell = s2.facet.getDataCells()[0];

const size = 12;
const meta = targetCell.getMeta();

// 例：绘制在右下角
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

#### 5 效果

<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*X2KJSI-po1sAAAAAAAAAAAAADmJ7AQ/original" alt="preview" width="600"/>

[查看示例](/examples/custom/custom-shape-and-chart/#custom-g-shape)
