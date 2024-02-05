---
title: ViewMeta
order: 6
---

## ViewMeta

功能描述：单元格数据和位置等信息

| 参数 | 类型 | 必选  | 默认值 | 功能描述 |
| --- | --- | ---  | --- | --- |
| spreadsheet | [SpreadSheet](/docs/api/basic-class/spreadsheet) |  |   | 表格实例 |
| id | `string` |  |   | 单元格唯一标识 |
| x | `number` |  |   | 单元格 x 坐标 |
| y | `number` |  |   | 单元格 y 坐标 |
| width | `number` |   |  | 单元格宽度 |
| height | `number` |    |  | 单元格高度 |
| data | `Record<string, any>` |    |  | 单元格原始数据度量 |
| rowIndex | `number` |  |  |   单元格在行叶子节点中的索引 |
| colIndex | `number` |  |  |   单元格在列叶子节点中的索引 |
| valueField | `string` |  |    | 度量 id |
| fieldValue | [DataItem](#dataitem) |  |    | 度量展示的真实值 |
| isTotals | `boolean` |  |    |   是否为总计：true 为总计  false 为小计 |
| rowQuery | `Record<string, any>`|   |  | 行查询条件 |
| colQuery | `Record<string, any>` |    |  | 列查询条件 |
| rowId | `string` |  |  |   单元格的行 id |
| colId | `string` |  |  |   单元格的列 id |
