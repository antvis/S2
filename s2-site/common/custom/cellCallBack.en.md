---
title: cell callback
order: 7
---

## Cell Callback

```js
CellCallback = (node: Node, spreadsheet: SpreadSheet, ...restOptions: unknown[]) => G.Group;
```

Function description: custom cell

| parameter   | type                        | required | Defaults | Functional description                                               |
| ----------- | --------------------------- | -------- | -------- | -------------------------------------------------------------------- |
| node        | [node](#node)               | ✓        |          | The currently rendered node node                                     |
| spreadsheet | [SpreadSheet](#spreadsheet) | ✓        |          | Table class instance, which can access any configuration information |
| restOptions | `unknown[]`                 |          |          | Indeterminate parameters, pass additional information                |
