---
title: Custom Tooltip
order: 5
---

## TooltipShowOptions

object is **required** , *default: null* Function description: tooltip display configuration

| parameter | type                                                                                                       | required | Defaults | Functional description     |
| --------- | ---------------------------------------------------------------------------------------------------------- | -------- | -------- | -------------------------- |
| position  | [TooltipPosition](#tooltipposition)                                                                        | ✓        |          | tooltip display location   |
| data      | [TooltipData](#tooltipdata)                                                                                |          |          | tooltip data               |
| cellInfos | `Record<string, any>`                                                                                      |          |          | cell information           |
| options   | [TooltipOptions](#tooltipoptions)                                                                          |          |          | Tooltip part configuration |
| content   | `ReactNode \| string` \| or `(cell, defaultTooltipShowOptions: TooltipShowOptions) => ReactNode \| string` |          |          | Customize tooltip content  |
| event     | `Event`                                                                                                    |          |          | Current event Event        |

### TooltipPosition

object is **required** , *default: null* Function description: tooltip coordinates

| parameter | type     | required | Defaults | Functional description |
| --------- | -------- | -------- | -------- | ---------------------- |
| x         | `number` | ✓        |          | Abscissa               |
| the y     | `number` | ✓        |          | Y-axis                 |

### TooltipData

object **optional** , *default: null* function description: tooltip data

| parameter | type                                            | required | Defaults | Functional description                                                            |
| --------- | ----------------------------------------------- | -------- | -------- | --------------------------------------------------------------------------------- |
| summaries | [TooltipSummaryOptions](#tooltipsummaryoptions) |          |          | List of selected item statistics (differentiated by measure value)                |
| details   | [ListItem](#listitem)                           |          |          | Data Point Details                                                                |
| headInfo  | [TooltipHeadInfo](#tooltipheadinfo)             |          |          | list of axes (row/column headers)                                                 |
| name      | `string`                                        |          |          | current cell name                                                                 |
| tips      | `string`                                        |          |          | Tips/Instructions                                                                 |
| infos     | `string`                                        |          |          | Prompt information at the bottom (can be used for shortcut key operation prompts) |

#### TooltipSummaryOptions

object is **optional** , *default: null* Function description: tooltip List of selected item statistics (differentiated by measurement value)

| parameter    | type                  | required | Defaults | Functional description       |
| ------------ | --------------------- | -------- | -------- | ---------------------------- |
| name         | `string`              | ✓        |          | name                         |
| value        | `number \| string`    | ✓        |          | value                        |
| selectedData | `Record<string, any>` | ✓        |          | currently selected data list |

#### TooltipHeadInfo

object **optional** , *default: null* function description: tooltip axis (row/column header) list

| parameter | type                  | required | Defaults | Functional description |
| --------- | --------------------- | -------- | -------- | ---------------------- |
| rows      | [ListItem](#listitem) | ✓        |          | List of outfits        |
| cols      | [ListItem](#listitem) | ✓        |          | header list            |

#### ListItem

object **optional** , *default: null* function description: tooltip data point detail data

| parameter | type               | required | Defaults | Functional description |
| --------- | ------------------ | -------- | -------- | ---------------------- |
| name      | `string`           | ✓        |          | name                   |
| value     | `string \| number` | ✓        |          | value                  |
| icon      | `ReactNode`        |          |          | custom icon component  |

### TooltipOptions

object is **required** , *default: null* Function description: tooltip partial configuration

| parameter      | type                                              | required | Defaults | Functional description                        |
| -------------- | ------------------------------------------------- | -------- | -------- | --------------------------------------------- |
| hideSummary    | `boolean`                                         |          | `false`  | Whether to hide selected item statistics      |
| operator       | [TooltipOperatorOptions](#tooltipoperatoroptions) |          |          | Action Bar Configuration                      |
| onlyShowOperator       | `boolean`                                         |          | `false`  | Whether tooltip only shows action menu items  |
| isTotals       | `boolean`                                         |          | `false`  | Is it a total/subtotal cell                   |
| onlyShowCellText | `boolean`                                         |          | `false`  | Whether to display cell prompt information    |
| enableFormat   | `boolean`                                         |          | `false`  | Whether to enable formatting                  |
| forceRender    | `boolean`                                         |          | `false`  | Whether to force the dom to be cleared        |

#### TooltipOperatorOptions

object **optional** , *default: null* Function description: tooltip operation bar configuration

| parameter           | type                                            | required | Defaults | Functional description                                                                                                                                               |
| ------------------- | ----------------------------------------------- | -------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| menus               | [TooltipOperatorMenu\[\]](#tooltipoperatormenu) |          |          | action item list                                                                                                                                                     |
| onClick             | `({ item, key, keyPath, domEvent }) => void`    |          |          | Click event, transparently transmit [onClick](https://ant.design/components/menu-cn/#Menu) of `antd` `Menu` component                                                |
| defaultSelectedKeys | `string[]`                                      |          |          | Initially selected menu item key array, transparently transmit the [defaultSelectedKeys](https://ant.design/components/menu-cn/#Menu) of the `antd` `Menu` component |

##### TooltipOperatorMenu

object is **required** , *default: null* Function description: tooltip list of operation items

| parameter | type                                                                 | required | Defaults | Functional description                                                                                                                  |
| --------- | -------------------------------------------------------------------- | -------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| key       | `string`                                                             | ✓        |          | Uniquely identifies                                                                                                                     |
| text      | `ReactNode \| string`                                                |          |          | name                                                                                                                                    |
| icon      | `ReactNode \| string`                                                |          |          | custom icon                                                                                                                             |
| visible   | `boolean \| (cell) => boolean`                                       |          | `true`   | Whether the operation item is displayed, you can pass in a function to dynamically display it according to the current cell information |
| onClick   | ( `cell` : [S2CellType](/docs/api/basic-class/base-cell) : ) => void |          |          | Click event callback (cell is the cell corresponding to the current tooltip)                                                            |
| children  | [TooltipOperatorMenu](#tooltipoperatormenu)                          |          |          | submenu list                                                                                                                            |
