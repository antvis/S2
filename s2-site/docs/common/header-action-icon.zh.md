## HeaderActionIcon

<description> **optional**  _object_ </description>

功能描述：为表格行列头角头注册自定义操作 icon。

| 参数             | 说明                                                                                                                                                       | 类型                                                      | 默认值 | 必选 | 取值                                                       | 版本                                            |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- | ------ | ---- | ---------------------------------------------------------- | ----------------------------------------------- |
| icons            | 已经注册的 icon 名称，或用户通过 customSVGIcons 注册的 icon 名称，如果是字符串形式，则 position 默认为 'right'，也可以使用对象的形式，显示指定 icon 的位置 | `string[]` \| `{name:string,position:'right'\|'left'}[]`  |        | ✓    |                                                            | `2.0.0`                                         |
| belongsCell      | 需要增加操作图标的单元格名称                                                                                                                               | `string[]`                                                |        | ✓    | 角头：'cornerCell';<br>列头：'colCell';<br>行头：'rowCell' |                                                 |
| defaultHide      | 控制是否 hover 才展示 icon                                                                                                                                 | `boolean` \| `(meta: Node, iconName: string) => boolean`  | false  |      | true                                                       | `1.26.0` 支持配置为一个函数                     |
| displayCondition | 展示的过滤条件，可以通过该回调函数用户自定义行列头哪些层级或单元格需要展示 icon。 所有返回值为 true 的 icon 会展示给用户。                                 | `(mete: Node, iconName: string) => boolean;`              |        |      |                                                            | `1.26.0` 回传 `iconName` 并按单个 icon 控制显隐 |
| onClick          | icon 点击之后的执行函数                                                                                                                                    | `(headerIconClickParams: HeaderIconClickParams) => void;` |        |      |                                                            | `1.26.0`                                        |
| onHover          | icon hover 开始及结束之后的执行函数                                                                                                                        | `(headerIconHoverParams: HeaderIconHoverParams) => void;` |        |      |                                                            | `1.26.0`                                        |

​

## HeaderActionIconProps

<description> **required**  _object_ </description>

功能描述： 点击自定义操作 icon 后透视表返回的当前 icon 相关的信息

| 参数     | 功能描述               | 类型                          | 默认值 | 必选 |
| -------- | ---------------------- | ----------------------------- | ------ | ---- |
| iconName | 当前 icon 名称         | `string`                      |        | ✓    |
| meta     | 当前 cell 的 meta 信息 | [Node](/api/basic-class/node) |        | ✓    |
| event    | 当前点击事件信息       | `Event`                       | false  | ✓    |

## CustomSVGIcon

<description> **optional**  _object_ </description>

功能描述：用于用户注册自己的 icon 图标， 目前只支持 svg 格式

| 参数 | 说明                                                                                 | 类型     | 默认值 | 必选 |
| ---- | ------------------------------------------------------------------------------------ | -------- | ------ | ---- |
| name | icon 名称                                                                            | `string` | -      | ✓    |
| svg  | 目前支持三种格式的 svg 字符串：<br> 1、base 64<br>2、svg 本地文件<br>3、线上图片地址 | `string` | -      | ✓    |
