---
title: S2Theme
order: 2
---

## ThemeCfg

<description> **optional**  _object_ </description>

功能描述： 表主题配置项。

| 参数 | 类型 | 必选 | 默认值 | 取值 | 功能描述 |
| :--- | :--- | :---: | :--- | :---| :--- |
| theme | [S2Theme](#s2theme) | | | |主题 schema |
| palette | [Palette](#palette) | | <a href="https://github.com/antvis/S2/blob/master/packages/s2-core/src/theme/palette/default.ts" target="_blank" >paletteDefault</a>|<a href="https://github.com/antvis/S2/blob/master/packages/s2-core/src/theme/palette/default.ts" target="_blank" >paletteDefault</a><br> <a href="https://github.com/antvis/S2/blob/master/packages/s2-core/src/theme/palette/simple-blue.ts" target="_blank" >paletteSimpleBlue</a> <br>  <a href="https://github.com/antvis/S2/blob/master/packages/s2-core/src/theme/palette/colorful-blue.ts" target="_blank" >paletteColorfulBlue</a> | 色板 schema |
| name | string | | `default`|  `default` <br>  `simple` <br> `colorful` | 色板 schema |

### Palette 

<description> **optional**  _object_ </description>

 功能描述： 表主题色板 `Schama`

| 参数 | 类型 | 必选 | 默认值 | 取值 | 功能描述 |
| :--- | :--- | :---: | :--- | :---| :--- |
| basicColors | string[] | | | | 基础色板 |
| semanticColors | [key: string] | | | | 用于表示实际业务语义的颜色。例如内置颜色 “红跌绿涨” |
### S2Theme 

<description> **optional**  _object_ </description>

 功能描述： 表主题 `Schama`

| 参数 | 类型 | 必选 | 默认值 | 取值 | 功能描述 |
| :--- | :--- | :---: | :--- | :---| :--- |
| cornerCell | [DefaultCellTheme](#defaultcelltheme) | | | | 角头单元格主题 |
| rowCell | [DefaultCellTheme](#defaultcelltheme) | | | | 角头单元格主题 |
| colCell | [DefaultCellTheme](#defaultcelltheme) | | | | 行头单元格主题 |
| dataCell | [DefaultCellTheme](#defaultcelltheme) | | | | 数据单元格主题 |
| resizeArea | [ResizeArea](#resizearea) | | | | 列宽行高调整热区 |
| scrollBar | [ScrollBarTheme](#scrollbartheme) | | | | 滚动条样式 |
| splitLine | [SplitLine](#splitline) | | | | 框架分割线样式 |
| prepareSelectMask | [InteractionStateTheme](#interactionstatetheme) | | | | 刷选遮罩样式  |
| background | [Background](#background) | | | | 刷选遮罩样式  |
| [key: string] | unknown | | | | 额外属性字段，用于用户自定义主题时传参  |


#### DefaultCellTheme

<description> **optional**  _object_ </description>

功能描述： 默认单元格主题

| 参数 | 类型 | 必选 | 默认值 | 取值 | 功能描述 |
| :--- | :--- | :---: | :--- | :---| :--- |
| bolderText | [TextTheme](#texttheme) | | | | 加粗文本样式 |
| text | [TextTheme](#texttheme) | | | | 文本样式 |
| cell | [CellTheme](#texttheme) | | | | 单元格样式 |
| icon | [IconTheme](#texttheme) | | | | 图标样式 |
| seriesNumberWidth | number | | 80 | | 序号列宽 |


#### ResizeArea

<description> **optional**  _object_ </description>

功能描述： 列宽行高拖拽热区样式

| 参数 | 类型 | 必选 | 默认值 | 取值 | 功能描述 |
| :--- | :--- | :---: | :--- | :--- | :--- |
| size | number | | | 3 | 热区尺寸 |
| background | string | | | | 热区背景色 |
| backgroundOpacity | number | | | | 热区背景色透明度 |
| guidLineColor | string | | | | 参考线颜色 |
| interactionState | [InteractionState](#interactionstate) | | | | 热区交互态样式 |


#### ScrollBarTheme

<description> **optional**  _object_ </description>

功能描述： 滚动条样式

| 参数 | 类型 | 必选 | 默认值 | 取值 | 功能描述 |
| :--- | :--- | :---: | :--- | :---| :--- |
| trackColor | string | | `rgba(0,0,0,0)` | | 滚动条轨道颜色 |
| thumbHoverColor | string | | `rgba(0,0,0,0.4)` | | 滚动条 Hover 态颜色 |
| thumbColor | string | | `rgba(0,0,0,0.15)` | | 滚动条颜色 |
| size | number | | Mobile: 3 <br> PC: 6 | | 滚动条尺寸 |
| hoverSize | number | | 16 | | 滚动条 Hover 态尺寸 |
| lineCap | string | | `round` | `butt` <br> `round` <br> `square` | 指定如何绘制每一条线段末端 |


#### SplitLine

<description> **optional**  _object_ </description>

功能描述： 分割线样式

| 参数 | 类型 | 必选 | 默认值 | 取值 | 功能描述 |
| :--- | :--- | :---: | :--- | :---| :--- |
| horizontalBorderColor | string | | | | 水平分割线颜色 |
| horizontalBorderColorOpacity | number | | 1 | | 水平分割线颜色透明度 |
| horizontalBorderWidth | number | | 2 | | 水平分割线宽度 |
| verticalBorderColor | string | | | | 垂直分割线颜色 |
| verticalBorderColorOpacity | number | | 1 | | 垂直分割线颜色透明度 |
| verticalBorderWidth | number | | 2 | | 垂直分割线宽度 |
| showRightShadow | boolean | | true | | 分割线是否显示右侧外阴影(透视表行头冻结情况下) |
| shadowWidth | number | | 10 | | 阴影宽度 |
| shadowColors | {left: string, right: string} | | {left: 'rgba(0,0,0,0.1),' right: 'rgba(0,0,0,0)'} | | `left` : 线性变化左侧颜色  <br> `right` : 线性变化右侧颜色 |


#### TextTheme

<description> **optional**  _object_ </description>

功能描述： 文本主题

| 参数 | 类型 | 必选 | 默认值 | 取值 | 功能描述 |
| :--- | :--- | :---: | :--- | :---| :--- |
| textAlign | string | | | `left` <br> `center` <br> `right` | 文本内容的对齐方式 |
| textBaseline | string | | | `top` <br> `middle` <br> `bottom` | 绘制文本时的基线 |
| fontFamily | string | | Roboto, PingFangSC, -apple-system, BlinkMacSystemFont, Microsoft YaHei, Arial, sans-serif | | 字体 |
| fontSize | number | | | | 字体大小 |
| fontWeight | number <br> string | | 粗体文本：Mobile：520 <br> PC: `bold` <br> 普通文本：`normal` | number <br> string: `normal` <br> `bold` <br> `bolder` <br> `lighter` | 字体粗细 |
| fill | string | | | | 字体颜色 |
| linkTextFill | string | | | | 链接文本颜色 |
| linkTextFill | string | | | | 链接文本颜色 |
| opacity | number | | 1 | | 字体透明度 |


#### CellTheme

<description> **optional**  _object_ </description>

功能描述： 单元格通用主题

| 参数 | 类型 | 必选 | 默认值 | 取值 | 功能描述 |
| :--- | :--- | :---: | :--- | :---| :--- |
| crossBackgroundColor | string | | | | 基数行单元格背景色 |
| backgroundColor | string | | | | 单元格背景色 |
| backgroundColorOpacity | number | | | 1 | 单元格背景色透明度 |
| horizontalBorderColor | string | | | | 单元格水平边线颜色 |
| horizontalBorderColorOpacity | number | | 1 | 单元格水平边线颜色透明度 |
| horizontalBorderWidth | number | | | 单元格水平边线宽度 |
| verticalBorderColor | string | | | | 单元格垂直边线颜色 |
| verticalBorderColorOpacity | number | | 1 | 单元格垂直边线颜色透明度 |
| verticalBorderWidth | number | | | | 单元格垂直边线宽度 |
| padding | [Padding](#margin--padding) | | | | 单元格内边距 |
| interactionState | [InteractionStateTheme](#interactionstatetheme) | | | 单元格交互态 |
| miniBarChartHeight | number | | | 12 | 单元格内条件格式-迷你条形图高度 |
| miniBarChartFillColor | string | | | | 单元格内条件格式-迷你条形图默认填充颜色 |


#### IconTheme

<description> **optional**  _object_ </description>

功能描述：icon 通用主题

| 参数 | 类型 | 必选 | 默认值 | 取值 | 功能描述 |
| :--- | :--- | :---: | :--- | :---| :--- |
| fill | string | | | | icon 填充色 |
| downIconColor | string | | `#FF4D4F` | | 下跌 icon 填充色 |
| upIconColor | string | | `#29A294` | | 上涨 icon 填充色 |
| size | number | | | | icon 大小 |
| margin | [Margin](#margin--padding) | | | | 单元格外边距 |


#### InteractionStateTheme

<description> **optional**  _object_ </description>

功能描述：交互通用主题

| 参数 | 类型 | 必选 | 默认值 | 取值 | 功能描述 |
| :--- | :--- | :---: | :--- | :---| :--- |
| backgroundColor | string | | | | 背景填充色 |
| backgroundOpacity | number | | | | 背景透明度 |
| borderColor | string | | | | 边线填充色 |
| borderWidth | number | | | | 边线宽度 |
| opacity | number | | | | 整体透明度 |


#### Margin ｜ Padding

<description> **optional**  _object_ </description>

功能描述：icon 外边距，单元格内边距

| 参数 | 类型 | 必选 | 默认值 | 取值 | 功能描述 |
| :--- | :--- | :---: | :--- | :---| :--- |
| top | number | | | | 上 |
| right | number | | | | 右 |
| bottom | number | | | | 下 |
| left | number | | | | 左 |

#### Background

<description> **optional**  _object_ </description>

功能描述：背景

| 参数 | 类型 | 必选 | 默认值 | 取值 | 功能描述 |
| :--- | :--- | :---: | :--- | :---| :--- |
| color | string | |  | | 颜色 |
| opacity | number | | 1 | |透明度 |
