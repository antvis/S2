---
title: 编辑表
order: 3
---

## 明细表简介

编辑表是 `S2` 明细表的衍生形态之一。在提供完整的明细表的分析功能之外，还支持对数据的修改操作。

<img alt="editable-mode" src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*9RoBT5FIJG0AAAAAAAAAAAAAARQnAQ" width="600">

## 使用

```html
<div id="container"></div>
```

### React 组件方式

```typescript
import React from "react";
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
const App = () => {
  return (
    <SheetComponent
      sheetType="editable"
      dataCfg={s2DataCfg}
      options={s2Options}
    />,
  )
}
```

## 特性

效果如图：
<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*9RoBT5FIJG0AAAAAAAAAAAAAARQnAQ" width="600" alt="preview" />

[playground 地址](/examples/react-component/sheet#editable)
