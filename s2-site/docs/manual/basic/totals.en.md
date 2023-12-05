---
title: Totals
order: 5
---

| parameter | illustrate   | type                                          | Defaults | required |
| --------- | ------------ | --------------------------------------------- | -------- | -------- |
| row       | column total | [Total](/docs/api/general/S2Options#total) | {}       |          |
| col       | row total    | [Total](/docs/api/general/S2Options#total) | {}       |          |

#### Total

object is **required** , *default: null* Function description: Subtotal calculation configuration

| parameter                                                                            | illustrate                                                                                            | type         | Defaults | required |     |
|--------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------|--------------|----------|----------|-----|
| showGrandTotals                                                                      | Whether to display the total                                                                          | `boolean`    | false    | ✓        |     |
| showSubTotals                                                                        | Whether to display subtotals. When configured as an object, always controls whether to always display |              |          |          |     |
| subtotals when there are less than 2 subdimensions, and does not display by default. | `boolean \| { always: boolean }`                                                                      |              |          |          |     |
| false                                                                                | ✓                                                                                                     |              |          |          |     |
| subTotalsDimensions                                                                  | Summary Dimensions for Subtotals                                                                      | `string[]`   | []       | ✓        |     |
| reverseLayout                                                                        | total layout position, default bottom or right                                                        | `boolean`    | false    | ✓        |     |
| reverseSubLayout                                                                     | Subtotal layout position, default bottom or right                                                     | `boolean`    | false    | ✓        |     |
| label                                                                                | total alias                                                                                           | `string`     |          |          |     |
| subLabel                                                                             | subtotal alias                                                                                        | `string`     |          |          |     |
| calcTotals                                                                           | calculate the total                                                                                   | `CalcTotals` |          |          |     |
| calcSubTotals                                                                        | calculate subtotal                                                                                    | `CalcTotals` |          |          |     |
| totalsGroupDimensions                  | grouping dimension of the total                                                                       |`string[]`    |                    |      |
| subTotalsGroupDimensions               | grouping dimension of the subtotal                                                                    |  `string[]`            |                    |      |

```typescript
 const s2Options = {
  totals: {
    row: {
      showGrandTotals: true,
      showSubTotals: true,
      reverseLayout: true,
      reverseSubLayout: true,
      subTotalsDimensions: [ 'province' ],
      totalsGroupDimensions: ['city'],
      subTotalsGroupDimensions: ['type', 'sub_type'],
    },
    col: {
      showGrandTotals: true,
      showSubTotals: true,
      reverseLayout: true,
      reverseSubLayout: true,
      subTotalsDimensions: [ 'type' ],
    },
  },
};
```

### 2. Data

#### 1. Data incoming

The data is imported according to the row/column position and key value, and the dimension key value does not include
the keys of all rows and columns, for example:

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

##### Method 1: Collection into data

```typescript
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
    }
  ],
  ...
}
```

##### Method 2: Pass in totalData

```typescript
 const s2DataConfig = {
  data: [
    {
      province: '浙江',
      city: '杭州',
      type: '笔',
      price: '1',
    },
  ],
  totalData: [
    // 总计/总计
    {
      price: '15.5',
    }
  ],
  ...
}
```

#### 2. Calculate the data

You can configure attributes `calcTotals` and `calcSubTotals` for `row` and `col` under `totals` respectively to realize
the calculation of summary data

##### 1. Configure aggregation mode

It is realized by configuring `aggregation` , which currently supports `SUM` (sum), `MIN` (minimum value), `MAX` (
maximum value) and `AVG` (arithmetic average).

```typescript
 const s2Options = {
  totals: {
    row: {
      showGrandTotals: true,
      showSubTotals: true,
      reverseLayout: true,
      reverseSubLayout: true,
      subTotalsDimensions: [ 'province' ],
      calcTotals: {
        aggregation: 'SUM',
      },
      calcSubTotals: {
        aggregation: 'SUM',
      },
    },
    col: {
      showGrandTotals: true,
      showSubTotals: true,
      reverseLayout: true,
      reverseSubLayout: true,
      subTotalsDimensions: [ 'type' ],
      calcTotals: {
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

```typescript
 const s2Options = {
  totals: {
    row: {
      showGrandTotals: true,
      showSubTotals: true,
      reverseLayout: true,
      reverseSubLayout: true,
      subTotalsDimensions: [ 'province' ],
      calcTotals: {
        calcFunc: (query, data) => {
          return
        ...
          ;
        }
      },
      calcSubTotals: {
        calcFunc: (query, data) => {
          return
        ...
          ;
        }
      },
    },
    col: {
      showGrandTotals: true,
      showSubTotals: true,
      reverseLayout: true,
      reverseSubLayout: true,
      subTotalsDimensions: [ 'type' ],
      calcTotals: {
        calcFunc: (query, data) => {
          return ...;
        }
      },
      calcSubTotals: {
        calcFunc: (query, data) => {
          return ...;
        }
      },
    },
  },
};
```

### priority

1. Data input priority is higher than calculation data
2. Configuring custom methods takes precedence over configuring aggregation methods, that is,
   configuring `calcFunc > aggregation`
3. When the same cell is a`row+column`summary value, the **priority** is:`column total/column subtotal > row total/row subtotal`
