---
title: 结合 @antv/g2 绘制图形
order: 12
tag: Experimental
---

:::warning{title='提示'}
阅读本章前，请确保已经对 S2 足够了解，并且熟悉 [`AntV/G`](https://g.antv.antgroup.com/) 渲染引擎的相关内容。
:::

除了 mini 图绘制外，S2 也支持 [自定义单元格](/examples#custom-custom-cell) 的方式结合 [`AntV/G2`](https://g2.antv.antgroup.com/) 来实现一个组合图表，也可以绘制 `AntV/G` 的基础图形。

### 数据格式

数值格式依旧是 { values: [G2 图表数据 (Spec)](https://g2.antv.antgroup.com/examples/general/interval/#column) }

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

#### 1.1 数据准备

:::info{title="提示"}
数据源类型为 [MultiData](https://s2.antv.antgroup.com/api/general/s2-data-config#multidata) 支持 `普通数值单元格` 和 `图表单元格` 共存。图表数据源为标准的 [G2 Spec](https://g2.antv.antgroup.com/examples/general/interval/#column).
:::

```ts
const s2DataConfig = {
  data: [
    // 普通数据
    {
      number: 1343,
      province: '浙江省',
      city: '杭州市',
      type: '办公用品',
      sub_type: '纸张',
    },
    {
      number: {
        // G2 图表数据 (Spec) https://g2.antv.antgroup.com/examples/general/interval/#column
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
      province: '浙江省',
      city: '舟山市',
      type: '办公用品',
      sub_type: '笔',
    },
  ],
};
```

#### 1.2 安装 G2

:::warning{title="该功能依赖 G2 的 `5.x` 版本，请确保使用了正确的版本 "}

```bash
pnpm add @antv/g2
```

:::

#### 1.3 在 `@antv/s2` 中使用

##### 1. 使用 `@antv/s2/extends` 中导出的`ChartDataCell`

```ts
import { PivotSheet } from '@antv/s2';
import { ChartDataCell } from '@antv/s2/extends';

const s2 = new PivotSheet(container, s2DataConfig, {
  dataCell: (viewMeta, spreadsheet) => new ChartDataCell(viewMeta, spreadsheet)
});

await s2.render();

```

:::info{title="提示"}
本质上就是使用 `G2` 提供的 `renderToMountedElement` 将图表挂载在 `S2` 单元格实例上
:::

[查看示例](/examples/custom/custom-shape-and-chart/#custom-g2-chart)

#### 2.4 在 `@antv/s2-react` 使用

如果希望在 `React` 中使用，除了上诉的方式外，也可以直接使用 `<SheetComponent sheetType="chart" />`, 内部封装了 `ChartDateCell`。

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

[查看 React 示例](/examples/react-component/sheet/#chart)

#### 2.5 效果

<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*A9oWSbAfHu4AAAAAAAAAAAAADmJ7AQ/original" alt="preview" width="800"/>
