---
title: CellData
order: 10

---

Description: Pivot table data cell metadata. [Details](https://github.com/antvis/S2/blob/next/packages/s2-core/src/data-set/cell-data.ts)

```ts
this.meta.data
```

| Name | Description | Type |
| --- | --- | --- |
| extraField | Virtual measure field | `string` |
| raw | Raw data | [RawData](#rawdata) |
| getValueByField | Gets the value | (field: `string`) => [DataItem](#dataitem) |
| $$value$$ | The value of the measure (internal use) | [DataItem](#dataitem) |
| $$extra$$ | Virtual measure field (internal use, equivalent to `extraField`) | `string` |
| $$origin$$ | Raw data (internal use, equivalent to `raw`) | [RawData](#rawdata) |

## Static Methods

```ts | pure
import { CellData } from '@antv/s2'
```

### getCellData

```ts
CellData.getCellData(raw: RawData, extraField: string)
```

### getCellDataList

```ts
CellData.getCellDataList(raw: RawData, extraFields: string[])
```

### getFieldValue

```ts
CellData.getFieldValue(data: ViewMetaData, field?: string)
```

<embed src="@/common/view-meta.en.md"></embed>
