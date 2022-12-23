---
title: Tooltip
order: 4
---

## Tooltips

object is **required** , *default: null* Function description: tooltip configuration

| parameter          | illustrate                                                                                                                                                                          | type                                                                                       | Defaults        | required |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | --------------- | :------: |
| showTooltip        | Whether to display tooltip                                                                                                                                                          | `boolean`                                                                                  | `true`          |          |
| operation          | tooltip operation configuration item                                                                                                                                                | [Tooltip Operation](#tooltipoperation)                                                     | -               |          |
| row                | line configuration                                                                                                                                                                  | [BaseTooltipConfig](#basetooltipconfig)                                                    | -               |          |
| col                | Header configuration                                                                                                                                                                | [BaseTooltipConfig](#basetooltipconfig)                                                    | -               |          |
| data               | Value configuration                                                                                                                                                                 | [BaseTooltipConfig](#basetooltipconfig)                                                    | -               |          |
| the corner         | Corner configuration                                                                                                                                                                | [BaseTooltipConfig](#basetooltipconfig)                                                    | -               |          |
| renderTooltip      | To customize the entire tooltip, you can inherit BaseTooltip and rewrite some methods yourself                                                                                      | [RenderTooltip](#rendertooltip)                                                            | -               |          |
| content            | Customize tooltip content                                                                                                                                                           | \`React.ReactNode                                                                          | Element         |  string  |
| autoAdjustBoundary | Automatically adjust the display position when the tooltip exceeds the boundary, container: the chart area, body: the entire browser window, set to `null` to disable this function | `container` \| `body`                                                                      | `body`          |          |
| adjustPosition     | Customize tooltip position,                                                                                                                                                         | (positionInfo: [TooltipPositionInfo](#tooltippositioninfo) ) => {x: number, y: number}     |                 |          |
| getContainer       | Customize the tooltip to mount the container,                                                                                                                                       | `() => HTMLElement`                                                                        | `document.body` |          |
| className          | additional container class names,                                                                                                                                                   | `string`                                                                                   | -               |          |
| style              | additional container styles,                                                                                                                                                        | [CSSProperties](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Properties_Reference) | -               |          |

### BaseTooltipConfig

| parameter   | illustrate                           | type                                   | Defaults | required |
| ----------- | ------------------------------------ | -------------------------------------- | -------- | :------: |
| showTooltip | Whether to display tooltip           | `boolean`                              | `false`  |          |
| operation   | tooltip operation configuration item | [Tooltip Operation](#tooltipoperation) | -        |          |
| content     | Customize tooltip content            | \`React.ReactNode                      | Element  |  string  |

### TooltipPositionInfo

| parameter | illustrate                                                                                      | type                                | Defaults | required |
| --------- | ----------------------------------------------------------------------------------------------- | ----------------------------------- | -------- | :------: |
| position  | The default tooltip position coordinate after calculation (default offset + autoAdjustBoundary) | [TooltipPosition](#tooltipposition) |          |     ✓    |
| event     | Current click event information                                                                 | event                               |          |     ✓    |

### Tooltip Operation

object is **required** , *default: null* Function description: tooltip operation configuration item

| parameter     | illustrate                                              | type                                         | Defaults | required |
| ------------- | ------------------------------------------------------- | -------------------------------------------- | -------- | :------: |
| hiddenColumns | Whether to enable hidden columns (leaf nodes are valid) | `boolean`                                    | `false`  |          |
| sort          | Whether to enable sorting within the group              | `boolean`                                    | `false`  |          |
| tableSort     | Whether to enable sorting of list column headers        | `boolean`                                    | `false`  |          |
| menus         | Custom Action Configuration Items                       | `boolean`                                    | `-`      |          |
| onClick       | Action item click callback function                     | `({ item, key, keyPath, domEvent }) => void` | `-`      |          |
