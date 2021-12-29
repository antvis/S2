---
title: 透视表
order: 1
---
## 透视表简介

透视表也叫做交叉表或多维表，显示多变量之间相互关系的一种表格，可以帮助用户发现它们之间的相互作用，帮助业务进行交叉探索分析，是目前商业 BI 分析领域中使用频率最高的图表之一。

<img alt="pivot-mode" src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*swH5TodvsMwAAAAAAAAAAAAAARQnAQ" width="600">

## 使用

```html
<div id="container"></div>
```

### React 组件方式

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
    rows: ["province", "city"]
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

​📊 查看 demo [React 版本透视表](/zh/examples/react-component/sheet#pivot)。

### 类方式

如果不打算依赖 `React`，可以在上面第三步之后直接调用：

```ts
import { PivotSheet } from "@antv/s2";

const container = document.getElementById('container');
const pivotSheet = new PivotSheet(container, dataCfg, options);
pivotSheet.render();
```

​📊 查看 demo [类方式透视表](/zh/examples/basic/pivot#grid)。
