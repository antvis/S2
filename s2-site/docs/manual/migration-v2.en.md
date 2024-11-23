---
title: S2 2.0 Migration Guide
order: 9
tag: New
---

This document will help you upgrade from S2 `1.x` to S2 `2.x`.

## 🏠 Official Website Changes

:::warning{title="Note"}
The original websites <https://s2.antv.vision> and <https://antv-s2.gitee.io> are no longer maintained. Please visit the latest URL to ensure you're not viewing outdated documentation.
:::

- Original `v1` website has moved to <https://s2-v1.antv.antgroup.com>.
- <https://s2.antv.antgroup.com> will serve as the default `v2` website.

## 🏷️ npm dist-tag Changes

> What is [dist-tag](https://docs.npmjs.com/adding-dist-tags-to-packages/)?

[`S2 2.0`](https://s2.antv.antgroup.com) official version has been released. Now the [`latest` dist-tag](https://docs.npmjs.com/cli/v10/commands/npm-dist-tag) on `npm` defaults to `2.x` version:

- ~~`@antv/s2@latest` => `@antv/s2@1.x.x`~~

- `@antv/s2@latest` => `@antv/s2@2.x.x`

:::warning{title="Note"}
**If installing without specifying a version, be careful not to accidentally install the new `2.0` version.**
:::

## ⏰ Discontinued Packages and Versions

- Version `1.x` is now discontinued, will no longer be updated, bugs fixed, or new features added.
- `@antv/s2-vue` is now discontinued. Due to limited resources and maintenance costs, combined with package download volume considerations, it will no longer be updated after `2.0.0` official release. Please encapsulate based on `@antv/s2` yourself or fork the repository for secondary development of community versions.

Please upgrade to `2.x` version according to the [Migration Guide](/manual/migration-v2).

## 🛺 From 2.0.0-next.x to 2.0.0 Official Release

If you are using the beta version `2.0.0-next.x`, pay attention to these additional incompatible changes when upgrading to `2.0` official release:

- [Build Output Adjustments](#-build-output-adjustments)
- [Remove Ant Design Component Library Dependencies](#remove-ant-design-component-library-dependencies)
- [Tooltip Operation Menu Component Removal](#tooltip-operation-menu-component-removal)

## 📦 Installation

<embed src="@/docs/common/install.en.md"></embed>

<embed src="@/docs/common/packages.en.md"></embed>

## ⭐ New Features

Features marked with <Badge type="success">New</Badge> and <Badge>Updated</Badge> in the official documentation indicate new functionality. You can also check out the official blog post [S2 2.0: A New Era for Data Tables](https://www.yuque.com/antv/blog/1122_7_s2).

## 📦 Build Output Adjustments

- `ESModule/CommonJS`

The `ESModule (esm)` and `CommonJS (lib)` build outputs for all packages have been changed from `Bundle` to `Bundless`. Dependent sub-modules are now directly copied without compilation to better support code `tree shaking` and reduce package size.

- `UMD`

The `UMD (dist)` build outputs remain as single `Bundle` files, but **filenames** and **global variable names** have been adjusted:

| Package Name     | Filename (Before)                        | Filename (After)                                |
| ---------------- | ---------------------------------------- | ----------------------------------------------- |
| `@antv/s2`       | `dist/index.min.js` `dist/style.min.css` | `dist/s2.min.css` `dist/s2.min.css`             |
| `@antv/s2-react` | `dist/index.min.js` `dist/style.min.css` | `dist/s2-react.min.css` `dist/s2-react.min.css` |
| `@antv/s2-vue`   | `dist/index.min.js` `dist/style.min.css` | `dist/s2-vue.min.css` `dist/s2-vue.min.css`     |

| Package Name     | Global Variable (Before) | Global Variable (After) |
| ---------------- | ------------------------ | ----------------------- |
| `@antv/s2`       | `S2`                     | `S2`                    |
| `@antv/s2-react` | `S2-React`               | `S2React`               |
| `@antv/s2-vue`   | `S2-Vue`                 | `S2Vue`                 |

## 📣 Incompatible Changes

### Core Package (s2) <Badge>@antv/s2</Badge>

#### Upgraded Rendering Engine to `AntV/G 6.0`

The table rendering engine has been upgraded to [`G 6.0`](https://g.antv.antgroup.com/) major version to stay in sync with other [`AntV` technology stacks](https://antv.antgroup.com/). Rendering is now **asynchronous**.

```diff
- s2.render()
+ await s2.render()
```

If you use custom `G` shapes in your business scenarios, such as custom rectangles, images, etc., or other capabilities, please note the replacements. For details, see G's [official documentation](https://g.antv.antgroup.com/api/basic/image).

```diff
+ import { Image } from '@antv/g';

+ this.appendChild(new Image({ style: {} }))

- this.addShape('image', { attrs: {} });
```

The same applies to other [shapes](https://g.antv.antgroup.com/api/basic/concept).

#### Separation of S2 and G Configurations

In `1.x`, we passed properties like `supportsCSSTransform` and `devicePixelRatio` from `S2Options` to `G`.

In `2.x`:

- Removed `devicePixelRatio` and `supportsCSSTransform (supportCSSTransform)`.
- Added `transformCanvasConfig` to support passing `G` configurations and registering plugins. See [Register AntV/G Plugins](/manual/advanced/g-plugins) documentation for details.

```tsx | pure
const s2Options = {
  transformCanvasConfig(renderer) {
    renderer.setConfig({ enableDirtyCheck: true })
    renderer.registerPlugin(new PluginA11y({ enableExtractingText: true }));

    return {
      supportsCSSTransform: true,
      devicePixelRatio: 2
    };
  },
}
```

#### Custom Width/Height Configuration Adjustments

1. Changed `rowCfg/colCfg/cellCfg` to `rowCell/colCell/dataCell`.

```diff
const s2Options = {
  style: {
-   rowCfg: {},
-   colCfg: {},
-   cellCfg: {},

+   rowCell: {},
+   colCell: {},
+   dataCell: {},
  }
}
```

2. Deprecated `widthByFieldValue`, added `widthByField`.
3. Row and column width/height now support dynamic configuration.

```diff
export interface BaseCellStyle {
  width?: number | (node) => number;
- height?: number;
+ height?: number | (node) => number;
- widthByFieldValue?: Record<string, number>;
+ widthByField?: Record<string, number>;
  heightByField?: Record<string, number>;
}
```

4. Now `widthByField` and `heightByField` support both dimension `id` and dimension `field`.

See [Custom Cell Width/Height](/manual/advanced/custom/cell-size) documentation for details.

#### Tooltip Configuration Adjustments

1. Changed `row/col/data/corner` to `rowCell/colCell/dataCell/cornerCell`.

```diff
const s2Options = {
  tooltip: {
-   row: {},
-   col: {},
-   data: {},
-   corner: {},

+   rowCell: {},
+   colCell: {},
+   dataCell: {},
+   cornerCell: {},
  }
}
```

2. Changed `showTooltip` and `renderTooltip` to `enable` and `render`.

```diff
const s2Options = {
  tooltip: {
-   showTooltip: true,
-   renderTooltip: () => new CustomTooltip(),

+   enable: true,
+   render: () => new CustomTooltip(),
  }
}
```

3. Configuration changes for API calls

Removed `enterable` property, changed `showSingleTips` to `onlyShowCellText`, changed `onlyMenu` to `onlyShowOperator`

```diff
s2.showTooltip({
  options: {
-   enterable: true,
-   showSingleTips: true,
+   onlyShowCellText: true,
-   onlyMenu: true,
+   onlyShowOperator: true
  },
});
```

See [Tooltip](/manual/basic/tooltip) documentation for details.

#### Copy/Export Adjustments

1. Configuration consolidated under `interaction.copy`, added `customTransformer` for custom transformations.

```diff
const s2Options = {
  interaction: {
-   enableCopy: true,
-   copyWithHeader: true,
-   copyWithFormat: true

+   copy: {
+     enable: true,
+     withHeader: true,
+     withFormat: true,
+     customTransformer: () => {}
+   },
  }
}
```

2. Deprecated `copyData`, added `asyncGetAllData`, `asyncGetAllPlainData`, `asyncGetAllHtmlData` and other APIs to support asynchronous data retrieval.

```diff
- const data = copyData(spreadsheet, '\t', false)

+ const data = await asyncGetAllData({
+   sheetInstance: s2,
+   split: '\t',
+   formatOptions: false,
+   async: true,
});
```

3. Changed second parameter meaning in `copyToClipboard` from `sync` to `async`.

```diff
- const data = copyToClipboard(data: string, sync: boolean)
+ const data = copyToClipboard(data: Copyable | string, async: boolean)
```

4. Copy is enabled by default.
5. Copy/export is asynchronous by default.

See [Copy and Export](/manual/advanced/interaction/copy) documentation for details.

#### Brush Selection Configuration Adjustments

1. Changed `row/col/data` to `rowCell/colCell/dataCell`.

```diff
const s2Options = {
  interaction: {
-   brushSelection: {
-     row: false,
-     col: false,
-     data: true,
-   },

+   brushSelection: {
+     rowCell: true,
+     colCell: true,
+     dataCell: true,
+   }
  }
}
```

2. Brush selection is enabled by default for all cells.

See [Basic Interactions](/manual/advanced/interaction/basic) documentation for details.

#### headerActionIcons Configuration Adjustments

Changed `iconsNames` to `icons`, deprecated `action`, added `onClick` and `onHover`.

```diff
const s2Options = {
  headerActionIcons: [
    {
-      iconNames: ['SortDown'],
-      action: () => {}

+      icons: ['SortDown'],
+      onClick: () => {}
+      onHover: () => {}
    },
  ],
}
```

Now supports configuring `position (icon position relative to text)` and `fill (color configuration)`, and allows setting independent `displayCondition` and `defaultHide` for individual icons.

```diff
const s2Options = {
  headerActionIcons: [
    {
+     icons: [{
+       name: 'SortDown',
+       position: 'right',
+       fill: '#000',
+       displayCondition: () => {},
+       defaultHide: () => {},
+     }]
    },
  ],
}
```

See [Custom Icon](/manual/advanced/custom/custom-icon) documentation for details.

#### customSVGIcons Configuration Adjustments

Changed `svg` to `src` for API consistency.

```diff | pure
const s2Options = {
  customSVGIcons: [
    {
      name: 'CustomIcon',
-     svg: 'https://gw.alipayobjects.com/zos/bmw-prod/f44eb1f5-7cea-45df-875e-76e825a6e0ab.svg',
+     src: 'https://gw.alipayobjects.com/zos/bmw-prod/f44eb1f5-7cea-45df-875e-76e825a6e0ab.svg',
    },
  ]
}
```

#### Tree Structure Configuration and Callback Event Adjustments

1. Row Header Collapse/Expand Configuration Changes

Deprecated `rowExpandDepth/collapsedRows/hierarchyCollapse`, replaced with more semantic `expandDepth/collapseFields/collapseAll`.

```diff
const s2Options = {
  hierarchyType: 'tree',
  style: {
-   rowExpandDepth: 0,
-   collapsedRows: {},
-   hierarchyCollapse: true,

+   rowCell: {
+     expandDepth: 0,
+     collapseFields: {},
+     collapseAll: true
    }
  },
}
```

2. Row Header Width Configuration Changes in Tree Structure

Deprecated `treeRowsWidth`, replaced with `rowCell.width`.

```diff
const s2Options = {
  hierarchyType: 'tree',
  style: {
-   treeRowsWidth: 200
+   rowCell: {
+     width: 200,
+   }
  },
}
```

3. `customTree` and `customTreeItems` have been deprecated.

The original way of customizing tree structures has been deprecated. Now custom structures support both `flat` and `tree` modes.

```diff
const s2Options = {
-  hierarchyType: 'customTree',
+  hierarchyType: 'tree',
}

const s2DataConfig = {
  fields: {
-    customTreeItems: [
-      {
-        key: 'custom-node-1',
-        title: 'Custom Node A',
-        description: 'Custom Node A Description',
-        children: []
-      }

+    rows: [
+      {
+        field: 'custom-node-1',
+        title: 'Custom Node A',
+        description: 'Custom Node A Description',
+        children: []
+      }
    ]
  }
}
```

See [Custom Row/Column Header Grouping](/manual/advanced/custom/custom-header) documentation for details.

4. Row Header Cell Collapse/Expand Events Moved to `RowCell`

Removed `LAYOUT_AFTER_COLLAPSE_ROWS`

```diff
- S2Event.LAYOUT_TREE_ROWS_COLLAPSE_ALL
+ S2Event.ROW_CELL_ALL_COLLAPSED

- S2Event.LAYOUT_COLLAPSE_ROWS
- S2Event.LAYOUT_AFTER_COLLAPSE_ROWS
+ S2Event.ROW_CELL_COLLAPSED
```

#### Tree Structure Icon Collapse/Expand State Synchronization

Now when row header node icons are expanded/collapsed, the corner header icon state (expand all/collapse all) will be synchronized accordingly.

#### Row/Column Freezing Configuration

Pivot table and detail table row/column freezing configurations are now consolidated under `frozen`.

In pivot tables, `frozenFirstRow` is replaced by `rowCount: 1`. In detail tables with multi-level column headers, freezing in `1.x` was based on the topmost node, while in `2.x` it's based on the number of leaf nodes.

```diff
const s2Options = {
-  frozenRowHeader: true,
-  frozenFirstRow: true,
-  frozenRowCount: 1;
-  frozenColCount: 1;
-  frozenTrailingRowCount: 1;
-  frozenTrailingColCount: 1;

+  frozen: {
+    rowHeader: true,
+    rowCount: 1;
+    colCount: 1;
+    trailingRowCount: 1;
+    trailingColCount: 1;
+  }
}
```

#### Pivot Table Row Header Freezing Configuration Changes

`rowHeader` now supports passing a `number`. If a numeric value is provided, it enables row header freezing with a custom maximum frozen width (0 - 1).

```diff
const s2Options = {
  frozen: {
-   rowHeader: true,
+   rowHeader: true,
+   rowHeader: 0.5,
  }
}
```

#### High DPI Adaptation Configuration Adjustment

```diff
const s2Options = {
-  hdAdapter: true,
+  hd: true,
}
```

#### Field Marking

Text field marking capabilities now align with [Text Theme Configuration](/api/general/s2-theme#texttheme), supporting font size, opacity, alignment, and other configurations.

```diff
const s2Options = {
  conditions: {
    text: [
      {
        field: 'city',
        mapping() {
          return {
            fill: '#DB6BCF',
+           fontSize: 16,
+           opacity: 0.8,
+           textAlign: 'right',
          };
        },
      },
    ]
  },
}
```

See [Field Marking](/manual/basic/conditions) documentation and [Text Marking Examples](/examples/analysis/conditions#text) for details.

#### Serial Number Configuration Changes

Serial number related configurations are now consolidated under `seriesNumber`.

```diff
const s2Options = {
- showSeriesNumber: true,
- seriesNumberText: 'No.'

+ seriesNumber: {
+   enable: true,
+   text: 'No.'
+ }
}
```

#### Cell Width/Height Drag Logic Changes

1. In `1.x`, width/height adjustments affected **all cells**. `2.x` adds `rowResizeType/colResizeType` to choose whether adjustments affect `current`, `selected`, or `all` cells.

```diff
const s2Options = {
  interaction: {
    resize: {
+     rowResizeType: 'current', // 'all' | 'selected'
+     colResizeType: 'current'  // 'all' | 'selected'
    }
  }
}
```

2. By default, adjustments only affect the current cell.
3. Selection state is no longer reset after width/height adjustments, only tooltip is closed.
4. Now supports batch adjustments after multiple selections.

See [Row/Column Width/Height Adjustment](/manual/advanced/interaction/resize) documentation for details.

#### Facet Changes

1. Static property `layoutResult` is deprecated, use `s2.facet.getLayoutResult()` to dynamically get results, which now includes `corner nodes (cornerNodes)` and `serial number nodes (seriesNumberNodes)`.

```diff
- s2.facet.layoutResult
+ s2.facet.getLayoutResult()
```

2. `getCellMeta` has been removed from `layoutResult` and moved to the `facet` level. Now `layoutResult` only contains layout nodes.

```diff
- s2.facet.layoutResult.getCellMeta(rowIndex, colIndex)
+ s2.facet.getCellMeta(rowIndex, colIndex)
```

3. Layout structure `layoutResult` now includes `corner nodes (cornerNodes)` and `serial number nodes (seriesNumberNodes)`.

```diff
export interface LayoutResult {
  colNodes: Node[];
  colLeafNodes: Node[];
  colsHierarchy: Hierarchy;
  rowNodes: Node[];
  rowsHierarchy: Hierarchy;
  rowLeafNodes: Node[];
- getCellMeta: (rowIndex: number, colIndex: number) => ViewMeta
+ seriesNumberNodes?: Node[];
+ cornerNodes?: Node[];
}
```

4. Pivot table and detail table value cell metadata formats are now unified, with `cellMeta` now including `query/rowQuery/colQuery` for both.

Pivot table:

```diff
{
  rowQuery: {
    "province": "Zhejiang",
    "city": "Ningbo"
  },
  colQuery: {
    "sub_type": "Sofa",
    "type": "Furniture",
    "$$extra$$": "number"
  },
+ query: {
+   "province": "Zhejiang",
+   "city": "Ningbo",
+   "sub_type": "Sofa",
+   "type": "Furniture",
+   "$$extra$$": "number"
+  }
}
```

Detail table:

```diff
{
+  rowQuery: {
+    "rowIndex": 1,
+  },
+  colQuery: {
+    "colIndex": 2,
+  },
+  query: {
+    "rowIndex": 1,
+    "colIndex": 2
+  }
}
```

5. Original `s2.getContentHeight()` is deprecated, moved to `s2.facet.getContentHeight()`.

```diff
- s2.getContentHeight()
+ s2.facet.getContentHeight()
+ s2.facet.getContentWidth()
```

6. APIs for getting layout nodes have been moved to the `s2.facet` namespace. Added rich [syntactic sugar](/api/basic-class/base-facet).

```diff
- s2.getRowNodes()
- s2.getRowLeafNodes()
- s2.getColumnLeafNodes()
- s2.getColumnNodes()

+ s2.facet.getRowNodes()
+ s2.facet.getRowLeafNodes()
+ s2.facet.getColLeafNodes()
+ s2.facet.getColNodes()
```

See [Get Cell Data](/manual/advanced/get-cell-data) and [BaseFacet](/api/basic-class/base-facet) documentation for details.

#### Rendering Parameter Changes

The render function's parameter has been expanded from `boolean` to `boolean | object`. When boolean, it's equivalent to `{ reloadData: boolean }`

```diff
- s2.render(true)
- s2.render(false)
- s2.render(false, { reBuildHiddenColumnsDetail: false })

+ s2.render({ reloadData: true }) // equivalent to s2.render(true)
+ s2.render({ reloadData: false }) // equivalent to s2.render(false)
+ s2.render({
+   reloadData: false,
+   rebuildHiddenColumnsDetail: false,
+ });
```

`reBuildDataSet` renamed to `rebuildDataSet`:
`reBuildHiddenColumnsDetail` renamed to `rebuildHiddenColumnsDetail`:

```diff
s2.render({
-  reBuildDataSet: false,
+  rebuildDataSet: false,
-  reBuildHiddenColumnsDetail: false,
+  rebuildHiddenColumnsDetail: false,
});
```

#### Subtotal/Grand Total Configuration Parameter Changes

Total-related configurations now consistently include `grandTotals` and `subTotals` prefixes to avoid ambiguity.

```diff
const s2Options = {
  totals: {
    row: {
-     calcTotals: {}.
-     reverseLayout: true,
-     label: 'Total'
-     subLabel: 'Subtotal'
-     totalsGroupDimensions: [],
-     reverseSubLayout: true,

+     calcGrandTotals: {}.
+     reverseGrandTotalsLayout: true,
+     grandTotalsLabel: 'Total',
+     subTotalsLabel: 'Subtotal',
+     grandTotalsGroupDimensions: [],
+     reverseSubTotalsLayout: true
    };
  }
}
```

#### Custom Text Drawing API Changes

Multi-column text drawing function `drawObjectText` renamed to `drawCustomContent`.

```diff
- import { drawObjectText } from '@antv/s2'
+ import { drawCustomContent } from '@antv/s2'
```

#### Dataset Processing Logic Changes

For data with multiple `values`, now expects all `values` information to be included in a single data item.

```js
{
  fields: {
    rows: ["province", "city"],
    columns: ["type", "subType"],
    values: ["number1", "number2"],
 }
}
```

```diff
- [
-   {
-     province: 'Liaoning',
-     city: 'Dazhou',
-     type: 'Table',
-     subType: 'Furniture',
-     number1: 3482.28,
-   },
-   {
-     province: 'Liaoning',
-     city: 'Dazhou',
-     type: 'Table',
-     subType: 'Furniture',
-     number2: 34,
-   },
- ];

+ [
+   {
+     province: 'Liaoning',
+     city: 'Dazhou',
+     type: 'Table',
+     subType: 'Furniture',
+     number1: 3482.28,
+     number2: 34,
+   },
+ ];
```

#### Dataset Query Logic Changes

1. Query field type changed from `string` to `CustomTreeNode | string`.

```diff
- s2.dataSet.getField(field: string)
- s2.dataSet.getFieldMeta(field: string)
- s2.dataSet.getFieldName(field: string)
- s2.dataSet.getFieldFormatter(field: string)

+ s2.dataSet.getField(field: CustomTreeNode | string)
+ s2.dataSet.getFieldMeta(field: CustomTreeNode | string)
+ s2.dataSet.getFieldName(field: CustomTreeNode | string)
+ s2.dataSet.getFieldFormatter(field: CustomTreeNode | string)
```

2. Cell data retrieval API parameters unified.

```diff
- s2.dataSet.getCellData(params: CellDataParams)
+ s2.dataSet.getCellData(params: GetCellDataParams)

- s2.dataSet.getMultiData(query: DateType, params: MultiDataParams)
- s2.dataSet.getMultiData(query: DataType, isTotals?: boolean, isRow?: boolean, drillDownFields?: string[], includeTotalData:boolean)
+ s2.dataSet.getCellMultiData(params: GetCellMultiDataParams)
```

See [Get Cell Data](/manual/advanced/get-cell-data) documentation for details.

#### S2DataConfig.totalData Configuration Removed

`totalData` merged with `data`, `totalData` configuration no longer needed.

```diff
{
-  data: [...],
-  totalData: [...],

+  data: [...data, ...totalData],
}
```

#### Pivot Table Value Cell Metadata Structure Changes

`this.meta.data` structure changes:

```diff
{
-  "number": 7789,
-  "province": "Zhejiang",
-  "city": "Hangzhou",
-  "type": "Furniture",
-  "sub_type": "Table",

+  "extraField": "number",
+    "raw": {
+    "number": 7789,
+    "province": "Zhejiang",
+    "city": "Hangzhou",
+    "type": "Furniture",
+    "sub_type": "Table"
+ },
+  "$$extra$$": "number",
+  "$$value$$": 7789,
+  "$$origin$$": {
+    "number": 7789,
+    "province": "Zhejiang",
+    "city": "Hangzhou",
+    "type": "Furniture",
+    "sub_type": "Table"
+  }
}
```

See [CellData](/api/basic-class/cell-data) documentation for details.

#### Cell Brush Selection State Changes

In `1.x`, row/column header brush selection state was `brushSelected`, while value cell brush selection state was `selected`. In `2.x`, these have been further unified and differentiated:

```diff
s2.interaction.getState()

// Row header
- stateName: "brushSelected"
+ stateName: "rowCellBrushSelected"

// Column header
- stateName: "brushSelected"
+ stateName: "colCellBrushSelected"

// Value cells
- stateName: "selected"
+ stateName: "dataCellBrushSelected"
```

#### Select All API Logic Adjustment

In `1.x`, select all was essentially highlighting, with only style updates but no actual selection. In `2.x`, this has been changed to the correct semantics, and selected cells can be retrieved.

```diff
s2.interaction.selectAll()
- s2.interaction.getActiveCells() // []
+ s2.interaction.getActiveCells() // [CellA, CellB]
```

#### Cell Selection API Adjustments

`selectHeaderCell` changed to `changeCell`, supporting selection of all cell types. Also supports syntactic sugar for `selection (selectCell)` and `highlighting (highlightCell)`.

```diff
- s2.interaction.selectHeaderCell(selectHeaderCellInfo: SelectHeaderCellInfo)
+ s2.interaction.changeCell(options: ChangeCellOptions)

+ s2.interaction.selectCell(cell: S2CellType)
+ s2.interaction.highlightCell(cell: S2CellType)
```

Also supports `animate (whether to show scroll animation)` and `skipScrollEvent (whether to trigger scroll event)` configurations.

```ts | pure
s2.interaction.selectCell(cell, {
  animate: true,
  skipScrollEvent: true
})
```

See [Highlight/Select Cell](/manual/advanced/interaction/highlight-and-select-cell) documentation for details.

#### Scroll API Adjustments

Scroll API `s2.updateScrollOffset` removed, unified under `s2.interaction` namespace. Also supports syntactic sugar like `scrollToCell` and `scrollToTop`.

```diff
- s2.updateScrollOffset(offsetConfig: ScrollOffsetConfig)
+ s2.interaction.scrollTo(offsetConfig: ScrollOffsetConfig)
```

Also supports `skipScrollEvent (whether to trigger scroll event)` configuration.

```diff
s2.interaction.scrollTo({
+  skipScrollEvent: false
})
```

See [Scroll](/manual/advanced/interaction/scroll) documentation for details.

#### Configuration Preprocessing API Changes

```diff
- import { getSafetyOptions, getSafetyDataConfig } from '@antv/s2'
+ import { setupOptions, setupDataConfig } from '@antv/s2'
```

#### Empty Data Placeholder Configuration Changes

In addition to supporting cell empty data placeholders, now supports configuring detail table [empty data states](/examples/custom/custom-cell/#empty-placeholder), similar to [Ant Design's Empty component](https://ant-design.antgroup.com/components/empty-cn) empty state effect. Configuration is separated into `cell` and `empty` to distinguish between the two states.

```diff
const s2Options = {
- placeholder: "-",
+ placeholder: {
+   cell: '-'
+ }
}
```

```diff
const s2Options = {
+ placeholder: {
+   empty: {
+     icon: 'Empty',
+     description: 'No Data'
+   }
+ }
}
```

See [Custom Empty Data Placeholder](/examples/custom/custom-cell/#empty-placeholder) and [Custom Cell Empty Data Placeholder](/examples/custom/custom-cell/#data-cell-placeholder) examples.

#### Internal Constants Renamed

```diff
- import { ROOT_ID, ID_SEPARATOR } from '@antv/s2'
+ import { ROOT_NODE_ID, NODE_ID_SEPARATOR } from '@antv/s2'
```

If you're using these, please note the changes. See [source code definition](https://github.com/antvis/S2/tree/next/packages/s2-core/src/common/constant) for details.

#### Custom Value Cell Parameter Changes

Added second parameter `spreadsheet` to maintain consistency with other cells.

```diff
const s2Options = {
   width: 600,
-  dataCell: (viewMeta) => {
-    return new CustomDataCell(viewMeta, viewMeta.spreadsheet);
-  }
+  dataCell: (viewMeta, spreadsheet) => {
+    return new CustomDataCell(viewMeta, spreadsheet);
+  }
}
```

#### Link Jump Logic and Parameter Changes

1. Link jumping now supports marking **column headers**, and in detail tables, it works for both `column headers` and `values` (with customizable rules).
2. Callback parameter `key` changed to `field`, `cellData` changed to `meta`.

```diff
s2.on(S2Event.GLOBAL_LINK_FIELD_JUMP, (data) => {
-  const { key, cellData, record } = data;
+  const { field, meta, record } = data;
});
```

See [Link Jump](/manual/advanced/interaction/link-jump) documentation for details.

#### ID Generation Rule Changes for Empty Row/Column Dimension Values

In `1.x`, dimension values were converted to strings, so empty values (null) would be converted to `"null"`, making it impossible to get the original dimension value. In `2.x`, special identifiers are added for these cases to correctly identify `null` cases, original dimension values, and empty value placeholder logic.

```diff
{
-  id: 'root[&]null',
-  value: 'null'

+  id: 'root[&]$$null$$',
+  value: null
}
```

#### Value Cell Value Range Retrieval Method Changes

```diff
- dataCell.valueRangeByField
+ dataCell.getValueRange()
```

#### Split Line Theme Configuration Default Value Changes

When no default values are set for split line `color` and `opacity`, they now default to match the cell border of their corresponding area.

```diff
splitLine: {
-  horizontalBorderColor: basicColors[12],
-  horizontalBorderColorOpacity: 0.2,
-  verticalBorderColor: basicColors[12],
-  verticalBorderColorOpacity: 0.25,
}
```

#### Cell Default Padding Changes

`paddingTop` and `paddingBottom` adjusted to `8px`.

```diff
{
-  top: 4,
+  top: 8,
-  bottom: 4,
+  bottom: 8
}
```

### Component Layer (s2-react) <Badge>@antv/s2-react</Badge>

#### Remove Ant Design Component Library Dependencies

:::info
The `2.0` official version removes the `antd` dependency, making the component internally lighter and no longer constrained by project `antd` versions, enabling smoother upgrades. Self-combination is recommended.
:::

##### Header Component Removal

`header` property removed, related configurations (`switcher`, `export`, `advancedSort`) and corresponding components moved to `@antv/s2-react-components`, can be **imported separately as needed**.

```diff
<SheetComponent
-  header={{
-    title: "",
-    description: "",
-    switcher: { open: true },
-    export: { open: true },
-    advancedSort: { open: true },
-  }}
/>
```

##### Internal ConfigProvider Removal

`SheetComponent` no longer wraps antd's `<ConfigProvider />` global configuration component. You can wrap `<ConfigProvider />` component externally to avoid compatibility issues with different `antd` versions.

```diff
import { ConfigProvider } from 'antd'

<SheetComponent>
-  <ConfigProvider />
</SheetComponent>

+ <ConfigProvider>
+  <SheetComponent />
+ </ConfigProvider>
```

##### Internal Spin Component Removal

```diff
import { Spin } from 'antd'

<SheetComponent>
-  <Spin />
</SheetComponent>

+ <Spin>
+  <SheetComponent />
+ </Spin>
```

In `1.x`, `<SheetComponent />` internally wrapped antd's `<Spin />` component. This has been removed and no longer has a `loading` effect. Added `onLoading`, allowing you to wrap related components externally for combined use.

**Generally, onLoading's effect is not very noticeable, it's recommended to control the `loading` effect based on the business-side API request status**.

```tsx | pure
import { Spin } from 'antd'

function App() {
  const [loading, setLoading] = React.useState(false)

  return (
    <Spin spinning={loading}>
      <SheetComponent onLoading={setLoading} />
    </Spin>
  )
}
```

##### Pagination Component Removal

1. `showPagination` property removed.

```diff
- <SheetComponent showPagination />
```

2. Provides `pagination` property, the table internally encapsulates S2's internal pagination update logic, can be used with any pagination component, such as antd's `<Pagination />`.

```tsx | pure
import { Pagination } from 'antd';

function App() {
  return (
    <SheetComponent options={s2Options}>
      {({ pagination }) => (
        // Use with any paginator: like antd's Pagination component
        <Pagination
          size="small"
          showTotal={(total) => `Total ${total} items`}
          {...pagination}
        />
      )}
    </SheetComponent>
  )
}
```

##### Advanced Sort Component Migration

```diff
- import { AdvancedSort } from '@antv/s2-react';
+ import { AdvancedSort } from '@antv/s2-react-components';
```

1. Configuration Changes

`sheet` changed to `sheetInstance`

```diff
- <AdvancedSort sheet={s2} />
+ <AdvancedSort sheetInstance={s2} />
```

See [Advanced Sort](/manual/advanced/analysis/advanced) documentation for details.

##### Dimension Switcher Component Migration

```diff
- import { Switcher } from '@antv/s2-react';
+ import { Switcher } from '@antv/s2-react-components';
```

1. Configuration Changes

Added `icon` configuration, changed `title` meaning, no longer used for custom entry, use `children` instead.

```diff
- <Switcher title={<Button>Switch Dimension</Button>} />

+ <Switcher title="Switch Dimension" icon={<SwapOutlined/>} />
+ <Switcher>
+   <Button>Switch Dimension</Button>
+ </Switcher>
```

See [Dimension Switcher](/manual/advanced/analysis/switcher) documentation for details.

##### Export Component Migration

```diff
- import { Export } from '@antv/s2-react';
+ import { Export } from '@antv/s2-react-components';
```

1. Configuration Changes

```diff
- <Export syncCopy={true} sheet={s2} />
+ <Export async={false} sheetInstance={s2} />
```

`icon` property removed, supports custom children.

```diff
- <Export icon={<MoreOutlined/> } />
+ <Export><Button type="text"><MoreOutlined /></Button></Export>
```

2. `Copy Original Data` and `Copy Formatted Data` now write both `text/plain` and `text/html` data to the clipboard.
3. Added `onCopySuccess/onCopyError`, `onDownloadSuccess/onDownloadError` APIs, removed `successText/errorText`, operations no longer show `message` tips by default.

```diff
<Export
-  successText="Operation successful"
-  errorText="Operation successful"
+  onCopySuccess={(data) => {
+    console.log('copy success:', data);
+  }}
+  onCopyError={(error) => {
+    console.log('copy failed:', error);
+  }}
+  onDownloadSuccess={(data) => {
+    console.log('download success', data);
+  }}
+  onDownloadError={(error) => {
+    console.log('download failed:', error);
+  }}
/>
```

4. Added `StrategyExport` component, suitable for trend analysis table data copying and exporting, used the same way as `Export`.

```ts
import { StrategyExport } from '@antv/s2-react-components';
```

See [Export](/manual/advanced/analysis/export) documentation for details.

##### Drill Down Component Migration

```diff
- import { DrillDown } from '@antv/s2-react';
+ import { DrillDown } from '@antv/s2-react-components';
```

1. Configuration Adjustments

```diff
- <DrillDown titleText="Drill Down" clearButtonText="Clear" />
+ <DrillDown title="Drill Down" clearText="Clear" />
```

2. When used in table component, need to pass `DrillDown` configuration panel through `render` property.

```diff
+ import { DrillDown } from '@antv/s2-react-components';

function App() {
  return (
    <SheetComponent
      sheetType="pivot"
      options={s2Options}
      partDrillDown={{
+       render: (props) => <DrillDown {...props} />,
      }}
    />
  )
}
```

See [Dimension Drill Down](/manual/advanced/analysis/drill-down) documentation for details.

##### Edit Table Input Component Replacement

antd's `Input.TextArea` component replaced with native `textarea`.

```diff
+ <Input.TextArea />
- <textarea />
```

##### Tooltip Operation Menu Component Removal

1. Internal **sort menu** and **operation items** depending on antd's [Menu component](https://ant-design.antgroup.com/components/menu-cn#api) removed, now need to explicitly declare UI components through `render`, final effect remains the same, default menu configuration (props) provided, can adjust usage based on project's actual `antd@v4` or `antd@v5` version.

```tsx | pure
import { Menu } from 'antd'

const s2Options = {
  tooltip: {
    operation: {
      menu: {
        render: (props) => {
          return <Menu {...props} />;
        },
      }
    }
  }
}
```

2. Configuration and API Parameter Adjustments

Menu items moved under `menu`

```diff
const s2Options = {
  tooltip: {
    operation: {
-     onClick: (cell) => {},
-     menus: [
-       {
-         key: 'custom-a',
-         text: 'Operation 1',
-         icon: 'Trend',
-         onClick: (cell) => {},
-         visible: (cell) => true,
-         children: [],
-       }
-     ],

+     menu: {
+       onClick: (info, cell) => {},
+       items: [
+         {
+           key: 'custom-a',
+           label: 'Operation 1',
+           icon: 'Trend',
+           onClick: (info, cell) => {},
+           visible: (info, cell) => true,
+           children: [],
+         }
+       ],
+     },
    },
  },
};

<SheetComponent options={s2Options} />
```

Also, when calling via API, `defaultSelectedKeys` changed to `selectedKeys`.

```diff
s2.showTooltip({
  options: {
    operator: {
      menu: {
-       defaultSelectedKeys: ['key-1'],
+       selectedKeys: ['key-1'],
      },
    },
  },
});
```

See [Tooltip](/manual/basic/tooltip) and [Group Sort](/manual/basic/sort/group) documentation for details.

#### React 18 Support

:::info{title="Note"}
React 19 has released its [RC version](https://react.dev/blog/2024/04/25/react-19), future compatibility will depend on circumstances.
:::

Version `2.x` of `@antv/s2-react` is adapted for `React 18`, while maintaining compatibility with `React 16 and 17`.

#### Ant Design Multi-version Coexistence (Not Recommended)

Since `antd@4.x` has been [discontinued](https://ant-design.antgroup.com/docs/blog/v4-ood-cn), the analysis component `@antv/s2-react-components` is developed based on `antd@5.x` by default. Although it uses basic components, full compatibility with `antd@4.x` depends on the differences between the two versions.

For projects using `antd@4.x`, or depending on other libraries that indirectly depend on `antd@4.x`, where upgrading to `antd@5.x` is not possible due to various historical reasons, you can temporarily transition using [multi-version coexistence](https://ant-design.antgroup.com/docs/react/migration-v5-cn#%E5%A4%9A%E7%89%88%E6%9C%AC%E5%85%B1%E5%AD%98).

```json
// $ npm install --save antd-v5@npm:antd@5
{
  "antd": "4.x",
  "antd-v5": "npm:antd@5"
}
```

Use webpack's built-in [`NormalModuleReplacementPlugin`](https://webpack.js.org/plugins/normal-module-replacement-plugin/) or `custom webpack plugin` to specify that `@antv/s2-react-components` uses `antd-v5`, no modifications needed, other dependencies in the project will continue to use `antd@4.x`.

:::warning{title="Note"}
The same applies to other bundlers (like `Vite`) or libraries/frameworks based on `webpack` (like `father`, `umi`), please search accordingly, we won't elaborate here.
Note that this approach is a temporary transition solution. In the long run, **[Ant Design v4 version stopped maintenance at the end of 2023](https://ant-design.antgroup.com/docs/blog/v4-ood-cn), it's recommended to upgrade to `antd@5.x` as soon as possible.**
:::

Custom webpack plugin reference:

```ts
class AntdV5AliasPlugin {
  apply(compiler) {
    compiler.hooks.normalModuleFactory.tap("AntdV5AliasPlugin", (nmf) => {
      nmf.hooks.beforeResolve.tapAsync("AntdV5AliasPlugin", (resolveData, callback) => {
        if (resolveData.contextInfo?.issuer?.includes('node_modules/@antv/s2-react-components')) {
          // Match: "antd" and "antd/es/locale/xxx"
          if (/antd(\/*)?/.test(resolveData.request)) {
            // Replace with: "antd-v5" and "antd-v5/es/locale/xxx"
            resolveData.request = resolveData.request.replace(/antd(\/*)?/,'antd-v5$1')
          }
        }

        callback();
      });
    });
  }
}
```

#### Row Header Cell Collapse/Expand Events Moved to `RowCell`

`onCollapseRowsAll`, `onLayoutAfterCollapseRows` renamed to `onRowCellAllCollapsed`, `onRowCellCollapsed`

```diff
- <SheetComponent options={s2Options} onCollapseRowsAll={} />
+ <SheetComponent options={s2Options} onRowCellAllCollapsed={} />

- <SheetComponent options={s2Options} onLayoutAfterCollapseRows={} />
+ <SheetComponent options={s2Options} onRowCellCollapsed={} />
```

#### `onSheetUpdate` Renamed to `onUpdate`, and Added `onUpdateAfterRender`

- `onUpdate`: Component-level table update event, triggered when `data (S2DataConfig)` or `configuration (S2Options)` is updated.
- `onUpdateAfterRender`: Component-level table update event, triggered when `data (S2DataConfig)` or `configuration (S2Options)` is updated, and after `s2.render()` is completed.

```diff
- <SheetComponent onSheetUpdate={} />
+ <SheetComponent onUpdate={} onUpdateAfterRender={} />
```

#### onUpdate Type Optimization, No Longer Requires Return of Render Parameters

In version `2.x`, if render parameters are not specified in `onUpdate`, default `renderOptions` will be used.

```diff
<SheetComponent
  onUpdate={(renderOptions) => {
-   return renderOptions
  }}
/>
```

#### SheetComponentsProps Type Adjustment

```diff
- interface SheetComponentsProps {}
+ interface SheetComponentProps {}
```

### Component Layer (s2-vue) <Badge type="success">@antv/s2-vue</Badge> <Badge type="error">Discontinued</Badge>

:::warning{title="Note"}
`@antv/s2-vue` is now discontinued. Due to limited resources and considering maintenance costs and package download volume, it will no longer be updated after the `2.0.0` official release. Please encapsulate based on `@antv/s2` yourself, or fork the repository for secondary development of community versions.
:::

## ✍️ API Adjustments

Please refer to the [`API Documentation`](/api) marked with <Badge type="success">New</Badge> and <Badge>Updated</Badge> for details.

## 🙋 Troubleshooting

Please read the documentation for more new features and changes. If you encounter any issues during the upgrade process, please provide feedback through [GitHub issues](https://github.com/antvis/S2/issues) or [GitHub Discussions](https://github.com/antvis/S2/discussions). We will respond and improve this document as quickly as possible.
