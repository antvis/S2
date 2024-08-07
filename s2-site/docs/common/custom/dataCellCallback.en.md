---
title: data-cell
order: 11
---

## DataCellCallback

```js | pure
DataCellCallback = (viewMeta: ViewMeta, s2: Spreadsheet) => G.Group;
```

Function description: custom value cell, [ViewMeta](#viewmeta)

<embed src="@/docs/common/view-meta.zh.md"></embed>

<embed src="@/docs/common/custom/cellCallBack.zh.md"></embed>

## CornerHeaderCallback

```js | pure
CornerHeaderCallback = (parent: S2CellType, spreadsheet: SpreadSheet, ...restOptions: unknown[]) => void;
```

Function description: custom corner head

| parameter   | type                        | required | Defaults | Functional description                                               |
| ----------- | --------------------------- | :------: | -------- | -------------------------------------------------------------------- |
| parents     | [S2CellType](#s2celltype)   |     ✓    |          | parent cell                                                          |
| spreadsheet | [SpreadSheet](#spreadsheet) |     ✓    |          | Table class instance, which can access any configuration information |
| restOptions | `unknown[]`                 |          |          | Indeterminate parameters, pass additional information                |
