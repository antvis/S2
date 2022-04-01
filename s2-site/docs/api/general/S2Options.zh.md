---
title: S2Options
order: 1
---

| 参数 | 类型 | 必选  | 默认值 | 功能描述 |
| :-- | :-- | :-: | :--  | :-- | --- |
| width | `number` |    | 600  | 表格宽度 |
| height | `number` |    | 480  | 表格高度 |
| debug | `boolean` |   |`false` | 是否开启调试模式 |
| hierarchyType | `grid` \| `tree` \| `customTree` |    | `grid` | 行头的展示方式，grid：平铺网格结构， tree： 树状结构。 customTree: 自定义树状结构 |
| conditions | [Conditions](#conditions) |  |    | 条件模式配置 |
| totals | [Totals](#totals) |  |    | 小计总计配置 |
| tooltip | [Tooltip](#tooltip) |    |  |  tooltip 配置 |
| interaction | [Interaction](#interaction) |    |  |  表格交互配置 |
| pagination | [Pagination](#pagination) |  |    | 分页配置 |
| frozenRowHeader | `boolean` |  |   `true` | 冻结行头 （透视表有效） |
| showSeriesNumber | `boolean` |  |  `false` | 是否显示行序号 |
| showDefaultHeaderActionIcon |`boolean` |  |   `true` | 是否展示默认行列头操作图标 |
| headerActionIcons | [HeaderActionIcon[]](#headeractionicon) |  |   `false` | 自定义行列头操作图标（需要将 `showDefaultHeaderActionIcon` 置为 `false`） |
| customSVGIcons | [CustomSVGIcon[]](#customsvgicon) |  |   `false` | 自定义 svg 图标 |
| style | [Style](#style) |  |    | 单元格样式设置，比如布局类型，宽高，边距，是否隐藏数值列头等 |
| frozenRowCount | `number` |  |    | 冻结行的数量，从顶部开始计数 （明细表有效） |
| frozenColCount | `number` |  |    | 冻结列的数量，从左侧开始计数 （明细表有效） |
| frozenTrailingRowCount | `number` |    |  | 冻结行数量，从底部开始计数 （明细表有效） |
| frozenTrailingColCount | `number` |    |  | 冻结列的数量，从右侧开始计数 （明细表有效） |
| hierarchyCollapse | `boolean` |  |   `false` | 在树状结构模式下行头是否默认展开。 |
| hdAdapter | `boolean` |  |   `true` | 是否开启高清屏适配，解决多屏切换，高清视网膜屏字体渲染模糊的问题 |
| mergedCellsInfo | [MergedCellInfo[][]](#mergedcellinfo) |    |  | 合并单元格信息 |
| placeholder | string |    |  | 空单元格的填充内容 |
| cornerText | string |    |  | 自定义角头文本 （自定义树 `hierarchyType: customTree` 时有效） |
| cornerExtraFieldText | string |    |  | 自定义角头虚拟数值字段文本 （数值挂行头时有效，替换 "数值" 这两个字） |
| dataCell | [DataCellCallback](#datacellcallback) |  |    | 自定义单元格 cell |
| cornerCell | [CellCallback](#cellcallback) |  |    | 自定义 cornerCell |
| rowCell | [CellCallback](#cellcallback) |  |  |   自定义行头 cell |
| colCell | [CellCallback](#cellcallback) |  |  |   自定义列头 cell |
| cornerHeader | [CornerHeaderCallback](#cornerheadercallback) |    |  | 自定义角头 |
| layoutHierarchy | [LayoutHierarchy](#layouthierarchy) |  |    | 自定义层级结构 |
| layoutArrange | [LayoutArrange](#layoutarrange) |  |  |   自定义排列顺序 |
| layoutCoordinate | [layoutCoordinate](#layoutcoordinate) |    |  | 自定义坐标 |
| layoutDataPosition | [layoutDataPosition](#layoutdataposition)   |  |  | 自定义数据 |
| filterDisplayDataItem | [FilterDataItemCallback](#filterdataitemcallback) |  |    | 过滤数据 |
| mappingDisplayDataItem | [MappingDataItemCallback](#mappingdataitemcallback) |  |    | 转换数据，用于 tooltip 显示 |
| dataSet | [DataSet](#dataset) |  |  |   自定义数据集 |
| supportCSSTransform | `boolean` |  |   `false` | 开启后支持 CSS transform, 解决父元素设置 `transform` 后，鼠标坐标响应不正确的问题  |
| devicePixelRatio | `number` |  |   `window.devicePixelRatio` | 自定义设备像素比  |

`markdown:docs/common/interaction.zh.md`

`markdown:docs/common/conditions.zh.md`

`markdown:docs/common/totals.zh.md`

`markdown:docs/common/tooltip.zh.md`

## Pagination

boolean ｜ object **必选**,_default: null_ 功能描述： 分页配置

| 参数      | 说明          | 类型   | 默认值 | 必选  |
| --------- | ------------------- | ------ | ------ | :--:  |
| pageSize  | 每页数量            | `number` | - |  ✓   |
| current   | 当前页（从 1 开始） | `number` |       1      |     |
| total     | 数据总条数          | `number` | - |      |

`markdown:docs/common/style.zh.md`

## DataCellCallback

```js
DataCellCallback = (viewMeta: ViewMeta, s2: Spreadsheet) => G.Group;
```

功能描述：自定义数值单元格，[ViewMeta](#viewmeta)

`markdown:docs/common/view-meta.zh.md`

## CellCallback

```js
CellCallback = (node: Node, spreadsheet: SpreadSheet, ...restOptions: unknown[]) => G.Group;
```

功能描述：自定义单元格

| 参数 | 说明 | 类型 | 默认值 | 必选  |
| --- | --- | --- | --- | :-:  |
| node | 当前渲染的 node 节点 | [Node](#node) | - | ✓ |
| spreadsheet | 表类实例，可以访问任意的配置信息 | [SpreadSheet](#spreadsheet) | - | ✓ |
| restOptions | 不定参数，传递额外的信息 | `unknown[]` | - |  |

## CornerHeaderCallback

```js
CornerHeaderCallback = (parent: S2CellType, spreadsheet: SpreadSheet, ...restOptions: unknown[]) => void;
```

功能描述：自定义角头

| 参数 | 说明 | 类型 | 默认值 | 必选  |
| --- | --- | --- | --- | :-:  |
| parent |   父级单元格 | [S2CellType](#s2celltype) | - | ✓ |
| spreadsheet | 表类实例，可以访问任意的配置信息 | [SpreadSheet](#spreadsheet) | - | ✓   |
| restOptions |   不定参数，传递额外的信息 | `unknown[]` | - |  |

`markdown:docs/common/custom/layoutHierarchy.zh.md`

`markdown:docs/common/custom/layoutArrange.zh.md`

`markdown:docs/common/custom/layoutCoordinate.zh.md`

`markdown:docs/common/custom/layoutDataPosition.zh.md`

`markdown:docs/common/custom/headerActionIcons.zh.md`

## HeaderActionIconProps

功能描述： 点击自定义操作 icon 后透视表返回的当前 icon 相关

| 参数 | 说明                   | 类型 | 默认值 | 必选  |
| --- | --- | --- | --- | :-:  |
| iconName | 当前点击的 icon 名称 | string | - | ✓ |
| meta | 当前 cell 的 meta 信息 | Node | - | ✓ |
| event | 当前点击事件信息 | Event |  false  | ✓ |

`markdown:docs/common/custom/customSvgIcons.zh.md`

## FilterDataItemCallback

```js
FilterDataItemCallback = (valueField: string, data: DataItem) => DataItem
```

功能描述：转换，过滤数据

| 参数 | 说明                             | 类型 | 默认值 | 必选  |
| --- | --- | --- | --- | :-:  |
| valueField | 表类实例，可以访问任意的配置信息 | `string` | - | ✓ |
| data | 数据格式 | [DataItem](#dataitem) | - | ✓   |

## MappingDataItemCallback

```js
MappingDataItemCallback = (valueField: string, data: DataItem) => Record<string, string | number> | DataItem;
```

功能描述：数据隐射，用于显示在 tooltip 中

| 参数 | 说明                             | 类型 | 默认值 | 必选  |
| --- | --- | --- | --- | :-: |
| valueField |   表类实例，可以访问任意的配置信息 | `string` | - | ✓ |
| data | 数据格式 | [DataItem](#dataitem) | - | ✓ |

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

## LayoutResult

| 参数 | 说明                             | 类型 | 默认值 | 必选  |
| --- | --- | --- | --- | :-: |
| colNodes |   列的所有节点 | [Node[]](#node) |  |  |
| colsHierarchy |   列的结构信息 | [Hierarchy](#hierarchy) |  |  |
| rowNodes |   行的所有节点 | [Node[]](#node) |  |  |
| rowsHierarchy |   行的结构信息 | [Hierarchy](#hierarchy) |  | ✓ |
| rowLeafNodes |   行的所有叶子节点，用于笛卡尔交叉 | [Node[]](#node) |  |  |
| colLeafNodes |   列的所有叶子节点，用于笛卡尔交叉 | [Node[]](#node) |  |  |
| getViewMeta |  获取交叉出 [x,y] 对应坐标的信息 | `(rowIndex: number, colIndex: number) => ViewMeta` | | |
| spreadsheet |  表类实例，可以访问任意的配置信息 | [SpreadSheet](#spreadsheet) | |  |

## DataSet

```js
DataSet = (spreadsheet: SpreadSheet) => BaseDataSet;
```

## MergedCellInfo

| 参数            | 说明                 | 类型                   | 默认值 | 必选 |
| --------------- | ------------------ | ---------------------- | ------ | ---- |
| colIndex        | 单元格的列索引        | `number`               | -      |      |
| rowIndex        | 单元格的行索引        | `number`               | -      |      |
| showText        | 合并单元格是否展示当前单元格的 meta 信息，只需要对一个单元格进行标识，</br>若未对单元格进行标识，会默认使用第一个选中点击的单元格的 meta 信息 | `booelan`      | -      |      |
