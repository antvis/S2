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
