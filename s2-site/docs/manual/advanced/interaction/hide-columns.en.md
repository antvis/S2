---
title: Hide Columns
order: 2
---

When you want to reduce the interference of unimportant information, you can hide the column header so that you can view the data more intuitively. There are three ways to hide the column header

<Playground path="interaction/advanced/demo/pivot-hide-columns.ts" rid="pivot-hide-columns" height="400"></Playground>

## 1. Manual Hide - by clicking

Click the column header and click the`隐藏`button in the pop-up `tooltip`

<img src="https://gw.alipayobjects.com/zos/antfincdn/pBa8%24Q1gG/15a1cdef-a4b1-4fcf-a2cf-b6f4a39f710b.png" width="400" alt="preview">

Turn off interactive hiding

```ts
const s2Options = {
  tooltip: {
    operation: {
      hiddenColumns: false,
    },
  },
}
```

## 2. Autohide - via configuration

Configurable default hidden column headers, pivot tables and schedules

### 1. Schedule

There is no multi-column header in the detailed table, just specify any field in the `columns` of `fields`

```ts
const s2DataConfig = {
  fields: {
    columns: ['province', 'city', 'type', 'price'],
  },
};

const s2Options = {
  interaction: {
    hiddenColumnFields: ['city']
  }
}
```

![preview](https://gw.alipayobjects.com/zos/antfincdn/GHizMg2ok/f8d667c9-910a-40da-a6e3-74c238e7afa8.png)

### 2. Pivot table

There are multiple column headers in the pivot table, and the [node id](/docs/api/basic-class/node) corresponding to the column header needs to be specified

<details><summary>How to get column header Id?</summary><pre> <code class="language-ts">//&#x26;nbsp;/docs/api/basic-class/spreadsheet
const&#x26;nbsp;s2&#x26;nbsp;=&#x26;nbsp;new&#x26;nbsp;PivotSheet()
console.log(s2.facet.getColCellNodes())
</code></pre></details>

```ts
const s2DataConfig = {
  fields: {
    rows: [
      'province',
      'city'
    ],
    columns: [
      'type',
      'sub_type'
    ],
    values: [
      'number'
    ],
    valueInCols: true
  },
}

const s2Options = {
  interaction: {
    hiddenColumnFields: ['root[&]家具[&]沙发[&]number'],
  }
}
```

![preview](https://gw.alipayobjects.com/zos/antfincdn/1VeZokRvz/a1933e73-f3ed-4289-beb1-8a06fa3292b6.png)

`hiddenColumnFields` support automatic grouping, for example, hidden is `province` , `type` , `price`

```ts
const s2Options = {
  interaction: {
    hiddenColumnFields: ['province', 'type', 'price']
  }
}
```

The second column `city` is not configured to hide, then you will get two groups

* \['province']
* \['type', 'price']

In this way, **two** hidden buttons are rendered, and the buttons work independently. Click the first expand button to expand `province` , click the second expand button to expand `type` and `price`

![preview](https://gw.alipayobjects.com/zos/antfincdn/LYrMG8bf5/660aa34c-5fce-4f62-b422-ee6d3b5478d1.png)

You can also integrate the analysis component, and realize dynamic hiding of column headers by changing the configuration method. For details, please refer to the [analysis component](/docs/manual/basic/analysis/switcher/)

<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*a0uHRZ70hDcAAAAAAAAAAAAAARQnAQ" height="300" alt="preview">

## 3. Manual hiding - via instance method

[View all APIs](/docs/api/basic-class/interaction)

```ts
const s2 = new PivotSheet(...)

const hiddenColumnFields = ['province', 'type', 'price']
s2.interaction.hideColumns(hiddenColumnFields)
```

## Get hidden column header data

`COL_CELL_EXPANDED` and `COL_CELL_HIDDEN` that can be exposed through `S2Event` monitor the expansion and hiding of the column header respectively

```ts
import { S2Event } from '@antv/s2'

const s2 = new PivotSheet(...);

s2.on(S2Event.COL_CELL_EXPANDED, (cell) => {
  console.log('列头展开', cell);
});

s2.on(
  S2Event.COL_CELL_HIDDEN,
  (currentHiddenColumnsInfo, hiddenColumnsDetail) => {
    console.log('列头隐藏', currentHiddenColumnsInfo, hiddenColumnsDetail);
  },
);
```

You can also access the `hiddenColumnsDetail` stored in the [`store`](/docs/api/basic-class/store) to actively obtain

```ts
const hiddenColumnsDetail = s2.store.get('hiddenColumnsDetail')
console.log(hiddenColumnsDetail)
```
