---
title: 自定义树结构
order: 8
---

## CustomTreeItem

[详细说明](/zh/docs/manual/advanced/custom/category-tree) [例子](//s2.antv.vision/zh/examples/custom/custom-tree#custom-tree)

功能描述：自定义树状结构的配置，兼容 [antd Tree](https://ant.design/components/tree-cn/) 数据配置项；

| 参数 | 说明 | 类型 | 默认值 | 必选  |
| --- | --- | --- | --- | :-:  |
| key | 当前节点唯一标识 | `string` |    | ✓ |
| title | 当前节点展示名 | `string` |    | ✓ |
| collapsed | 节点是否收起（只会在自身代表非叶子节点生效） | `boolean` |  `false`  |  |
| description | 节点的额外描述信息 | `string` |    |  |
| children | 子节点 | `CustomTreeItem[]` |    |  |
