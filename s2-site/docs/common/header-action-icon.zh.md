## HeaderActionIcon

<description> **optional**  _object_ </description>

功能描述：为表格行列头角头注册自定义操作 icon。

| 参数 | 类型 | 必选 | 取值 | 默认值 | 功能描述 |
| --- | --- | --- | --- | --- | --- |
| iconNames | `string[]` | ✓ |  |  | 已经注册的 icon 名称，或用户通过 customSVGIcons 注册的 icon 名称 |
| belongsCell | `string[]` | ✓ | 角头：'cornerCell';<br>列头：'colCell';<br>行头：'rowCell' | ​| 需要增加操作图标的单元格名称 |
| defaultHide | `boolean` |  | true | false | false | 是否默认隐藏, 如果为 true 则为 hover 后再显示；false 则始终显示  |
| displayCondition | `(mete: Node)=> boolean;` |  |  |  | 展示的过滤条件，可以通过该回调函数用户自定义行列头哪些层级或单元格需要展示 icon。 所有返回值为 true 的单元格会展示 icon，反之则无 |
| action | `(headerActionIconProps: HeaderActionIconProps)=>void;` | ✓ |  |  | icon 点击之后的执行函数 |

​

## HeaderActionIconProps

<description> **required**  _object_ </description>

功能描述： 点击自定义操作 icon 后透视表返回的当前 icon 相关的信息

| 参数 | 类型 | 必选 | 取值 | 默认值 | 功能描述 |
| --- | --- | --- | --- | --- | --- |
| iconName | string | ✓ |  |  | 当前点击的 icon 名称 |
| meta | Node | ✓ |  | ​
 | 当前 cell 的 meta 信息 |
| event | Event | ✓ | ​
 | false | 当前点击事件信息 |

## CustomSVGIcon

<description> **optional**  _object_ </description>

功能描述：用于用户注册自己的icon图标， 目前只支持 svg 格式

| 参数 | 类型 | 必选 | 取值 | 默认值 | 功能描述 |
| --- | --- | --- | --- | --- | --- |
| name | string | ✓ |  |  | icon 名称 |
| svg | string | ✓ |  | ​| 目前支持三种格式的svg字符串：<br> 1、base 64<br>2、svg本地文件<br>3、线上图片地址 |
