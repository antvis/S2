---
title: 编辑表
order: 3
---

## 简介

编辑表是 `S2` 明细表的衍生形态之一，基于 `React` 版本的明细表封装，在提供完整的明细表的分析功能之外，还支持对数据的修改操作。

<img alt="editable-mode" src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*9RoBT5FIJG0AAAAAAAAAAAAAARQnAQ" width="600">

## 使用

:::warning{title="注意"}
编辑表的原理本质上是在 `Canvas` 表格上增加一个 `div` 蒙层，来实现对数据的编辑，如果想在 `@antv/s2` 和 `@antv/s2-vue` 中使用，请自行参考 [React 版本的实现](https://github.com/antvis/S2/blob/b81b7957b9e8b8e1fbac9ebc6cacdf45a14e5412/packages/s2-react/src/components/sheets/editable-sheet/index.tsx#L7) 进行封装。
:::

<Playground path='react-component/sheet/demo/editable' rid='container'></playground>

```html
<div id="container"></div>
```

```tsx
import React from "react";
import ReactDOM from "react-dom";
import { SheetComponent } from '@antv/s2-react';
import '@antv/s2-react/dist/style.min.css';

// 1. 准备数据
const data = [
  {
    "province": "浙江",
    "city": "杭州",
    "type": "笔",
    "price": 1
  },
  {
    "province": "浙江",
    "city": "杭州",
    "type": "纸张",
    "price": 2
  },
  {
    "province": "浙江",
    "city": "舟山",
    "type": "笔",
    "price": 17
  },
  {
    "province": "浙江",
    "city": "舟山",
    "type": "纸张",
    "price": 6
  },
  {
    "province": "吉林",
    "city": "长春",
    "type": "笔",
    "price": 8
  },
  {
    "province": "吉林",
    "city": "白山",
    "type": "笔",
    "price": 12
  },
  {
    "province": "吉林",
    "city": "长春",
    "type": "纸张",
    "price": 3
  },
  {
    "province": "吉林",
    "city": "白山",
    "type": "纸张",
    "price": 25
  },

  {
    "province": "浙江",
    "city": "杭州",
    "type": "笔",
    "price": 20
  },
  {
    "province": "浙江",
    "city": "杭州",
    "type": "纸张",
    "price": 10
  },
  {
    "province": "浙江",
    "city": "舟山",
    "type": "笔",
    "price": 15
  },
  {
    "province": "浙江",
    "city": "舟山",
    "type": "纸张",
    "price": 2
  },
  {
    "province": "吉林",
    "city": "长春",
    "type": "笔",
    "price": 15
  },
  {
    "province": "吉林",
    "city": "白山",
    "type": "笔",
    "price": 30
  },
  {
    "province": "吉林",
    "city": "长春",
    "type": "纸张",
    "price": 40
  },
  {
    "province": "吉林",
    "city": "白山",
    "type": "纸张",
    "price": 50
  }
];

// 2. 配置数据
const s2DataCfg = {
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
    sheetType="editable" // 此处指定 sheetType 为 editable
    dataCfg={s2DataCfg}
    options={s2Options}
    onDataCellEditStart={(meta, cell) => {
      console.log('onDataCellEditStart:', meta, cell);
    }}
    onDataCellEditEnd={(meta, cell) => {
      console.log('onDataCellEditEnd:', meta, cell);
    }}
  />,
  document.getElementById('container')
);
```

## 效果

[查看示例](/examples/react-component/sheet#editable)

<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*9RoBT5FIJG0AAAAAAAAAAAAAARQnAQ" width="600" alt="preview" />
