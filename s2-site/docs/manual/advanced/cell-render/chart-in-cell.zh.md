---
title: 迷你图表
order: 11
---

:::warning{title='提示'}
阅读本章前，请确保已经对 S2 足够了解，并且熟悉 [`AntV/G`](https://g.antv.antgroup.com/) 渲染引擎的相关内容。
:::

如果纯文本的表格不够直观，S2 内置了 [简单的 mini 图绘制](/examples/custom/custom-cell/#mini-chart)。

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
