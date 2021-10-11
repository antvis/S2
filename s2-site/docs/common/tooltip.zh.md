---
title: Tooltip
order: 4
---

## Tooltip

object **必选**,_default：null_ 功能描述： tooltip 配置

| 参数 | 类型   | 必选  | 默认值 | 功能描述 |
| --- | --- | :-:  | --- | --- |
| showTooltip | `boolean` |    | `true` | 是否展示 tooltip |
| operation | [TooltipOperation](#tooltipoperation) |  |   `false` | tooltip 操作配置项 |
| row | [Tooltip](#tooltip) |  |    | 行头配置 |
| col | [Tooltip](#tooltip) |  |    | 列头配置 |
| cell | [Tooltip](#tooltip) |  |    | 单元格配置 |
| renderTooltip | [RenderTooltip](#rendertooltip) |    |  | 自定义整个 tooltip, 可以继承 BaseTooltip 自己重写一些方法 |
| tooltipComponent | `JSX.Element` |    |  | 自定义 tooltip 弹框组件 |

### TooltipOperation

object **必选**,_default：null_ 功能描述： tooltip 操作配置项

| 参数 | 类型   | 必选  | 默认值 | 功能描述 |
| --- | --- | :-: | --- | --- |
| hiddenColumns | `boolean` |  |   `true` | 是否开启隐藏列 （明细表有效） |
| trend | `boolean` |  |   `false` | 是否显示趋势图 icon |

### RenderTooltip

```js
RenderTooltip = (spreadsheet: BaseSpreadSheet) => BaseTooltip;
```

功能描述：行列布局结构自定义回调函数

| 参数 | 类型 | 必选  | 默认值 | 功能描述 |
| --- | --- | :-:  | --- | --- |
| spreadsheet | [SpreadSheet](#SpreadSheet) |  |   | 表类实例，可以访问任意的配置信息 |
