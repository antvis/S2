---
title: SortParams
order: 7
---

### SortParams

功能描述：排序配置。查看 [文档](/manual/basic/sort/basic) 和 [示例](/examples/analysis/sort/#table-sort)

| 参数          | 说明                                        | 类型                                  | 默认值 | 必选 |
| ------------ | ------------------------------------------ | ------------------------------------ | ------ | --- |
| sortFieldId   | 度量 Id，即要被排序的 Id                    | `string`                              | -      | ✓    |
| sortMethod    | 排序方式                                    | `ASC \| DESC \| asc \| desc`     | -      |      |
| sortBy        | 自定义排序列表                              | `string[]`                            | -      |      |
| sortByMeasure | 按照度量值（数值）排序（透视表适用）         | `string`                              | -      |      |
| query         | 筛选条件，缩小排序范围 如 ：`{city:'白山'}` | `Record<string, string>`                              | -      |      |
| type          | 组内排序用来显示 icon （透视表适用）          | `string`                              | -      |      |
| sortFunc      | 自定义排序的 function                        | (params: [SortFuncParam](#sortfuncparam)) => `string[]` | -      |      |
| nullsPlacement | 空值排序位置                                | `'first' \| 'last' \| 'auto'`        | `'last'` |      |

#### nullsPlacement

空值（`null`、`undefined`、`'-'`、空字符串）排序位置配置：

| 值 | 说明 |
| --- | --- |
| `'first'` | 空值永远排在最前 |
| `'last'` | 空值永远排在最后（**默认值**，业界最佳实践） |
| `'auto'` | 升序时空值在前，降序时空值在后 |

:::info{title="说明"}

1. 当用户自定义了 `sortFunc` 时，排序逻辑完全由 `sortFunc` 接管，`nullsPlacement` 配置不生效
2. 默认值 `'last'` 符合 Excel、Google Sheets 等主流电子表格的行为，更符合用户直觉

:::

```ts
const s2DataConfig = {
  sortParams: [
    {
      sortFieldId: 'price',
      sortMethod: 'DESC',
      // 空值永远排在最后（默认行为）
      nullsPlacement: 'last',
    },
  ],
};

const globalNullsConfig = {
  sortParams: [
    // 使用通配符 * 配置全局空值策略，所有字段默认空值在前
    {
      sortFieldId: '*',
      nullsPlacement: 'first',
    },
    // 特殊字段覆盖：price 字段空值在后
    {
      sortFieldId: 'price',
      nullsPlacement: 'last',
    },
  ],
};
```

#### SortFuncParam

功能描述：自定义排序函数参数。查看 [文档](/manual/basic/sort/basic#4-自定义方法sortfunc) 和 [示例](/examples/analysis/sort/#custom-sort-func)

| 参数          | 说明                                        | 类型                                  | 默认值 | 必选 |
| ------------ | ------------------------------------------ | ------------------------------------ | ------ | --- |
| sortFieldId   | 度量 Id，即要被排序的 Id                    | `string`                              | -      | ✓    |
| sortMethod    | 排序方式                                    | `ASC \| DESC \| asc \| desc`    | -      |      |
| sortBy        | 自定义排序列表                              | `string[]`                            | -      |      |
| sortByMeasure | 按照度量值（数值）排序（透视表适用）      | `string`                              | -      |      |
| query         | 筛选条件，缩小排序范围 如 ：`{city:'白山'}` | `Record<string, string>`    | -      |      |
| type          | 组内排序用来显示 icon（透视表适用）             | `string`                              | -      |      |
| data          | 当前排序数据列表                            | `Array<string \| Record<string, any>>` | -      |      |
