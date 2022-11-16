---
title: Graphic style
order: 3
redirect_from:
- /en/docs/api
---
Here is a brief introduction to the commonly used drawing properties of S2:

## Configure Graphics Styles

| property name | type              | Function description                                                                                                                                                         |
| ------------- | ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| fill          | `string`          | The fill color of the graphic background, support[Gradient color configuration](<#Configure gradient colors>) ,[texture configuration](<#Configure textures>)                |
| fillOpacity   | `number`          | The fill transparency of the graphics background                                                                                                                             |
| stroke        | `string`          | Graphic stroke, support[Gradient color configuration](<#Configure gradient colors>) ,[texture configuration](<#Configure textures>)                                          |
| lineWidth     | `number`          | Graphic stroke width                                                                                                                                                         |
| lineDash      | `[number,number]` | The dotted line configuration of the graphic stroke, the first value is the length of each segment of the dotted line, and the second value is the distance between segments |
| lineOpacity   | `number`          | Graphic Stroke Stroke Transparency                                                                                                                                           |
| opacity       | `number`          | Overall transparency of graphics                                                                                                                                             |
| shadowColor   | `string`          | Graphic shadow color                                                                                                                                                         |
| shadowBlur    | `number`          | Gaussian blur coefficient for graphics shadows                                                                                                                               |
| shadowOffsetX | `number`          | Sets the horizontal distance of the shadow from the graphic                                                                                                                  |
| shadowOffsetY | `number`          | Sets the vertical distance of the shadow from the graphic                                                                                                                    |
| cursor        | `string`          | mouse style. same [css mouse style](https://developer.mozilla.org/zh-CN/docs/Web/CSS/cursor)                                                                                 |

## Configure textures

Fill the figure with a specific texture. Texture content can be directly images or Data URLs.

<img alt="radial" src="https://gw.alipayobjects.com/zos/rmsportal/NjtjUimlJtmvXljsETAJ.png" width="600">

* `p`Indicates the use of textures, i.e.*pattern*, the green font is variable and can be customized
* There are 4 types of repetitions:
  * `a`: The pattern repeats horizontally and vertically
  * `x`: The pattern is repeated horizontally only
  * `y`: The pattern is repeated vertically only
  * `n`: The pattern is displayed only once (not repeated)

Example:

```ts
fill: 'p(a)https://gw.alipayobjects.com/mdn/rms_d314dd/afts/img/A*58XjQY1tO7gAAAAAAAAAAAABkARQnAQ';
```

Effect:

<img alt="pattern" src="https://gw.alipayobjects.com/zos/antfincdn/BCQ05%243O9/6e37b24f-57ad-4ce0-a035-4ec2cbd1b7c6.png" width="400">
