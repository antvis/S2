---
title: 表组件
order: 0
---

## SpreadsheetProps

功能描述： 基于 core 层封装的 react 版开箱即用组件。

| 参数 | 类型 | 必选 | 默认值  | 功能描述 |
| :--- | :--- | :---: | :--- | :--- |
| sheetType | `pivot | table | tabular` | | `pivot` |  表格类型：<br> 1. `pivot`: 透视表 <br> 2. `table`: 明细表 <br> 3. `tabular`: 网格分析表|
| spreadsheet |`(...args: S2Constructor) => SpreadSheet`|  | | | 外部自定义的表实体， 用于初始化自定义表格 |
| dataCfg | [S2DataConfig](/zh/docs/api/general/S2DataConfig) | ✓ | |  交叉表数据映射相关配置项 |
| options | [S2Options](/zh/docs/api/general/S2Options) | ✓ | | 交叉表属性配置项 |
| partDrillDown | [PartDrillDown](/zh/docs/api/components/drill-down) |  | |  维度下钻相关属性 |
| adaptive | `boolean` | | `false` | 是否根据窗口大小自适应 |
| showPagination | `boolean` | | `true` | 是否显示默认分页(只有在 `options` 配置过 Pagination  属性才会生效) |
| themeCfg | [ThemeCfg](/zh/docs/api/general/S2Theme) |  | | 自定义交叉表主题样式 |
| isLoading | `boolean` | | | 控制表格的加载状态 |
| header | [HeaderCfgProps](/zh/docs/api/components/header) | | | 表头配置项 |
| getSpreadsheet | (spreadsheet: BaseSpreadsheet) => void; | | | 获取表实例 |
| onListSort |  (params: [ListSortParams](#listsortparams) ) => void; |  | | 排序回调，用于做自定义排序 |
| onRowCellClick| (data: [TargetCellInfo](#targetcellinfo)) => void | | | 行头单击回调事件|
| onRowCellDoubleClick| (data: [TargetCellInfo](#targetcellinfo)) => void | | | 行头双击回调事件|
| onColCellClick| (data: [TargetCellInfo](#targetcellinfo)) => void | | | 列头单击回调事件|
| onColCellDoubleClick| (data: [TargetCellInfo](#targetcellinfo)) => void | | | 列头双击回调事件|
| onCornerCellClick| (data: [TargetCellInfo](#targetcellinfo)) => void | | | 角头单击回调事件|
| onDataCellClick| (data: [TargetCellInfo](#targetcellinfo)) => void | | | | 交叉单元格单击回调事件|
| onDataCellDoubleClick| (data: [TargetCellInfo](#targetcellinfo)) => void | | | 交叉单元格双击回调事件|
| onMergedCellClick| (data: [TargetCellInfo](#targetcellinfo)) => void | | | | 合并单元格单击回调事件|
| onMergedCellDoubleClick| (data: [TargetCellInfo](#targetcellinfo)) => void | | | 合并单元格双击回调事件|
| onContextMenu| (data: [TargetCellInfo](#targetcellinfo)) => void | | | 右键单元格单击回调事件|

### ListSortParams

<description> **required**  _object_ </description>

功能描述：排序回调函数的返回的信息。

| 参数 | 类型 | 必选 | 默认值  | 功能描述 |
| :--- | :--- | :---: | :--- | :--- |
| sortFieldId | string | ✓ | | 当前排序的维度或度量的 id |
| sortMethod | string | ✓ | | 当前排序方式 |

### TargetCellInfo

<description> **required**  _object_ </description>

功能描述：交互回调函数的返回信息。

| 参数 | 类型 | 必选 | 默认值  | 功能描述 |
| :--- | :--- | :---: | :--- | :--- |
| target | `any` | ✓ | | 交互作用对象 |
| event | `Event` | ✓ | | 事件 |
| viewMeta | `Node` | ✓ | | 当前交互作用的结点信息 |
