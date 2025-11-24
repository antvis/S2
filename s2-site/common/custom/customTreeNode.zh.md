---
title: 自定义树状结构
order: 8
---

#### CustomTreeNode

功能描述：自定义树状结构的配置，适用于透视表和明细表的自定义行列头。查看 [文档](/manual/advanced/custom/custom-header) 和 [示例](/examples/layout/custom-header-group/#custom-pivot-row-header)

| 参数 | 说明 | 类型 | 默认值 | 必选  |
| --- | --- | --- | --- | :-:  |
| field | 当前节点唯一标识 | `string` |    | ✓ |
| title | 当前节点展示名 | `string` |    | ✓ |
| collapsed | 节点是否收起（树状模式下，行头非叶子节点有效） | `boolean` |  `false`  |  |
| description | 节点的额外描述信息，在对应行头的 tooltip 中展示 | `string` |    |  |
| children | 子节点 | [CustomTreeNode[]](#customtreenode) |    |  |

##### CustomHeaderField

```ts
type CustomHeaderField = CustomTreeNode | string;
```
