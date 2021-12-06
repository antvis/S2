---
title: 自定义Tooltip
order: 5
---


## TooltipShowOptions

object **必选**,_default：null_ 功能描述： tooltip 显示配置

| 参数      | 类型                                | 必选  | 默认值 | 功能描述                |
| --------- | ----------------------------------- | :---: | ------ | ----------------------- |
| position  | [TooltipPosition](#tooltipposition) |   ✓   |        | tooltip 显示位置        |
| data      | [TooltipData](#tooltipdata)         |       |        | tooltip 数据      |
| cellInfos | `Record<string, any>`               |       |        | 单元格信息      |
| options   | [TooltipOptions](#tooltipoptions)   |       |        | tooltip 部分配置        |
| content   | `React.ReactNode`                |       |        | 自定义 tooltip 内容 |

### TooltipPosition

object **必选**,_default：null_ 功能描述： tooltip 显示位置

| 参数 | 类型     | 必选  | 默认值 | 功能描述 |
| ---- | -------- | :---: | ------ | -------- |
| x    | `number` |   ✓   |        | 横坐标   |
| y    | `number` |   ✓   |        | 纵坐标   |

### TooltipData

object **可选**,_default：null_ 功能描述： tooltip 数据

| 参数      | 类型                                            | 必选  | 默认值 | 功能描述                             |
| --------- | ----------------------------------------------- | :---: | ------ | ------------------------------------ |
| summaries | [TooltipSummaryOptions](#tooltipsummaryoptions) |       |        | 所选项统计（按度量值区分）列表       |
| details   | [ListItem](#listitem)                           |       |        | 数据点明细信息                       |
| headInfo  | [TooltipHeadInfo](#tooltipheadinfo)             |       |        | 轴（行/列头）列表                    |
| name      | `string`                                        |       |        | 当前单元格名称                       |
| tips      | `string`                                        |       |        | 提示/说明信息                        |
| infos     | `string`                                        |       |        | 底部提示信息（可用于快捷键操作提示） |

#### TooltipSummaryOptions

object **可选**,_default：null_ 功能描述： tooltip 所选项统计（按度量值区分）列表

| 参数         | 类型                  | 必选  | 默认值 | 功能描述           |
| ------------ | --------------------- | :---: | ------ | ------------------ |
| name         | `string`              |   ✓   |        | 名称               |
| value        | `number | string`     |   ✓   |        | 值                 |
| selectedData | `Record<string, any>` |   ✓   |        | 当前选择的数据列表 |

#### TooltipHeadInfo

object **可选**,_default：null_ 功能描述： tooltip 轴（行/列头）列表

| 参数 | 类型                  | 必选  | 默认值 | 功能描述 |
| ---- | --------------------- | :---: | ------ | -------- |
| rows | [ListItem](#listitem) |   ✓   |        | 行头列表 |
| cols | [ListItem](#listitem) |   ✓   |        | 列头列表 |

#### ListItem

object **可选**,_default：null_ 功能描述： tooltip 数据点明细数据

| 参数  | 类型              | 必选  | 默认值 | 功能描述       |
| ----- | ----------------- | :---: | ------ | -------------- |
| name  | `string`          |   ✓   |        | 名称           |
| value | `string | number` |   ✓   |        | 值             |
| icon  | `React.ReactNode` |       |        | 自定义图标组件 |

### TooltipOptions

object **必选**,_default：null_ 功能描述： tooltip 部分配置

| 参数           | 类型                                              | 必选  | 默认值 | 功能描述                     |
| -------------- | ------------------------------------------------- | :---: | ------ | ---------------------------- |
| hideSummary    | `boolean`                                         |       |        | 是否隐藏所选项统计信息       |
| operator       | [TooltipOperatorOptions](#tooltipoperatoroptions) |       |        | 操作栏配置                   |
| onlyMenu       | `boolean`                                         |       |        | tooltip 是否只展示操作菜单项 |
| enterable      | `boolean`                                         |       |        | 是否可进入 tooltip 组件      |
| isTotals       | `boolean`                                         |       |        | 是否是 总计/小计 单元格      |
| showSingleTips | `boolean`                                         |       |        | 是否显示单元格提示信息       |

#### TooltipOperatorOptions

object **可选**,_default：null_ 功能描述： tooltip 操作栏配置

| 参数          | 类型                                        | 必选  | 默认值 | 功能描述   |
| ------------- | ------------------------------------------- | :---: | ------ | ---------- |
| menus         | [TooltipOperatorMenu](#tooltipoperatormenu) |   ✓   |        | 操作项列表 |
| onClick       | `() => void`                                |   ✓   |        | 点击事件   |
| [key: string] | `boolean`                                   |       |        | 其他       |

##### TooltipOperatorMenu

object **必选**,_default：null_ 功能描述： tooltip 操作项列表

| 参数     | 类型                                        | 必选  | 默认值 | 功能描述       |
| -------- | ------------------------------------------- | :---: | ------ | -------------- |
| id       | `string`                                    |   ✓   |        | 值             |
| text     | `boolean`                                   |       |        | 名称           |
| icon     | `React.ReactNode`                           |       |        | 自定义图标组件 |
| children | [TooltipOperatorMenu](#tooltipoperatormenu) |       |        | 子菜单列表     |
