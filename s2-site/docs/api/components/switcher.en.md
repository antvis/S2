---
title: Switcher
order: 3
---

# React Dimension Toggle Component

## Switcher Component Props

| Attributes            | illustrate                                                                                                 | type                                                          | Defaults                 | required |
| --------------------- | ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- | ------------------------ | -------- |
| rows                  | Header configuration description                                                                           | [SwitcherField](#switcherfield)                               |                          |          |
| columns               | Column Header Configuration Description                                                                    | [SwitcherField](#switcherfield)                               |                          |          |
| values                | Indicator configuration description                                                                        | [SwitcherField](#switcherfield)                               |                          |          |
| disabled              | Whether to disable                                                                                         | `boolean`                                                     | `false`                  |          |
| title                 | Open the trigger node of the toggle popup window                                                           | `ReactNode`                                                   |                          |          |
| contentTitleText      | Popup window default title text                                                                            | `string`                                                      | Row and column switching |          |
| resetText             | reset button text                                                                                          | `string`                                                      | reset                    |          |
| innerContentClassName | Popup box content style name                                                                               | `string`                                                      |                          |          |
| allowExchangeHeader   | Whether to allow indicators to switch between row and column dimensions                                    | `boolean`                                                     |                          | `true`   |
| onSubmit              | After the popup window is closed, the callback function for processing the row and column switching result | `(result:` [SwitcherResult](#switcherresult) `) => void`      |                          |          |
| popover               | Popup window configuration, transparently passed to the `antd` component of `Popover`                      | [PopoverProps](https://ant.design/components/popover-cn/#API) |                          |          |

## SwitcherField

Row and column headers and index value configuration description objects

| Attributes | illustrate                                                                                                  | type                               | Defaults | required |
| ---------- | ----------------------------------------------------------------------------------------------------------- | ---------------------------------- | -------- | -------- |
| items      | Configure field objects                                                                                     | [SwitcherItem](#switcheritem) `[]` | -        | ✓        |
| expandable | Whether to open the checkbox for expanding subitems is used to control the expansion and hiding of subitems | `boolean`                          | `false`  |          |
| expandText | Expand the text corresponding to the checkbox of the subitem                                                | `string`                           | `展开子项`   |          |
| selectable | Whether to open the checkbox of the field to control the display and hiding                                 | `boolean`                          | `false`  |          |
| allowEmpty | Whether the current dimension can drag out all sub-items                                                    | `boolean`                          | `true`   |          |

## SwitcherItem

Configure field objects

| Attributes  | illustrate                                                                                                     | type                               | Defaults | required |
| ----------- | -------------------------------------------------------------------------------------------------------------- | ---------------------------------- | -------- | -------- |
| id          | field id                                                                                                       | `string`                           | -        | ✓        |
| displayName | The name of the field is displayed, and the id is displayed directly when the field does not exist             | `string`                           | -        |          |
| checked     | Whether the field needs to be displayed                                                                        | `boolean`                          | `true`   |          |
| children    | If the field has associated sub-items (such as: same-ring ratio), use this property to configure the sub-items | [SwitcherItem](#switcheritem) `[]` | `[]`     |          |

## SwitcherResult

After the popup window is closed, the parameter of the callback function that processes the row and column switching result

| Attributes | illustrate                                | type                                      | Defaults | required |
| ---------- | ----------------------------------------- | ----------------------------------------- | -------- | -------- |
| rows       | All line header field operation results   | [SwitcherResultItem](#switcherresultitem) |          |          |
| columns    | All column header field operation results | [SwitcherResultItem](#switcherresultitem) |          |          |
| values     | All indicator field operation results     | [SwitcherResultItem](#switcherresultitem) |          |          |

## SwitcherResultItem

After closing the pop-up window, the description object of each dimension result

| Attributes | illustrate                                                                                       | type                               | Defaults | required |
| ---------- | ------------------------------------------------------------------------------------------------ | ---------------------------------- | -------- | -------- |
| items      | A **flattened** collection of all fields, sorted in order after dragging                         | [SwitcherItem](#switcheritem) `[]` | `[]`     |          |
| hideItems  | All collections that need to be **flattened with** hidden fields, sorted in order after dragging | [SwitcherItem](#switcheritem) `[]` | `[]`     |          |

## SwitcherCfgProps

Built-in header component configuration parameters, essentially a subset of Switcher component Props

| Attributes            | illustrate                                                                                                                                              | type                                                          | Defaults                 | required     |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- | ------------------------ | ------------ |
| sheetType             | Form type:<br>1. `pivot` : pivot table<br>2. `table` : detailed list<br>3. `gridAnalysis` : grid analysis table<br>4. `strategy` : trend analysis table | \`pivot                                                       | table                    | gridAnalysis |
| title                 | Open the trigger node of the toggle popup window                                                                                                        | `ReactNode`                                                   |                          |              |
| contentTitleText      | Popup window default title text                                                                                                                         | `string`                                                      | Row and column switching |              |
| resetText             | reset button text                                                                                                                                       | `string`                                                      | reset                    |              |
| innerContentClassName | Popup box content style name                                                                                                                            | `string`                                                      |                          |              |
| popover               | Popup window configuration, transparently passed to the `antd` component of `Popover`                                                                   | [PopoverProps](https://ant.design/components/popover-cn/#API) |                          |              |
| disabled              | Whether to disable                                                                                                                                      | `boolean`                                                     | `false`                  |              |

# Vue Dimension Toggle Component

In development, please look forward to
