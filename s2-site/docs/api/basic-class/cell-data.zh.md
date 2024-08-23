---
title: CellData
order: 10
tag: New
---

功能描述：透视表数值单元格元数据。[详情](https://github.com/antvis/S2/blob/next/packages/s2-core/src/data-set/cell-data.ts)

```ts
this.meta.data
```

| 参数 | 说明 | 类型 |
| --- | --- | --- |
| extraField | `string` | 虚拟度量字段 |
| raw | 原始数据 | [RawData](#rawdata) |
| getValueByField | 获取数值 | (field: `string`) => [DataItem](#dataitem) |
| $$value$$ | 指标值（内部使用） | [DataItem](#dataitem) |
| $$extra$$ | 虚拟度量字段 （内部使用，等价于 `extraField`) | `string` |
| $$origin$$ | 原始数据 （内部使用，等价于 `raw`) | [RawData](#rawdata) |

## 静态方法

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

<embed src="@/docs/common/view-meta.zh.md"></embed>
