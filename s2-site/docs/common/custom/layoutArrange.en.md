---
title: layout arrange
order: 1
---

## LayoutArrange

```js
LayoutArrange = (spreadsheet: SpreadSheet, parent: Node, field: string, fieldValues: string[]) => string[];
```

Function description: custom order

| parameter   | type                                             | required | Defaults | Functional description                                               |
| ----------- | ------------------------------------------------ | -------- | -------- | -------------------------------------------------------------------- |
| spreadsheet | [SpreadSheet](/docs/api/basic-class/spreadsheet) | ✓        |          | Table class instance, which can access any configuration information |
| node        | [node](/docs/api/basic-class/node)               | ✓        |          | The currently rendered node node                                     |
| field       | `string`                                         | ✓        |          | current field name                                                   |
| fieldValues | `string[]`                                       | ✓        |          | current field value                                                  |
