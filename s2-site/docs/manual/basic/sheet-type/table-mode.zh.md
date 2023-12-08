---
title: 明细表
order: 2
---

## 简介

明细表是 `S2` 的基础形态之一。明细表就是普通的表格，在列头下把每行数据直接展示出来。主要用于大数据场景下明细数据的展示。

<img alt="pivot-mode" src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*PmpvRrcBEbMAAAAAAAAAAAAAARQnAQ" width="600" />

明细表和透视表共享 [基础交互](/manual/advanced/interaction/basic)、[主题](/manual/basic/theme) 、[复制](/manual/basic/analysis/export)、[自定义单元格](/manual/advanced/custom/hook) 等能力。除此之外，明细表还支持 [行列冻结](/examples/interaction/basic#froze) 等特色功能。在海量明细数据渲染场景下，明细表可以替换基于 `DOM` 的表格组件，来提升性能和用户体验。

## 使用

```html
<div id="container" />
```

### React 组件方式

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

### TableSheet 类方式

如果不打算依赖 React，可以在上面第三步之后直接调用：

```ts
import { TableSheet } from "@antv/s2";

const container = document.getElementById('container');
const s2 = new TableSheet(container, dataCfg, options);
s2.render();
```

## 特性

### 序号

在 `s2Options` 中传入 `showSeriesNumber` 即可展示内置的序号，可以自定义序号列标题。[查看 demo](/examples/basic/table#table)

```ts
const s2Options = {
  showSeriesNumber: true,
  seriesNumberText: '自定义序号标题' // 默认 "序号"
}
```

### 行列冻结

行列冻结让特定行列在滚动时保持固定，从而一直保持在视口范围内，提供信息的对照和参考。[查看 demo](/examples/interaction/basic#frozen)

<Playground path='interaction/basic/demo/frozen.ts' rid='container' height='300'></playground>

<br/>

行列冻结通过在 `s2Options` 中传入这些属性控制：

```ts
const s2Options = {
  frozenRowCount: number; // 冻结行的数量，从顶部开始计数
  frozenTrailingRowCount: number; // 冻结行数量，从底部开始计数
  frozenColCount: number; // 冻结列的数量，从左侧开始计数
  frozenTrailingColCount: number; // 冻结列的数量，从右侧开始计数
}
```

效果如图：

<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*tZkOSqYWVFQAAAAAAAAAAAAAARQnAQ" width="600" alt="preview" />
