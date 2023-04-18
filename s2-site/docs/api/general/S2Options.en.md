---
title: S2Options
order: 1
---

Form parameter configuration

\| parameter | type | required | default value | function description| | :-- | :-- | :-: | :-- | :-- | --- | `number` | width| | height | `number` | | 480 | table height| | debug | `boolean` | | `false` | whether to enable debug mode| `grid` | hierarchyType | `grid` | `tree` | `customTree` | grid structure, tree: tree structure. [customTree](#tooltip) : custom tree structure | | conditions | [Conditions](#conditions) | | | condition pattern configuration | [](#interaction)| totals | [Totals](#totals) | | | | | Table Interaction Configuration| | pagination | [Pagination](#pagination) | | | `false` Configuration| `boolean` | `true` | `boolean` | | `false` | `boolean` | | `true` | `false` to display the default row header action icon | `showDefaultHeaderActionIcon` | [headerActionIcons](#headeractionicon) [|](#customsvgicon) `false` | custom svg icon| | style | [Style](#style) | | | cell style settings, such as layout type, width and height, margin, whether to hide the value column header, etc. | | frozenRowCount | `number` | | | the number of frozen rows, from counting from top (valid for schedules) | | frozenColCount | `number` | | | number of frozen columns, counting from left (valid for schedules) | | frozenTrailingRowCount | `number` | | | number of frozen rows, counting from bottom ( list is valid) | | frozenTrailingColCount | `number` | | | the number of frozen columns, counting from the right side (schedule is valid) | | `true` | `boolean` | | Blurred font rendering on high-definition retina screens| | mergedCellsInfo | [MergedCellInfo\[\]\[\]](#mergedcellinfo) | | | merged cell information| | placeholder | `(meta: Record<string, any>) => string | string` | | | fill content of empty cells | | cornerText | string | | | custom corner header text (valid when custom tree `hierarchyType: customTree` ) | | The text of the virtual value field of the corner head (valid when the value is the row header, replace the two words "value") | | dataCell | [DataCellCallback](#datacellcallback) | | | custom cell | | cornerCell | [CellCallback](#cellcallback) | | | custom cornerCell | | rowCell | [CellCallback](#cellcallback) | | | custom row header cell | | colCell | [CellCallback](#cellcallback) | | | custom column header cell | | cornerHeader | [CornerHeaderCallback](#cornerheadercallback) | | | custom corner header | | [layoutHierarchy](#layouthierarchy) | struct | | [layoutArrange](#layoutdataposition) | [LayoutArrange](#layoutarrange) | | | custom sort order | | layoutCoordinate | [layoutCoordinate](#layoutcoordinate) | [|](#filterdataitemcallback) | | `false` | [MappingDataItemCallback](#mappingdataitemcallback) | | | Convert data for tooltip display| | dataSet | [DataSet](#dataset) | | | custom data set| `transform` | supportCSSTransform | `boolean` | , mouse coordinates respond incorrectly| | devicePixelRatio | `number` | | `window.devicePixelRatio` | custom device pixel ratio|

<embed src="@/docs/common/interaction.zh.md"></embed>

<embed src="@/docs/common/conditions.zh.md"></embed>

<embed src="@/docs/common/totals.zh.md"></embed>

<embed src="@/docs/common/tooltip.zh.md"></embed>

<embed src="@/docs/common/custom-tooltip.zh.md"></embed>

<embed src="@/docs/common/pagination.zh.md"></embed>

<embed src="@/docs/common/style.zh.md"></embed>

## DataCellCallback

```js
DataCellCallback = (viewMeta: ViewMeta, s2: Spreadsheet) => G.Group;
```

Function description: custom value cell, [ViewMeta](#viewmeta)

<embed src="@/docs/common/view-meta.zh.md"></embed>

## Cell Callback

```js
CellCallback = (node: Node, spreadsheet: SpreadSheet, ...restOptions: unknown[]) => G.Group;
```

Function description: custom cell

| parameter   | illustrate                                                           | type                                                | Defaults | required |
| ----------- | -------------------------------------------------------------------- | --------------------------------------------------- | -------- | :------: |
| node        | The currently rendered node node                                     | [node](/docs/api/basic-class/node)               | -        |     ✓    |
| spreadsheet | Table class instance, which can access any configuration information | [SpreadSheet](/docs/api/basic-class/spreadsheet) | -        |     ✓    |
| restOptions | Indeterminate parameters, pass additional information                | `unknown[]`                                         | -        |          |

## CornerHeaderCallback

```js
CornerHeaderCallback = (parent: S2CellType, spreadsheet: SpreadSheet, ...restOptions: unknown[]) => void;
```

Function description: custom corner head

| parameter   | illustrate                                                           | type                                                | Defaults | required |
| ----------- | -------------------------------------------------------------------- | --------------------------------------------------- | -------- | :------: |
| parents     | parent cell                                                          | [S2CellType](#s2celltype)                           | -        |     ✓    |
| spreadsheet | Table class instance, which can access any configuration information | [SpreadSheet](/docs/api/basic-class/spreadsheet) | -        |     ✓    |
| restOptions | Indeterminate parameters, pass additional information                | `unknown[]`                                         | -        |          |

<embed src="@/docs/common/custom/layoutHierarchy.zh.md"></embed>

<embed src="@/docs/common/custom/layoutArrange.zh.md"></embed>

<embed src="@/docs/common/custom/layoutCoordinate.zh.md"></embed>

<embed src="@/docs/common/custom/layoutDataPosition.zh.md"></embed>

<embed src="@/docs/common/custom/headerActionIcons.zh.md"></embed>

## HeaderActionIconProps

Function description: After clicking the custom operation icon, the current icon returned by the pivot table is related

| parameter | illustrate                               | type   | Defaults | required |
| --------- | ---------------------------------------- | ------ | -------- | :------: |
| iconName  | The name of the currently clicked icon   | string | -        |     ✓    |
| meta      | The meta information of the current cell | node   | -        |     ✓    |
| event     | Current click event information          | event  | false    |     ✓    |

<embed src="@/docs/common/custom/customSvgIcons.zh.md"></embed>

## FilterDataItemCallback

```js
FilterDataItemCallback = (valueField: string, data: DataItem) => DataItem
```

Function description: convert, filter data

| parameter  | illustrate                                                           | type                  | Defaults | required |
| ---------- | -------------------------------------------------------------------- | --------------------- | -------- | :------: |
| valueField | Table class instance, which can access any configuration information | `string`              | -        |     ✓    |
| data       | Data Format                                                          | [DataItem](#dataitem) | -        |     ✓    |

## MappingDataItemCallback

```js
MappingDataItemCallback = (valueField: string, data: DataItem) => Record<string, string | number> | DataItem;
```

Function description: data implicit, used to display in tooltip

| parameter  | illustrate                                                           | type                  | Defaults | required |
| ---------- | -------------------------------------------------------------------- | --------------------- | -------- | :------: |
| valueField | Table class instance, which can access any configuration information | `string`              | -        |     ✓    |
| data       | Data Format                                                          | [DataItem](#dataitem) | -        |     ✓    |

## DataItem

Function description: basic data format

```ts
export interface MultiData {
  label?: string;
  values: (string | number)[][];
}

export type SimpleDataItem = string | number;

export type DataItem = SimpleDataItem | MultiData;
```

## LayoutResult

| parameter      | illustrate                                                                    | type                                                | Defaults | required |
| -------------- | ----------------------------------------------------------------------------- | --------------------------------------------------- | -------- | :------: |
| colNodes       | all nodes in the column                                                       | [Node\[\]](/docs/api/basic-class/node)           |          |          |
| cols Hierarchy | column structure information                                                  | [Hierarchy](#hierarchy)                             |          |          |
| rowNodes       | all nodes of the row                                                          | [Node\[\]](#node)                                   |          |          |
| rowsHierarchy  | row structure information                                                     | [Hierarchy](#hierarchy)                             |          |     ✓    |
| rowLeafNodes   | All leaf nodes of the row, for Cartesian intersection                         | [Node\[\]](/docs/api/basic-class/node)           |          |          |
| colLeafNodes   | All leaf nodes of the column, for Cartesian intersection                      | [Node\[\]](/docs/api/basic-class/node)           |          |          |
| getViewMeta    | Obtain the information corresponding to the coordinates of \[x,y] crossed out | `(rowIndex: number, colIndex: number) => ViewMeta`  |          |          |
| spreadsheet    | Table class instance, which can access any configuration information          | [SpreadSheet](/docs/api/basic-class/spreadsheet) |          |          |

## DataSet

```js
DataSet = (spreadsheet: SpreadSheet) => BaseDataSet;
```

## MergedCellInfo

<embed src="@/docs/common/merged-cell.zh.md"></embed>
