---
title: 自定义树状结构
order: 8
---

## CustomTreeNode

功能描述：自定义树状结构的配置。查看 [详细说明](/zh/docs/manual/advanced/custom/custom-tree) 或 [例子](/zh/examples/custom/custom-tree#custom-tree)

| 参数 | 说明 | 类型 | 默认值 | 必选  |
| --- | --- | --- | --- | :-:  |
| key | 当前节点唯一标识 | `string` |    | ✓ |
| title | 当前节点展示名 | `string` |    | ✓ |
| collapsed | 节点是否收起（树状模式下，行头非叶子节点有效） | `boolean` |  `false`  |  |
| description | 节点的额外描述信息，在对应行头的 tooltip 中展示 | `string` |    |  |
| children | 子节点 | [CustomTreeNode[]](#customtreenode) |    |  |
