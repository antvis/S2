---
title: S2DataConfig
order: 0
redirect_from:
  - /zh/docs/api
---


数据映射，description

| 参数 | 类型 | 必选  | 默认值 | 功能描述 |
| :------------- | :--------- | :--- | :----- | :----------------- |
| data           | `Data[]` |   ✓   | `[]`   | 原始数据        |
| totalData        | `Data[]` |      | `[]`   | 总计数据       |
| fields         | `Fields` |   ✓     |    | 维度指标配置项       |
| meta    | `Meta[]`  |   ✓    |  | 全局化配置表数数据元信息，以度量为单位进行配置。在 `meta` 上的配置将同时影响所有组件的文本信息。 |
| sortParams    | `SortParams`  |   ✓    |  | 全局化配置表数数据元信息，以度量为单位进行配置。在 `meta` 上的配置将同时影响所有组件的文本信息。 |

### Data

array object **required**, _default：null_

功能描述： 设置表的数据源数据源为对象集合，例如：

```json
const data = [{
    "area": "东北",
    "province": "吉林",
    "city": "白山",
    "type": "办公用品",
    "sub_type": "纸张",
    "cost": "2",
}, {
    "area": "东北",
    "province": "吉林",
    "city": "白山",
    "type": "办公用品",
    "sub_type": "笔",
    "cost": "3",
}]
```

### Fields

object **必选**,_default：null_

功能描述： 配置表格的维度域，即对应行列维度

| 配置项名称 | 类型   | 必选 | 默认值 | 功能描述           |
| :------------- | :--------- | :--- | :----- | :----------------- |
| rows           | `string[]` |      | `[]`   | 行维度列表         |
| columns        | `string[]` |      | `[]`   | 列维度列表         |
| values         | `string[]` |      | `[]`   | 指标维度列表       |
| valueInCols    | `boolean`  |      | `true` | 指标维度是否在列头 |

### Meta

array object **必选**,_default：null_

功能描述： 全局化配置表数数据元信息，以度量为单位进行配置。在 meta 上的配置将同时影响所有组件的文本信息。

| 参数 | 类型 | 必选  | 默认值 | 功能描述 |
| :--| :--- | :--- | :----- | :--------|
| field  | `string` | ✓   | |  度量 id |                                                                     |
| name | `string`| ✓  |  | 度量名称 |                                                                        |
| formatter | `(v: any) => string` | | | 格式化<br/>数值度量：一般用于格式化数字<br/>文本度量：一般用于做字段枚举值的别名 |

`markdown:docs/common/sort-params.zh.md`

`markdown:docs/common/custom/customTreeItem.zh.md`
