---
title: custom tree item
order: 8
---

### CustomTreeNode

Function description: Customize the configuration of the tree structure. View [detailed instructions](/zh/docs/manual/advanced/custom/custom-tree) or [examples](/zh/examples/custom/custom-tree#custom-tree)

| parameter   | illustrate                                                                                                      | type                                  | Defaults | required |
| ----------- | --------------------------------------------------------------------------------------------------------------- | ------------------------------------- | -------- | :------: |
| key         | The unique identifier of the current node                                                                       | `string`                              |          |     ✓    |
| title       | current node display name                                                                                       | `string`                              |          |     ✓    |
| collapsed   | Whether the node is collapsed (in tree mode, non-leaf nodes at the head of the line are valid)                  | `boolean`                             | `false`  |          |
| description | The additional description information of the node is displayed in the tooltip of the corresponding line header | `string`                              |          |          |
| children    | child node                                                                                                      | [CustomTreeNode\[\]](#customtreenode) |          |          |
