---
title: S2Options
order: 1
---

Form parameter configuration
| parameter                        | type                                          | required    |  default value                    | function description                                                                          |
| --------------------------- | --------------------------------------------- | ------- | ------------------------- | --------------------------------------------------------------------------------- |
| width                       | `number`                                      |         | 600                       | table width                                                                          |
| height                      | `number`                                      |         | 480                       | table height                                                                          |
| debug                       | `boolean`                                     |         | `false`                   | whether to enable debug mode                                                                  |
| hierarchyType               | `grid` \| `tree`                              |         | `grid`                    | row header layout style，grid：grid structure， tree： tree structure                              |
| conditions                  | [Conditions](#conditions)                     |         |                           | conditions pattern configuration                                                                      |
| totals                      | [Totals](#totals)                             |         |                           | grand total, sub total configuration                                                                      |
| tooltip                     | [Tooltip](#tooltip)                           |         |                           | tooltip configuration                                                                      |
| interaction                 | [Interaction](#interaction)                   |         |                           | table interaction configuration                                                                      |
| pagination                  | [Pagination](#pagination)                     |         |                           | pagination configuration                                                                          |
| frozenRowHeader             | `boolean`                                     |         | `true`                    | freeze row header(only used for table mode)                                                           |
| showSeriesNumber            | `boolean`                                     |         | `false`                   | whether to show series number                                                                    |
| seriesNumberText            | `string`                                      |         | `序号`                    | customized series number corner cell text                                                                    |
| showDefaultHeaderActionIcon | `boolean`                                     |         | `true`                    | whether to show default header action icons |
| headerActionIcons           | [HeaderActionIcon[]](#headeractionicon)       |         | `false`                   | customized action icons(with prerequisite to turn off `showDefaultHeaderActionIcon`)         |
| customSVGIcons              | [CustomSVGIcon[]](#customsvgicon)             |         | `false`                   | customize svg icons
| style                       | [Style](#style)                               |         |                           | cell style configurations, such as layout type, width, height,margin and etc.|
| frozenRowCount              | `number`                                      |         |                           | the number of frozen rows, from counting from top (only used for table mode)                                      |
| frozenColCount              | `number`                                      |         |                           | number of frozen columns, counting from left (only used for table mode)                                       |
| frozenTrailingRowCount      | `number`                                      |         |                           | he number of frozen columns, counting from the bottom side (only used for table mode)                            |
| frozenTrailingColCount      | `number`                                      |         |                           | he number of frozen columns, counting from the right side (only used for table mode)                                      |
| hdAdapter                   | `boolean`                                     |         | `true`                    | whether to enable high definition adaption, to solve the problem of blurred font rendering on retina screen when switching between multiple screens|
| mergedCellsInfo             | [MergedCellInfo[][]](#mergedcellinfo)         |         |                           | merged cells info                                                                    |
| placeholder                 | `(meta: Record<string, any>) => string        | string` |                           |                                                                                   | placeholder for empty cells |
| cornerText                  | string                                        |         |                           | customize corner cell text 自定义角头文本 （only used for `hierarchyType: customTree`）                    |
| cornerExtraFieldText        | string                                        |         |                           | customize text of the virtual value of the corner cell (valid when the value is the row header, replace the two words "value")             |
| dataCell                    | [DataCellCallback](#datacellcallback)         |         |                           | customize data cell cell                                                                 |
| cornerCell                  | [CellCallback](#cellcallback)                 |         |                           | customize corner cell                                                                 |
| rowCell                     | [CellCallback](#cellcallback)                 |         |                           | customize row cell                                                                    |
| colCell                     | [CellCallback](#cellcallback)                 |         |                           | customize col cell                                                                   |
| cornerHeader                | [CornerHeaderCallback](#cornerheadercallback) |         |                           | customize corner header                                                                        |
| layoutHierarchy             | [LayoutHierarchy](#layouthierarchy)           |         |                           | customize layout hierarchy                                                                    |
| layoutArrange               | [LayoutArrange](#layoutarrange)               |         |                           | customize layout arrange                                                                    |
| layoutCoordinate            | [layoutCoordinate](#layoutcoordinate)         |         |                           | customize coordinate                                                                        |
| layoutDataPosition          | [layoutDataPosition](#layoutdataposition)     |         |                           | customize data position                                                                        |
| dataSet                     | [DataSet](#dataset)                           |         |                           | customize data set                                                                      |
| supportCSSTransform         | `boolean`                                     |         | `false`                   | make mouse coordinates respond incorrectly when customize `transform` style in parent node|
| devicePixelRatio            | `number`                                      |         | `window.devicePixelRatio` | custom device pixel ratio

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
