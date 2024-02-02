---
title: BaseDataSet
order: 5
---

Function description: tabular data
set. [details](https://github.com/antvis/S2/blob/next/packages/s2-core/src/data-set/pivot-data-set.ts)

```ts
s2.dataSet.getFieldName('type')
```

| parameter                                 | illustrate                                                     | type                                                                                                                                                                                         | Version                                                              |
| ----------------------------------------- | -------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| fields                                    | field information                                              | () => [Fields](/docs/api/general/S2DataConfig#fields)                                                                                                                                        |                                                                      |
| meta                                      | Field meta information, including field name, formatting, etc. | () => [Meta\[\]](/docs/api/general/S2DataConfig#meta)                                                                                                                                        |                                                                      |
| originData                                | Raw data                                                       | () => [DataType\[\]](#datatype)                                                                                                                                                              |                                                                      |
| totalData                                 | summary data                                                   | () => [DataType\[\]](#datatype)                                                                                                                                                              |                                                                      |
| indexesData                               | multidimensional index data                                    | () => [DataType\[\]](#datatype)                                                                                                                                                              |                                                                      |
| sortParams                                | sort configuration                                             | () => [SortParams](/docs/api/general/S2DataConfig#sortparams)                                                                                                                                |                                                                      |
| spreadsheet                               | Form example                                                   | () => [SpreadSheet](/docs/api/basic-class/spreadsheet)                                                                                                                                       |                                                                      |
| getFieldMeta                              | Get field metadata information                                 | (field: string, meta?: [Meta\[\]](/docs/api/general/S2DataConfig#meta) ) => [Meta](/docs/api/general/S2DataConfig#meta)                                                                      |                                                                      |
| getFieldName                              | get field name                                                 | `() => string`                                                                                                                                                                               |                                                                      |
| getFieldFormatter                         | Get the field formatting function                              | `() => (v: string) => unknown`                                                                                                                                                               |                                                                      |
| getFieldDescription                       | Get field description                                          | `() => string`                                                                                                                                                                               |                                                                      |
| setDataCfg                                | Set data configuration                                         | `<T extends boolean = false>(dataCfg: T extends true ?` [`S2DataConfig`](/docs/api/general/S2DataConfig) `: Partial<`[`S2DataConfig`](/docs/api/general/S2DataConfig)`>, reset?: T) => void` | The `reset` parameter needs to be used in `@antv/s2^1.34.0` version |
| getDisplayDataSet                         | Get the currently displayed dataset                            | () => [DataType\[\]](#datatype)                                                                                                                                                              |                                                                      |
| getDimensionValues                        | get dimension value                                            | (filed: string, query?: [DataType](#datatype) ) => string\[]                                                                                                                                 |                                                                      |
| getCellData                               | Get a single cell data                                         | (params: [CellDataParams](#celldataparams) ) => [DataType\[\]](#datatype)                                                                                                                    |                                                                      |
| getMultiData                              | Get bulk cell data                                             | (query: [DataType](#datatype),params?: [MultiDataParams](#multidataparams)) => [DataType[]](#datatype)                                                                                       |                                                                      |
| <strike>getMultiData</strike>(deprecated) | Get bulk cell data                                             | (query: [DataType](#datatype) , isTotals?: boolean, isRow?: boolean, drillDownFields?: string\[], includeTotalData:boolean) => [DataType\[\]](#datatype)                                     |                                                                      |
| moreThanOneValue                          | Is there more than 1 value                                     | () => [ViewMeta](#viewmeta)                                                                                                                                                                  |                                                                      |

### DataType

```ts
type DataType = Record<string, unknown>;
```

### CellDataParams

```ts
interface CellDataParams {
  // search query
  query: DataType;
  isTotals?: boolean;
  // use in part drill-down
  rowNode?: Node;
  // mark row's cell
  isRow?: boolean;
}
```

### MultiDataParams

```ts
interface MultiDataParams {
  drillDownFields?: string[]; // drill down dimensions
  queryType?: QueryDataType; // query type, get all data by default
}

enum QueryDataType {
  All = 'all', // get all data, include total data
  DetailOnly = 'detailOnly', // only get detail data
}
```
