---
title: 明细表
order: 2
tag: Updated
---

## 简介

明细表是 `S2` 的基础形态之一。明细表就是普通的表格，在列头下把每行数据直接展示出来。主要用于大数据场景下明细数据的展示。

明细表和透视表共享 [基础交互](/manual/advanced/interaction/basic)、[主题](/manual/basic/theme) 、[复制](/manual/basic/analysis/export)、[自定义单元格](/manual/advanced/custom/hook) 等能力。除此之外，明细表还支持 [行列冻结](/examples/interaction/basic#froze) 等特色功能。在海量明细数据渲染场景下，明细表可以替换基于 `DOM` 的表格组件，来提升性能和用户体验。

<img alt="pivot-mode" src="https://gw.alipayobjects.com/zos/antfincdn/jWifHNLOsB/08db1064-bb09-4d44-b42b-26aed1766545.png" width="600" />

## 使用

```html
<div id="container" />
```

```ts
import { TableSheet } from "@antv/s2";

// 准备数据
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

// 配置数据
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

// 渲染
async function bootstrap() {
  const container = document.getElementById('container');
  const s2 = new TableSheet(container, dataCfg, options);

  await s2.render();
}

bootstrap()
```

<Playground path='basic/table/demo/table.ts' rid='table' height='300'></playground>

​[查看示例](/examples/basic/table) 和 [API 文档](/api/general/s2options)。

## 在 React 中使用

### 使用 `@antv/s2`

```tsx
import React from "react";
import { TableSheet } from '@antv/s2';

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

    const s2 = new TableSheet(container, dataCfg, s2Options);
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
      sheetType="table"
      dataCfg={s2DataConfig}
      options={s2Options}
    />
  )
}
```

[查看示例](/examples/react-component/sheet/#table) 和 [API 文档](/api/components/sheet-component)

## 特性

### 序号

在 `s2Options` 中传入 `seriesNumber` 即可展示内置的序号，可以自定义序号列标题。[查看示例](/examples/basic/table#table)

```ts
const s2Options = {
  seriesNumber: {
    enable: true,
    text: '序号'
  }
}
```

### 行列冻结

行列冻结让特定行列在滚动时保持固定，从而一直保持在视口范围内，提供信息的对照和参考。[查看示例](/examples/interaction/basic#frozen)

<Playground path='layout/frozen/demo/table-frozen.ts' rid='table-frozen' height='300'></playground>

<br/>

行列冻结通过在 `s2Options` 中传入这些属性控制：

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

<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*tZkOSqYWVFQAAAAAAAAAAAAAARQnAQ" width="600" alt="preview" />

### 列头自定义分组

列头结构默认根据传入的维值进行分组，同时支持自定义分组，可实现多级列头。[了解更多](/manual/advanced/custom/custom-header)
