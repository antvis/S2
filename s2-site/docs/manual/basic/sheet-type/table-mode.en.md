---
title: Table Mode
order: 2
---

## Introduction

The schedule is one of the basic forms of `S2` . The detailed table is an ordinary table, and the data of each row is directly displayed under the column header. It is mainly used for the display of detailed data in big data scenarios.

<img alt="pivot-mode" src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*PmpvRrcBEbMAAAAAAAAAAAAAARQnAQ" width="600">

Schedules and pivot tables share [basic interactions](/manual/advanced/interaction/basic) , [theming](/manual/basic/theme) , [replication](/manual/basic/analysis/export) , [custom cell](/manual/advanced/custom/hook) capabilities, and more. In addition, the schedule also supports special functions such as row and [column freezing](/examples/interaction/basic#froze) . In the scenario of massive detailed data rendering, the detailed table can replace the `DOM` -based table component to improve performance and user experience.

## use

```html
<div id="container" />
```

### The React component approach

```typescript
import React from "react";
import ReactDOM from "react-dom";
import { SheetComponent } from '@antv/s2-react';
import '@antv/s2-react/dist/style.min.css';

// 1. 准备数据
const data = [
  {
    province: "浙江",
    city: "杭州",
    type: "笔",
    price: "1",
  },
  {
    province: "浙江",
    city: "杭州",
    type: "纸张",
    price: "2",
  },
];

// 2. 配置数据
const s2DataConfig = {
  fields: {
    columns: ["province", "city", "type", "price"], // 要展示的列头字段 id 列表
  },
  meta: [
    // 列头字段对应的元信息，比如展示的中文名
    {
      field: "province",
      name: "省份",
    },
    {
      field: "city",
      name: "城市",
    },
    {
      field: "type",
      name: "类型",
    },
    {
      field: "price",
      name: "价格",
    },
  ],
  data,
};

// 3. 添加配置
const s2Options = {
  width: 400,
  height: 200,
};

// 4, 渲染
ReactDOM.render(
  <SheetComponent
    sheetType="table"
    dataCfg={s2DataConfig}
    options={s2Options}
  />,
  document.getElementById('container')
);
```

### TableSheet class method

If you don't plan to rely on React, you can call it directly after the third step above:

```ts
import { TableSheet } from "@antv/s2";

const container = document.getElementById('container');
const s2 = new TableSheet(container, dataCfg, options);
s2.render();
```

## characteristic

### serial number

Pass in `s2Options` in `seriesNumber` to display the built-in serial number. [view demo](/examples/basic/table#table)

```ts
const s2Options = {
  seriesNumber: {
    enable: true
  }
}
```

### ranks freeze

Row and column freeze keeps a specific row and column fixed while scrolling, so that it remains within the viewport at all times, providing information for comparison and reference. [view demo](/examples/interaction/basic#frozen)

Row and column freezing is controlled by passing these properties in `s2Options` :

```ts
const s2Options = {
  frozen: {
    rowCount: number; // 冻结行的数量，从顶部开始计数
    trailingRowCount: number; // 冻结行数量，从底部开始计数
    colCount: number; // 冻结列的数量，从左侧开始计数
    trailingColCount: number; // 冻结列的数量，从右侧开始计数
  }
}
```

The effect is as shown in the figure:

<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*tZkOSqYWVFQAAAAAAAAAAAAAARQnAQ" width="600" alt="preview">

<Playground path="interaction/basic/demo/frozen.ts" rid="container" height="300"></Playground>
