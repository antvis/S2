------

## HeaderActionIcon

**optional** *object*

Function description: Register a custom operation icon for the row, column, and corner headers of the table.

| parameter        | illustrate                                                                                                                                                                | type                                                      | Defaults                                    | required | value                                                                              | Version                                                                                     |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- | ------------------------------------------- | -------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| iconNames        | The name of the registered icon, or the name of the icon registered by the user through customSVGIcons                                                                    | `string[]`                                                |                                             | ✓        |                                                                                    |                                                                                             |
| belongs to Cell  | The name of the cell that needs to add an operation icon                                                                                                                  | `string[]`                                                |                                             | ✓        | Corner header: 'cornerCell';<br>column header: 'colCell';<br>row header: 'rowCell' |                                                                                             |
| defaultHide      | Control whether the icon is displayed only when hover                                                                                                                     | \`boolean                                                 | (meta: Node, iconName: string) => boolean\` | false    |                                                                                    | true                                                                                        |
| displayCondition | Display filter conditions, user-defined which levels or cells need to display icons through this callback function. All icons that return true will be shown to the user. | `(mete: Node, iconName: string) => boolean;`              |                                             |          |                                                                                    | `1.26.0` returns the `iconName` and presses a single icon to control the display and hiding |
| onClick          | Execution function after icon click                                                                                                                                       | `(headerIconClickParams: HeaderIconClickParams) => void;` |                                             |          |                                                                                    | `1.26.0`                                                                                    |
| onHover          | The execution function after the icon hover starts and ends                                                                                                               | `(headerIconHoverParams: HeaderIconHoverParams) => void;` |                                             |          |                                                                                    | `1.26.0`                                                                                    |

​

## HeaderActionIconProps

**required** *object*

Function description: After clicking the custom operation icon, the pivot table returns information related to the current icon

| parameter | Functional description                   | type   | Defaults | required |
| --------- | ---------------------------------------- | ------ | -------- | -------- |
| iconName  | The name of the currently clicked icon   | string |          | ✓        |
| meta      | The meta information of the current cell | node   |          | ✓        |
| event     | Current click event information          | event  | false    | ✓        |

## CustomSVGIcon

**optional** *object*

Function description: used for users to register their own icons, currently only supports svg format

| parameter | illustrate                                                                                                            | type   | Defaults | required |
| --------- | --------------------------------------------------------------------------------------------------------------------- | ------ | -------- | -------- |
| name      | icon name                                                                                                             | string | -        | ✓        |
| svg       | Three formats of svg strings are currently supported:<br>1. base 64<br>2. svg local file<br>3. Online picture address | string | -        | ✓        |
