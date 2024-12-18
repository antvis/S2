---
title: ViewMeta
order: 6
---

## ViewMeta

功能描述：数值单元格数据和位置等信息

| 参数 | 类型 | 必选  | 默认值 | 功能描述 |
| --- | --- | ---  | --- | --- |
| spreadsheet | [SpreadSheet](/api/basic-class/spreadsheet) |  |   | 表格实例 |
| id | `string` |  |   | 单元格唯一标识 |
| x | `number` |  |   | 单元格 x 坐标 |
| y | `number` |  |   | 单元格 y 坐标 |
| width | `number` |   |  | 单元格宽度 |
| height | `number` |    |  | 单元格高度 |
| data | [ViewMetaData](#viewmetadata) |    |  | 单元格数据 |
| rowIndex | `number` |  |  |   单元格在行叶子节点中的索引 |
| colIndex | `number` |  |  |   单元格在列叶子节点中的索引 |
| valueField | `string` |  |    | 度量 id |
| fieldValue | [DataItem](#dataitem) |  |    | 度量展示的真实值 |
| isTotals | `boolean` |  |    |   是否为总计：true 为总计  false 为小计 |
| query | `Record<string, any>`|   |  | 行列查询条件 |
| rowQuery | `Record<string, any>`|   |  | 行查询条件 |
| colQuery | `Record<string, any>` |    |  | 列查询条件 |
| rowId | `string` |  |  |   单元格的行 id |
| colId | `string` |  |  |   单元格的列 id |

### RawData

[DateItem](#dataitem)

```ts | pure
type RawData = Record<string, DataItem>;
```

### SimpleData

```ts
type SimpleData = string | number | null | undefined;
```

### MultiData

功能描述：用于支持多指标类型的自定义数据单元格渲染。例如：[趋势分析表](/examples/react-component/sheet#strategy)

| 配置项名称       | 说明                                       | 类型                          | 默认值 | 必选 |
| :--------------- | :----------------------------------------- | :---------------------------- | :----- | :--- |
| `values`         | 格式化后的数据，直接展示在 dataCfg 中      | [SimpleData](#simpledata)[][] |        |   ✓   |
| `originalValues` | 原始数据，用于原始数据导出                 | [SimpleData](#simpledata)[][] |        |      |
| `label`          | 用作单元格小标题，单独占一行展示           | `string`                      |        |      |
| `[key: string]`  | 其他透传字段，用于自定义单元格的定制化展示 | `unknown`                     | ``     |      |

```json
{
  "number": {
    "originalValues": [1, 2, 3],
    "values": ["1", "2", "3"]
  }
}
```

### DataItem

[SimpleData](#simpledata) | [MultiData](#multidata) | [MiniChartData](#minichartdata)

```ts | pure
type DataItem = SimpleData | MultiData | MiniChartData | Record<string, unknown>;
```

```json
{
  "number": 7789,
  "province": "浙江省",
  "city": "杭州市",
  "type": "家具",
  "sub_type": "桌子"
}
```

### ExtraData

```ts | pure
import type { EXTRA_FIELD, VALUE_FIELD } from '@antv/s2';

type ExtraData = {
  [EXTRA_FIELD]: string;
  [VALUE_FIELD]: string | DataItem;
};
```

```json
{
  "$$extra$$": "number",
  "$$value$$": 7789,
}
```

### Data

```ts | pure
type Data = RawData & ExtraData;
```

### ViewMetaData

[查看 `CellData` 定义](/api/basic-class/cell-data)

```ts | pure
type ViewMetaData = Data | CellData;
```

#### Data

```json
{
  "city": "杭州市"
}
```

#### CellData

```json
{
  "extraField": "number",
  "raw": {
    "number": 7789,
    "province": "浙江省",
    "city": "杭州市",
    "type": "家具",
    "sub_type": "桌子"
  },
  "$$extra$$": "number",
  "$$value$$": 7789,
  "$$origin$$": {
    "number": 7789,
    "province": "浙江省",
    "city": "杭州市",
    "type": "家具",
    "sub_type": "桌子"
  }
}
```

### MiniChartData

<embed src="@/docs/common/mini-chart.zh.md"></embed>
