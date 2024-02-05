---
title: S2Options
order: 1
tag: Updated
---

Form parameter configuration

```ts
const s2Options = {
  width: 600,
  height: 400,
  hierarchyType: 'grid'
}
```

| parameter                   | type                                                | required | Defaults                  | Functional description                                                                                                                                                                                                |
| --------------------------- | --------------------------------------------------- | -------- | ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| width                       | `number`                                            |          | 600                       | table width                                                                                                                                                                                                           |
| height                      | `number`                                            |          | 480                       | form height                                                                                                                                                                                                           |
| debug                       | `boolean`                                           |          | `false`                   | Whether to enable debug mode                                                                                                                                                                                          |
| hierarchyType               | `grid` \| `tree` \| `customTree`                    |          | `grid`                    | The display method of line headers, grid: tiled grid structure, tree: tree structure. customTree: custom tree structure                                                                                               |
| conditions                  | [Conditions](#conditions)                           |          |                           | Conditional Mode Configuration                                                                                                                                                                                        |
| totals                      | [Totals](#totals)                                   |          |                           | Subtotal Total Configuration                                                                                                                                                                                          |
| tooltip                     | [Tooltips](#tooltip)                                |          |                           | tooltip configuration                                                                                                                                                                                                 |
| interaction                 | [Interaction](#interaction)                         |          |                           | Form interaction configuration                                                                                                                                                                                        |
| pagination                  | [Pagination](#pagination)                           |          |                           | paging configuration                                                                                                                                                                                                  |
| frozen                      | [Frozen](#frozen)                                   |          |                           | Column Header Freezing Configuration                                                                                                                                                                                  |
| seriesNumber                | [SeriesNumber](#seriesnumber)                       |          |                           | Whether to display the series number                                                                                                                                                                                  |
| showDefaultHeaderActionIcon | `boolean`                                           |          | `true`                    | Whether to display the default row and column header operation icons                                                                                                                                                  |
| headerActionIcons           | [HeaderActionIcon\[\]](#headeractionicon)           |          | `false`                   | Customize row and column header action icons (need to set `showDefaultHeaderActionIcon` to `false` )                                                                                                                  |
| customSVGIcons              | [CustomSVGIcon\[\]](#customsvgicon)                 |          | `false`                   | Custom svg icons                                                                                                                                                                                                      |
| style                       | [style](#style)                                     |          |                           | Cell style settings, such as layout type, width and height, margin, whether to hide the value column header, etc.                                                                                                     |
| hd                   | `boolean`                                           |          | `true`                    | Whether to enable high-definition screen adaptation to solve the problem of blurred font rendering on high-definition retina screens when switching between multiple screens. [see more](/manual/advanced/hd-adapter) |
| mergedCellsInfo             | [MergedCellInfo\[\]\[\]](#mergedcellinfo)           |          |                           | Merge cell information                                                                                                                                                                                                |
| placeholder                 | `string \| (meta: Record<string, any>) => string`   |          |                           | fill content for empty cells                                                                                                                                                                                          |
| cornerText                  | string                                              |          |                           | Custom corner header text (valid when custom tree `hierarchyType: customTree` )                                                                                                                                       |
| cornerExtraFieldText        | string                                              |          |                           | Customize the text of the virtual value field of the corner header (valid when the value is linked to the line header, replace the two words "value")                                                                 |
| dataCell                    | [DataCellCallback](#datacellcallback)               |          |                           | custom cell                                                                                                                                                                                                           |
| cornerCell                  | [Cell Callback](#cellcallback)                      |          |                           | Custom cornerCell                                                                                                                                                                                                     |
| rowCell                     | [Cell Callback](#cellcallback)                      |          |                           | Custom header cell                                                                                                                                                                                                    |
| colCell                     | [Cell Callback](#cellcallback)                      |          |                           | Custom column header cell                                                                                                                                                                                             |
| cornerHeader                | [CornerHeaderCallback](#cornerheadercallback)       |          |                           | custom angle head                                                                                                                                                                                                     |
| layout Hierarchy            | [Layout Hierarchy](#layouthierarchy)                |          |                           | custom hierarchy                                                                                                                                                                                                      |
| layoutArrange               | [LayoutArrange](#layoutarrange)                     |          |                           | custom sort order                                                                                                                                                                                                     |
| layoutCoordinate            | [layoutCoordinate](#layoutcoordinate)               |          |                           | custom coordinates                                                                                                                                                                                                    |
| layoutDataPosition          | [layoutDataPosition](#layoutdataposition)           |          |                           | custom data                                                                                                                                                                                                           |
| filterDisplayDataItem       | [FilterDataItemCallback](#filterdataitemcallback)   |          |                           | filter data                                                                                                                                                                                                           |
| mappingDisplayDataItem      | [MappingDataItemCallback](#mappingdataitemcallback) |          |                           | Convert data for tooltip display                                                                                                                                                                                      |
| dataSet                     | [DataSet](#dataset)                                 |          |                           | custom data set                                                                                                                                                                                                       |
| supportsCSSTransform        | `boolean`                                           |          | `false`                   | After enabling it, CSS transform is supported, which solves the problem that the mouse coordinates respond incorrectly after the parent element is set to `transform`                                                 |
| devicePixelRatio            | `number`                                            |          | `window.devicePixelRatio` | Custom Device Pixel Ratio                                                                                                                                                                                             |

<embed src="@/docs/common/series-number.en.md"></embed>

<embed src="@/docs/common/frozen.en.md"></embed>

<embed src="@/docs/common/interaction.en.md"></embed>

<embed src="@/docs/common/conditions.en.md"></embed>

<embed src="@/docs/common/totals.en.md"></embed>

<embed src="@/docs/common/tooltip.en.md"></embed>

<embed src="@/docs/common/custom-tooltip.en.md"></embed>

<embed src="@/docs/common/pagination.en.md"></embed>

<embed src="@/docs/common/style.en.md"></embed>

## DataCellCallback

```js
DataCellCallback = (viewMeta: ViewMeta, s2: Spreadsheet) => G.Group;
```

Function description: custom value cell, [ViewMeta](#viewmeta)

<embed src="@/docs/common/view-meta.en.md"></embed>

## Cell Callback

```js
CellCallback = (node: Node, spreadsheet: SpreadSheet, ...restOptions: unknown[]) => G.Group;
```

Function description: custom cell

| parameter   | illustrate                                                           | type                                             | Defaults | required |
| ----------- | -------------------------------------------------------------------- | ------------------------------------------------ | -------- | -------- |
| node        | The currently rendered node node                                     | [node](/docs/api/basic-class/node)               | -        | ✓        |
| spreadsheet | Table class instance, which can access any configuration information | [SpreadSheet](/docs/api/basic-class/spreadsheet) | -        | ✓        |
| restOptions | Indeterminate parameters, pass additional information                | `unknown[]`                                      | -        |          |

## CornerHeaderCallback

```js
CornerHeaderCallback = (parent: S2CellType, spreadsheet: SpreadSheet, ...restOptions: unknown[]) => void;
```

Function description: custom corner head

| parameter   | illustrate                                                           | type                                             | Defaults | required |
| ----------- | -------------------------------------------------------------------- | ------------------------------------------------ | -------- | -------- |
| parents     | parent cell                                                          | [S2CellType](#s2celltype)                        | -        | ✓        |
| spreadsheet | Table class instance, which can access any configuration information | [SpreadSheet](/docs/api/basic-class/spreadsheet) | -        | ✓        |
| restOptions | Indeterminate parameters, pass additional information                | `unknown[]`                                      | -        |          |

<embed src="@/docs/common/custom/layoutHierarchy.en.md"></embed>

<embed src="@/docs/common/custom/layoutArrange.en.md"></embed>

<embed src="@/docs/common/custom/layoutCoordinate.en.md"></embed>

<embed src="@/docs/common/custom/layoutCellMeta.en.md"></embed>

<embed src="@/docs/common/custom/headerActionIcons.en.md"></embed>

## HeaderActionIconProps

Function description: After clicking the custom operation icon, the current icon returned by the pivot table is related

| parameter | illustrate                               | type   | Defaults | required |
| --------- | ---------------------------------------- | ------ | -------- | -------- |
| iconName  | The name of the currently clicked icon   | string | -        | ✓        |
| meta      | The meta information of the current cell | node   | -        | ✓        |
| event     | Current click event information          | event  | false    | ✓        |

<embed src="@/docs/common/custom/customSvgIcons.en.md"></embed>

## DataItem

Function description: basic data format

```ts
export interface MultiData {
  label?: string;
  values: SimpleData[][];
  originalValues?: SimpleData[][]
}

export type SimpleData = string | number;

export type DataItem = SimpleDataItem | MultiData;
```

## LayoutResult

| parameter      | illustrate                                                                    | type                                               | Defaults | required |
| -------------- | ----------------------------------------------------------------------------- | -------------------------------------------------- | -------- | -------- |
| colNodes       | all nodes in the column                                                       | [Node\[\]](/docs/api/basic-class/node)             |          |          |
| cols Hierarchy | column structure information                                                  | [Hierarchy](#hierarchy)                            |          |          |
| rowNodes       | all nodes of the row                                                          | [Node\[\]](#node)                                  |          |          |
| rows Hierarchy | row structure information                                                     | [Hierarchy](#hierarchy)                            |          | ✓        |
| rowLeafNodes   | All leaf nodes of the row, for Cartesian intersection                         | [Node\[\]](/docs/api/basic-class/node)             |          |          |
| colLeafNodes   | All leaf nodes of the column, for Cartesian intersection                      | [Node\[\]](/docs/api/basic-class/node)             |          |          |
| getViewMeta    | Obtain the information corresponding to the coordinates of \[x,y] crossed out | `(rowIndex: number, colIndex: number) => ViewMeta` |          |          |
| spreadsheet    | Table class instance, which can access any configuration information          | [SpreadSheet](/docs/api/basic-class/spreadsheet)   |          |          |

## DataSet

```js
DataSet = (spreadsheet: SpreadSheet) => BaseDataSet;
```

## MergedCellInfo

<embed src="@/docs/common/merged-cell.en.md"></embed>
