---
title: 表头组件
order: 1
---


## HeaderCfgProps

<description> **optional**  _object_ </description>

功能描述： 表头组件配置项。

| 细分配置项名称 | 类型 | 必选 | 默认值 | 功能描述 |
| :--- | :--- | :--- | :--- | :--- |
| className | string |  |  | 类名 |
| title | string |  |  | 表头标题 |
| description | string |  |  | 表格描述 |
| exportCfg | [ExportCfgProps](/zh/docs/api/components/export)  |  | {open: false} | 导出功配置项 |
| advancedSortCfg | [AdvancedSortCfgProps](/zh/docs/api/components/advanced-sort)  |  | {open: false} | 高级排序配置项 |
| extra | ReactNode[] |  |  | 操作区dom，位于title行尾 |
