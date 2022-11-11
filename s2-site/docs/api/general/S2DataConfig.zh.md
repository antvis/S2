---
title: S2DataConfig
order: 0
redirect_from:
  - /zh/docs/api
---

表格数据配置

| 参数       | 说明                                                   | 类型                      | 默认值 | 必选 |
| :--------- | :----------------------------------------------------- | :------------------------ | :----- | :--- |
| data       | 原始数据                                               | [RawData[]](#rawdata)     |        | ✓    |
| fields     | 维度指标                                               | [Fields](#fields)         |        | ✓    |
| meta       | 字段元数据，可配置字段别名，描述，数值格式化函数等信息 | [Meta[]](#meta)           |        |      |
| sortParams | 排序参数配置                                           | [SortParam[]](#sortparam) |        |      |

### RawData

[SimpleData](#simpledata) | [MultiData](#multidata) **required**, _default：null_

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

#### MultiData

功能描述：用于支持多指标类型的自定义数据单元格渲染。例如：[趋势分析表](/zh/examples/react-component/sheet#strategy)

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

object **必选**,_default：null_

功能描述： 配置表格的维度域，即对应行列维度

| 配置项名称       | 说明                                      | 类型                                              | 默认值 | 必选 |
| :--------------- | :---------------------------------------- | :------------------------------------------------ | :----- | :--- |
| rows             | 行维度 （可自定义行头，[查看例子](#TODO)) | `string[]` \| [CustomTreeNode[]](#customtreenode) | `[]`   |      |
| columns          | 列维度 （可自定义列头，[查看例子](#TODO)) | `string[]` \| [CustomTreeNode[]](#customtreenode) | `[]`   |      |
| values           | 指标维度                                  | `string[]`                                        | `[]`   |      |
| valueInCols      | 指标维度是否在列头                        | `boolean`                                         | `true` |      |
| customValueOrder | 自定义指标维度在行列头中的位置顺序        | `number`                                          | -      |      |

### Meta

功能描述：字段元数据，可配置字段别名和数值格式化。

| 参数        | 说明                                                                                                                                                                                                                                                                                                 | 类型                          | 默认值              | 必选                 |
| :---------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------- | :------------------ | :------------------- |
| field       | 字段 id, 对应 [Fields](#fields) 的 `rows` 和 `columns`, 如果是自定义行列头，对应 [CustomTreeNode](#customtreenode) 的 `key`                                                                                                                                                                          | `string`                      |                     |                      |
| name        | 字段名称                                                                                                                                                                                                                                                                                             | `string`                      |                     |                      |
| description | 字段描述，会显示在行头、列头、单元格对应的 tooltip 中                                                                                                                                                                                                                                                | `string`                      |                     |                      |
| formatter   | 格式化函数 <br/> 单元格、行头和列头支持格式化，角头不支持格式化。只有单元格存在第二个参数。 <br/>数值字段：一般用于格式化数字单位<br/>文本字段：一般用于做字段枚举值的别名<br/> 第二个参数在以下情况会传入：data cell 格式化，复制/导出，tooltip 展示（**且仅在选择多个单元格时，data 类型为数组**） | `(value: unknown, data?: Data | Data[], meta?: Node | ViewMeta) => string` |  |  |

`markdown:docs/common/sort-param.zh.md`

`markdown:docs/common/custom/customTreeNode.zh.md`
