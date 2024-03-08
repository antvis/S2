---
title: 单元格内绘制图表和图形
order: 11
tag: New
---

:::warning{title='提示'}
阅读本章前，请确保已经对 S2 足够了解，并且熟悉 [`AntV/G`](https://g.antv.antgroup.com/) 渲染引擎的相关内容。
:::

如果纯文本的表格不够直观，S2 内置了 [简单的 mini 图绘制](/examples/custom/custom-cell/#mini-chart), 同时也支持 [自定义单元格](/examples#custom-custom-cell) 的方式结合 [`AntV/G2`](https://g2.antv.antgroup.com/) 来实现一个组合图表，也可以绘制 `AntV/G` 的基础图形。

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

```ts
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
  dataCell: (viewMeta) => {
    return new CustomDataCell(viewMeta, viewMeta?.spreadsheet);
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

### 2. 绘制 G2 图表

如果上诉功能都无法满足使用，那么还可以使用专业的可视化图表库 [`AntV/G2`](https://g2.antv.antgroup.com/).

:::info{title="提示"}
`S2` 和 `G2` 底层都使用 [AntV/G](https://g.antv.antgroup.com/) 渲染引擎绘制，也就意味着可以**共享渲染引擎**, 实现在 `S2` 表格中绘制 `G2` 图表的梦幻联动，实现真 `图·表`.
:::

<Playground path='custom/custom-shape-and-chart/demo/custom-g2-chart.ts' rid='custom-g2-chart' height='400'></playground>

<br/>

#### 2.1 数据准备

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

#### 2.2 安装 G2

:::warning{title="该功能依赖 G2 的 `5.x` 版本，请确保使用了正确的版本 "}

```bash
pnpm add @antv/g2
```

使用 `G2` 提供的 `renderToMountedElement` 方法

```ts
import { renderToMountedElement } from '@antv/g2';
```

:::

#### 2.3 在 `@antv/s2` 中使用

##### 1. 自定义 `DataCell`, 如果是图表数据，则不渲染默认的文本

```ts
import { PivotSheet, DataCell } from '@antv/s2';

class ChartSheetDataCell extends DataCell {
  public drawTextShape(options) {
    if (this.isMultiData()) {
      return null;
    }

    super.drawTextShape(options);
  }
}

const s2 = new PivotSheet(container, s2DataConfig, {
  dataCell: (viewMeta) => new ChartSheetDataCell(viewMeta, viewMeta.spreadsheet)
});

await s2.render();

```

##### 2. 监听数值单元格渲染完成后，使用 `G2` 提供的 `renderToMountedElement` 将图表挂载在 `S2` 单元格实例上

:::warning{title="提示"}
由于 `G2` 按需加载的特性，请根据你渲染的图表，自行选择适合的 [`library`](https://g2.antv.antgroup.com/manual/extra-topics/bundle#g2stdlib)
:::

```ts
import { renderToMountedElement, stdlib } from '@antv/g2';

s2.on(S2Event.DATA_CELL_RENDER, (cell) => {
  // 如果是普通数值单元格正常展示
  if (!cell.isChartData()) {
    return;
  }

  const chartOptions = cell.getRenderChartOptions();

  renderToMountedElement(chartOptions, {
    group: cell,
    // https://g2.antv.antgroup.com/manual/extra-topics/bundle#g2stdlib
    library: stdlib(),
  });
});
```

#### 2.4 在 `@antv/s2-react` 使用

如果希望在 `React` 中使用，除了上诉的方式外，也可以直接使用 `<SheetComponent sheetType="chart" />`, 内部封装了 `自定义 DateCell` 的步骤

```tsx
import { SheetComponent } from '@antv/s2-react';
import { renderToMountedElement, stdlib } from '@antv/g2';

function App() {
  const onDataCellRender = (cell) => {
    // 如果是普通数值单元格正常展示
    if (!cell.isChartData()) {
      return;
    }

    const chartOptions = cell.getRenderChartOptions();

    renderToMountedElement(chartOptions, {
      group: cell,
      // 根据实际需要渲染的图表，选择 library：https://g2.antv.antgroup.com/manual/extra-topics/bundle#g2stdlib
      library: stdlib(),
    });
  };

  return (
    <SheetComponent
      sheetType="chart"
      dataCfg={s2DataConfig}
      onDataCellRender={onDataCellRender}
    />
  )
}
```

#### 2.5 效果

[查看示例](/examples/custom/custom-shape-and-chart/#custom-g2-chart)

<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*A9oWSbAfHu4AAAAAAAAAAAAADmJ7AQ/original" alt="preview" width="800"/>

### 3. 绘制 G 自定义图形

S2 的每一个单元格对应 [`AntV/G`](https://g.antv.antgroup.com/) 的一个 [Group 图形分组](https://g.antv.antgroup.com/api/basic/group). 所以可以在单元格内添加任意 G 的图形，甚至是任意基于 G 的图表库，比如 [`AntV/G2`](https://g2.antv.antgroup.com/).

<Playground path='custom/custom-shape-and-chart/demo/custom-g-shape.ts' rid='custom-g-shape' height='400'></playground>

#### 3.1 自定义单元格，重写绘制逻辑，添加任意图形

```ts
import { Image as GImage } from '@antv/g';
import { CornerCell } from '@antv/s2';

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

const s2Options = {
  cornerCell: (node, spreadsheet, headerConfig) => {
    return new CustomCornerCell(node, spreadsheet, headerConfig);
  }
};
```

#### 3.2 直接在表格 (Canvas) 上绘制任意图形

通过 `s2.getCanvas()` 获取 `G` 的 `Canvas` 实例。

```ts
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

#### 3.3 手动获取指定单元格实例 (Group) 后绘制任意图形

```ts
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

#### 3.4 效果

<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*TPuRQaXCSQEAAAAAAAAAAAAADmJ7AQ/original" alt="preview" width="600"/>

[查看示例](/examples/custom/custom-shape-and-chart/#custom-g-shape)
