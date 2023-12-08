---
title: Pivot Mode
order: 1
---

## Introduction to Pivot Tables

Pivot table is also called cross table or multi-dimensional table. It is a table showing the relationship between multiple variables. It can help users discover the interaction between them and help businesses conduct cross-exploration analysis. It is currently the most frequently used in the field of commercial BI analysis. one of the charts.

<img data-mdast="html" alt="pivot-mode" src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*swH5TodvsMwAAAAAAAAAAAAAARQnAQ" width="600">

## use

```html
 <div id="container"></div>
```

### The React component approach

```typescript
 import React from "react";
import ReactDOM from "react-dom";
import { SheetComponent } from "@antv/s2-react";
import '@antv/s2-react/dist/style.min.css';

// 1. 准备数据
const data = [
  {
    province: "浙江",
    city: "杭州",
    type: "家具",
    sub_type: "桌子",
    price: "1",
  },
  {
    province: "浙江",
    city: "杭州",
    type: "家具",
    sub_type: "沙发",
    price: "2",
  },
  {
    province: "浙江",
    city: "杭州",
    type: "办公用品",
    sub_type: "笔",
    price: "3",
  },
  {
    province: "浙江",
    city: "杭州",
    type: "办公用品",
    sub_type: "纸张",
    price: "4",
  },
];

// 2. 配置数据
const dataCfg = {
 fields: {
 rows: ["province", "city"],
 columns: ["type", "sub_type"],
 values: ["price"]
 },
 data,
};

// 3. 添加配置
const options = {
 width: 600,
 height: 600,
};

// 4. 渲染
ReactDOM.render(
 <SheetComponent
 dataCfg={dataCfg}
 options={options}
 />,
 document.getElementById('container')
);
```

​📊 Check out the demo [React version pivot table](/examples/react-component/sheet#pivot) .

### class way

If you don't plan to rely on `React` , you can call it directly after the third step above:

```ts
 import { PivotSheet } from "@antv/s2";

const container = document.getElementById('container');
const pivotSheet = new PivotSheet(container, dataCfg, options);
pivotSheet.render();
```

​📊 View [the pivot table of the demo class](/examples/basic/pivot#grid) .

### FrozenFirstRow <Badge type="success">@antv/s2@^1.53.0 new feature</Badge>

Translation: Currently, only the ability to freeze the first row is provided, which is different from freezing rows and columns in a detail table. Due to the complex layout caused by the grouping feature in a pivot table, and to ensure reasonable interaction, the following limitations are in place:

The first row does not have any child nodes (suitable for scenarios where the total is placed at the top or for tree-like structures).
Pagination scenarios are not currently supported. To enable freezing of the first row, set frozenFirstRow in s2Options configuration.

```ts
const s2Options = {
  frozenFirstRow: boolean;
  totals: {
    row: {
      showGrandTotals: true,
      reverseLayout: true,
    },
  },
}
```

picture & demo：

<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*ncdCT7NB2I0AAAAAAAAAAAAADmJ7AQ/original" width="600" alt="preview" />
<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*ge0_S5iMB-wAAAAAAAAAAAAADmJ7AQ/original" width="600" alt="preview" />

<Playground path='interaction/advanced/demo/frozen-pivot-grid.ts' rid='container' height='300'></playground>
<Playground path='interaction/advanced/demo/frozen-pivot-tree.ts' rid='container' height='300'></playground>
