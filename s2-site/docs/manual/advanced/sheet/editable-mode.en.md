---
title: Editable Mode
order: 3
---

## Introduction to Schedules

The edit table is one of the derived forms of the `S2` schedule. In addition to providing the analysis function of a complete schedule, it also supports data modification operations.

<img alt="editable-mode" src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*9RoBT5FIJG0AAAAAAAAAAAAAARQnAQ" width="600">

## use

```html
<div id="container"></div>
```

### The React component approach

```typescript
import React from "react";
import ReactDOM from "react-dom";
import { SheetComponent } from '@antv/s2-react';
import '@antv/s2-react/dist/s2-react.min.css';

// 1. Prepare data
const data = [
  {
    "province": "Zhejiang",
    "city": "Hangzhou",
    "type": "Pen",
    "price": 1
  },
  {
    "province": "Zhejiang",
    "city": "Hangzhou",
    "type": "Paper",
    "price": 2
  },
  {
    "province": "Zhejiang",
    "city": "Zhoushan",
    "type": "Pen",
    "price": 17
  },
  {
    "province": "Zhejiang",
    "city": "Zhoushan",
    "type": "Paper",
    "price": 6
  },
  {
    "province": "Jilin",
    "city": "Changchun",
    "type": "Pen",
    "price": 8
  },
  {
    "province": "Jilin",
    "city": "Baishan",
    "type": "Pen",
    "price": 12
  },
  {
    "province": "Jilin",
    "city": "Changchun",
    "type": "Paper",
    "price": 3
  },
  {
    "province": "Jilin",
    "city": "Baishan",
    "type": "Paper",
    "price": 25
  },

  {
    "province": "Zhejiang",
    "city": "Hangzhou",
    "type": "Pen",
    "price": 20
  },
  {
    "province": "Zhejiang",
    "city": "Hangzhou",
    "type": "Paper",
    "price": 10
  },
  {
    "province": "Zhejiang",
    "city": "Zhoushan",
    "type": "Pen",
    "price": 15
  },
  {
    "province": "Zhejiang",
    "city": "Zhoushan",
    "type": "Paper",
    "price": 2
  },
  {
    "province": "Jilin",
    "city": "Changchun",
    "type": "Pen",
    "price": 15
  },
  {
    "province": "Jilin",
    "city": "Baishan",
    "type": "Pen",
    "price": 30
  },
  {
    "province": "Jilin",
    "city": "Changchun",
    "type": "Paper",
    "price": 40
  },
  {
    "province": "Jilin",
    "city": "Baishan",
    "type": "Paper",
    "price": 50
  }
];

// 2. Configure data
const s2DataCfg = {
  fields: {
    columns: ["province", "city", "type", "price"], // IDs of column header fields to be displayed
  },
  meta: [
    // Meta information corresponding to column header fields, such as displayed names
    {
      field: "province",
      name: "Province",
    },
    {
      field: "city",
      name: "City",
    },
    {
      field: "type",
      name: "Type",
    },
    {
      field: "price",
      name: "Price",
    },
  ],
  data,
};

// 3. Add configuration
const s2Options = {
  width: 400,
  height: 200,
};

// 4. Render
ReactDOM.render(
  <SheetComponent
    sheetType="editable" // Specify sheetType as editable here
    dataCfg={s2DataCfg}
    options={s2Options}
  />,
  document.getElementById('container')
);
```

## characteristic

The effect is shown in the figure: <img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*9RoBT5FIJG0AAAAAAAAAAAAAARQnAQ" width="600" alt="preview">

[Playground address](/en/examples/react-component/sheet#editable)
