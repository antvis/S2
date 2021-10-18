---
title: SortParams
order: 7
---

## SortParams

array SortParam **可选**,_default：null_ 功能描述： 配置表格的度量的排序 **sortParams**

| 细分配置项名称 | 类型 | 必选  | 功能描述 |
| :-- | :-- | :-- | :--  | --- |
| sortFieldId | `string` | ✓  | 度量 Id，即要被排序的 Id |
| sortMethod | `ASC` \| `DESC` \| `asc` \| `desc` |    | 排序方式 |
| sortBy | `string[]`   || 自定义排序列表 |
| sortByMeasure | `string` |    | 按照度量值（数值）排序 |
| query | `object` |  |   筛选条件，缩小排序范围 如 ：`{city:'白山'}` |
| type | `string` |     | 组内排序用来显示icon |
| sortFunc | `(v: SortFuncParam) => Array<string>` |   |  自定义排序的function

### SortFuncParam

| 细分配置项名称 | 类型 | 必选  | 功能描述 |
| :-- | :-- | :-- | :--  | --- |
| sortFieldId | `string` | ✓  | 度量 Id，即要被排序的 Id |
| sortMethod | `ASC` \| `DESC` \| `asc` \| `desc` |    | 排序方式 |
| sortBy | `string[]`   || 自定义排序列表 |
| sortByMeasure | `string` |    | 按照度量值（数值）排序 |
| query | `object` |  |   筛选条件，缩小排序范围 如 ：`{city:'白山'}` |
| type | `string` |     | 组内排序用来显示icon |
| data | `Array<string | Record<string, any>>` |  | 当前排序数据列表
