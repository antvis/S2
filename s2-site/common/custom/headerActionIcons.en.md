---
title: header action icons
order: 6
---

## HeaderActionIcon

Function description: Register a custom operation `icon` for the row, column, and corner headers of the table. If the configuration bit is empty, the default action `icon` of the pivot table will be displayed.

| parameter        | type                                                      | required | Defaults | Functional description                                                                                                                                                    | Version                                                                                     |
| ---------------- | --------------------------------------------------------- | -------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| iconNames        | string\[]                                                 | ✓        |          | The name of the registered icon, or the name of the icon registered by the user through customSVGIcons                                                                    |                                                                                             |
| belongs to Cell  | string\[]                                                 | ✓        |          | The cell names that need to add operation icons cornerCell, colCell, rowCell                                                                                              |                                                                                             |
| defaultHide      | boolean \| (mete: Node, iconName: string) => boolean      |          |          | Whether to hide by default, if it is true, it will be displayed after hover; if false, it will always be displayed                                                        | `1.26.0` supports configuration as a function                                               |
| displayCondition | (mete: Node, iconName: string) => boolean                 |          |          | Display filter conditions, user-defined which levels or cells need to display icons through this callback function. All icons that return true will be shown to the user. | `1.26.0` returns the `iconName` and presses a single icon to control the display and hiding |
| onClick          | `(headerIconClickParams: HeaderIconClickParams) => void;` | ✓        |          |                                                                                                                                                                           | `1.26.0`                                                                                    |
| onHover          | `(headerIconHoverParams: HeaderIconHoverParams) => void;` |          |          |                                                                                                                                                                           | `1.26.0`                                                                                    |
