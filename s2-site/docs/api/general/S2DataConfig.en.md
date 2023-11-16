---
title: S2DataConfig
order: 0
redirect_from:
  - /en/docs/api
---

Demo of the DataConfig

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

Tabular data configuration

| parameter  | illustrate                                                      | type                        | Defaults | required |
| :--------- | :-------------------------------------------------------------- | :-------------------------- | :------- | :------- |
| data       | Raw data                                                        | [Data\[\]](#data)           |          | ✓        |
| fields     | dimension index                                                 | [Fields](#fields)           |          | ✓        |
| totalData  | Total/Subtotal Data                                             | [Data\[\]](#data)           |          |          |
| meta       | Field metadata, configurable field aliases and value formatting | [Meta\[\]](#meta)           |          |          |
| sortParams | Sorting parameter configuration                                 | [SortParam\[\]](#sortparam) |          |          |

### Data

string | number | [MiniChartData](#minichartdata) | [MultiData](#multidata) **required** , *default: null*

Function description: Set the data source data source of the table, for example:

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

object is **required** , *default: null*

Function description: Configure the dimension field of the table, that is, the corresponding row and column dimensions

| Configuration item name | illustrate                                                           | type                                  | Defaults | required |
| :---------------------- | :------------------------------------------------------------------- | :------------------------------------ | :------- | :------- |
| rows                    | list of row dimensions                                               | `string[]`                            | `[]`     |          |
| customTreeItems         | Customize the header directory tree                                  | [CustomTreeItem[]](#customtreeitem) |          |          |
| columns                 | list of column dimensions                                            | [Columns[]](#columns) | `[]`     |          |
| values                  | List of Metric Dimensions                                            | `string[]`                            | `[]`     |          |
| valueInCols             | Whether the indicator dimension is at the column header              | `boolean`                             | `true`   |          |
| customValueOrder        | Position order of custom metric dimensions in row and column headers  [example](/en/examples/custom/custom-layout/#custom-value-order) | `number`                              | -        |          |

### Meta

array object **required** , *default: null*

Function description: Field metadata, configurable field alias and value formatting.

| parameter   | illustrate | type                           | Defaults             | required              |
| :---------- | :---- | :----------------------------- | :------------------- | :-------------------- |
| field       | field id | `string`  |  |                       |
| name   | Field Name  | `string`  |  |   |
| description | Field description, which will be displayed in the tooltip corresponding to the row header, column header, and cell   | `string` |   |   |
| formatter   | Formatting cells, row headers and column headers support formatting, but corner headers do not support formatting. The second parameter exists only for cells. Numerical fields: generally used to format numeric units Text fields: generally used as aliases for field enumeration values The second parameter will be passed in in the following situations: data cell formatting, copy/export, tooltip display ( **and only when selected When there are multiple cells, the data type is an array** ) | \`(value: unknown, data?: Data | Data\[], meta?: Node | ViewMeta) => string\` |

### MiniChartData

<embed src="@/docs/common/mini-chart.en.md"></embed>

### MultiData

object is **required** , *default: null*

Function description: used to support custom data cell rendering of multiple indicator types. Example: [Trend Analysis Table](/examples/react-component/sheet#strategy)

| Configuration item name | illustrate                                                      | type      | Defaults        | required |
| :---------------------- | :-------------------------------------------------------------- | :-------- | :-------------- | :------- |
| values                  | The formatted data is directly displayed in dataCfg             | \`(string | number)\[]\[]\` | ✓        |
| originalValues          | raw data, for raw data export                                   | \`(string | number)\[]\[]\` |          |
| label                   | Used as a subtitle of a cell, displayed on a separate line      | `string`  |                 |          |
| \[key: string]          | Other transparent fields for customized display of custom cells | `unknown` | \`\`            |          |

<embed src="@/docs/common/sort-param.zh.md"></embed>

<embed src="@/docs/common/custom/customTreeItem.zh.md"></embed>

### Columns

`Array<ColumnNode | string>`

列配置数组，在明细表模式下支持使用 [ColumnNode](#columnnode) 结构来描述列分组关系

### ColumnNode

| 属性名称 | 说明     | 类型   | 默认值 | 必选 |
| ------- | ---------| -------| ------|------|
| key | 列字段 id 或分组 id   | string |       | ✓ |
| rowSpan | 合并单元格行数，配置后则优先按照 rowSpan 规划列头单元格高度   | number |       |  |
| children | 分组下面的子级  | Array\<ColumnNode \| string\> |       |  |
