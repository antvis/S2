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

| 参数         | 说明                                   | 类型                          | 默认值 | 必选 |
| ------------ | -------------------------------------- | ----------------------------- | ------ | ---- |
| data         | 原始数据                               | [RawData](#rawdata)[]         |        | ✓    |
| fields       | 维度指标                               | [Fields](#fields)             |        | ✓    |
| meta         | 字段元数据，可配置字段别名和数值格式化 | [Meta](#meta)[]               |        |      |
| sortParams   | 排序参数配置                           | [SortParam](#sortparam)[]     |        |      |
| filterParams | 筛选参数配置                           | [FilterParam](#filterparam)[] |        |      |

### RawData

[SimpleData](#simpledata) | [MiniChartData](#minichartdata) | [MultiData](#multidata)

功能描述：表格数据源

```ts
type RawData = Record<string, DataItem>;
type DataItem =  SimpleData | MultiData;
```

#### SimpleData

功能描述：基础数据类型

```ts
type SimpleData = string | number;
```

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

#### MiniChartData

<embed src="@/docs/common/mini-chart.zh.md"></embed>

#### MultiData

功能描述：用于支持多指标类型的自定义数据单元格渲染。例如：[趋势分析表](/examples/react-component/sheet#strategy)

| 配置项名称       | 说明                                       | 类型                          | 默认值 | 必选 |
| :--------------- | :----------------------------------------- | :---------------------------- | :----- | :--- |
| `values`         | 格式化后的数据，直接展示在 dataCfg 中      | [SimpleData](#simpledata)[][] | ✓      |
| `originalValues` | 原始数据，用于原始数据导出                 | [SimpleData](#simpledata)[][] |        |      |
| `label`          | 用作单元格小标题，单独占一行展示           | `string`                      |        |      |
| `[key: string]`  | 其他透传字段，用于自定义单元格的定制化展示 | `unknown`                     | ``     |      |

```ts
const data = [
  {
    number: {
      originalValues: [1, 2, 3],
      values: ['1', '2', '3']
    }
  }
];
```

### Fields

功能描述： 配置表格的维度域，即对应行列维度。

| 配置项名称       | 说明                                                                                                                                   | 类型                                              | 默认值 | 必选 |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- | ------ | ---- |
| rows             | 行维度 （可自定义行头，[查看示例](/examples/layout/custom-header-group/#custom-pivot-row-header))                                      | `string[]` \| [CustomTreeNode[]](#customtreenode) | `[]`   |      |
| columns          | 列维度 （可自定义列头，[查看示例](/examples/layout/custom-header-group/#custom-pivot-col-header))                                      | `string[]` \| [CustomTreeNode[]](#customtreenode) | `[]`   |      |
| values           | 指标维度                                                                                                                               | `string[]`                                        | `[]`   |      |
| valueInCols      | 指标维度是否在列头                                                                                                                     | `boolean`                                         |
| customValueOrder | 自定义指标维度在行列头中的层级顺序 （即 `values` 的 顺序，从 `0` 开始） [查看示例](/examples/custom/custom-layout/#custom-value-order) | `number`                                          | -      |      |

### Meta

功能描述：字段元数据，可配置字段别名和数值格式化。[查看示例](/examples/basic/pivot/#grid)

| 参数        | 说明                                                                                                                                                                                                                                                                                             | 类型                                                                         | 默认值 | 必选 |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------- | ------ | ---- |
| field       | 字段 id                                                                                                                                                                                                                                                                                          | `string`                                                                     |        |      |
| name        | 字段名称                                                                                                                                                                                                                                                                                         | `string`                                                                     |        |      |
| description | 字段描述，会显示在行头、列头、单元格对应的 tooltip 中                                                                                                                                                                                                                                            | `string`                                                                     |        |      |
| formatter   | 格式化 <br/> 单元格、行头和列头支持格式化，角头不支持格式化。只有单元格存在第二个参数。 <br/>数值字段：一般用于格式化数字单位<br/>文本字段：一般用于做字段枚举值的别名<br/> 第二个参数在以下情况会传入：data cell 格式化，复制/导出，tooltip 展示（**且仅在选择多个单元格时，data 类型为数组**） | `(value: unknown, data?: Data \| Data[], meta?: Node \| ViewMeta) => string` |        |      |

<embed src="@/docs/common/custom/customTreeNode.zh.md"></embed>

<embed src="@/docs/common/sort-param.zh.md"></embed>

### FilterParam

功能描述：用于**明细表**做数据筛选。

| 配置项名称       | 说明                                                                           | 类型                      | 默认值 | 必选 |
| :--------------- | :----------------------------------------------------------------------------- | :------------------------ | :----- | :--- |
| `filterKey`      | 需要筛选的字段 id                                                              | `string`                  |        | ✓    |
| `filteredValues` | 不包含的维度值                                                                 | `unknown[]`               |        |      |
| `customFilter`   | 自定义筛选函数，最终筛选的结果是同时满足 customFilter 且不在 filteredValues 中 | `(raw: Record<string, string>) => boolean` |        |      |
