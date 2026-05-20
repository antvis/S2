---
title: SortParam
order: 7
---

### SortParam

Function description: sorting configuration

| parameter     | illustrate                                                              | type                                                     | Defaults | required |
| ------------- | ----------------------------------------------------------------------- | -------------------------------------------------------- | -------- | -------- |
| sortFieldId   | Measure Id, the Id to be sorted                                         | `string`                                                 | -        | ✓        |
| sortMethod    | sort by                                                                 | `ASC \| DESC \| asc \| desc`                             | -        |          |
| sortBy        | custom sorted list                                                      | `string[]`                                               | -        |          |
| sortByMeasure | Sort by metric value (numeric value) (for pivot tables)                 | `string`                                                 | -        |          |
| query         | Filter criteria, narrow the sort range such as: `{city:'白山'}`           | `Record<string, string>`                                 | -        |          |
| type          | Sorting within the group is used to display the icon (for pivot tables) | `string`                                                 | -        |          |
| sortFunc      | Function for custom sorting                                             | (params: [SortFuncParam](#sortfuncparam) ) => `string[]` | -        |          |
| nullsPlacement | Position of null values in sorting                                     | `'first' \| 'last' \| 'auto'`                            | `'last'` |          |

#### nullsPlacement

Configuration for the position of null values (`null`, `undefined`, `'-'`, empty string) in sorting:

| Value | Description |
| --- | --- |
| `'first'` | Null values always at the beginning |
| `'last'` | Null values always at the end (**default**, industry best practice) |
| `'auto'` | Ascending: null values at the beginning; Descending: null values at the end |

:::info{title="Note"}

1. When a custom `sortFunc` is provided, the sorting logic is fully controlled by `sortFunc`, and `nullsPlacement` configuration has no effect
2. The default value `'last'` aligns with the behavior of mainstream spreadsheet applications like Excel and Google Sheets, which is more intuitive for users

:::

```ts
const s2DataConfig = {
  sortParams: [
    {
      sortFieldId: 'price',
      sortMethod: 'DESC',
      // Null values always at the end (default behavior)
      nullsPlacement: 'last',
    },
  ],
};
```

#### SortFuncParam

Function description: Custom sorting function parameters

| parameter     | illustrate                                                                     | type                                   | Defaults | required |
| ------------- | ------------------------------------------------------------------------------ | -------------------------------------- | -------- | -------- |
| sortFieldId   | Measure Id, the Id to be sorted                                                | `string`                               | -        | ✓        |
| sortMethod    | sort by                                                                        | `ASC \| DESC \| asc \| desc`           | -        |          |
| sortBy        | custom sorted list                                                             | `string[]`                             | -        |          |
| sortByMeasure | Sort by metric value (numeric value) (for pivot tables)                        | `string`                               | -        |          |
| query         | Filter criteria, narrow the sort range such as: `{city:'白山'}`                  | `Record<string, string>`               | -        |          |
| type          | Sorting within the group is used to display icons (applicable to pivot tables) | `string`                               | -        |          |
| data          | List of currently sorted data                                                  | `Array<string \| Record<string, any>>` | -        |          |
