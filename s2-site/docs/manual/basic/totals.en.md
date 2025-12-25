---
title: Subtotals and Grand Totals
order: 5
---

## Introduction

Subtotals and grand totals are a pivoting feature of the table that allows you to configure summary capabilities for row and column headers. When [custom row and column headers](/en/manual/advanced/custom/custom-header) are enabled, the summary capabilities for the corresponding headers are disabled.

### Subtotals

Summarizes the measure values for a specific dimension.

#### Form 1: Adding Extra Rows/Columns

In grid mode, an extra row/column is added for the current dimension.

<img src="https://gw.alipayobjects.com/zos/antfincdn/sK5Rx1%26Sp/c4dcee0c-af4b-4be6-b665-c810eec78101.png" width="600" alt="row" />

<br/>

#### Form 2: Attached to a Node

In tree mode, it is attached to the row/column of the current node.

<img src="https://gw.alipayobjects.com/zos/antfincdn/Ljeww3JNa/543f1a66-51e3-4134-a2ec-83fd6a64f7d9.png" width="600" alt="row" />

<br/>

### Grand Totals

Summarizes the measure values for all dimensions. Both grid and tree modes require adding an extra row/column.

#### 1. Single Measure Value

Grid:

<img src="https://gw.alipayobjects.com/zos/antfincdn/9GwQ67LQ%26/c11b6f7b-ff0a-4ce3-89e7-1eccb95719a3.png" width="600"  alt="row" />

<br/>

Tree:

<img src="https://gw.alipayobjects.com/zos/antfincdn/MRc64qzqf/d77ae378-4512-45a8-b2e0-9fb7e4a19c45.png" width="600" alt="row" />

<br/>

#### 2. Multiple Measure Values

Grid:

<img src="https://gw.alipayobjects.com/zos/antfincdn/bPhcUuHCi/6cd43952-58fb-469a-b4bb-fdd142bf3317.png" width="600" alt="row" />

<br/>

Tree:

<img src="https://gw.alipayobjects.com/zos/antfincdn/GekvQBQAw/8dde8830-e496-458c-b05e-bcd4f3e4bc0c.png" width="600" alt="row" />

<br/>

### Grouped Summaries

Performs `subtotal/grand total` calculations grouped by dimension, which is useful for comparative analysis of data for a specific dimension.

#### Row Grand Total/Subtotal Grouping

<Playground path='analysis/totals/demo/dimension-group-row.ts' rid='pivot-total-group-row' height='400'></playground>

<br/>

#### Column Grand Total/Subtotal Grouping

<Playground path='analysis/totals/demo/dimension-group-col.ts' rid='pivot-total-group-col' height='400'></playground>

<br/>

## Usage

### 1. Display Configuration

Configure the `totals` property of [S2Options](/en/api/general/s2-options#total) to control the display and position of row and column subtotals and grand totals. The type is as follows:

<embed src="@/common/totals.en.md"></embed>

### 2. Data

#### 1. Passing Data

Data is passed in based on the row/column position and `key` value. The dimension `key` value does not include all row and column `keys`. For example:

```typescript
[
  // Grand Total/Grand Total
  {
    price: '15.5',
  },
  // Zhejiang/Grand Total
  {
    province: 'Zhejiang',
    price: '5.5',
  },
  // Zhejiang-Hangzhou/Grand Total
  {
    province: 'Zhejiang',
    city: 'Hangzhou',
    price: '3',
  },
  // Grand Total/Pen
  {
    type: 'Pen',
    price: '10',
  },
  // Zhejiang-Subtotal/Pen
  {
    province: "Zhejiang",
    type: "Pen",
    price: "3"
  },
]
```

##### Combining Grand Total and Subtotal Data into `data`

```ts
const s2DataConfig = {
  data: [
    {
      province: 'Zhejiang',
      city: 'Hangzhou',
      type: 'Pen',
      price: '1',
    },
    // Grand Total/Grand Total
    {
      price: '15.5',
    },
  ],
  ...
}
```

#### 2. Calculating Data

You can configure the `calcGrandTotals` and `calcSubTotals` properties for `row` and `col` under `totals` to calculate the summary data.

##### 2.1. Configure Aggregation Method

This is done by configuring `aggregation`. The currently supported aggregation methods are `SUM`, `MIN`, `MAX`, `AVG` (arithmetic mean), and `COUNT`. [View Example](https://s2.antv.antgroup.com/en/examples/analysis/totals/#calculate)

```ts
const s2Options = {
  totals: {
    row: {
      showGrandTotals: true,
      showSubTotals: true,
      reverseGrandTotalsLayout: true,
      reverseSubTotalsLayout: true,
      subTotalsDimensions: ['province'],
      calcGrandTotals: {
        aggregation: 'SUM',
      },
      calcSubTotals: {
        aggregation: 'SUM',
      },
    },
    col: {
      showGrandTotals: true,
      showSubTotals: true,
      reverseGrandTotalsLayout: true,
      reverseSubTotalsLayout: true,
      subTotalsDimensions: ['type'],
      calcGrandTotals: {
        aggregation: 'SUM',
      },
      calcSubTotals: {
        aggregation: 'SUM',
      },
    },
  },
};
```

<br/>

##### 2.2. Configure Custom Calculation Method

```ts
const s2Options = {
  totals: {
    row: {
      showGrandTotals: true,
      showSubTotals: true,
      reverseGrandTotalsLayout: true,
      reverseSubTotalsLayout: true,
      subTotalsDimensions: ['province'],
      calcGrandTotals: {
        calcFunc: (query, data, spreadsheet) => {},
      },
      calcSubTotals: {
        calcFunc: (query, data, spreadsheet) => {},
      },
    },
    col: {
      showGrandTotals: true,
      showSubTotals: true,
      reverseGrandTotalsLayout: true,
      reverseSubTotalsLayout: true,
      subTotalsDimensions: ['type'],
      calcGrandTotals: {
        calcFunc: (query, data, spreadsheet) => {},
      },
      calcSubTotals: {
        calcFunc: (query, data, spreadsheet) => {},
      },
    },
  },
};
```

This is done by configuring `calcFunc: (query: Record<string, any>, data: Record<string, any>[], spreadsheet: SpreadSheet) => number`. [View Example](https://s2.antv.antgroup.com/en/examples/analysis/totals/#custom)

Note: `data` is the detail data. To get data that includes summaries:

```ts | pure
import { QueryDataType } from '@antv/s2';

const calcFunc = (query, data, spreadsheet) => {
  const allData = spreadsheet.dataSet.getCellMultiData({
    query,
    queryType: QueryDataType.All,
  });

  console.log('data (detail data):', data);
  console.log('data (all data, including summaries):', allData);
};
```

<Playground path='analysis/totals/demo/custom.ts' rid='pivot-total-custom' height='400'></playground>

<br/>

### Priority

1. Data passed in has a higher priority than calculated data.
2. Configuring a custom method has a higher priority than configuring an aggregation method, i.e., `calcFunc > aggregation`.
3. When the same cell is a `row + col` summary value, the **priority** is: `column grand total/subtotal > row grand total/subtotal`.
