---
title: S2DataConfig
order: 0
redirect_from:
  - /zh/docs/api
---

数据映射，description

## Data

array object **必选**, _default：null_ 功能描述： 设置表的数据源数据源为对象集合，例如：

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

## Meta

array object **必选**,_default：null_ 功能描述： 全局化配置表数元信息，以度量为单位进行配置。在 meta 上的配置将同时影响所有组件的文本信息。

| 细分配置项名称     | 类型     | 必选    | 功能描述 |
| :----------------- | :-------  | :----- | :------- | -------------------- |
| field              | `string`   | ✓            | 度量 id  |
| name               | `string`   | ✓            | 度量名称 |
| formatter          | `(v: any) => string` |             | 格式化<br/>数值度量：一般用于格式化数字<br/>文本度量：一般用于做字段枚举值的别名

## Fields

object **必选**,_default：null_ 功能描述： 配置表格的维度域，即对应行列维度

| 细分配置项名称 | 类型 | 必选 | 默认值 | 功能描述 |
| :-- | :-- | :-- | :-- | :-- |
| rows | `string[]` |  | `[]` | 行维度列表 |
| columns | `string[]` |  |  `[]`| 列维度列表 |
| values | `string[]` | |  `[]`| 指标维度列表 |
| valueInCols | `boolean` | |  `true`| 指标维度是否在列头 |

## sortParams

array SortParam **可选**,_default：null_ 功能描述： 配置表格的度量的排序 **sortparam** \*\*

| 细分配置项名称 | 类型 | 必选  | 功能描述 |
| :-- | :-- | :-- | :--  | --- |
| sortFieldId | `string` | ✓  | 度量 Id，业务中一般是 displayId |
| sortMethod | `ASC` \| `DESC` |    | 列维度列表 |
| sortBy | `string[]`   || 自定义排序 |
| sortByField | `string` |    | 按照其他维度排序 |
| query | `object` |  |   筛选条件，缩小排序范围 如 ：`{city:'白山'}` |
| type | `string` |     | 组内排序用来显示icon |

## 额外属性

array object **可选**,_default：null_ 功能描述： 额外的由外部传入的属性对象合集。
