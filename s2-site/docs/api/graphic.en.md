---
title: Graphic style
order: 3
redirect_from:
- /en/docs/api
---

S2 uses [AntV/G](https://g.antv.vision/zh/docs/guide/introduce) as the graphics engine. Some graphics style configurations, such as the `fill` attribute and `stroke` attribute of cells, and the `fontFamily` and `fontSize` of drawing fonts, etc., are directly transparently transmitted to [AntV/G drawing attributes](https://g.antv.vision/zh/docs/api/shape/attrs) .

Here is a brief introduction to the commonly used drawing properties of S2:

## Configure graphic styles

| attribute name | type              | Functional description                                                                                                                                                         |
| -------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| fill           | `string`          | The fill color of the graphics background supports \[gradient color configuration] (#configure gradient color), [texture configuration](#%E9%85%8D%E7%BD%AE%E7%BA%B9%E7%90%86) |
| fill Opacity   | `number`          | Fill transparency of the graphic background                                                                                                                                    |
| stroke         | `string`          | Graphic stroke, support \[gradient color configuration]\(#Configure gradient color), [texture configuration](#%E9%85%8D%E7%BD%AE%E7%BA%B9%E7%90%86)                            |
| lineWidth      | `number`          | Shape stroke width                                                                                                                                                             |
| lineDash       | `[number,number]` | The dotted line configuration of the graphic stroke, the first value is the length of each segment of the dotted line, and the second value is the distance between segments   |
| lineOpacity    | `number`          | graphic stroke stroke transparency                                                                                                                                             |
| opacity        | `number`          | overall transparency of the graph                                                                                                                                              |
| shadowColor    | `string`          | Graphic shadow color                                                                                                                                                           |
| shadowBlur     | `number`          | Gaussian blur factor for figure shadows                                                                                                                                        |
| shadowOffsetX  | `number`          | Set the horizontal distance of the shadow from the shape                                                                                                                       |
| shadowOffsetY  | `number`          | Sets the vertical distance of the shadow from the shape                                                                                                                        |
| cursor         | `string`          | Mouse style. [mouse style with css](https://developer.mozilla.org/zh-CN/docs/Web/CSS/cursor)                                                                                   |

## Configure Line Style

| attribute name | type              | Functional description                                                                                                                                          |
| -------------- | ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| stroke         | `string`          | Line segment color, support \[gradient color configuration]\(#Configure gradient color), [texture configuration](#%E9%85%8D%E7%BD%AE%E7%BA%B9%E7%90%86)         |
| lineWidth      | `number`          | line width                                                                                                                                                      |
| lineDash       | `[number,number]` | Line segment dotted line configuration, the first value is the length of each segment of the dotted line, and the second value is the distance between segments |
| opacity        | `number`          | line transparency                                                                                                                                               |
| shadowColor    | `string`          | line shadow color                                                                                                                                               |
| shadowBlur     | `number`          | Line Segment Gaussian Blur Coefficient                                                                                                                          |
| shadowOffsetX  | `number`          | Sets the horizontal distance of the shadow from the line segment                                                                                                |
| shadowOffsetY  | `number`          | Sets the vertical distance of the shadow from the line segment                                                                                                  |
| cursor         | `string`          | Mouse style. [mouse style with css](https://developer.mozilla.org/zh-CN/docs/Web/CSS/cursor)                                                                    |

## Configure Text Style

| attribute name | type                                                    | Functional description                                                                                                                                               |
| -------------- | ------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| fontSize       | `number`                                                | font size                                                                                                                                                            |
| fontFamily     | `string`                                                | text font                                                                                                                                                            |
| fontWeight     | `number`                                                | font weight                                                                                                                                                          |
| lineHeight     | `number`                                                | line height of text                                                                                                                                                  |
| textAlign      | `center` \| `left` \| `right` \| `start` \| `end`       | Sets the alignment of the text content                                                                                                                               |
| textBaseline   | `top` \| `middle` \| `bottom` \| `alphabetic` `hanging` | Sets the current text baseline to use when drawing text                                                                                                              |
| fill           | `string`                                                | Text fill color, support \[gradient color configuration]\(#Configure gradient color), [texture configuration](#%E9%85%8D%E7%BD%AE%E7%BA%B9%E7%90%86)                 |
| fill Opacity   | `number`                                                | text fill transparency                                                                                                                                               |
| stroke         | `string`                                                | Text stroke, support \[gradient color configuration]\(#Configure gradient color), [texture configuration](#%E9%85%8D%E7%BD%AE%E7%BA%B9%E7%90%86)                     |
| lineWidth      | `number`                                                | text stroke width                                                                                                                                                    |
| lineDash       | `[number,number]`                                       | The dotted line configuration of the stroke, the first value is the length of each segment of the dotted line, and the second value is the distance between segments |
| line Opacity   | `number`                                                | stroke transparency                                                                                                                                                  |
| opacity        | `number`                                                | The overall transparency of the text                                                                                                                                 |
| shadowColor    | `string`                                                | text shadow color                                                                                                                                                    |
| shadowBlur     | `number`                                                | Gaussian blur factor for text shadows                                                                                                                                |
| shadowOffsetX  | `number`                                                | Set the horizontal distance of the shadow from the text                                                                                                              |
| shadowOffsetY  | `number`                                                | Sets the vertical distance of the shadow from the text                                                                                                               |
| cursor         | `string`                                                | Mouse style. [css mouse styles](https://developer.mozilla.org/zh-CN/docs/Web/CSS/cursor)                                                                             |

## Configure Gradients

S2 provides two forms of linear gradient and circular gradient

### linear gradient

<img alt="linear" src="https://gw.alipayobjects.com/zos/rmsportal/ieWkhtoHOijxweuNFWdz.png" width="600">

* `l` means to use linear gradient, that is, *linear gradient* , the green font is a variable, which can be customized
* The color variable can be in the form of hexadecimal or rgb(a)

Example:

```ts
// 使用渐变色填充，渐变角度为 0，渐变的起始点颜色 #95F0FF，结束的渐变色为 #3A9DBF
fill: `l(0) 0:#95F0FF 1:#3A9DBF`,
```

Effect:

<img alt="preview" src="https://gw.alipayobjects.com/zos/antfincdn/gCsPi6N0x/c31897c4-80f4-4ae6-b562-0c19fedcd34e.png" width="400">

### circular gradient

<img alt="radial" src="https://gw.alipayobjects.com/zos/rmsportal/qnvmbtSBGxQlcuVOWkdu.png" width="600">

* `r` means to use radial gradient, that is, *radial gradient* , and the green font is a variable, which can be customized
* The `x` , `y` , and `r` values of the circle are all relative values, ranging from 0 to 1
* The color variable can be in the form of hexadecimal or rgb(a)

Example:

```ts
// 使用渐变色填充，渐变起始圆的圆心坐标为被填充物体的包围盒中心点，半径为（包围盒对角线长度 / 2) 的 1 倍，渐变的起始点颜色 #ffffff，结束的渐变色为 #1890ff
fill: 'r(0.5, 0.5, 1) 0:#ffffff 0.5:#1890ff';
```

Effect:

<img alt="preview" src="https://gw.alipayobjects.com/zos/antfincdn/p0RB31l21/23f13927-929f-4a2a-a77d-cbc058abbaf0.png" width="400">

## Configure Textures

Fill the shape with a specific texture. Texture content can be directly images or Data URLs.

<img alt="radial" src="https://gw.alipayobjects.com/zos/rmsportal/NjtjUimlJtmvXljsETAJ.png" width="600">

* `p` means to use texture, that is *pattern* , the green font is a variable, which can be customized

* There are 4 types of repetitions:

  * `a` : the pattern repeats horizontally and vertically
  * `x` : the pattern repeats only horizontally
  * `y` : the pattern repeats only vertically
  * `n` : the pattern is displayed only once (not repeated)

Example:

```ts
fill: 'p(a)https://gw.alipayobjects.com/mdn/rms_d314dd/afts/img/A*58XjQY1tO7gAAAAAAAAAAABkARQnAQ';
```

Effect:

<img alt="pattern" src="https://gw.alipayobjects.com/zos/antfincdn/BCQ05%243O9/6e37b24f-57ad-4ce0-a035-4ec2cbd1b7c6.png" width="400">
