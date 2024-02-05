---
title: Node
order: 5
---

Function description: layout node. [details](https://github.com/antvis/S2/blob/next/packages/s2-core/src/facet/layout/node.ts)

```ts
node.isTotals // false
```

| parameter         | illustrate                             | type                                             |
| ----------------- | -------------------------------------- | ------------------------------------------------ |
| id                | node id                                | `string`                                         |
| key               | node key                               | `string`                                         |
| value             | node value                             | `string`                                         |
| level             | node level                             | `number`                                         |
| rowIndex          | row header index                       | `number`                                         |
| colIndex          | header index                           | `number`                                         |
| parents           | parent node                            | [node](/docs/api/basic-class/node)               |
| isTotals          | Is it summary                          | `boolean`                                        |
| isSubTotals       | Is it a subtotal                       | `boolean`                                        |
| isGrandTotals     | Is it total                            | `boolean`                                        |
| isCollapsed       | Whether to expand                      | `boolean`                                        |
| hierarchy         | hierarchical structure                 | [Hierarchy](#)                                   |
| isPivotMode       | Is it a pivot table                    | `boolean`                                        |
| seriesNumberWidth | Serial number width                    | `number`                                         |
| field             | The field corresponding to dataCfg     | `string`                                         |
| spreadsheet       | Form example                           | [SpreadSheet](/docs/api/basic-class/spreadsheet) |
| query             | Data corresponding to the current node | `Record<string, any>`                            |
| belongs to Cell   | corresponding cell                     | [S2CellType](/docs/api/basic-class/base-cell)    |
| isTotalMeasure    | Is it a numerical subtotal             | `boolean`                                        |
| inCollapseNode    | Whether to expand the node             | `boolean`                                        |
| isLeaf            | Is it a leaf node                      | `boolean`                                        |
| x                 | x-axis coordinate                      | `number`                                         |
| the y             | y-axis coordinates                     | `number`                                         |
| width             | width                                  | `number`                                         |
| height            | high                                   | `number`                                         |
| padding           | spacing                                | `number`                                         |
| children          | child node                             | [Node\[\]](/docs/api/basic-class/node)           |
