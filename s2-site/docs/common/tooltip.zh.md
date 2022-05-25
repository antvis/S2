---
title: Tooltip
order: 4
---

## Tooltip

object **必选**,_default：null_ 功能描述： tooltip 配置

| 参数               | 说明                                                         | 类型                                    | 默认值 | 必选 |
| ------------------ | ------------------------------------------------------------ | --------------------------------------- | ------ | :--: |
| showTooltip        | 是否展示 tooltip                                             | `boolean`                               | `true` |      |
| operation          | tooltip 操作配置项                                           | [TooltipOperation](#tooltipoperation)   | -      |      |
| row                | 行头配置                                                     | [BaseTooltipConfig](#basetooltipconfig) | -      |      |
| col                | 列头配置                                                     | [BaseTooltipConfig](#basetooltipconfig) | -      |      |
| data               | 数值配置                                                     | [BaseTooltipConfig](#basetooltipconfig) | -      |      |
| corner             | 角头配置                                                     | [BaseTooltipConfig](#basetooltipconfig) | -      |      |
| renderTooltip      | 自定义整个 tooltip, 可以继承 BaseTooltip 自己重写一些方法    | [RenderTooltip](#rendertooltip)         | -      |      |
| content   | 自定义 tooltip 内容                                      | `React.ReactNode | Element | string |` 或者 `(cell, defaultTooltipShowOptions) => React.ReactNode | Element | string`                         | -      |      |
| autoAdjustBoundary | 当 tooltip 超过边界时自动调整显示位置，container: 图表区域，body: 整个浏览器窗口，设置为 `null` 可关闭此功能 | `container` \| `body`                   | `body` |      |
| getContainer | 自定义 tooltip 挂载容器，| `() => HTMLElement`                   | `document.body` |      |

### BaseTooltipConfig

| 参数             | 说明                    | 类型                                  | 默认值 | 必选 |
| ---------------- | ----------------------- | ------------------------------------- | ------ | :--: |
| showTooltip      | 是否展示 tooltip        | `boolean`                             | `false` |      |
| operation        | tooltip 操作配置项      | [TooltipOperation](#tooltipoperation) | -      |      |
| content | 自定义 tooltip 内容 | `React.ReactNode | Element | string |` 或者 `(cell, defaultTooltipShowOptions) => React.ReactNode | Element | string`                       | -      |      |

### TooltipOperation

object **必选**,_default：null_ 功能描述： tooltip 操作配置项

| 参数          | 说明                          | 类型      | 默认值  | 必选 |
| ------------- | ----------------------------- | --------- | ------- | :--: |
| hiddenColumns | 是否开启隐藏列（叶子节点有效）   | `boolean` | `false`  |      |
| trend         | 是否显示趋势图 icon           | `boolean` | `false` |      |
| sort          | 是否开启组内排序              | `boolean` | `false` |      |
| tableSort     | 是否开启明细表列头排序         | `boolean` | `false` |      |
| menus         | 自定义操作配置项         | `boolean` | `-` |      |
| onClick       | 操作项点击回调函数         | `({ item, key, keyPath, domEvent }) => void` | `-` |      |
