---
title: layout hierarchy
order: 1
---

## Layout Hierarchy

```js
LayoutHierarchy = (spreadsheet: SpreadSheet, node: Node) => LayoutHierarchyReturnType;
```

Function description: custom hierarchical structure

| parameter   | type                                                | required | Defaults | Functional description                                               |
| ----------- | --------------------------------------------------- | :------: | -------- | -------------------------------------------------------------------- |
| spreadsheet | [SpreadSheet](/zh/docs/api/basic-class/spreadsheet) |     ✓    |          | Table class instance, which can access any configuration information |
| node        | [node](/zh/docs/api/basic-class/node)               |     ✓    |          | The currently rendered node node                                     |

```ts
interface LayoutHierarchyReturnType {
  push?: Node[];
  unshift?: Node[];
  delete?: boolean;
}
```
