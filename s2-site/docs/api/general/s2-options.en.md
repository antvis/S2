---
title: S2Options
order: 1

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
| height                      | `number`                                            |          | 480                       | table height                                                                                                                                                                                                           |
| debug                       | `boolean`                                           |          | `false`                   | Whether to enable debug mode                                                                                                                                                                                          |
| hierarchyType               | `"grid" \| "tree"`                                  |          | `grid`                    | The display method of row headers, grid: tiled grid structure, tree: tree structure. Supports [custom structure](/manual/advanced/custom/custom-header)                                                               |
| conditions                  | [Conditions](#conditions)                           |          |                           | Conditional Mode Configuration                                                                                                                                                                                        |
| totals                      | [Totals](#totals)                                   |          |                           | Subtotal Total Configuration                                                                                                                                                                                          |
| tooltip                     | [Tooltip](#tooltip)                                 |          |                           | tooltip configuration                                                                                                                                                                                                 |
| interaction                 | [Interaction](#interaction)                         |          |                           | Table interaction configuration                                                                                                                                                                                        |
| pagination                  | [Pagination](#pagination)                           |          |                           | paging configuration                                                                                                                                                                                                  |
| frozen                      | [Frozen](#frozen)                                   |          |                           | Row and Column Header Freezing Configuration                                                                                                                                                                                  |
| seriesNumber                | [SeriesNumber](#seriesnumber)                       |          |                           | Series number column configuration                                                                                                                                                                                  |
| showDefaultHeaderActionIcon | `boolean`                                           |          | `true`                    | Whether to display the default row and column header operation icons                                                                                                                                                  |
| headerActionIcons           | [HeaderActionIcon\[\]](#headeractionicon)           |          | `false`                   | Customize row and column header action icons (need to set `showDefaultHeaderActionIcon` to `false` )                                                                                                                  |
| customSVGIcons              | [CustomSVGIcon\[\]](#customsvgicon)                 |          | `false`                   | Custom svg icons                                                                                                                                                                                                      |
| style                       | [Style](#style)                                     |          |                           | Cell style settings, such as layout type, width and height, margin, whether to hide the value column header, etc.                                                                                                     |
| hd                          | `boolean`                                           |          | `true`                    | Whether to enable high-definition screen adaptation to solve the problem of blurred font rendering on high-definition retina screens when switching between multiple screens. [see more](/manual/advanced/hd-adapter) |
| mergedCellsInfo             | [MergedCellInfo\[\]\[\]](#mergedcellinfo)           |          |                           | Merge cell information                                                                                                                                                                                                |
| placeholder                 | [Placeholder](#placeholder)                         |          |                           | Empty data placeholder configuration                                                                                                                                                                                          |
| cornerText                  | `string`                                            |          |                           | Custom corner header text (valid only in tree mode)                                                                                                                                                                    |
| cornerExtraFieldText        | `string`                                            |          | `数值`                     | Customize the text of the virtual value field of the corner header (valid when value is in row headers)                                                                                                                |
| dataCell                    | [DataCellCallback](#datacellcallback)               |          |                           | custom data cell                                                                                                                                                                                                           |
| cornerCell                  | [CellCallback](#cellcallback)                       |          |                           | Custom cornerCell                                                                                                                                                                                                     |
| seriesNumberCell            | [CellCallback](#cellcallback)                       |          |                           | Custom series number cell                                                                                                                                                                                             |
| rowCell                     | [CellCallback](#cellcallback)                       |          |                           | Custom row header cell                                                                                                                                                                                                    |
| colCell                     | [CellCallback](#cellcallback)                       |          |                           | Custom column header cell                                                                                                                                                                                             |
| mergedCell                  | [MergedCellCallback](#mergedcellcallback)           |          |                           | Custom merged cell                                                                                                                                                                                                    |
| frame                       | [FrameCallback](#framecallback)                     |          |                           | Custom table frame/border                                                                                                                                                                                             |
| cornerHeader                | [CornerHeaderCallback](#cornerheadercallback)       |          |                           | custom corner header                                                                                                                                                                                                     |
| layoutHierarchy             | [LayoutHierarchy](#layouthierarchy)                 |          |                           | custom hierarchy                                                                                                                                                                                                      |
| layoutArrange               | [LayoutArrange](#layoutarrange)                     |          |                           | custom sort order (valid in tree mode)                                                                                                                                                                                     |
| layoutCoordinate            | [layoutCoordinate](#layoutcoordinate)               |          |                           | custom cell node coordinates                                                                                                                                                                                               |
| layoutCellMeta              | [layoutCellMeta](#layoutcellmeta)                   |          |                           | custom cell metadata                                                                                                                                                                                                  |
| layoutSeriesNumberNodes     | [LayoutSeriesNumberNodes](#layoutseriesnumbernodes) |          |                           | custom series number nodes                                                                                                                                                                                            |
| dataSet                     | [DataSet](#dataset)                                 |          |                           | custom data set                                                                                                                                                                                                       |
| facet                       | (spreadsheet: [SpreadSheet](/api/basic-class/spreadsheet)) => [BaseFacet](/api/basic-class/base-facet) |      |         | custom facet                                                                                                                                |
| device                      | `"pc" \| "mobile"`                                  |          |                           | Device type                                                                                                                                                                                                           |
| transformCanvasConfig       | (renderer: [Renderer](https://g.antv.antgroup.com/api/canvas/options#renderer), spreadsheet: [SpreadSheet](/api/basic-class/spreadsheet)) => Partial<[CanvasConfig](https://g.antv.antgroup.com/api/canvas/options)> \| void |      | `-`     | Custom AntV/G rendering engine [configuration](https://g.antv.antgroup.com/api/canvas/options) & [plugin registration](https://g.antv.antgroup.com/plugins/intro) |
| rendererConfig              | `Partial<RendererConfig>`                           |          |                           | Custom AntV/G rendering engine configuration                                                                                                                                                                          |
| future                      | [Future](#future)                                   |          |                           | Enable some experimental features (currently unstable, may change in the future)                                                                                                                                       |

<embed src="@/common/conditions.en.md"></embed>

<embed src="@/common/series-number.en.md"></embed>

<embed src="@/common/frozen.en.md"></embed>

<embed src="@/common/interaction.en.md"></embed>

<embed src="@/common/totals.en.md"></embed>

<embed src="@/common/tooltip.en.md"></embed>

<embed src="@/common/custom-tooltip.en.md"></embed>

<embed src="@/common/pagination.en.md"></embed>

<embed src="@/common/style.en.md"></embed>

## DataCellCallback

```js
DataCellCallback = (viewMeta: ViewMeta, s2: Spreadsheet) => G.Group;
```

Function description: custom value cell, [ViewMeta](#viewmeta)

<embed src="@/common/view-meta.en.md"></embed>

## CellCallback

```js
CellCallback = (node: Node, spreadsheet: SpreadSheet, ...restOptions: unknown[]) => G.Group;
```

Function description: custom cell. [View example](/examples/custom/custom-cell#row-cell)

| parameter   | illustrate                                                           | type                                             | Defaults | required |
| ----------- | -------------------------------------------------------------------- | ------------------------------------------------ | -------- | -------- |
| node        | The currently rendered node                                          | [Node](/api/basic-class/node)                    | -        | ✓        |
| spreadsheet | Table class instance, which can access any configuration information | [SpreadSheet](/api/basic-class/spreadsheet)      | -        | ✓        |
| restOptions | Indeterminate parameters, pass additional information                | `unknown[]`                                      | -        |          |

## MergedCellCallback

```js | pure
MergedCellCallback = (s2: Spreadsheet, cells: S2CellType[], viewMeta: ViewMeta) => MergedCell;
```

Function description: custom merged cell. [View example](/examples/custom/custom-cell/#custom-merged-cell)

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

<embed src="@/common/custom/layoutHierarchy.en.md"></embed>

<embed src="@/common/custom/layoutArrange.en.md"></embed>

<embed src="@/common/custom/layoutCoordinate.en.md"></embed>

<embed src="@/common/custom/layoutCellMeta.en.md"></embed>

<embed src="@/common/custom/layoutSeriesNumberNodes.en.md"></embed>

<embed src="@/common/custom/headerActionIcons.en.md"></embed>

## HeaderActionIconProps

Function description: After clicking the custom operation icon, the current icon returned by the pivot table is related

| parameter | illustrate                               | type   | Defaults | required |
| --------- | ---------------------------------------- | ------ | -------- | -------- |
| iconName  | The name of the currently clicked icon   | string | -        | ✓        |
| meta      | The meta information of the current cell | node   | -        | ✓        |
| event     | Current click event information          | event  | false    | ✓        |

<embed src="@/common/custom/customSvgIcons.en.md"></embed>

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

Function description: Basic data format. [View documentation](/manual/advanced/get-cell-data#%E8%8E%B7%E5%8F%96%E6%8C%87%E5%AE%9A%E5%8C%BA%E5%9F%9F%E5%8D%95%E5%85%83%E6%A0%BC%E8%8A%82%E7%82%B9)

| parameter         | illustrate                                                           | type                                               | Defaults | required |
| ----------------- | -------------------------------------------------------------------- | -------------------------------------------------- | -------- | -------- |
| colNodes          | Column header nodes (including non-visible area)                     | [Node\[\]](/api/basic-class/node)                  |          |          |
| colLeafNodes      | Column header leaf nodes (including non-visible area)                | [Node\[\]](/api/basic-class/node)                  |          |          |
| colsHierarchy     | Column header nodes hierarchy structure (including non-visible area) | [Hierarchy](#hierarchy)                            |          |          |
| rowNodes          | Row header nodes (including non-visible area)                        | [Node\[\]](#node)                                  |          |          |
| rowLeafNodes      | Row header leaf nodes (including non-visible area)                   | [Node\[\]](/api/basic-class/node)                  |          |          |
| rowsHierarchy     | Row header nodes hierarchy structure (including non-visible area)    | [Hierarchy](#hierarchy)                            |          | ✓        |
| seriesNumberNodes | Series number nodes (including non-visible area)                     | [Node\[\]](/api/basic-class/node)                  |          |          |
| cornerNodes       | Corner nodes (including non-visible area)                            | [Node\[\]](/api/basic-class/node)                  |          |          |

## DataSet

Function description: Custom data set. [View example](/examples/custom/custom-dataset/#custom-strategy-sheet-dataset)

```js | pure
DataSet = (spreadsheet: SpreadSheet) => BaseDataSet;
```

## Placeholder

Function description: Empty data placeholder configuration

| parameter | illustrate                             | type                                                                              | Defaults | required |
| --------- | -------------------------------------- | --------------------------------------------------------------------------------- | -------- | -------- |
| cell      | Empty cell placeholder                 | `((meta: Record<string, any>) => string \| undefined \| null) \| string \| null`  | `'-'`    |          |
| empty     | Empty data placeholder (for table)     | [EmptyPlaceholder](#emptyplaceholder)                                             |          |          |

### EmptyPlaceholder

Function description: Empty data placeholder configuration (for table mode)

| parameter   | illustrate                                                            | type     | Defaults     | required |
| ----------- | --------------------------------------------------------------------- | -------- | ------------ | -------- |
| icon        | Custom Icon, supports customSVGIcons registration and built-in icons | `string` | `"Empty"`    |          |
| description | Custom description content                                            | `string` | `"No Data"`  |          |

## Future

Function description: Enable some experimental features

> [!WARNING]
> These features are currently unstable and may change in the future

| parameter                   | illustrate                  | type      | Defaults | required |
| --------------------------- | --------------------------- | --------- | -------- | -------- |
| experimentalReuseCell   | Whether to reuse cells to improve performance | `boolean` | `false`  |          |

## MergedCellInfo

<embed src="@/common/merged-cell.en.md"></embed>
