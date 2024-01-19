---
title: BaseDataSet
order: 5
---

功能描述：表格数据集。[详情](https://github.com/antvis/S2/blob/next/packages/s2-core/src/data-set/pivot-data-set.ts)

```ts
s2.dataSet.getFieldName('type')
```

| 参数                                   | 说明                               | 类型                                                                                                                                                                                         | 版本                                        |
| -------------------------------------- | ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| fields                                 | 字段信息                           | () => [Fields](/docs/api/general/S2DataConfig#fields)                                                                                                                                        |                                             |
| meta                                   | 字段元信息，包含有字段名、格式化等 | () => [Meta[]](/docs/api/general/S2DataConfig#meta)                                                                                                                                          |                                             |
| originData                             | 原始数据                           | () => [DataType[]](#datatype)                                                                                                                                                                |                                             |
| totalData                              | 汇总数据                           | () => [DataType[]](#datatype)                                                                                                                                                                |                                             |
| indexesData                            | 多维索引数据                       | () => [DataType[]](#datatype)                                                                                                                                                                |                                             |
| sortParams                             | 排序配置                           | () => [SortParams](/docs/api/general/S2DataConfig#sortparams)                                                                                                                                |                                             |
| spreadsheet                            | 表格实例                           | () => [SpreadSheet](/docs/api/basic-class/spreadsheet)                                                                                                                                       |                                             |
| getFieldMeta                           | 获取字段元数据信息                 | (field: string, meta?: [Meta[]](/docs/api/general/S2DataConfig#meta)) => [Meta](/docs/api/general/S2DataConfig#meta)                                                                         |                                             |
| getFieldName                           | 获取字段名                         | `() => string`                                                                                                                                                                               |                                             |
| getFieldFormatter                      | 获取字段格式化函数                 | `() => (v: string) => unknown`                                                                                                                                                               |                                             |
| getFieldDescription                    | 获取字段描述                       | `() => string`                                                                                                                                                                               |                                             |
| setDataCfg                             | 设置数据配置                       | `<T extends boolean = false>(dataCfg: T extends true ?` [`S2DataConfig`](/docs/api/general/S2DataConfig) `: Partial<`[`S2DataConfig`](/docs/api/general/S2DataConfig)`>, reset?: T) => void` | `reset` 参数需在 `@antv/s2-v1.34.0`版本使用 |
| getDisplayDataSet                      | 获取当前显示的数据集               | () => [DataType[]](#datatype)                                                                                                                                                                |                                             |
| getDimensionValues                     | 获取维值                           | (filed: string, query?: [DataType](#datatype) ) => string[]                                                                                                                                  |                                             |
| getCellData                            | 获取单个的单元格数据               | (params: [CellDataParams](#celldataparams)) => [DataType[]](#datatype)                                                                                                                       |                                             |
| getMultiData                           | 获取批量的单元格数据               | (query: [DataType](#datatype),params?: [MultiDataParams](#multidataparams)) => [DataType[]](#datatype)                                                                                       |                                             |
| <strike>getMultiData<strike>  （已废弃） | 获取批量的单元格数据               | (query: [DataType](#datatype), isTotals?: boolean, isRow?: boolean, drillDownFields?: string[], includeTotalData:boolean) => [DataType[]](#datatype)                                         |                                             |
| moreThanOneValue                       | 是否超过 1 个数值                  | () => [ViewMeta](#viewmeta)                                                                                                                                                                  |                                             |
| isEmpty                                | 是否为空数据集                     | () => `boolean`                                                                                                                                                                              | `@antv/s2-v1.51.1`                          |

### DataType

```ts
type DataType = Record<string, unknown>;
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
}
```

### GetCellMultiDataParams

```ts
interface GetCellMultiDataParams {
  /**
   * 查询条件
   */
  query: Query;

  /**
   * 汇总
   */
  totals?: TotalSelectionsOfMultiData;

  /**
   * 下钻
   */
  drillDownFields?: string[];

  /**
   * 获取数据的类型，默认获取所有的数据
  */
  queryType?: QueryDataType;
}

enum QueryDataType {
  All = 'all', // 获取所有的数据
  DetailOnly = 'detailOnly', // 只需要明细数据
}

```

`markdown:docs/common/custom/customTreeNode.zh.md`
