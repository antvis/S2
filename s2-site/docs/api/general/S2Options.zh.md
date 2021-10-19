---
title: S2Options
order: 1
---

| 参数 | 类型 | 必选  | 默认值 | 功能描述 |
| :-- | :-- | :-: | :--  | :-- | --- |
| width | `number` | ✓   |  | 表格宽度 |
| height | `number` | ✓   |  | 表格高度 |
| debug | `boolean` |   |`false` | 是否开启调试模式 |
| hierarchyType | `grid` \| `tree` \| `customTree` |    | `grid` | 行头的展示方式，grid：平铺网格结构， tree： 树状结构。 customTree: 自定义树状结构 |
| conditions | [Conditions](#conditions) |  |    | 条件模式配置 |
| totals | [Totals](#totals) |  |    | 小计总计配置 |
| tooltip | [Tooltip](#tooltip) |    |  |  tooltip 总配置 |
| linkFields | `string[]` |  |  |   标记字段为链接样式，用于外链跳转 |
| pagination | [Pagination](#pagination) |  |    | 分页配置 |
| freezeRowHeader | `boolean` |  |   `true` | 冻结行头 |
| showSeriesNumber | `boolean` |  |  `false` | 是否显示行序号 |
| scrollReachNodeField | [NodeField](#nodefield) |  |  | 滚动监听的节点度量 |
| customHeaderCells | [CustomHeaderCells](#customheadercells) |   | `false` | 自定义行列头单元格 |
| showDefaultHeaderActionIcon |`boolean` |  |   `true` | 是否展示默认行列头操作图标 |
| headerActionIcons | [HeaderActionIcon[]](#headeractionicon) |  |   `false` | 自定义行列头操作图标（需要将 `showDefaultHeaderActionIcon` 置为 `false`） |
| customSVGIcons | [CustomSVGIcon[]](#CustomSVGIcon) |  |   `false` | 自定义 svg 图标 |
| style | [Style](#style) |  |    | 附加样式 |
| frozenRowCount | `number` |  |    | 冻结行的数量，从顶部开始计数 |
| frozenColCount | `number` |  |    | 冻结列的数量，从左侧开始计数 |
| frozenTrailingRowCount | `number` |    |  | 冻结行数量，从底部开始计数 |
| frozenTrailingColCount | `number` |    |  | 冻结列的数量，从右侧开始计数 |
| hierarchyCollapse | `boolean` |  |   `false` | 在树状结构模式下行头是否默认展开。 |
| selectedCellsSpotlight | `boolean` |  |   `true` | 是否开启选中高亮聚光灯效果 |
| hoverHighlight | `boolean` |  |   `true` | 鼠标悬停时高亮当前单元格，以及所对应的行头，列头 |
| hdAdapter | `boolean` |  |   `true` | 是否开启高清屏适配，解决多屏切换，高清视网膜屏字体渲染模糊的问题 |
| hiddenColumnFields | `string[]` |  |    | 隐藏列 （明细表有效） |
| mergedCellsInfo | [MergedCellInfo[][]](#mergedcellinfo) |    |  | 合并单元格信息 |
| enableCopy | `boolean` |  |   `false` | 是否允许复制 |
| dataCell | [DataCellCallback](#datacellcallback) |  |    | 自定义单元格 cell |
| cornerCell | [CellCallback](#cellcallback) |  |    | 自定义 cornerCell |
| rowCell | [CellCallback](#cellcallback) |  |  |   自定义行头 cell |
| colCell | [CellCallback](#cellcallback) |  |  |   自定义列头 cell |
| frame | [FrameCallback](#framecallback) |  |  |   自定义 frame 边框 |
| cornerHeader | [CornerHeaderCallback](#cornerheadercallback) |    |  | 自定义角头 |
| layoutHierarchy | [LayoutHierarchy](#layouthierarchy) |  |    | 自定义层级结构 |
| layoutArrange | [LayoutArrange](#layoutarrange) |  |  |   自定义排列顺序 |
| layoutCoordinate | [layoutCoordinate](#layoutcoordinate) |    |  | 自定义坐标 |
| layoutDataPosition | [layoutDataPosition](#layoutdataposition)   |  |  | 自定义数据 |
| filterDisplayDataItem | [FilterDataItemCallback](#filterdataitemcallback) |  |    | 过滤数据 |
| mappingDisplayDataItem | [MappingDataItemCallback](#mappingdataitemcallback) |  |    | 转换数据，用于 tooltip 显示 |
| otterLayout | [OtterLayout](#OtterLayout) |  |  |   自定义 layout |
| customInteractions | [CustomInteraction[]](#custominteraction) |    |  | 自定义交互 |
| dataSet | [DataSet](#dataset) |  |  |   自定义数据集 |
| scrollSpeedRatio | [ScrollRatio](#scrollratio)|  |  |  用于控制滚动速率，分水平和垂直两个方向，默认为 1 |
| autoResetSheetStyle | `boolean` |  | `true` |  用于控制点击表格外区域和按下 esc 键时是否重置交互状态 |
| [key: string] | `unknown` |  |  |   其他任意的选择配置，用于自定义表格 |

`markdown:docs/common/conditions.zh.md`

`markdown:docs/common/totals.zh.md`

`markdown:docs/common/tooltip.zh.md`

## Pagination

boolean ｜ object **必选**,_default：null_ 功能描述： 分页配置

| 参数      | 类型   | 必选  | 默认值 | 功能描述            |
| --------- | ------ | :--:  | ------ | ------------------- |
| pageSize  | `number` |  ✓   |             | 每页数量            |
| current   | `number` |     |       1      | 当前页（从 1 开始） |
| total     | `number` |      |              | 数据总条数          |

## Style

object **必选**,_default：null_ 功能描述：样式设置

| 参数 | 类型 | 必选  | 默认值 | 功能描述 |
| --- | --- | :-:  | --- | --- | --- |
| treeRowsWidth | `number` |  |    | 树状模式行单元格宽度 |
| collapsedRows | `Record<string, boolean>` |  |    | 树状模式行的折叠、收起状态 |
| collapsedCols | `Record<string, boolean>`  |  |    | 树状模式列的折叠、收起状态 |
| cellCfg | [CellCfg](#cellcfg) |  |  |   单元格配置 |
| colCfg | [ColCfg](#ColCfg) |  |  |   列样式配置 |
| rowCfg | [RowCfg](#RowCfg) |  |  |   行样式配置 |
| device | `pc` \| `mobile` | |  `pc` | 设备类型 |

## CellCfg

object **必选**,_default：null_ 功能描述：单元格配置

| 参数    | 类型   | 必选  | 默认值 | 功能描述     |
| ------- | ------ | ---- | ------ | ------------ |
| width   | `number` |      |              | 单元格宽度   |
| height  | `number` |      |              | 单元格高度   |
| padding | `number` |      |              | 单元格内边距 |
| lineHeight | `number` |            |        | 单元格行高 |

## ColCfg

object **必选**,_default：null_ 功能描述： 列样式配置

| 参数 | 类型 | 必选  | 默认值 | 功能描述 |
| --- | --- | :-:  | --- | --- |
| height | `number` |  |  |   单元格高度（普通状态） |
| widthByFieldValue | `number`   |  |  | 根据度量值设置宽度（拖拽或者预设宽度场景） |
| heightByField | `Record<string, number>` |    |  | 根据度量值设置高度（拖拽或者预设宽度场景） |
| colWidthType | `adaptive` \| `compact` |    |  | 列类型，adaptive: 自适应，compact: 紧凑 |

## RowCfg

object **必选**,_default：null_ 功能描述：行样式配置

| 参数 | 类型 | 必选  | 默认值 | 功能描述 |
| --- | --- | :-:  | --- | --- |
| width | `number` |  |    | 单元格宽度 |
| widthByField | `Record<string, number>` |    |  | 根据度量值设置宽度（拖拽或者预设宽度场景） |
| treeRowsWidth | `adaptive` \| `compact` |    |  | 树状结构下行宽 （拖拽场景） |

## NodeField

object 可选，_default：{}_ 功能描述：滚动监听的节点度量

| 参数 | 类型 | 必选  | 默认值 | 功能描述 |
| --- | --- | :-:  | --- | --- |
| rowField | `string[]` |  |    | 行头中需要监听滚动吸顶的度量 id |
| colField | `string[]` |  |    | 列头中需要监听滚动吸「左」的度量 id |

## DataCellCallback

```js
DataCellCallback = (viewMeta: ViewMeta) => S2CellType;
```

功能描述：自定义数值单元格

`markdown:docs/common/view-meta.zh.md`

## CellCallback

```js
CellCallback = (node: Node, spreadsheet: SpreadSheet, ...restOptions: unknown[]) => S2CellType;
```

功能描述：自定义单元格

| 参数 | 类型 | 必选  | 默认值 | 功能描述 |
| --- | --- | :-:  | --- | --- |
| node | [Node](#node) | ✓ |    | 当前渲染的 node 节点 |
| spreadsheet | [SpreadSheet](#spreadsheet) | ✓ |    | 表类实例，可以访问任意的配置信息 |
| restOptions | `unknown[]` |  |    | 不定参数，传递额外的信息 |

## CornerHeaderCallback

```js
CornerHeaderCallback = (parent: S2CellType, spreadsheet: SpreadSheet, ...restOptions: unknown[]) => void;
```

功能描述：自定义角头

| 参数 | 类型 | 必选  | 默认值 | 功能描述 |
| --- | --- | :-:  | --- | --- |
| parent | [S2CellType](#S2CellType) | ✓ |  |   父级单元格 |
| spreadsheet | [SpreadSheet](#spreadsheet) | ✓   |  | 表类实例，可以访问任意的配置信息 |
| restOptions | `unknown[]` |  |  |   不定参数，传递额外的信息 |

## FrameCallback

```js
FrameCallback = (cfg: FrameConfig) => Frame;
```

功能描述：自定义框架

| 参数 | 类型 | 必选  | 默认值 | 功能描述 |
| --- | --- | :-:  | --- | --- |
| cfg | [FrameConfig](#frameconfig) | ✓ |    | 当前渲染的 node 节点 |

## LayoutHierarchy

```js
LayoutHierarchy = (spreadsheet: SpreadSheet, node: Node) => LayoutHierarchyReturnType;
```

功能描述：自定义层级结构

| 参数 | 类型 | 必选  | 默认值 | 功能描述 |
| --- | --- | :-:  | --- | --- |
| spreadsheet | [SpreadSheet](#spreadsheet) | ✓ |    | 表类实例，可以访问任意的配置信息 |
| node | [Node](#node) | ✓ |  |   当前渲染的 node 节点 |

```ts
interface LayoutHierarchyReturnType {
  push?: Node[];
  unshift?: Node[];
  delete?: boolean;
}
```

## LayoutArrange

```js
LayoutArrange = (spreadsheet: SpreadSheet, parent: Node, field: string, fieldValues: string[]) => string[];
```

功能描述：自定义顺序

| 参数 | 类型 | 必选  | 默认值 | 功能描述 |
| --- | --- | :-:  | --- | --- |
| spreadsheet | [SpreadSheet](#spreadsheet) | ✓ |    | 表类实例，可以访问任意的配置信息 |
| node | [Node](#node) | ✓ |  |   当前渲染的 node 节点 |
| field | `string` | ✓ |  |   当前的字段名 |
| fieldValues | `string[]` | ✓ |  |   当前字段值 |

## LayoutCoordinate

```js
LayoutCoordinate = (spreadsheet: SpreadSheet, rowNode: Node, colNode: Node) => void
```

功能描述：自定义坐标

| 参数 | 类型 | 必选  | 默认值 | 功能描述 |
| --- | --- | :-:  | --- | --- |
| spreadsheet | [SpreadSheet](#spreadsheet) | ✓ |    | 表类实例，可以访问任意的配置信息 |
| rowNode | [Node](#node) | ✓ |    | 行节点 |
| colNode | [Node](#node) | ✓ |    | 列节点 |

## LayoutDataPosition

```js
LayoutDataPosition = (spreadsheet: SpreadSheet, getCellData: GetCellMeta) => GetCellMeta
```

功能描述：自定义数据

| 参数 | 类型 | 必选  | 默认值 | 功能描述 |
| --- | --- | :-: | ---  | --- |
| spreadsheet | [SpreadSheet](#spreadsheet) | ✓ |    | 表类实例，可以访问任意的配置信息 |
| getCellData | [GetCellMeta](#GetCellMeta) | ✓ |    | 获取单元格数据和位置等信息|

```ts
type GetCellMeta = (rowIndex?: number, colIndex?: number) => ViewMeta;
```

## FilterDataItemCallback

```js
FilterDataItemCallback = (valueField: string, data: DataItem) => DataItem
```

功能描述：转换，过滤数据

| 参数 | 类型 | 必选  | 默认值 | 功能描述 |
| --- | --- | :-:  | --- | --- |
| valueField | `string` | ✓ |    | 表类实例，可以访问任意的配置信息 |
| data | [DataItem](#DataItem) | ✓   |  | 数据格式 |

## MappingDataItemCallback

```js
MappingDataItemCallback = (valueField: string, data: DataItem) => Record<string, string | number> | DataItem;
```

功能描述：数据隐射，用于显示在 tooltip 中

| 参数 | 类型 | 必选  | 默认值 | 功能描述 |
| --- | --- | :-: | --- | --- |
| valueField | `string` | ✓ |  |   表类实例，可以访问任意的配置信息 |
| data | [DataItem](#DataItem) | ✓ |    | 数据格式 |

## DataItem

功能描述：基本数据格式

```ts
export interface MultiData {
  label?: string;
  values: (string | number)[][];
}

export type SimpleDataItem = string | number;

export type DataItem = SimpleDataItem | MultiData;
```

## OtterLayout

```js
OtterLayout = (spreadsheet: SpreadSheet, rowNode: Node, colNode: Node) => void;
```

功能描述：自定义布局

| 参数 | 类型 | 必选  | 默认值 | 功能描述 |
| --- | --- | :-:  | --- | --- |
| spreadsheet | [SpreadSheet](#spreadsheet) | ✓ |  |   表类实例，可以访问任意的配置信息 |
| rowNode | [Node](#node) | ✓ |  |   行节点 |
| colNode | [Node](#node) | ✓ |  |   列节点 |

## LayoutResult

| 参数 | 类型 | 必选  | 默认值 | 功能描述 |
| --- | --- | :-: | --- | --- |
| colNodes | [Node[]](#node) |  |  |   列的所有节点 |
| colsHierarchy | [Hierarchy](#hierarchy) |  |  |   列的结构信息 |
| rowNodes | [Node[]](#node) |  |  |   行的所有节点 |
| rowsHierarchy | [Hierarchy](#hierarchy) | ✓ |  |   行的结构信息 |
| rowLeafNodes | [Node[]](#node) |  |  |   行的所有叶子节点，用于笛卡尔交叉 |
| colLeafNodes | [Node[]](#node) |  |  |   列的所有叶子节点，用于笛卡尔交叉 |
| getViewMeta | `(rowIndex: number, colIndex: number) => ViewMeta` | | |  获取交叉出 [x,y] 对应坐标的信息 |
| spreadsheet | [SpreadSheet](#spreadsheet) |  | |  表类实例，可以访问任意的配置信息 |

## CustomHeaderCells

功能描述：自定义行列头单元格：

| 参数 | 类型 | 必选  | 默认值 | 功能描述 |
| --- | --- | :-: | ---  | --- |
| cellLabels | `string[]` | ✓ |  |   自定义单元格标签 |
| mode | `pick` \| `omit`  | ✓ |  |   pick: 提取，omit: 去除 |

`markdown:docs/common/header-action-icon.zh.md`

## DataSet

```js
DataSet = (spreadsheet: SpreadSheet) => BaseDataSet;
```

## MergedCellInfo

| 参数 | 类型 | 必选  | 默认值 | 功能描述 |
| --- | --- | :-: | --- | --- |
| colIndex | `boolean` |  |  |   列索引 |
| rowIndex | `boolean` |  |  |   行索引 |
| showText | `boolean` |  |  |   是否显示文本 |

## FrameConfig

| 参数 | 类型 | 必选  | 默认值 | 功能描述 |
| --- | --- | :-:  | --- | --- |
| position | `{x: number, y: number}` |  |  |   位置 |
| scrollX | `number` |  |    | 横向偏移量 |
| width | `number` |  |  |   宽度 |
| height | `number` |  |  |   高度 |
| viewportWidth | `number` |  |  |   可视区域宽度 |
| viewportHeight | `number` |  |  |   可视区域高度 |
| showCornerRightShadow | `boolean` |  |  |   显示角头右阴影 |
| showViewPortRightShadow | `boolean` |  |  |   显示可视区域右阴影 |
| scrollContainsRowHeader | `boolean` |  |  |   滚动时是否包含焊头 |
| isPivotMode | `boolean` |  |  |   是否是透视表 |
| spreadsheet | [SpreadSheet](#spreadsheet) |  |    | 表格实例 |

## ScrollRatio

```js
interface ScrollRatio {
  horizontal?: number; // 水平滚动速率，默认为 1
  vertical?: number; // 垂直滚动速率，默认为 1
}

```
