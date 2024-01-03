---
title: Hierarchy
order: 8
tag: New
---

功能描述：节点层级结构。[详情](https://github.com/antvis/S2/blob/next/packages/s2-core/src/facet/layout/hierarchy.ts)

```ts
hierarchy.sampleNodesForAllLevels
```

| 参数 | 说明 | 类型 |
| --- | --- | --- |
| rows | 行头维度字段 | `string[]` |
| width | 层级宽度 | `number` |
| height | 层级高度 | `number` |
| maxLevel | 层级最大层级 | `number` |
| sampleNodesForAllLevels | 所有层级的采样节点 | [Node](/docs/api/basic-class/node)[] |
| sampleNodeForLastLevel | 最大层级的采样节点 | [Node](/docs/api/basic-class/node) |
| allNodesWithoutRoot | 除根节点的所有节点 | [Node](/docs/api/basic-class/node)[] |
| indexNode | 索引节点 | [Node](/docs/api/basic-class/node)[] |
| getLeaves | 获取所有叶子节点 | () => [Node](/docs/api/basic-class/node)[] |
| getNodes | 获取节点 | (level?: number) => [Node](/docs/api/basic-class/node)[] |
| getNodesLessThanLevel | 获取小于指定层级的节点 | (lessThanLevel: number) => [Node](/docs/api/basic-class/node)[] |
| pushNode | 添加节点 | (node: [Node](/docs/api/basic-class/node), insetIndex: number) => void |
| pushIndexNode | 添加索引节点 | (node: [Node](/docs/api/basic-class/node)) => void |
| getIndexNodes | 获取索引节点 | () => [Node](/docs/api/basic-class/node)[] |
