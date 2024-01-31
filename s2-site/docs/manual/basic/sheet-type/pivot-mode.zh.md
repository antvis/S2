---
title: 透视表
order: 1
tag: Updated
---

## 简介

透视表也叫做交叉表或多维表，显示多变量之间相互关系的一种表格，可以帮助用户发现它们之间的相互作用，帮助业务进行交叉探索分析，是目前商业 BI 分析领域中使用频率最高的图表之一。

<img alt="pivot-mode" src="https://gw.alipayobjects.com/zos/antfincdn/a6zSe1gvvy/f97ed6ec-0a5d-49b7-8492-754611d0aea6.png" width="600" />

## 使用

```html
<div id="container" />
```

```ts
import { PivotSheet } from "@antv/s2";

// 准备数据
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

// 配置数据
const s2DataConfig = {
  fields: {
    rows: ["province", "city"],
    columns: ["type", "sub_type"],
    values: ["price"]
  },
  data,
};

// 添加配置
const s2Options = {
  width: 600,
  height: 600,
};

// 渲染
async function bootstrap() {
  const container = document.getElementById('container');
  const s2 = new PivotSheet(container, dataCfg, options);

  await s2.render();
}

bootstrap()

```

<Playground path='/basic/pivot/demo/grid.ts' rid='pivot-grid' height='300'></playground>

​[查看示例](/examples/basic/pivot#grid) 和 [API 文档](/api/general/s2options)。

## 在 React 中使用

### 使用 `@antv/s2`

```tsx
import React from "react";
import { PivotSheet } from '@antv/s2';

const s2Options = {
  width: 400,
  height: 200,
};

const App = () => {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const shouldInit = React.useRef(true);
  const isDevMode = React.useMemo(() => {
    try {
      return process.env['NODE_ENV'] !== 'production';
    } catch {
      return false;
    }
  }, []);

  React.useEffect(() => {
    // 兼容 React 18 StrictMode 开发环境下渲染两次
    if (isDevMode && !shouldInit.current) {
      return;
    }

    const s2 = new PivotSheet(container, dataCfg, s2Options);
    shouldInit.current = false;

    return () => {
      s2?.destroy?.();
    };
  }, []);

  return <div id="container" ref={containerRef} />
}
```

### 使用 `@antv/s2-react` <Badge type="success">推荐</Badge>

```tsx
import React from "react";
import { SheetComponent } from '@antv/s2-react';
import '@antv/s2-react/dist/style.min.css';

const s2Options = {
  width: 400,
  height: 200,
};

const App = () => {
  return (
    <SheetComponent
      sheetType="pivot"
      dataCfg={s2DataConfig}
      options={s2Options}
    />
  )
}
```

​[查看示例](/examples/react-component/sheet#pivot) 和 [API 文档](/api/components/sheet-component)。

## 特性

### 序号

在 `s2Options` 中传入 `seriesNumber` 即可展示内置的序号，可以自定义序号列标题。[查看示例](/examples/basic/pivot#grid)

```ts
const s2Options = {
  seriesNumber: {
    enable: true,
    text: '自定义序号标题' // 默认 "序号"
  }
}
```

### 展示形态

默认支持 [平铺模式](/zh/examples/basic/pivot/#grid) 和 [树状模式](/zh/examples/basic/pivot/#tree) 两种展示形态。

### 数据汇总

支持 [小计/总计](/manual/basic/totals) 的透视能力。

### 冻结行头

当行头固定时，行头会有一个独立的可滚动区域，如果关闭冻结行头，则滚动区域为整个表格。

<Playground path='layout/frozen/demo/pivot-frozen-row-header.ts' rid='pivot-frozen-row-header' height='300'></playground>

<br/>

```ts
const s2Options = {
  frozen: {
    rowHeader: false, // 默认开启
  }
}
```

<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*kk0ETbbbnOsAAAAAAAAAAAAADmJ7AQ/original" width="600" alt="preview" />

默认最大冻结宽度为表格区域的 `1/2`, 支持自定义：

```ts
const s2Options = {
  frozen: {
    rowHeader: 0.2, // 默认 0.5 （可选范围 0 - 1)
  }
}
```

### 冻结首行

:::info{title="注意"}

目前仅提供**冻结首行**能力，和 [明细表行列冻结](https://s2.antv.antgroup.com/manual/basic/sheet-type/table-mode#%E8%A1%8C%E5%88%97%E5%86%BB%E7%BB%93) 不同，透视表由于带有分组的特性，布局比较复杂，考虑到交互合理性，目前有如下限制：

- 首行不存在子节点（适用于总计置于顶部，只有单个维值，树状模式等场景）。
- 分页场景暂不支持。

`s2Options` 中配置 `frozen.firstRow` 开启首行冻结能力

:::

#### 平铺模式

```ts
const s2Options = {
  hierarchyType: 'grid',
  frozen: {
    firstRow: true,
  },
  // 需要开启行总计 & 总计行置于顶部
  totals: {
    row: {
      showGrandTotals: true,
      reverseLayout: true,
    },
  },
}
```

<Playground path='layout/frozen/demo/frozen-pivot-grid.ts' rid='container-grid' height='300'></playground>

<br/>

#### 树状模式

```ts
const s2Options = {
  hierarchyType: 'tree',
  frozen: {
    firstRow: true,
  },
}
```

<Playground path='layout/frozen/demo/frozen-pivot-tree.ts' rid='container-tree' height='300'></playground>

<br/>

### 行列头自定义分组

行列头结构默认根据传入的维值进行分组，同时支持自定义分组。[了解更多](/manual/advanced/custom/custom-header)
