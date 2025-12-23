---
title: Basic Sorting
order: 0

---

## Introduction

S2 supports various forms of sorting for table data, such as sorting row/column header dimension values by alphabetical order, or by their corresponding subtotals/grand totals/numerical values. In addition to providing default sorting methods, S2 also allows for custom sorting using functions. [View Example](/examples/analysis/sort#custom-sort-func)

## Usage

Sorting is enabled by passing `sortParams` in the [s2DataConfig](/api/general/s2-data-config).

### sortParams

| Parameter | Description | Type | Default | Required |
| --- | --- | --- | --- | --- |
| sortFieldId | The ID of the dimension or measure to be sorted. | `string` | - | ✓ |
| sortMethod | The sorting method. | `ASC` \| `DESC` \| `asc` \| `desc` | - | |
| sortBy | A custom list to sort by. | `string[]` | - | |
| sortByMeasure | Sorts by a measure (numerical) value (for pivot tables). | `string` | - | |
| query | A filter condition to narrow the sorting scope, e.g., `{ city: 'Chengdu' }`. | `object` | - | |
| type | Used to display an icon for in-group sorting (for pivot tables). | `string` | - | |
| sortFunc | A custom sorting function. | `(v: SortFuncParam) => Array<string>` | - | |

```ts
import { EXTRA_FIELD } from "@antv/s2";

const s2DataConfig = {
  sortParams: [
    {
      sortFieldId: 'type',
      sortMethod: 'DESC',
      // EXTRA_FIELD is the virtual fieldId for the dataCfg.fields.values field
      query: { city: 'Chengdu', [EXTRA_FIELD]: 'price' },
    },
  ],
  ...
}
```

## Methods

### 1. Ascending/Descending (sortMethod)

Supports sorting of `row/column headers`. It handles numbers, number-like strings, and regular strings. Non-numeric types fall back to **localeCompare**.

```ts
const s2DataConfig = {
  sortParams: [
    { sortFieldId: 'province', sortMethod: 'DESC' },
    { sortFieldId: 'type', sortMethod: 'ASC' },
  ]
}
```

<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*DlG8SYEFlS8AAAAAAAAAAAAAARQnAQ" width="500" alt="row" />

### 2. Dimension Value List (sortBy)

Supports sorting `row/column headers` according to a specified list of dimension values. If there are multiple levels, each sublevel is sorted within its group (like `city` below).

```ts
const s2DataConfig = {
  sortParams: [
    { sortFieldId: 'province', sortBy: ['Zhejiang', 'Jilin'] },
    { sortFieldId: 'city', sortBy: ['Zhoushan', 'Hangzhou', 'Baishan', 'Changchun'] },
    { sortFieldId: 'type', sortBy: ['Paper', 'Pen'] },
  ]
}
```

<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*jD1iTZdrUZwAAAAAAAAAAAAADmJ7AQ/original" width="500" alt="row" />

### 3. By Measure Field (sortByMeasure)

Supports sorting `row/column headers` by their intersecting measure (numerical) values. In the example below, to sort the `city` dimension in the row header, you must first identify the data to sort by. The `city` dimension corresponds to 7 columns of numerical data. Using any of these columns can determine the sort order. Therefore, you must specify the `sortFieldId` and use the `query` property to define the numerical data to be used for comparison.

<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*gAxoSaj9Z4IAAAAAAAAAAAAAADmJ7AQ/original" width="600" alt="preview" />

Sorting can be categorized into two types based on the dimension's level and the data used for sorting:

#### Sorting by Detail Data

- `sortByMeasure` is a specific measure, e.g., `number`.
- `sortFieldId` is the last field in the row/column dimension, e.g., `city`.
- `query` narrows down to the lowest-level detail data, e.g., including all column dimension values for `type` and `sub_type`. (See Example 1)

#### Sorting by Summary Data

> How to enable totals/subtotals in S2?
>
> 1. Use aggregated data from your data source.
> 2. Use S2's built-in aggregate calculations. 📊 [See documentation](/api/general/s2-options#totals).

- `sortByMeasure` is `TOTAL_VALUE`.
- `sortFieldId` can be any dimension field (e.g., non-leaf `province` or leaf `city`).
  - If it's `province`, the `query` can limit some or all dimension values of `type` and `sub_type`, sorting by the row subtotal of `province`. (See Example 2)
  - If it's `city`, the `query` can only limit some column dimensions, e.g., `type`, sorting by the column subtotal. (See Example 3)

#### Example 1: Sorting by Detail Data

```javascript
{
  sortFieldId: 'city',
  sortByMeasure: 'number',
  sortMethod: 'asc',
  query: {
    type: 'Office Supplies',
    sub_type: 'Paper',
    [EXTRA_FIELD]: 'number'
  }
}
```

<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*im9YR7e_wooAAAAAAAAAAAAADmJ7AQ/original" width="600" alt="Sorting by Detail Data"/>

#### Example 2: Sorting Non-Innermost Dimension by Summary Data

When `query` includes `some` column dimensions:

```javascript
{
  sortFieldId: 'province',
  sortByMeasure: TOTAL_VALUE,
  sortMethod: 'asc',
  query: {
    type: 'Furniture',
    [EXTRA_FIELD]: 'number'
  }
}
```

<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*HthpSLAX6BYAAAAAAAAAAAAADmJ7AQ/original" width="600" alt="Sorting Non-Innermost Dimension by Summary Data"/>

When `query` includes `all` column dimensions:

```javascript
{
  sortFieldId: 'province',
  sortByMeasure: TOTAL_VALUE,
  sortMethod: 'asc',
  query: {
    type: 'Office Supplies',
    sub_type: 'Pen',
    [EXTRA_FIELD]: 'number'
  }
}
```

<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*8MlDSbozN0gAAAAAAAAAAAAADmJ7AQ/original" width="600" alt="When `query` includes `all` column dimensions"/>

#### Example 3: Sorting Innermost Dimension by Summary Data

```javascript
{
  sortFieldId: 'city',
  sortByMeasure: TOTAL_VALUE,
  sortMethod: 'desc',
  query: {
    type: 'Office Supplies',
    [EXTRA_FIELD]: 'number'
  }
}
```

<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*SiB0T7oePzEAAAAAAAAAAAAADmJ7AQ/original" width="600" alt="Sorting Innermost Dimension by Summary Data"/>

### 4. Custom Method (sortFunc)

`sortFunc` receives a `SortFuncParam` object and supports sorting by both `dimension values` and `measure values`.

| Parameter | Description | Type | Default | Required |
| --- | --- | --- | --- | --- |
| sortFieldId | The ID of the dimension or measure to be sorted. | `string` | - | ✓ |
| sortMethod | The sorting method. | `ASC` \| `DESC` \| `asc` \| `desc` | - | |
| sortBy | A custom list to sort by. | `string[]` | - | |
| sortByMeasure | Sorts by a measure (numerical) value. | `string` | - | |
| query | A filter condition to narrow the sorting scope, e.g., `{ city: 'Baishan' }`. | `object` | - | |
| type | Used to display an icon for in-group sorting. | `string` | - | |
| data | The current list of data to be sorted. | Array<`string` \| [`CellData`](/api/basic-class/cell-data)> | - | |

#### By Dimension Value (Row/Column Header)

Supports custom sorting of dimension values (row or column headers).

```ts
const s2DataConfig = {
  sortParams: [
    {
      // When sortFieldId is a dimension, params.data is a list of dimension values
      sortFieldId: 'province',
      sortFunc: (params) => {
        const { data } = params;
        return data.sort((a, b) => a.localeCompare(b));
      },
    },
  ],
};
```

<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*7MLkQLxhliAAAAAAAAAAAAAAARQnAQ" width="600" alt="row" />

#### By Measure Value (Numerical)

Supports custom calculations using measure values.

```ts
const s2DataConfig = {
  sortParams: [
    {
      sortFieldId: 'city',
      sortByMeasure: 'price',
      // When using sortByMeasure, you can pass a query to locate the list of numerical values
      // The following limits params.data to where type='Paper' and the measure is 'price'
      query: { type: 'Paper', [EXTRA_FIELD]: 'price' },
      sortFunc: (params) => {
        const { data, sortByMeasure, sortFieldId } = params || {};
        return (
          data
            .map(item => item.raw) // item is CellData, so we get the raw data object
            // Compare using 'price'
            ?.sort((a, b) => b[sortByMeasure] - a[sortByMeasure])
            // Map to an array of the 'city' dimension
            ?.map((item) => item[sortFieldId])
        );
      },
    },
  ],
};
```

<img src="https://gw.alipayobjects.com/zos/antfincdn/xZbG1ALW0/cd83b502-cde6-4a7b-a581-36aae26b4028.png" width="600" alt="row" />

📊 [View the custom sort demo](/examples/analysis/sort#custom-sort-func).

## Priority

1. Conditions in `sortParams` have a higher priority than the original data order.
2. For multiple items in `sortParams`: the later ones have higher priority.
3. For multiple conditions within an item: `sortFunc` > `sortBy` > `sortByMeasure` > `sortMethod`.
