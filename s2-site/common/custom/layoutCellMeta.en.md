---
title: Custom Cell Meta
order: 3
---

## LayoutCellMeta

```js
LayoutCellMeta = (spreadsheet: SpreadSheet, getCellData: GetCellMeta) => GetCellMeta
```

Function description: custom data

| parameter   | type                                             | required | Defaults | Functional description                                               |
| ----------- | ------------------------------------------------ | -------- | -------- | -------------------------------------------------------------------- |
| spreadsheet | [SpreadSheet](/docs/api/basic-class/spreadsheet) | ✓        |          | Table class instance, which can access any configuration information |
| getCellData | [GetCellMeta](#viewmeta)                         | ✓        |          | Get information such as cell data and position                       |

```ts
type GetCellMeta = (rowIndex?: number, colIndex?: number) => ViewMeta;
```
