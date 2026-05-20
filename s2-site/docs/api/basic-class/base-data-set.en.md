---
title: BaseDataSet
order: 5
---

Function description: The table's dataset. [Details](https://github.com/antvis/S2/blob/next/packages/s2-core/src/data-set/pivot-data-set.ts)

```ts
s2.dataSet.getFieldName('type')
```

| Parameter | Description | Type | Version |
| --- | --- | --- | --- |
| fields | Field information | [Fields](/en/api/general/s2-data-config#fields) | |
| meta | Field metadata, including field names, formatters, etc. | [Meta[]](/en/api/general/s2-data-config#meta) | |
| originData | Raw data | [RawData](#rawdata)[] | |
| indexesData | Multi-dimensional index data | Record<string, [RawData](#rawdata)[][] \| [RawData](#rawdata)[]> | |
| sortParams | Sorting configuration | [SortParams](/en/api/general/s2-data-config#sortparams) | |
| filterParams | Filtering configuration | [FilterParam](#filterparam)[] | |
| displayData | Display data | [RawData](#rawdata)[] | |
| spreadsheet | Spreadsheet instance | [SpreadSheet](/en/api/basic-class/spreadsheet) | |
| getField | Get a field | (field: [CustomHeaderField](#customheaderfield)) => [Meta](/en/api/general/s2-data-config#meta) | |
| getFieldMeta | Get field metadata | (field: [CustomHeaderField](#customheaderfield), meta?: [Meta[]](/en/api/general/s2-data-config#meta)) => [Meta](/en/api/general/s2-data-config#meta) | |
| getFieldName | Get a field name | (field: [CustomHeaderField](#customheaderfield), defaultValue?: string) => `string` | |
| getCustomRowFieldName | Get custom cell field name | (cell: S2CellType<[`ViewMeta`](#viewmeta) \| [`Node`](/en/api/basic-class/node)>) => `string` | |
| getCustomFieldDescription | Get custom cell field description | (cell: S2CellType<[`ViewMeta`](#viewmeta) \| [`Node`](/en/api/basic-class/node)>) => `string` | |
| getFieldFormatter | Get a field formatter function | (field: [CustomHeaderField](#customheaderfield)) => [Formatter](#formatter) | |
| getFieldDescription | Get a field description | (field: [CustomHeaderField](#customheaderfield)) => [Formatter](#formatter) | |
| setDataCfg | Set the data configuration | `<T extends boolean = false>(dataCfg: T extends true ?` [`S2DataConfig`](/en/api/general/s2-data-config) `: Partial<`[`S2DataConfig`](/en/api/general/s2-data-config)`>, reset?: T) => void` | The `reset` parameter is available from `@antv/s2^1.34.0` |
| getDisplayDataSet | Get the currently displayed dataset | () => [DataType[]](#datatype) | |
| getDimensionValues | Get dimension values | (field: string, query?: [DataType](#datatype)) => string[] | |
| getCellData | Get data for a single cell | (params: [GetCellDataParams](#getcelldataparams)) => [DataType[]](#datatype) | |
| getCellMultiData | Get data for multiple cells | (params?: [GetCellMultiDataParams](#getcellmultidataparams)) => [DataType[]](#datatype) | |
| moreThanOneValue | Checks if there is more than one measure value | () => [ViewMeta](#viewmeta) | |
| isEmpty | Checks if the dataset is empty | () => `boolean` | |
| displayFormattedValueMap | A map of formatted values for cells (used in editable tables) | `Map<string, string>` | |
| getValueRangeByField | Gets the min/max value range for a numerical field | `(field: string) => { minValue: number, maxValue: number }` | |

### Formatter

```ts
type Formatter = (
  value: DataItem,
  data?: DataItem | ViewMetaData | ViewMetaData[],
  meta?: Node | ViewMeta | null | undefined,
) => SimpleData;
```

### FormatResult

```ts
interface FormatResult {
  formattedValue: SimpleData;
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
   * Query condition
   */
  query: Query;

  /**
   * Whether it is a total node
   */
  isTotals?: boolean;

  /**
   * Row header node, for drill-down scenarios
   */
  rowNode?: Node;

  /**
   * Whether it is a row header
   */
  isRow?: boolean;

  /**
   * Summary information
   */
  totalStatus?: TotalStatus;
}
```

### GetCellMultiDataParams

```ts
interface GetCellMultiDataParams {
  /**
   * Query condition
   */
  query?: Query;

  /**
   * Query type
   */
  queryType?: QueryDataType;

  /**
   * Drill-down fields
   */
  drillDownFields?: string[];
}

enum QueryDataType {
  All = 'all', // Get all data
  DetailOnly = 'detailOnly', // Get only detail data
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

<embed src="@/common/custom/customTreeNode.en.md"></embed>
<embed src="@/common/view-meta.en.md"></embed>
