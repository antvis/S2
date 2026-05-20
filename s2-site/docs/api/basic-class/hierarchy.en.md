---
title: Hierarchy
order: 8

---

Description: Node hierarchy structure. [Details](https://github.com/antvis/S2/blob/next/packages/s2-core/src/facet/layout/hierarchy.ts)

```ts
hierarchy.sampleNodesForAllLevels
```

| Name | Description | Type |
| --- | --- | --- |
| rows | Row header dimension fields | `string[]` |
| width | The width of the hierarchy | `number` |
| height | The height of the hierarchy | `number` |
| maxLevel | The maximum level of the hierarchy | `number` |
| sampleNodesForAllLevels | Sample nodes for all levels | [Node](/en/api/basic-class/node)[] |
| sampleNodeForLastLevel | Sample node for the last level | [Node](/en/api/basic-class/node) |
| allNodesWithoutRoot | All nodes except the root node | [Node](/en/api/basic-class/node)[] |
| indexNode | Index nodes | [Node](/en/api/basic-class/node)[] |
| getLeaves | Gets all leaf nodes | () => [Node](/en/api/basic-class/node)[] |
| getNodes | Gets nodes at a specified level | (level?: number) => [Node](/en/api/basic-class/node)[] |
| getNodesLessThanLevel | Gets nodes at a level less than the specified level | (lessThanLevel: number) => [Node](/en/api/basic-class/node)[] |
| pushNode | Pushes a node | (node: [Node](/en/api/basic-class/node), insetIndex: number) => void |
| pushIndexNode | Pushes an index node | (node: [Node](/en/api/basic-class/node)) => void |
| getIndexNodes | Gets index nodes | () => [Node](/en/api/basic-class/node)[] |
