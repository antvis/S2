---
title: custom tree item
order: 8
---

### CustomTreeNode

Function description: Customize the configuration of the tree structure. View [detailed instructions](/manual/advanced/custom/custom-header) or [examples](/examples/custom/custom-layout#custom-layout-hierarchy)

| parameter   | illustrate                                                                                                      | type                                  | Defaults | required |
| ----------- | --------------------------------------------------------------------------------------------------------------- | ------------------------------------- | -------- | :------: |
| key         | The unique identifier of the current node                                                                       | `string`                              |          |     ✓    |
| title       | current node display name                                                                                       | `string`                              |          |     ✓    |
| collapsed   | Whether the node is collapsed (in tree mode, non-leaf nodes at the head of the line are valid)                  | `boolean`                             | `false`  |          |
| description | The additional description information of the node is displayed in the tooltip of the corresponding line header | `string`                              |          |          |
| children    | child node                                                                                                      | [CustomTreeNode\[\]](#customtreenode) |          |          |
