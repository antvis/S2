---
title: Tooltip
order: 4
---

## Tooltip

功能描述：tooltip 配置。查看 [文档](/manual/basic/tooltip) 和 [示例](/examples/react-component/tooltip/#basic)

| 参数               | 说明   | 类型      | 默认值 | 必选 |
| ------------------ | ----------- | ----------- | ------ | --- |
| enable        | 是否展示 tooltip                                             | `boolean`                               | `true` |      |
| operation          | tooltip 操作配置项    | [TooltipOperation](#tooltipoperation)   | -      |      |
| rowCell                | 行头单元格配置    | [BaseTooltipConfig](#basetooltipconfig) | -      |      |
| colCell                | 列头单元格配置     | [BaseTooltipConfig](#basetooltipconfig) | -      |      |
| dataCell               | 数值单元格配置  | [BaseTooltipConfig](#basetooltipconfig) | -      |      |
| cornerCell             | 角头单元格配置    | [BaseTooltipConfig](#basetooltipconfig) | -      |      |
| render      | 自定义整个 tooltip, 可以继承 BaseTooltip 自己重写一些方法    | [RenderTooltip](#rendertooltip)         | -      |      |
| content   | 自定义 tooltip 内容  | `ReactNode \| Element \| string` 或者 `(cell, defaultTooltipShowOptions) => ReactNode \| Element \| string`   | -      |      |
| autoAdjustBoundary | 当 tooltip 超过边界时自动调整显示位置，container: 图表区域，body: 整个浏览器窗口，设置为 `null` 可关闭此功能 | `container` \| `body`  | `body` |      |
| adjustPosition | 自定义 tooltip 位置，| (positionInfo: [TooltipPositionInfo](#tooltippositioninfo) ) => {x: number, y: number}                  |  |      |
| getContainer | 自定义 tooltip 挂载容器，| `() => HTMLElement`   | `document.body` |      |
| className | 额外的容器类名，| `string`    | - |      |
| style | 额外的容器样式，| [CSSProperties](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Properties_Reference)  | - |      |

### BaseTooltipConfig

功能描述：tooltip 基础通用配置

| 参数             | 说明                    | 类型                                  | 默认值 | 必选 |
| ---------------- | ----------------------- | ------------------------------------- | ------ | --- |
| enable      | 是否展示 tooltip        | `boolean`                             | `true` |      |
| operation        | tooltip 操作配置项      | [TooltipOperation](#tooltipoperation) | -      |      |
| content | 自定义 tooltip 内容 | `ReactNode \| Element \| string \|` 或者 `(cell, defaultTooltipShowOptions) => ReactNode \| Element \| string`                       | -      |      |

### TooltipPositionInfo

功能描述：tooltip 坐标信息。查看 [文档](/manual/basic/tooltip) 和 [示例](/examples/react-component/tooltip/#basic).

| 参数             | 说明                    | 类型                                  | 默认值 | 必选 |
| ---------------- | ----------------------- | ------------------------------------- | ------ | --- |
| position      | 默认经过计算（默认偏移量 + autoAdjustBoundary）后的 Tooltip 位置坐标  |  [TooltipPosition](#tooltipposition)  |  | ✓|
| event      | 当前点击事件信息 | Event | | ✓ |

### TooltipOperation

功能描述：tooltip 操作配置项。查看 [文档](/manual/basic/tooltip#%E6%93%8D%E4%BD%9C%E9%85%8D%E7%BD%AE%E9%A1%B9) 和 [示例](/examples/react-component/tooltip/#custom-operation).

| 参数          | 说明                          | 类型      | 默认值  | 必选 |
| ------------- | ----------------------------- | --------- | ------- | --- |
| hiddenColumns | 是否开启隐藏列（叶子节点有效）   | `boolean` | `true`  |      |
| sort          | 是否开启组内排序              | `boolean` | `false` |      |
| tableSort     | 是否开启明细表列头排序         | `boolean` | `false` |      |
| menu         | 自定义操作栏菜单配置项         | [TooltipOperatorMenuOptions](#tooltipoperatormenuoptions)  | `-` |      |
