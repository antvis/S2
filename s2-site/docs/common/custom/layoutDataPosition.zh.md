---
title: 自定义单元格
order: 3
---

## LayoutDataPosition

```js
LayoutDataPosition = (spreadsheet: SpreadSheet, getCellData: GetCellMeta) => GetCellMeta
```

功能描述：自定义数据

| 参数 | 类型 | 必选  | 默认值 | 功能描述 |
| --- | --- | --- | ---  | --- |
| spreadsheet | [SpreadSheet](/docs/api/basic-class/spreadsheet) | ✓ |    | 表类实例，可以访问任意的配置信息 |
| getCellData | [GetCellMeta](#viewmeta) | ✓ |    | 获取单元格数据和位置等信息|

```ts
type GetCellMeta = (rowIndex?: number, colIndex?: number) => ViewMeta;
```
