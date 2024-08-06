---
title: 单元格内绘制图表和图形
order: 11
tag: New
---

:::warning{title='提示'}
阅读本章前，请确保已经对 S2 足够了解，并且熟悉 [`AntV/G`](https://g.antv.antgroup.com/) 渲染引擎的相关内容。
:::

如果纯文本的表格不够直观，S2 内置了 [简单的 mini 图绘制](/examples/custom/custom-cell/#mini-chart)，也可以绘制 `AntV/G` 的基础图形。

### 数据格式

将普通数值替换成 { values: [G2 图表数据 (Spec)](https://g2.antv.antgroup.com/examples/general/interval/#column) }

```diff
{
-  number: string
+  number: {
+    values: { ...G2 Spec }
+  }
}
```

```diff
const s2DataConfig = {
  data: [
    {
-     number: 123,
+     number: {
+        values: {
+          type: 'line',
+          data: [
+            {
+              year: '2017',
+             value: -368,
+            },
+         ],
+          encode: { x: 'year', y: 'value' },
+        }
+      },
    }
  ]
}
```

### 1. 绘制 mini 图表

S2 内置了几种简单的 `mini` 图形的绘制，无需依赖 `G2` 等专业图表库，适用于简单的展示场景。

<Playground path='custom/custom-cell/demo/mini-chart.ts' rid='mini' height='400'></playground>

#### 1.1 数据准备

```ts
const s2DataConfig = {
  fields: {
    rows: ['province', 'city'],
    columns: ['type', 'sub_type'],
    values: ['number'],
  },
  data: [
    // 用于绘制 mini 图的数据
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
          type: 'bullet',
          measure: 0.3,
          target: 0.76,
        },
      },
    },
  ],
};
```

#### 1.2 自定义单元格

自定义 `DataCell`, 然后使用 `drawCustomContent` 接管绘制逻辑

```ts | pure
import { DataCell, drawCustomContent } from '@antv/s2';

class CustomDataCell extends DataCell {
  drawTextShape() {
    // 当数值为对象时，完全接管绘制，使用内置的 `drawCustomContent` 根据不同的数据结构 （见下方） 绘制不同的图形
    if (this.isMultiData()) {
      drawCustomContent(this);
      return;
    }

    // 如果是普通文本，则走默认的文本绘制逻辑
    super.drawTextShape();
  }
}

const s2Options = {
  dataCell: (viewMeta, spreadsheet) => {
    return new CustomDataCell(viewMeta, spreadsheet);
  },
};
```

#### 1.3 图表类型

:::info{title="提示"}

S2 内置了一些基于 [`AntV/G`](https://g.antv.antgroup.com/) 简单的图形绘制能力，适用于轻量简单使用，不希望有额外依赖的场景。

:::

- `line`: 折线图
- `bar`: 柱状图
- `bullet`: 子弹图

```json
{
  number: {
    values: {
      measure: 0.3,
      target: 0.76,
    }
  }
}
```

- `多列文本`

```json
{
  number: {
  values: [
    [3877, -4324, '42%'],
    [3877, 4324, '-42%'],
  ]
}
```

#### 1.4 效果

[查看示例](/examples/custom/custom-cell/#mini-chart)

<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*apnIT4KXP3YAAAAAAAAAAAAADmJ7AQ/original" alt="preview" width="800"/>

#### 1.5 数据格式

<embed src="@/docs/common/mini-chart.zh.md"></embed>

### 2. 绘制 G 自定义图形

S2 的每一个单元格对应 [`AntV/G`](https://g.antv.antgroup.com/) 的一个 [Group 图形分组](https://g.antv.antgroup.com/api/basic/group). 所以可以在单元格内添加任意 G 的图形，甚至是任意基于 G 的图表库，比如 [`AntV/G2`](https://g2.antv.antgroup.com/).

<Playground path='custom/custom-shape-and-chart/demo/custom-g-shape.ts' rid='custom-g-shape' height='400'></playground>

#### 2.1 自定义单元格，重写绘制逻辑，添加任意图形

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

#### 2.2 直接在表格 (Canvas) 上绘制任意图形

通过 `s2.getCanvas()` 获取 `G` 的 `Canvas` 实例。

```ts | pure
import { Rect } from '@antv/g';

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
```

#### 2.3 手动获取指定单元格实例 (Group) 后绘制任意图形

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

#### 2.4 手动获取指定单元格实例 (Group) 后绘制 icon

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

#### 2.5 效果

<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*X2KJSI-po1sAAAAAAAAAAAAADmJ7AQ/original" alt="preview" width="600"/>

[查看示例](/examples/custom/custom-shape-and-chart/#custom-g-shape)
