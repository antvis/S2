---
title: SortParams
order: 7
---


### SortParams

| 参数          | 说明                                        | 类型                                  | 默认值 | 必选 |
| :------------ | :------------------------------------------ | :------------------------------------ | ------ | :--- |
| sortFieldId   | 度量 Id，即要被排序的 Id                    | `string`                              | -      | ✓    |
| sortMethod    | 排序方式                                    | `ASC` \| `DESC` \| `asc` \| `desc`    | -      |      |
| sortBy        | 自定义排序列表                              | `string[]`                            | -      |      |
| sortByMeasure | 按照度量值（数值）排序（透视表适用）         | `string`                              | -      |      |
| query         | 筛选条件，缩小排序范围 如 ：`{city:'白山'}` | `object`                              | -      |      |
| type          | 组内排序用来显示icon （透视表适用）          | `string`                              | -      |      |
| sortFunc      | 自定义排序的function                        | `(v: SortFuncParam) => string[]` | -      |      |

#### SortFuncParam

| 参数          | 说明                                        | 类型                                  | 默认值 | 必选 |
| :------------ | :------------------------------------------ | :------------------------------------ | ------ | :--- |
| sortFieldId   | 度量 Id，即要被排序的 Id                    | `string`                              | -      | ✓    |
| sortMethod    | 排序方式                                    | `ASC` \| `DESC` \| `asc` \| `desc`    | -      |      |
| sortBy        | 自定义排序列表                              | `string[]`                            | -      |      |
| sortByMeasure | 按照度量值（数值）排序（透视表适用）      | `string`                              | -      |      |
| query         | 筛选条件，缩小排序范围 如 ：`{city:'白山'}` | `object`                              | -      |      |
| type          | 组内排序用来显示icon（透视表适用）             | `string`                              | -      |      |
| data          | 当前排序数据列表                            | `Array<string | Record<string, any>>` | -      |      |
