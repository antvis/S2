---
title: S2DataConfig
order: 0
redirect_from:
  - /zh/docs/api
---

表格数据配置

```ts
const s2DataConfig = {
  data: [],
  meta: [],
  sortParams: [],
  fields: {
    rows: [],
    columns: [],
    values: []
  }
}
```

| 参数 | 说明 | 类型 | 默认值 | 必选  |
| ------------- | ----------------- | --------- | ----- | --- |
| data           | 原始数据        | [Data[]](#data) |    |   ✓   |
| fields         | 维度指标       | [Fields](#fields) |    |   ✓     |
| totalData        | 总计/小计数据       | [Data[]](#data) |    |      |
| meta    | 字段元数据，可配置字段别名和数值格式化 | [Meta[]](#meta)  |  |       |
| sortParams    | 排序参数配置 | [SortParam[]](#sortparam)  |  |       |

### Data

string | number | [MiniChartData](#minichartdata) | [MultiData](#multidata) **required**, _default：null_

功能描述： 设置表的数据源数据源，例如：

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
| ------------- | ----------------- | --------- | ----- | --- |
| rows           | 行维度列表         | `string[]` | `[]`   |      |
| customTreeItems | 自定义行头目录树        | [CustomTreeItem[]](#customtreeitem) |  |      |
| columns        | 列维度列表         | [Columns[]](#columns) | `[]`   |      |
| values         | 指标维度列表       | `string[]` | `[]`   |      |
| valueInCols    | 指标维度是否在列头   | `boolean`  | `true` |      |
| customValueOrder | 自定义指标维度在行列头中的层级顺序 （即 `values` 的 顺序，从 `0` 开始，**仅支持单指标**） [查看示例](/zh/examples/custom/custom-layout/#custom-value-order) | `number`  | - |      |

### Meta

array object **必选**,_default：null_

功能描述： 字段元数据，可配置字段别名和数值格式化。

| 参数 | 说明 | 类型 | 默认值 | 必选  |
| --| --------| --- | ----- | --- |
| field  | 字段 id | `string` | |    |
| name | 字段名称 | `string`|  |   |
| description | 字段描述，会显示在行头、列头、单元格对应的 tooltip 中 | `string`|  |   |
| formatter | 格式化 <br/> 单元格、行头和列头支持格式化，角头不支持格式化。只有单元格存在第二个参数。 <br/>数值字段：一般用于格式化数字单位<br/>文本字段：一般用于做字段枚举值的别名<br/> 第二个参数在以下情况会传入：data cell 格式化，复制/导出，tooltip 展示（**且仅在选择多个单元格时，data 类型为数组**） | `(value: unknown, data?: Data \| Data[], meta?: Node \| ViewMeta) => string` | | |

### MiniChartData

<embed src="@/docs/common/mini-chart.zh.md"></embed>

### MultiData

object **必选**,_default：null_

功能描述：用于支持多指标类型的自定义数据单元格渲染。例如：[趋势分析表](/zh/examples/react-component/sheet#strategy)

| 配置项名称 | 说明     | 类型   | 默认值 | 必选 |
| ------------- | ----------------- | --------- | ----- | --- |
| values           | 格式化后的数据，直接展示在 dataCfg 中 | `(string \| number)[][]`   |  ✓   |
| originalValues | 原始数据，用于原始数据导出 | `(string \| number)[][]`  |  |      |
| label        | 用作单元格小标题，单独占一行展示    | `string` |    |      |
| [key: string]       | 其他透传字段，用于自定义单元格的定制化展示       | `unknown` | ``   |      |

<embed src="@/docs/common/sort-param.zh.md"></embed>

<embed src="@/docs/common/custom/customTreeItem.zh.md"></embed>

### Columns

`Array<ColumnNode | string>`

列配置数组，在明细表模式下支持使用 [ColumnNode](#columnnode) 结构来描述列分组关系

### ColumnNode

| 属性名称 | 说明     | 类型   | 默认值 | 必选 |
| ------- | ---------| -------| ------|------|
| key | 列字段 id 或分组 id   | string |       | ✓ |
| children | 分组下面的子级  | `Array<ColumnNode \| string>` |       |  |
