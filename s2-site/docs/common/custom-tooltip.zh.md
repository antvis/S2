---
title: 自定义 Tooltip
order: 5
---

## TooltipShowOptions

功能描述：tooltip 显示配置。

| 参数      | 类型      | 必选  | 默认值 | 功能描述            |
| --------- | ------- | ------ | ------ | ------------------- |
| position  | [TooltipPosition](#tooltipposition)       |   ✓   |        | tooltip 显示位置    |
| data      | [TooltipData](#tooltipdata)      |       |        | tooltip 数据        |
| cellInfos | `Record<string, any>`        |       |        | 单元格信息          |
| options   | [TooltipOptions](#tooltipoptions)    |       |        | tooltip 部分配置    |
| content   | `ReactNode \| string` \| 或者 `(cell, defaultTooltipShowOptions: TooltipShowOptions) => ReactNode \| string` |       |        | 自定义 tooltip 内容 |
| event     | `Event`  |       |        | 当前事件 Event      |

### TooltipPosition

功能描述：tooltip 坐标

| 参数 | 类型     | 必选  | 默认值 | 功能描述 |
| ---- | -------- | ------ | ------ | -------- |
| x    | `number` |   ✓   |        | 横坐标   |
| y    | `number` |   ✓   |        | 纵坐标   |

### TooltipData

功能描述：tooltip 数据

| 参数      | 类型                                            | 必选  | 默认值 | 功能描述                             |
| --------- | ----------------------------------------------- | ------ | ------ | ------------------------------------ |
| summaries | [TooltipSummaryOptions](#tooltipsummaryoptions) |       |        | 所选项统计（按度量值区分）列表       |
| details   | [ListItem](#listitem)                           |       |        | 数据点明细信息                       |
| headInfo  | [TooltipHeadInfo](#tooltipheadinfo)             |       |        | 轴（行/列头）列表                    |
| name      | `string`                                        |       |        | 当前单元格名称                       |
| tips      | `string`                                        |       |        | 提示/说明信息                        |
| infos     | `string`                                        |       |        | 底部提示信息（可用于快捷键操作提示） |

#### TooltipSummaryOptions

功能描述：tooltip 所选项统计（按度量值区分）列表

| 参数         | 类型                  | 必选  | 默认值 | 功能描述           |
| ------------ | --------------------- | ------ | ------ | ------------------ |
| name         | `string`              |   ✓   |        | 名称               |
| value        | `number \| string`     |   ✓   |        | 值                 |
| selectedData | `Record<string, any>` |   ✓   |        | 当前选择的数据列表 |

#### TooltipHeadInfo

功能描述： tooltip 轴（行/列头）列表

| 参数 | 类型                  | 必选  | 默认值 | 功能描述 |
| ---- | --------------------- | ------ | ------ | -------- |
| rows | [ListItem](#listitem) |   ✓   |        | 行头列表 |
| cols | [ListItem](#listitem) |   ✓   |        | 列头列表 |

#### ListItem

功能描述：tooltip 数据点明细数据

| 参数  | 类型              | 必选  | 默认值 | 功能描述       |
| ----- | ----------------- | ------ | ------ | -------------- |
| name  | `string`          |   ✓   |        | 名称           |
| value | `string \| number` |   ✓   |        | 值             |
| icon  | `ReactNode` |       |        | 自定义图标组件 |

### TooltipOptions

功能描述：tooltip 配置

| 参数           | 类型                                              | 必选  | 默认值 | 功能描述                     |
| -------------- | ------------------------------------------------- | ------ | ------ | ---------------------------- |
| hideSummary    | `boolean`                                         |       |     `false`    | 是否隐藏所选项统计信息       |
| operator       | [TooltipOperatorOptions](#tooltipoperatoroptions) |       |        | 操作栏配置                   |
| onlyShowOperator       | `boolean`                                         |       |      `false`   | 是否只展示操作菜单项 |
| isTotals       | `boolean`                                         |       |      `false`   | 是否是 总计/小计 单元格      |
| onlyShowCellText | `boolean`                                         |       |     `false`    | 是否只显示当前单元格文本       |
| enableFormat | `boolean`                                         |       |     `false`    | 是否开启格式化       |
| forceRender | `boolean`                                         |       |    `false`    | 是否强制清空 dom       |
| data | [TooltipData](#tooltipdata)                                         |       |    `-`    | 自定义 tooltip 数据       |

#### TooltipOperatorOptions

功能描述： tooltip 操作栏配置 （如果是 `@antv/s2-react` 配置等同于 `antd` 的 `Menu` [组件配置项](https://ant-design.antgroup.com/components/menu-cn#api))

| 参数    | 类型                                         | 必选  | 默认值 | 功能描述                                                                                   |
| ------- | -------------------------------------------- | ------ | ------ | ------------------------------------------------------------------------------------------ |
| menu   | [TooltipOperatorMenuOptions](#tooltipoperatormenuoptions)  |     |        | 操作项菜单配置  |

#### TooltipOperatorMenuOptions

功能描述： tooltip 操作栏菜单配置 （如果是 `@antv/s2-react` 配置等同于 `antd` 的 `Menu` [组件配置项](https://ant-design.antgroup.com/components/menu-cn#api))

| 参数    | 类型                                         | 必选  | 默认值 | 功能描述                                                                                   |
| ------- | -------------------------------------------- | ------ | ------ | ------------------------------------------------------------------------------------------ |
| items   | [TooltipOperatorMenuItem[]](#tooltipoperatormenuitem)  |     |        | 操作项列表  |
| onClick | `({ item, key, keyPath, domEvent }) => void` |      |        | 点击事件，透传 `antd` `Menu` 组件的 [onClick](https://ant.design/components/menu-cn/#Menu) |
| defaultSelectedKeys   | `string[]`  |     |        | 初始选中的菜单项 key 数组，透传 `antd` `Menu` 组件的 [defaultSelectedKeys](https://ant.design/components/menu-cn/#Menu)  |

##### TooltipOperatorMenuItem

功能描述： tooltip 操作项列表

| 参数     | 类型                                        | 必选  | 默认值 | 功能描述       |
| -------- | ------------------------------------------- | ------ | ------ | -------------- |
| key      | `string`                                    |   ✓   |        | 唯一标识       |
| label     | `ReactNode \| string`   |       |        | 名称           |
| icon     | `ReactNode \| Element \| string`   |       |        | 自定义图标     |
| visible  | `boolean \| (cell: S2CellType) => boolean`                           |      |   `true`      | 操作项是否显示，可传入一个函数根据当前单元格信息动态显示     |
| onClick  | (`info`: `{ key: string, [key: string]: unknown; }` , `cell`: [S2CellType](/docs/api/basic-class/base-cell)) => void                           |       |        | 点击事件回调  (`info` 为当前点击的菜单项，`cell` 为当前 tooltip 对应的单元格）   |
| children | [TooltipOperatorMenuItem[]](#tooltipoperatormenuitem) |       |        | 子菜单列表     |
