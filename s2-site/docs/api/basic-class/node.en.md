---
title: Node
order: 5
---

Function description: layout node. [details](https://github.com/antvis/S2/blob/next/packages/s2-core/src/facet/layout/node.ts)

```ts
node.isTotals // false
```

| parameter | illustrate | type |
| --- | --- | --- |
| id | node id (if dimension value is empty, `null` will be converted to `$$null$$` for internal identification of original dimension value) | `string` |
| field | node key | `string` |
| value | node value | `string` |
| level | node level | `number` |
| rowIndex | row header index | `number` |
| colIndex | column header index | `number` |
| parent | parent node | [Node](/en/api/basic-class/node) |
| isTotals | Is it a totals node | `boolean` |
| isSubTotals | Is it a subtotal | `boolean` |
| isGrandTotals | Is it a grand total | `boolean` |
| isCollapsed | Whether is collapsed | `boolean` |
| hierarchy | hierarchical structure | [Hierarchy](/en/api/basic-class/hierarchy) |
| isPivotMode | Is it a pivot table | `boolean` |
| seriesNumberWidth | Series number width | `number` |
| field | The field corresponding to dataCfg | `string` |
| spreadsheet | Table instance | [SpreadSheet](/en/api/basic-class/spreadsheet)  |
| query | Query condition for current node [details](/en/manual/advanced/get-cell-data) | `Record<string, any>` |
| belongsCell | Cell corresponding to current node | [S2CellType](/en/api/basic-class/base-cell)  |
| isTotalMeasure | Is it a measure subtotal | `boolean` |
| isCollapseNode | Whether is a collapse node | `boolean` |
| isSeriesNumberNode | Whether is a series number column node | () => `boolean` |
| isLeaf | Is it a leaf node | `boolean` |
| x | x-axis coordinate | `number` |
| y | y-axis coordinate | `number` |
| width | width | `number` |
| height | height | `number` |
| padding | padding | `number` |
| children | child nodes | [Node[]](/en/api/basic-class/node)  |
| extra | additional node info | `Record<string, any>` |
| relatedNode | Used for series number cells to identify the row header node corresponding to the series number cell; used in frozen row header scenarios | [Node[]](/en/api/basic-class/node)  |
