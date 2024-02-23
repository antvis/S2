---
title: BaseDataSet
order: 5
tag: Updated
---

功能描述：表格数据集。[详情](https://github.com/antvis/S2/blob/next/packages/s2-core/src/data-set/pivot-data-set.ts)

```ts
s2.dataSet.getFieldName('type')
```

| 参数                                   | 说明                               | 类型                                                                                                                                                                                         | 版本                                        |
| -------------------------------------- | ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| fields                                 | 字段信息                           | [Fields](/docs/api/general/S2DataConfig#fields)                                                                                                                                        |                                             |
| meta                                   | 字段元信息，包含有字段名、格式化等 | [Meta[]](/docs/api/general/S2DataConfig#meta)                                                                                                                                          |                                             |
| originData                             | 原始数据                           | [RawData](#rawdata)[](#)                                                                                                                                                                |                                             |
| indexesData                            | 多维索引数据                       | Record<string, [RawData](#rawdata)[][] \| [RawData](#rawdata)[]>                                                                                                                                                              |                                             |
| sortParams                             | 排序配置                           | [SortParams](/docs/api/general/S2DataConfig#sortparams)                                                                                                                                |                                             |
| filterParams                             | 筛选配置                           | [FilterParam](#filterparam)[]                                                                                                                                |                                             |
| displayData                             | 展示数据                           | [RawData](#rawdata)[]                                                                                                                               |                                             |
| spreadsheet                            | 表格实例                           | [SpreadSheet](/docs/api/basic-class/spreadsheet)                                                                                                                                       |                                             |
| getField                           | 获取字段                 | (field: [CustomHeaderField](#customheaderfield)) => [Meta](/docs/api/general/S2DataConfig#meta)                                                                         |                                             |
| getFieldMeta    | 获取字段元数据信息                 | (field: [CustomHeaderField](#customheaderfield), meta?: [Meta[]](/docs/api/general/S2DataConfig#meta)) => [Meta](/docs/api/general/S2DataConfig#meta)    |
| getFieldName                           | 获取字段名                         | (field: [CustomHeaderField](#customheaderfield), defaultValue?: string) => `string`  |                                             |
| getCustomRowFieldName                           | 获取自定义单元格字段名称                         | (cell: S2CellType<ViewMeta \| Node>) => `string`    |                                             |
| getCustomFieldDescription                           | 获取自定义单元格字段描述                         | (cell: S2CellType<ViewMeta \| Node>) => `string`   |                                             |
| getFieldFormatter                      | 获取字段格式化函数                 | (field: [CustomHeaderField](#customheaderfield)) => [Formatter](#formatter)                                                                                                                                                               |                                             |
| getFieldDescription                    | 获取字段描述                       | (field: [CustomHeaderField](#customheaderfield)) => [Formatter](#formatter)                                                                                                                                                                               |                                             |
| setDataCfg                             | 设置数据配置                       | `<T extends boolean = false>(dataCfg: T extends true ?` [`S2DataConfig`](/docs/api/general/S2DataConfig) `: Partial<`[`S2DataConfig`](/docs/api/general/S2DataConfig)`>, reset?: T) => void` | `reset` 参数需在 `@antv/s2^1.34.0`版本使用 |
| getDisplayDataSet                      | 获取当前显示的数据集               | () => [DataType[]](#datatype)                                                                                                                                                                |                                             |
| getDimensionValues                     | 获取维值                           | (filed: string, query?: [DataType](#datatype) ) => string[]                                                                                                                                  |                                             |
| getCellData                            | 获取单个的单元格数据               | (params: [GetCellDataParams](#getcelldataparams)) => [DataType[]](#datatype)                                                                                                                       |                                             |
| getCellMultiData                           | 获取批量的单元格数据               | (params?: [GetCellMultiDataParams](#getcellmultidataparams)) => [DataType[]](#datatype)                                                                                       |                                             |
| moreThanOneValue                       | 是否超过 1 个数值                  | () => [ViewMeta](#viewmeta)                                                                                                                                                                  |                                             |
| isEmpty                                | 是否为空数据集                     | () => `boolean`                                                                                                                                                                              | `@antv/s2^1.51.1`                          |
| displayFormattedValueMap                                |  单元格所对应格式化后的值（用于编辑表）                  | `Map<string, string>`                                                                                                                                                                             | `@antv/s2-v1.54.5`                          |

### SimpleData

```ts
type SimpleData = string | number | null;
```

### MultiData

```ts
interface MultiData<T = SimpleData[][]> {
  values: T;
  originalValues?: T;
  label?: string;
  [key: string]: unknown;
}
```

### DataItem

```ts

type DataItem =
  | SimpleData
  | MultiData
  | Record<string, unknown>
  | undefined
  | null;
```

### RawData

```ts
type RawData = Record<string, DataItem>;
```

### DataType

```ts
type DataType = Record<string, unknown>;
```

### ExtraData

```ts
type ExtraData = {
  [EXTRA_FIELD]: string;
  [VALUE_FIELD]: string | DataItem;
};
```

### Data

```ts
type Data = RawData & ExtraData;
```

### ViewMetaData

```ts
type ViewMetaData = Data | CellData;
```

### Formatter

```ts
 type Formatter = (
  v: unknown,
  data?: SimpleData | ViewMetaData | ViewMetaData[],
  meta?: Node | ViewMeta,
) => string;
```

### FormatResult

```ts
 interface FormatResult {
  formattedValue: string;
  value: DataItem;
}
```

### TotalSelection

```ts
type TotalSelection = {
  grandTotalOnly?: boolean;
  subTotalOnly?: boolean;
  totalDimensions?: boolean | string[];
};

```

```ts
type TotalSelectionsOfMultiData = {
  row?: TotalSelection;
  column?: TotalSelection;
};
```

### Query

```ts
type Query = Record<string, any>;
```

### TotalStatus

```ts
interface TotalStatus {
  isRowTotal: boolean;
  isRowSubTotal: boolean;
  isColTotal: boolean;
  isColSubTotal: boolean;
}
```

### GetCellDataParams

```ts
interface GetCellDataParams {
  /**
   * 查询条件
   */
  query: Query;

  /**
   * 是否是汇总节点
   */
  isTotals?: boolean;

  /**
   * 行头节点，用于下钻场景
   */
  rowNode?: Node;

  /**
   * 是否是行头
   */
  isRow?: boolean;

  /**
   * 汇总信息
   */
  totalStatus?: TotalStatus;
}

```

### GetCellMultiDataParams

```ts
interface GetCellMultiDataParams {
  /**
   * 查询条件
   */
  query?: Query;

  /**
   * 查询类型
   */
  queryType?: QueryDataType;

  /**
   * 下钻
   */
  drillDownFields?: string[];
}

enum QueryDataType {
  All = 'all', // 获取所有的数据
  DetailOnly = 'detailOnly', // 只需要明细数据
}

```

### FilterParam

```ts
interface FilterParam {
  filterKey: string;
  filteredValues?: unknown[];
  customFilter?: (row: Query) => boolean;
}
```

<embed src="@/docs/common/custom/customTreeNode.zh.md"></embed>
