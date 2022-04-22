---
title: S2DataConfig
order: 0
redirect_from:
  - /zh/docs/api
---

数据映射，description

| 参数 | 说明 | 类型 | 默认值 | 必选  |
| :------------- | :----------------- | :--------- | :----- | :--- |
| data           | 原始数据        | [Data[]](#data) |    |   ✓   |
| fields         | 维度指标配置项       | [Fields](#fields) |    |   ✓     |
| totalData        | 总计数据       | [Data[]](#data) |    |      |
| meta    | 全局化配置表数数据元信息，以度量为单位进行配置。在 `meta` 上的配置将同时影响所有组件的文本信息。 | [Meta[]](#meta)  |  |       |
| sortParams    | 全局化配置表数数据元信息，以度量为单位进行配置。在 `meta` 上的配置将同时影响所有组件的文本信息。 | [SortParams](#sortparams)  |  |       |

### Data

string | number | [MultiData](#multidata) **required**, _default：null_

功能描述： 设置表的数据源数据源为对象集合，例如：

```ts
const data = [
  {
    area: '东北',
    province: '吉林',
    city: '白山',
    type: '办公用品',
    subType: '纸张',
    cost: '2',
  },
  {
    area: '东北',
    province: '吉林',
    city: '白山',
    type: '办公用品',
    subType: '笔',
    cost: '3',
  }
];
```

### Fields

object **必选**,_default：null_

功能描述： 配置表格的维度域，即对应行列维度

| 配置项名称 | 说明     | 类型   | 默认值 | 必选 |
| :------------- | :----------------- | :--------- | :----- | :--- |
| rows           | 行维度列表         | `string[]` | `[]`   |      |
| customTreeItems | 自定义行头目录树        | [CustomTreeItem[]](#customtreeitem) |  |      |
| columns        | 列维度列表         | `string[]` | `[]`   |      |
| values         | 指标维度列表       | `string[]` | `[]`   |      |
| valueInCols    | 指标维度是否在列头   | `boolean`  | `true` |      |
| customValueOrder | 自定义指标维度在行列头中的位置顺序 | `number`  | - |      |

### Meta

array object **必选**,_default：null_

功能描述： 全局化配置表数数据元信息，以度量为单位进行配置。在 meta 上的配置将同时影响所有组件的文本信息。

| 参数 | 说明 | 类型 | 默认值 | 必选  |
| :--| :--------| :--- | :----- | :--- |
| field  | 字段 id | `string` | |    |
| name | 字段名称 | `string`|  |   |
| description | 字段描述 | `string`|  |   |
| formatter | 格式化 <br/> 单元格、行头和列头支持格式化，角头不支持格式化。只有单元格存在第二个参数。 <br/>数值字段：一般用于格式化数字单位<br/>文本字段：一般用于做字段枚举值的别名<br/> 第二个参数在以下情况会传入：data cell 格式化，复制/导出，tooltip 展示（**且仅在选择多个单元格时，data 类型为数组**） | `(value: unknown, data?: Data | Data[]) => string` | | |

### MultiData

object **必选**,_default：null_

功能描述：用于支持多指标类型的自定义数据单元格渲染。例如：[趋势分析表](/zh/examples/react-component/sheet#strategy)

| 配置项名称 | 说明     | 类型   | 默认值 | 必选 |
| :------------- | :----------------- | :--------- | :----- | :--- |
| values           | 格式化后的数据，直接展示在dataCfg中 | `(string | number)[][]`   |  ✓   |
| originalValues | 原始数据，用于原始数据导出 | `(string | number)[][]`  |  |      |
| label        | 用作单元格小标题，单独占一行展示    | `string` |    |      |
| [key: string]       | 其他透传字段，用于自定义单元格的定制化展示       | `unknown` | ``   |      |

`markdown:docs/common/sort-params.zh.md`

`markdown:docs/common/custom/customTreeItem.zh.md`
