---
title: Pivot Mode
order: 1

---

## Introduction

Pivot table is also called cross table or multi-dimensional table. It is a table showing the relationship between multiple variables. It can help users discover the interaction between them and help businesses conduct cross-exploration analysis. It is currently the most frequently used in the field of commercial BI analysis. one of the charts.

<img alt="pivot-mode" src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*swH5TodvsMwAAAAAAAAAAAAAARQnAQ" width="600">

## use

```html
<div id="container" />
```

### The React component approach

```typescript
import React from "react";
import ReactDOM from "react-dom";
import { SheetComponent } from "@antv/s2-react";
import '@antv/s2-react/dist/s2-react.min.css';

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
const s2DataConfig = {
  fields: {
    rows: ["province", "city"],
    columns: ["type", "sub_type"],
    values: ["price"]
  },
  data,
};

// 3. 添加配置
const s2Options = {
  width: 600,
  height: 600,
};

// 4. 渲染
ReactDOM.render(
  <SheetComponent
    dataCfg={s2DataConfig}
    options={s2Options}
  />,
  document.getElementById('container')
);
```

​📊 Check out the [React version perspective example](/examples/react-component/sheet#pivot) and [API docs](/api/components/sheet-component) .

### class way

If you don't plan to rely on `React` , you can call it directly after the third step above:

```ts
import { PivotSheet } from "@antv/s2";

const container = document.getElementById('container');
const s2 = new PivotSheet(container, dataCfg, options);
s2.render();
```

​📊 Check out [the class-wise perspective example](/examples/basic/pivot#grid) and [API docs](/api/general/s2options) .
