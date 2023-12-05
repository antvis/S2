---
title: 透视表
order: 1
---
## 简介

透视表也叫做交叉表或多维表，显示多变量之间相互关系的一种表格，可以帮助用户发现它们之间的相互作用，帮助业务进行交叉探索分析，是目前商业 BI 分析领域中使用频率最高的图表之一。

<img alt="pivot-mode" src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*swH5TodvsMwAAAAAAAAAAAAAARQnAQ" width="600">

## 使用

```html
<div id="container" />
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

​📊 查看 [React 版本透视表示例](/examples/react-component/sheet#pivot) 和 [API 文档](/api/components/sheet-component)。

### PivotSheet 类方式

如果不打算依赖 `React`，可以在上面第三步之后直接调用：

```ts
import { PivotSheet } from "@antv/s2";

const container = document.getElementById('container');
const s2 = new PivotSheet(container, dataCfg, options);
s2.render();
```

​📊 查看 [类方式透视表示例](/examples/basic/pivot#grid) 和 [API 文档](/api/general/s2options)。

## 特性

### 展示形态

默认支持 [平铺模式](/zh/examples/basic/pivot/#grid) 和 [树状模式](/zh/examples/basic/pivot/#tree) 两种展示形态。

### 数据汇总

支持 [小计/总计](/manual/basic/totals) 的透视能力。

### 冻结行头

当行头固定时，行头会有一个独立的可滚动区域，如果关闭冻结行头，则滚动区域为整个表格。

<Playground path='interaction/basic/demo/frozen-row-header.ts' rid='frozen-row-header' height='300'></playground>

<br/>

```ts
const s2Options = {
  frozenRowHeader: false, // 默认开启
}
```

<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*kk0ETbbbnOsAAAAAAAAAAAAADmJ7AQ/original" width="600" alt="preview">

### 冻结首行 <Badge type="success">@antv/s2@^1.53.0 新增</Badge>

:::info{title="注意"}

目前仅提供**冻结首行**能力，和 [明细表行列冻结](https://s2.antv.antgroup.com/manual/basic/sheet-type/table-mode#%E8%A1%8C%E5%88%97%E5%86%BB%E7%BB%93) 不同，透视表由于带有分组的特性，布局比较复杂，考虑到交互合理性，目前有如下限制：

- 首行不存在子节点（适用于总计置于顶部，只有单个维值，树状模式等场景）。
- 分页场景暂不支持。

`s2Options` 中配置 `frozenFirstRow` 开启首行冻结能力

:::

#### 平铺模式

```ts
const s2Options = {
  frozenFirstRow: true,
  hierarchyType: 'grid',
  // 需要开启行总计 & 总计行置于顶部
  totals: {
    row: {
      showGrandTotals: true,
      reverseLayout: true,
    },
  },
}
```

<Playground path='interaction/advanced/demo/frozen-pivot-grid.ts' rid='container-grid' height='300'></playground>

<br/>

#### 树状模式

```ts
const s2Options = {
  frozenFirstRow: true,
  hierarchyType: 'tree',
}
```

<Playground path='interaction/advanced/demo/frozen-pivot-tree.ts' rid='container-tree' height='300'></playground>

<br/>
