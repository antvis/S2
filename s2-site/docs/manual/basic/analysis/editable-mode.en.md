---
title: Editable Table
order: 3
---

## Introduction

The Editable Table is a variant of the `S2` Detail Table, built as a wrapper around the `React` version. In addition to providing the full analytical capabilities of a detail table, it also supports data modification.

<img alt="editable-mode" src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*9RoBT5FIJG0AAAAAAAAAAAAAARQnAQ" width="600">

## Usage

:::warning{title="Note"}
The principle behind the editable table is to add a `div` overlay on top of the `Canvas` table to enable editing. If you want to use this in `@antv/s2` or `@antv/s2-vue`, please refer to the [React implementation](https://github.com/antvis/S2/blob/b81b7957b9e8b8e1fbac9ebc6cacdf45a14e5412/packages/s2-react/src/components/sheets/editable-sheet/index.tsx#L7) to create your own wrapper.
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

// 1. Prepare the data
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
  // ... more data
];

// 2. Configure the data
const s2DataCfg = {
  fields: {
    columns: ["province", "city", "type", "price"], // List of column header field IDs to display
  },
  meta: [
    // Metadata for the column header fields, e.g., for display names
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
    sheetType="editable" // Specify the sheetType as editable
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
