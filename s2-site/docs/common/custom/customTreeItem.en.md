---
title: custom tree item
order: 8
---

### CustomTreeItem

[Detailed](/docs/manual/advanced/custom/category-tree) [example](/examples/custom/custom-tree#custom-tree)

Function description: custom tree structure configuration, compatible with [antd Tree](https://ant.design/components/tree-cn/) data configuration items;

| parameter   | illustrate                                                                                                      | type                                    | Defaults | required |
| ----------- | --------------------------------------------------------------------------------------------------------------- | --------------------------------------- | -------- | :------: |
| key         | The unique identifier of the current node                                                                       | `string`                                |          |     ✓    |
| title       | current node display name                                                                                       | `string`                                |          |     ✓    |
| collapsed   | Whether the node is collapsed (it will only take effect when it represents a non-leaf node)                     | `boolean`                               | `false`  |          |
| description | The additional description information of the node is displayed in the tooltip of the corresponding line header | `string`                                |          |          |
| children    | child node                                                                                                      | [CustomTreeItem\[\]](#custom-tree-item) |          |          |
