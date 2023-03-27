---
title: ViewMeta
order: 6
---

## ViewMeta

object is required, *default: {}* function description: information such as cell data and position

| parameter   | type                                             | required | Defaults | Functional description                                               |
| ----------- | ------------------------------------------------ | -------- | -------- | -------------------------------------------------------------------- |
| spreadsheet | [SpreadSheet](/docs/api/basic-class/spreadsheet) |          |          | Table class instance, which can access any configuration information |
| id          | `string`                                         |          |          | cell unique identifier                                               |
| x           | `number`                                         |          |          | cell x-coordinate                                                    |
| the y       | `number`                                         |          |          | cell y coordinate                                                    |
| width       | `number`                                         |          |          | cell width                                                           |
| height      | `number`                                         |          |          | cell height                                                          |
| data        | `Record<string, any>`                            |          |          | Cell Raw Data Metrics                                                |
| rowIndex    | `number`                                         |          |          | The index of the cell in the row leaf node                           |
| colIndex    | `number`                                         |          |          | The index of the cell in the column leaf node                        |
| valueField  | `string`                                         |          |          | metric-id                                                            |
| fieldValue  | [DataItem](#dataitem)                            |          |          | The true value of the metric display                                 |
| isTotals    | `boolean`                                        |          |          | Whether it is a total: true is a total, false is a subtotal          |
| rowQuery    | `Record<string, any>`                            |          |          | Row query condition                                                  |
| colQuery    | `Record<string, any>`                            |          |          | Column query condition                                               |
| rowId       | `string`                                         |          |          | the row id of the cell                                               |
| colId       | `string`                                         |          |          | the column id of the cell                                            |
