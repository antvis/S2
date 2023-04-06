---
title: S2DataConfig
order: 0
redirect_from:
  - /en/docs/api
---

Tabular data configuration

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

| parameter  | illustrate                                                      | type                        | Defaults | required |
| ---------- | --------------------------------------------------------------- | --------------------------- | -------- | -------- |
| data       | Raw data                                                        | [Data\[\]](#data)           |          | ✓        |
| fields     | dimension index                                                 | [Fields](#fields)           |          | ✓        |
| totalData  | Total/Subtotal Data                                             | [Data\[\]](#data)           |          |          |
| meta       | Field metadata, configurable field aliases and value formatting | [Meta\[\]](#meta)           |          |          |
| sortParams | Sorting parameter configuration                                 | [SortParam\[\]](#sortparam) |          |          |

### RawData

[SimpleData](#simpledata) | [MiniChartData](#minichartdata) | [MultiData](#multidata) **required** , *default: null*

Function description: tabular data source

```ts
type RawData = Record<string, DataItem>;
type DataItem =  SimpleData | MultiData;
```

#### SimpleData

Function description: basic data type

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

Function description: used to support custom data cell rendering of multiple indicator types. Example: [Trend Analysis Table](/zh/examples/react-component/sheet#strategy)

| Configuration item name | illustrate                                                      | type                             | Defaults | required |
| :---------------------- | :-------------------------------------------------------------- | :------------------------------- | :------- | :------- |
| `values`                | The formatted data is directly displayed in dataCfg             | [SimpleData](#simpledata) \[]\[] | ✓        |          |
| `originalValues`        | raw data, for raw data export                                   | [SimpleData](#simpledata) \[]\[] |          |          |
| `label`                 | Used as a subtitle of a cell, displayed on a separate line      | `string`                         |          |          |
| `[key: string]`         | Other transparent fields for customized display of custom cells | `unknown`                        | \`\`     |          |

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

object is **required** , *default: null*

Function description: Configure the dimension field of the table, that is, the corresponding row and column dimensions

| Configuration item name | illustrate                                                                                                                                                                                                   | type                                                | Defaults | required |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------- | -------- | -------- |
| rows                    | Row dimension (customizable row header, [see example](#TODO) )                                                                                                                                               | `string[]` \| [CustomTreeNode\[\]](#customtreenode) | `[]`     |          |
| columns                 | Column dimension (column header can be customized, [see example](#TODO) )                                                                                                                                    | `string[]` \| [CustomTreeNode\[\]](#customtreenode) | `[]`     |          |
| values                  | Indicator Dimensions                                                                                                                                                                                         | `string[]`                                          | `[]`     |          |
| valueInCols             | Whether the indicator dimension is at the column header                                                                                                                                                      | `boolean`                                           |          |          |
| customValueOrder        | The hierarchical order of custom indicator dimensions in the row and column headers (that is, the order of `values` , starting from `0` ) [View example](/examples/custom/custom-layout/#custom-value-order) | `number`                                            | -        |          |

### Meta

Function description: field metadata, configurable field alias and value formatting.

Function description: Field metadata, configurable field alias and value formatting.

| parameter   | illustrate                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | type                                                                         | Defaults | required |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | -------- | -------- |
| field       | field id                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | `string`                                                                     |          |          |
| name        | Field Name                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | `string`                                                                     |          |          |
| description | Field description, which will be displayed in the tooltip corresponding to the row header, column header, and cell                                                                                                                                                                                                                                                                                                                                                                                            | `string`                                                                     |          |          |
| formatter   | Formatting cells, row headers and column headers support formatting, but corner headers do not support formatting. The second parameter exists only for cells.<br>Numerical fields: generally used to format numeric units Text fields: generally used as aliases for field enumeration values The second parameter will be passed in in the following situations: data cell formatting, copy/export, tooltip display ( **and only when selected When there are multiple cells, the data type is an array** ) | `(value: unknown, data?: Data \| Data[], meta?: Node \| ViewMeta) => string` |          |          |

### MiniChartData

<embed src="@/docs/common/mini-chart.en.md"></embed>

### MultiData

object is **required** , *default: null*

Function description: used to support custom data cell rendering of multiple indicator types. Example: [Trend Analysis Table](/zh/examples/react-component/sheet#strategy)

| Configuration item name | illustrate                                                      | type                     | Defaults | required |
| ----------------------- | --------------------------------------------------------------- | ------------------------ | -------- | -------- |
| values                  | The formatted data is directly displayed in dataCfg             | `(string \| number)[][]` | ✓        |          |
| originalValues          | raw data, for raw data export                                   | `(string \| number)[][]` |          |          |
| label                   | Used as a cell subtitle, displayed on a separate line           | `string`                 |          |          |
| \[key: string]          | Other transparent fields for customized display of custom cells | `unknown`                | \`\`     |          |

<embed src="@/docs/common/sort-param.en.md"></embed>

<embed src="@/docs/common/custom/customTreeNode.en.md"></embed>

### Columns

`Array<ColumnNode | string>`

Column configuration array, supports the use of [ColumnNode](#columnnode) structure to describe the column grouping relationship in the detailed table mode

### ColumnNodes

| attribute name | illustrate                  | type                          | Defaults | required |
| -------------- | --------------------------- | ----------------------------- | -------- | -------- |
| key            | column field id or group id | string                        |          | ✓        |
| children       | subclass below the group    | `Array<ColumnNode \| string>` |          |          |
