---
title: Editable Table
order: 3
---

## Introduction

The editable table is one of the derivative forms of the `S2` table detail view. It is encapsulated based on the `React` version of the table detail view. In addition to providing the complete analysis functions of the table detail view, it also supports data modification operations.

<img alt="editable-mode" src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*9RoBT5FIJG0AAAAAAAAAAAAAARQnAQ" width="600">

## Usage

:::warning{title="Note"}
The principle of the editable table is essentially to add a `div` mask to the `Canvas` table to achieve data editing. If you want to use it in `@antv/s2` and `@antv/s2-vue`, please refer to the [React version implementation](https://github.com/antvis/S2/blob/b81b7957b9e8b8e1fbac9ebc6cacdf45a14e5412/packages/s2-react/src/components/sheets/editable-sheet/index.tsx#L7) for encapsulation.
:::

<Playground path='react-component/sheet/demo/editable' rid='container'></playground>

```html
<div id="container"></div>
```

```tsx
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
    columns: ["province", "city", "type", "price"], // List of column header field IDs to display
  },
  meta: [
    // Corresponding meta information for column header fields, such as the displayed Chinese name
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

// 4, Render
ReactDOM.render(
  <SheetComponent
    sheetType="editable" // Specify sheetType as editable here
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

## Effect

[View Example](/examples/react-component/sheet#editable)

<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*9RoBT5FIJG0AAAAAAAAAAAAAARQnAQ" width="600" alt="preview" />
