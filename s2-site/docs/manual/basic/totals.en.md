---
title: Totals
order: 5
---

## Introduction

Subtotals belong to the pivot function of the table, and subtotals can be configured for rows and columns.

### Subtotal

Aggregate Measures for a Dimension

#### Form 1: adding extra rows/columns

In tile mode, add an extra row/column to the current dimension

<img src="https://gw.alipayobjects.com/zos/antfincdn/sK5Rx1%26Sp/c4dcee0c-af4b-4be6-b665-c810eec78101.png" width="600" alt="row">

#### Form 2: Affiliate Node

In tree mode, anchor to the row/column where the current node is located

<img src="https://gw.alipayobjects.com/zos/antfincdn/Ljeww3JNa/543f1a66-51e3-4134-a2ec-83fd6a64f7d9.png" width="600" alt="row">

### total

Aggregate measures across all dimensions, additional rows/columns are required for both tiled and treed modes

#### 1. Single measure

Tile:

<img src="https://gw.alipayobjects.com/zos/antfincdn/9GwQ67LQ%26/c11b6f7b-ff0a-4ce3-89e7-1eccb95719a3.png" width="600" alt="row">

Tree:

<img src="https://gw.alipayobjects.com/zos/antfincdn/MRc64qzqf/d77ae378-4512-45a8-b2e0-9fb7e4a19c45.png" width="600" alt="row">

#### 2. Multiple metrics

Tile:

<img src="https://gw.alipayobjects.com/zos/antfincdn/bPhcUuHCi/6cd43952-58fb-469a-b4bb-fdd142bf3317.png" width="600" alt="row">

Tree:

<img src="https://gw.alipayobjects.com/zos/antfincdn/GekvQBQAw/8dde8830-e496-458c-b05e-bcd4f3e4bc0c.png" width="600" alt="row">

## use

### 1. Display configuration

Configure the `totals` attribute of [S2Options](/docs/api/general/S2Options#total) to realize whether to display the row and column subtotals and the display position. The types are as follows:

#### Totals

object is **required** , *default: null* Function description: subtotal total configuration

| parameter | illustrate   | type                                       | Defaults | required |
| --------- | ------------ | ------------------------------------------ | -------- | -------- |
| row       | column total | [Total](/docs/api/general/S2Options#total) | {}       |          |
| col       | row total    | [Total](/docs/api/general/S2Options#total) | {}       |          |

#### Total

object is **required** , *default: null* Function description: Subtotal calculation configuration

| parameter           | illustrate                                                                                                                                                                                 | type         | Defaults              | required |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------ | --------------------- | -------- |
| showGrandTotals     | Whether to display the total                                                                                                                                                               | `boolean`    | false                 | ✓        |
| showSubTotals       | Whether to display subtotals. When configured as an object, always controls whether to always display subtotals when there are less than 2 subdimensions, and does not display by default. | \`boolean    | { always: boolean }\` | false    |
| subTotalsDimensions | Summary Dimensions for Subtotals                                                                                                                                                           | `string[]`   | \[]                   | ✓        |
| reverseGrandTotalsLayout       | total layout position, default bottom or right                                                                                                                                             | `boolean`    | false                 | ✓        |
| reverseSubTotalsLayout    | Subtotal layout position, default bottom or right                                                                                                                                          | `boolean`    | false                 | ✓        |
| label               | total alias                                                                                                                                                                                | `string`     |                       |          |
| subLabel            | subtotal alias                                                                                                                                                                             | `string`     |                       |          |
| calcGrandTotals          | calculate the total                                                                                                                                                                        | `CalcTotals` |                       |          |
| calcSubTotals       | calculate subtotal                                                                                                                                                                         | `CalcTotals` |                       |          |

```ts
const s2Options = {
  totals: {
    row: {
      showGrandTotals: true,
      showSubTotals: true,
      reverseGrandTotalsLayout: true,
      reverseSubTotalsLayout: true,
      subTotalsDimensions: ['province'],
    },
    col: {
      showGrandTotals: true,
      showSubTotals: true,
      reverseGrandTotalsLayout: true,
      reverseSubTotalsLayout: true,
      subTotalsDimensions: ['type'],
    },
  },
};
```

### 2. Data

#### 1. Data incoming

The data is imported according to the row/column position and key value, and the dimension key value does not include the keys of all rows and columns, for example:

```typescript
[
    // 总计/总计
    {
        price: '15.5',
    },
    // 浙江/总计
    {
        province: '浙江',
        price: '5.5',
    },
    // 浙江-杭州/总计
    {
        province: '浙江',
        city: '杭州',
        price: '3',
    },
    // 总计/笔
    {
        type: '笔',
        price: '10',
    },
    // 浙江-小计/笔
    {
        province: "浙江",
        type: "笔",
        price: "3"
    },
]
```

##### Collect the total and subtotal data into data

```ts
const s2DataConfig = {
  data: [
    {
      province: '浙江',
      city: '杭州',
      type: '笔',
      price: '1',
    },
    // 总计/总计
    {
      price: '15.5',
    },
  ],
  ...
};
```

#### 2. Calculate the data

You can configure attributes `calcGrandTotals` and `calcSubTotals` for `row` and `col` under `totals` respectively to realize the calculation of summary data

##### 1. Configure aggregation mode

It is realized by configuring `aggregation` , which currently supports `SUM` (sum), `MIN` (minimum value), `MAX` (maximum value) and `AVG` (arithmetic average).

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

##### 2. Configure custom methods

Realized by configuring `calcFunc: (query: Record<string, any>, arr: Record<string, any>[]) => number`

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
        calcFunc: (query, data) => {},
      },
      calcSubTotals: {
        calcFunc: (query, data) => {},
      },
    },
    col: {
      showGrandTotals: true,
      showSubTotals: true,
      reverseGrandTotalsLayout: true,
      reverseSubTotalsLayout: true,
      subTotalsDimensions: ['type'],
      calcGrandTotals: {
        calcFunc: (query, data) => {},
      },
      calcSubTotals: {
        calcFunc: (query, data) => {},
      },
    },
  },
};
```

### priority

1. Data input priority is higher than calculation data
2. Configuring custom methods takes precedence over configuring aggregation methods, that is, configuring `calcFunc > aggregation`
3. When the same cell is a`行+列`summary value, the **priority** is:`列总计/列小计> 行总计/行小计`
