---
title: 表形态-明细表
order: 1
---

# 明细表简介

明细表是 S2 的基础形态之一。明细表就是普通的表格，在列头下把每行数据直接展示出来。主要用于大数据场景下明细数据的展示。

![tablmode](https://gw.alipayobjects.com/mdn/rms_ca5e51/afts/img/A*rUnvRKlKL0wAAAAAAAAAAAAAARQnAQ)

明细表和交叉表共享基础交互、主题、复制、自定义 Cell 等能力。除此之外，明细表还支持行列冻结等特色功能。在海量明细数据渲染场景下，明细表可以替换基于 DOM 的表格组件，来提升性能和用户体验。

# 使用


### React 组件方式

```typescript
import React from "react";
import ReactDOM from "react-dom";
import {
  TableSheet,
  SheetComponent,
  DataCfg,
  SpreadsheetOptions,
} from "@antv/s2";

// 1. 准备明细数据
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
const dataCfg = {
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

// 3. S2 相关配置
const options = {
  width: 400,
  height: 200,
  showSeriesNumber: true,
  style: {
    cellCfg: {
      height: 32,
    },
    device: "pc",
  },
};

// 4. 准备表实例
const getSpreadSheet = (
  dom: string | HTMLElement,
  dataCfg: DataCfg,
  options: SpreadsheetOptions
) => {
  return new TableSheet(dom, dataCfg, options);
};

// 5, 渲染 React 组件
ReactDOM.render(
  <SheetComponent
    dataCfg={dataCfg}
    options={options}
    spreadsheet={getSpreadSheet}
    sheetType={"table"}
  />,
  "#container"
);

```

### TableSheet 类方式

如果不打算依赖 React，可以在上面第三部之后直接调用：

```typescript
const sheet = new TableSheet("#container", dataCfg, options)
sheet.render()
```

# 特性


### 序号

在 S2 Options 中传入 `showSeriesNumber` 即可展示内置的序号。
 
### 行列冻结

行列冻结让特定行列在滚动时保持固定，从而一直保持在视口范围内，提供信息的对照和参考。

行列冻结通过在 S2 Options 中传入这些属性控制：

```typescript
{
    frozenRowCount: number; // 冻结行的数量，从顶部开始计数
    frozenTrailingRowCount: number; // 冻结行数量，从底部开始计数
    frozenColCount: number; // 冻结列的数量，从左侧开始计数
    frozenTrailingColCount: number; // 冻结列的数量，从右侧开始计数
}
```

效果如图：

![frozen](https://gw.alipayobjects.com/mdn/rms_ca5e51/afts/img/A*UZwHR7MHGJYAAAAAAAAAAAAAARQnAQ)







