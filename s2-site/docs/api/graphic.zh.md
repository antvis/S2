---
title: 绘图属性
order: 3
redirect_from:
  - /en/docs/api
---

:::warning{title="注意"}

S2 使用 `Canvas` , 底层基于 [AntV/G](https://g.antv.antgroup.com/guide/getting-started) 作为绘图引擎，一些图形的样式配置，如单元格的 `fill` 属性，`stroke` 属性，以及绘制字体的 `fontFamily` 和 `fontSize` 等，都是直接透传 [AntV/G 的绘图属性](https://g.antv.antgroup.com/api/basic/display-object#%E7%BB%98%E5%9B%BE%E5%B1%9E%E6%80%A7)。

理论上，你可以通过 [自定义单元格](https://s2.antv.antgroup.com/examples/custom/custom-cell/#data-cell), 在表格绘制任意内容，前提是请确保你已经掌握了一定的 [Canvas](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) 和 [SVG](https://developer.mozilla.org/en-US/docs/Web/SVG) 知识，并对 [AntV/G](https://g.antv.antgroup.com/guide/getting-started) 有一定了解。
:::

这里对 S2 常用的绘图属性进行简单介绍：

## 配置图形样式

| 属性名        | 类型            |    功能描述                                                                                                      |
| ------------- | --------------- | ------------------------------------------------------------------------------------------------------------ |
| fill          | `string`          | 图形背景的填充颜色，支持 [渐变色配置](#配置渐变) 和 [纹理配置](#配置纹理)                                                                                               |
| fillOpacity   | `number`          | 图形背景的填充透明度                                                                                             |
| stroke        | `string`          | 图形描边，支持 [渐变色配置](#配置渐变色) 和 [纹理配置](#配置纹理)                                                  |
| lineWidth     | `number`          | 图形描边宽度                                                                                               |
| lineDash      | `[number,number]` | 图形描边的虚线配置，第一个值为虚线每个分段的长度，第二个值为分段间隔的距离 |
| lineOpacity   | `number`          | 图形描边描边透明度                                                                                                   |
| opacity       | `number`          | 图形的整体透明度                                                                                             |
| shadowColor   | `string`          | 图形阴影颜色                                                                                                 |
| shadowBlur    | `number`          | 图形阴影的高斯模糊系数                                                                                       |
| shadowOffsetX | `number`          | 设置阴影距图形的水平距离                                                                                     |
| shadowOffsetY | `number`          | 设置阴影距图形的垂直距离                                                                                     |
| cursor        | `string`          | 鼠标样式。同 [css 的鼠标样式](https://developer.mozilla.org/zh-CN/docs/Web/CSS/cursor)                                                              |

## 配置线段样式

| 属性名        | 类型              | 功能描述                                                                                                   |
| ------------- | ----------------- | ------------------------------------------------------------------------------------------------------ |
| stroke        | `string`          | 线段颜色，支持 [渐变色配置](#配置渐变色) ，[纹理配置](#配置纹理)                                                |
| lineWidth     | `number`          | 线段宽度                                                                                                   |
| lineDash      | `[number,number]` | 线段虚线配置，第一个值为虚线每个分段的长度，第二个值为分段间隔的距离|
| opacity       | `number`          | 线段透明度                                                                                                 |
| shadowColor   | `string`          | 线段阴影颜色                                                                                               |
| shadowBlur    | `number`          | 线段高斯模糊系数                                                                                           |
| shadowOffsetX | `number`          | 设置阴影距线段的水平距离                                                                               |
| shadowOffsetY | `number`          | 设置阴影距线段的垂直距离                                                                               |
| cursor        | `string`          | 鼠标样式。同 [css 的鼠标样式](https://developer.mozilla.org/zh-CN/docs/Web/CSS/cursor)                                                               |

## 配置文字样式

| 属性名        | 类型            | 功能描述                                                                                                         |
| ------------- | --------------- | ------------------------------------------------------------------------------------------------------------ |
| fontSize      | `number`          | 文字大小                                                                                                     |
| fontFamily    | `string`          | 文字字体                                                                                                     |
| fontWeight    | `number`          | 字体粗细                                                                                                     |
| fontStyle    | `normal \| italic \| oblique`           | 字体样式                                                                                                     |
| fontVariant    | `normal \| small-caps \| string`           | 字体变体                                                                                                     |
| lineHeight    | `number`          | 文字的行高                                                                                                   |
| textAlign     | `center` \| `left` \| `right` \| `start` \| `end`          | 设置文本内容的对齐方式 |
| textBaseline  | `top` \| `middle` \| `bottom` \| `alphabetic` \| `hanging`          | 设置在绘制文本时使用的当前文本基线|
| fill          | `string`          | 文字填充颜色，支持 [渐变色配置](#配置渐变色)，[纹理配置](#配置纹理)                                                                             |
| fillOpacity   | `number`          | 文字填充透明度                                                                                             |
| stroke        | `string`          | 文字描边，支持 [渐变色配置](#配置渐变色) ，[纹理配置](#配置纹理)                                                                            |
| lineWidth     | `number`          | 文字描边宽度                                                                                               |
| lineDash      | `[number,number]` | 描边的虚线配置，第一个值为虚线每个分段的长度，第二个值为分段间隔的距离 |
| lineOpacity   | `number`          | 描边透明度                                                                                                   |
| opacity       | `number`          | 文字的整体透明度                                                                                             |
| shadowColor   | `string`          | 文字阴影颜色                                                                                                 |
| shadowBlur    | `number`          | 文字阴影的高斯模糊系数                                                                                       |
| shadowOffsetX | `number`          | 设置阴影距文字的水平距离                                                                                     |
| shadowOffsetY | `number`          | 设置阴影距文字的垂直距离                                                                                     |
| cursor        | `string`          | 鼠标样式。[css 的鼠标样式](https://developer.mozilla.org/zh-CN/docs/Web/CSS/cursor)                                |

## 配置渐变色

S2 提供线性渐变，环形渐变两种形式

### 线性渐变

<img alt="linear" src="https://gw.alipayobjects.com/zos/rmsportal/ieWkhtoHOijxweuNFWdz.png" width="600">

* `l` 表示使用线性渐变，即 *linear gradient*，绿色的字体为变量，可自定义
* 颜色变量可采用 16 进制或者 rgb(a) 形式

示例：

```ts
// 使用渐变色填充，渐变角度为 0，渐变的起始点颜色 #95F0FF，结束的渐变色为 #3A9DBF
fill: `l(0) 0:#95F0FF 1:#3A9DBF`,
```

效果：

<img alt="preview" src="https://gw.alipayobjects.com/zos/antfincdn/gCsPi6N0x/c31897c4-80f4-4ae6-b562-0c19fedcd34e.png" width="400">

### 环形渐变

<img alt="radial" src="https://gw.alipayobjects.com/zos/rmsportal/qnvmbtSBGxQlcuVOWkdu.png" width="600">

* `r` 表示使用放射状渐变，即 *radial gradient*，绿色的字体为变量，可自定义
* 圆的 `x`， `y`， `r` 值均为相对值，0 至 1 范围
* 颜色变量可采用 16 进制或者 rgb(a) 形式

示例：

```ts
// 使用渐变色填充，渐变起始圆的圆心坐标为被填充物体的包围盒中心点，半径为（包围盒对角线长度 / 2) 的 1 倍，渐变的起始点颜色 #ffffff，结束的渐变色为 #1890ff
fill: 'r(0.5, 0.5, 1) 0:#ffffff 0.5:#1890ff';
```

效果：

<img alt="preview" src="https://gw.alipayobjects.com/zos/antfincdn/p0RB31l21/23f13927-929f-4a2a-a77d-cbc058abbaf0.png" width="400">

## 配置纹理

用特定的纹理填充图形。纹理内容可以直接是图片或者 Data URLs。

<img alt="radial" src="https://gw.alipayobjects.com/zos/rmsportal/NjtjUimlJtmvXljsETAJ.png" width="600">

* `p`表示使用纹理，即 *pattern*，绿色的字体为变量，可自定义
* 重复方式有以下 4 种：
  * `a`: 该模式在水平和垂直方向重复
  * `x`: 该模式只在水平方向重复
  * `y`: 该模式只在垂直方向重复
  * `n`: 该模式只显示一次（不重复）

示例：

```ts
fill: 'p(a)https://gw.alipayobjects.com/mdn/rms_d314dd/afts/img/A*58XjQY1tO7gAAAAAAAAAAABkARQnAQ';
```

效果：

<img alt="pattern" src="https://gw.alipayobjects.com/zos/antfincdn/BCQ05%243O9/6e37b24f-57ad-4ce0-a035-4ec2cbd1b7c6.png" width="400">
