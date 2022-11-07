---
title: BaseDataSet
order: 5
---

功能描述：表格数据集。[详情](https://github.com/antvis/S2/blob/master/packages/s2-core/src/data-set/pivot-data-set.ts)

```ts
s2.dataSet
```

| 参数 | 说明 | 类型 |
| --- | --- | --- |
| fields | 字段信息 | () => [Fields](/zh/docs/api/general/S2DataConfig#fields) |
| meta | 字段元信息，包含有字段名、格式化等 | () => [Meta[]](/zh/docs/api/general/S2DataConfig#meta) |
| originData | 原始数据 | () => [DataType[]](#datatype) |
| indexesData | 多维索引数据 | () => [DataType[]](#datatype)  |
| sortParams | 排序配置 | () => [SortParams](/zh/docs/api/general/S2DataConfig#sortparams) |
| spreadsheet | 表格实例 | () => [SpreadSheet](/zh/docs/api/basic-class/spreadsheet) |
| getFieldMeta | 获取字段元数据信息 | (field: `string` \| [CustomTreeNode](#customtreenode), meta?: [Meta[]](/zh/docs/api/general/S2DataConfig#meta)) => [Meta](/zh/docs/api/general/S2DataConfig#meta) |
| getFieldName | 获取字段名 | (field: `string` \| [CustomTreeNode](#customtreenode), defaultValue?: `string`) => `string` |
| getFieldFormatter | 获取字段格式化函数 | (field: `string` \| [CustomTreeNode](#customtreenode)) => [Formatter](#formatter) |
| getFieldDescription | 获取字段描述 | (field: `string` | [CustomTreeNode](#customtreenode)) => string |
| getCustomRowFieldName | 获取自定义单元格字段名称 | (cell: [S2CellType](/zh/docs/api/basic-class/base-cell#s2celltype)) => `string` |
| getCustomFieldDescription | 获取自定义单元格字段描述 | (cell: [S2CellType](/zh/docs/api/basic-class/base-cell#s2celltype)) => `string`|
| setDataCfg | 设置数据配置 | (dataCfg: [S2DataConfig](/zh/docs/api/general/S2DataConfig)) => void |
| getDisplayDataSet | 获取当前显示的数据集 | () => [DataType[]](#datatype)  |
| getDimensionValues | 获取维值 | (filed: string, query?: [DataType](#datatype) ) => string[] |
| getCellData | 获取单个的单元格数据 | (params: [CellDataParams](#celldataparams)) => [DataType[]](#datatype) |
| getMultiData | 获取批量的单元格数据 | (query: [DataType](#datatype), isTotals?: boolean, isRow?: boolean, drillDownFields?: string[]) => [DataType[]](#datatype)|
| moreThanOneValue | 是否超过 1 个数值 | () => [ViewMeta](#viewmeta) |

### Formatter

```ts
type Formatter = (
  value: unknown,
  data?: Data | Data[],
  meta?: Node | ViewMeta,
) => string;
```

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

`markdown:docs/common/custom/customTreeNode.zh.md`
