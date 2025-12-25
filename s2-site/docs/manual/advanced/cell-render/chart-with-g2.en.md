---
title: Integrating with @antv/g2
order: 12
---

:::warning{title='Tip'}
Before reading this chapter, please make sure you are familiar enough with S2 and the related content of the [`AntV/G`](https://g.antv.antgroup.com/) rendering engine.
:::

In addition to mini chart drawing, S2 also supports [custom cells](/en/examples#custom-custom-cell) to combine with [`AntV/G2`](https://g2.antv.antgroup.com/) to create a composite chart, or to draw basic shapes of `AntV/G`.

### Data Format

The numeric format is still { values: [G2 Chart Data (Spec)](https://g2.antv.antgroup.com/examples/general/interval) }

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

#### 1.1 Data Preparation

:::info{title="Tip"}
The data source type is [MultiData](https://s2.antv.antgroup.com/api/general/s2-data-config#multidata), which supports the coexistence of `normal data cells` and `chart cells`. The chart data source is the standard [G2 Spec](https://g2.antv.antgroup.com/examples/general/interval).
:::

```ts
const s2DataConfig = {
  data: [
    // Normal data
    {
      number: 1343,
      province: 'Zhejiang',
      city: 'Hangzhou',
      type: 'Office Supplies',
      sub_type: 'Paper',
    },
    {
      number: {
        // G2 Chart Data (Spec) https://g2.antv.antgroup.com/examples/general/interval/#column
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
      province: 'Zhejiang',
      city: 'Zhoushan',
      type: 'Office Supplies',
      sub_type: 'Pen',
    },
  ],
};
```

#### 1.2 Installing G2

:::warning{title="This feature depends on version `5.x` of G2. Please make sure you are using the correct version."}

```bash
pnpm add @antv/g2
```

:::

#### 1.3 Using in `@antv/s2`

##### 1. Use `ChartDataCell` exported from `@antv/s2/extends`

```ts
import { PivotSheet } from '@antv/s2';
import { ChartDataCell } from '@antv/s2/extends';

const s2 = new PivotSheet(container, s2DataConfig, {
  dataCell: (viewMeta, spreadsheet) => new ChartDataCell(viewMeta, spreadsheet)
});

await s2.render();

```

:::info{title="Tip"}
Essentially, it uses the `renderToMountedElement` provided by `G2` to mount the chart on the `S2` cell instance.
:::

[View Example](/en/examples/custom/custom-shape-and-chart/#custom-g2-chart)

#### 2.4 Using in `@antv/s2-react`

If you want to use it in `React`, in addition to the above method, you can also use `<SheetComponent sheetType="chart" />`, which encapsulates `ChartDateCell` internally.

```tsx
import { SheetComponent } from '@antv/s2-react';

function App() {

  return (
    <SheetComponent
      sheetType="chart"
      dataCfg={s2DataConfig}
    />
  )
}
```

[View React Example](/en/examples/react-component/sheet/#chart)

#### 2.5 Effect

<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*A9oWSbAfHu4AAAAAAAAAAAAADmJ7AQ/original" alt="preview" width="800"/>
