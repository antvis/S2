---
title: Mini Chart
order: 11
---

:::warning{title='Tip'}
Before reading this chapter, please make sure you are familiar enough with S2 and the related content of the [`AntV/G`](https://g.antv.antgroup.com/) rendering engine.
:::

If a plain text table is not intuitive enough, S2 has built-in support for drawing [simple mini charts](/en/examples/custom/custom-cell/#mini-chart).

### Data Format

Replace the normal numeric value with { values: [G2 Chart Data (Spec)](https://g2.antv.antgroup.com/examples/general/interval) }

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

### 1. Drawing Mini Charts

S2 has several simple built-in `mini` chart drawing methods that do not rely on professional chart libraries like `G2`, making them suitable for simple display scenarios.

<Playground path='custom/custom-cell/demo/mini-chart.ts' rid='mini' height='400'></playground>

#### 1.1 Data Preparation

```ts
const s2DataConfig = {
  fields: {
    rows: ['province', 'city'],
    columns: ['type', 'sub_type'],
    values: ['number'],
  },
  data: [
    // Data for drawing mini charts
    {
      province: 'Hainan',
      city: 'Sanya',
      type: 'Furniture',
      sub_type: 'Table',
      number: {
        // Line chart
        values: {
          type: 'line',
          data: [
            { year: '2017', value: -368 },
            { year: '2018', value: 368 },
            { year: '2019', value: 368 },
            { year: '2020', value: 368 },
            { year: '2021', value: 268 },
            { year: '2022', value: 168 },
          ],
          encode: { x: 'year', y: 'value' },
        },
      },
    },
    {
      province: 'Hainan',
      city: 'Sanya',
      type: 'Furniture',
      sub_type: 'Sofa',
      number: {
        // Bar chart
        values: {
          type: 'bar',
          data: [
            { year: '2017', value: -368 },
            { year: '2018', value: 328 },
            { year: '2019', value: 38 },
            { year: '2020', value: 168 },
            { year: '2021', value: 268 },
            { year: '2022', value: 368 },
          ],
          encode: { x: 'year', y: 'value' },
        },
      },
    },
    {
      province: 'Hainan',
      city: 'Sanya',
      type: 'Office Supplies',
      sub_type: 'Pen',
      number: {
        // Multi-column text
        values: [
          [3877, -4324, '42%'],
          [3877, 4324, '-42%'],
        ],
      },
    },
    {
      province: 'Hainan',
      city: 'Sanya',
      type: 'Office Supplies',
      sub_type: 'Paper',
      number: {
        // Bullet chart
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

#### 1.2 Custom Cell

Customize `DataCell`, then use `drawCustomContent` to take over the drawing logic.

```ts | pure
import { DataCell, drawCustomContent } from '@antv/s2';

class CustomDataCell extends DataCell {
  drawTextShape() {
    // When the value is an object, completely take over the drawing and use the built-in `drawCustomContent`
    // to draw different graphics according to different data structures (see below).
    if (this.isMultiData()) {
      drawCustomContent(this);
      return;
    }

    // If it is plain text, the default text drawing logic will be used.
    super.drawTextShape();
  }
}

const s2Options = {
  dataCell: (viewMeta, spreadsheet) => {
    return new CustomDataCell(viewMeta, spreadsheet);
  },
};
```

#### 1.3 Chart Types

:::info{title="Tip"}

S2 has some simple graphics drawing capabilities based on [`AntV/G`](https://g.antv.antgroup.com/), suitable for lightweight and simple use scenarios where no additional dependencies are desired.

:::

- `line`: Line chart
- `bar`: Bar chart
- `bullet`: Bullet chart

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

- `Multi-column text`

```json
{
  number: {
  values: [
    [3877, -4324, '42%'],
    [3877, 4324, '-42%'],
  ]
}
```

#### 1.4 Effect

[View Example](/en/examples/custom/custom-cell/#mini-chart)

<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*apnIT4KXP3YAAAAAAAAAAAAADmJ7AQ/original" alt="preview" width="800"/>

#### 1.5 Data Format

<embed src="@/common/mini-chart.en.md"></embed>
