---
title: table component
order: 0
---

# React table component

Out-of-the-box component `<SheetComponent />` based on `React` packaged by `@antv/s2`

## SpreadsheetProps

Function description: The props parameter of the React SheetComponent component

| Parameter | Description | Type | Default | Required |
| -- | -- | -- | -- | --- |
| sheetType | Form type:<br/> 1. `pivot`: pivot table<br/> 2. `table`: detail table<br> 3. `gridAnalysis`: grid analysis table<br/> 4. `strategy`: trend analysis table | `pivot \| table \| gridAnalysis \| strategy` \| `pivot` | |
| spreadsheet | custom table | (container: `HTMLElement \| string`, dataCfg: [S2DataConfig](/docs/api/general/S2DataConfig), options: [SheetComponentOptions](#sheetcomponentoptions)) => [SpreadSheet](/ docs/api/basic-class/spreadsheet) | | |
| dataCfg | Pivot table data mapping related configuration items | [S2DataConfig](/docs/api/general/S2DataConfig) | | ✓ |
| options | pivot table property configuration item | [SheetComponentOptions](#sheetcomponentoptions) | | ✓ |
| partDrillDown | Attributes related to dimension drilldown | [PartDrillDown](/docs/api/components/drill-down) | | |
| adaptive | Whether to adapt to the window size | `boolean | { width?: boolean, height?: boolean, getContainer: () => HTMLElement }` | `false` | |
| showPagination | Whether to display the default pagination<br> (only if the `pagination` attribute is configured in `options`) | `boolean` \| \{ <br>onShowSizeChange?: (pageSize: number) => void,< br>onChange?: (current: number) => void <br>} | `false` | |
| themeCfg | Custom pivot table theme styles | [ThemeCfg](/docs/api/general/S2Theme) | | |
| loading | Controls the loading state of the table | `boolean` | | |
| header | header configuration items | [HeaderCfgProps](/docs/api/components/header) | | |
| onRangeSort | Callback event triggered when sorting within a group | (params: [SortParam[]](#sortparam) ) => void; | | |
| onRowCellHover | Row header mouse hover event | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| onRowCellClick | row head mouse click event | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| onRowCellDoubleClick | Mouse double-click event at row head | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| onRowCellMouseDown | row header mouse down event | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| onRowCellMouseUp | Row cell mouse release event | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| onRowCellMouseMove | Row cell mouse movement event | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| onRowCellCollapsed | Node expand/collapse event callback| ({ isCollapsed: `boolean`, collapseFields: `Record<string, boolean>`, node: [Node](/docs/api/basic-class/node) ) => void; | | |
| onRowCellAllCollapsed | Event callback for all nodes expanded/collapsed | (isCollapsed: boolean ) => void; | | |
| onRowCellScroll | row header cell scroll event | ({position: [CellScrollPosition](#cellscrollposition)} ) => void; | | |
| onColCellHover | Column header mouse hover event | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| onColCellClick | Column head mouse click event | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| onColCellDoubleClick | Mouse double-click event of column header | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| onColCellMouseDown | Column header mouse down event | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| onColCellMouseUp | Column header mouse release event | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| onColCellMouseMove | Column head mouse move event | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| onColCellExpanded | After the hidden column header is enabled (tooltip.operation.hiddenColumns = true), the event callback for column header expansion | (collapseAll: `boolean` ) => void; | | |
| onColCellHidden | After the hidden column header is enabled (tooltip.operation.hiddenColumns = true), the event callback for the hidden column header| ({data: { currentHiddenColumnsInfo:[HiddenColumnsInfo](#hiddencolumnsinfo);hiddenColumnsDetail:[HiddenColumnsInfo](#hiddencolumnsinfo);} ) => void; | | |
| onDataCellHover | mouse hover event of numeric cell | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| onDataCellClick | Mouse click event of numeric cell | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| onDataCellDoubleClick | Value cell double click event | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| onDataCellMouseDown | Mouse down event of numeric cell | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| onDataCellMouseUp | Numeric cell mouse release event | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| onDataCellMouseMove | Numeric cell mouse movement event | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| onDataCellBrushSelection | Value cell brush selection event | ( dataCells: [DataCell](/docs/api/basic-class/base-cell)[] ) => void | | |
| onDataCellSelectMove | Numerical cell keyboard direction key move event | (metas: CellMeta[]) => void | | |
| onCornerCellHover | corner mouse hover event | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| onCornerCellClick | Corner mouse click event | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| onCornerCellDoubleClick | Corner cell double click event | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| onCornerCellMouseUp | corner mouse down event | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| onCornerCellMouseUp | corner mouse release event | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| onCornerCellMouseMove | corner mouse movement event | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| onMergedCellsHover | Mouseover event of merged cells | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| onMergedCellsClick | Mouse click event of merged cells | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| onMergedCellDoubleClick | Mouse double-click event for merged cells | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| onMergedCellsMouseDown | Merged cell press event | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| onMergedCellsMouseUp | Merged cell release event | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| onMergedCellsMouseMove | merged cell move event | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| onRangeSort | A callback event is triggered when sorting within a group (for now only pivot tables are supported) | (params: [SortParam[]](#sortparam) ) => void; | | |
| onRangeSorted | A callback event is triggered when the sorting in the group ends (for now, only pivot tables are supported) | (event: CanvasEvent ) => void; | | |
| onRangeFilter | Trigger callback event when filtering | (data: { filterKey: string; filteredValues: string[] } ) => void; | | |
| onRangeFiltered | Trigger callback event after filtering | (data: DataType[] ) => void; | | |
| onLayoutCellRender | The header layout cell mount completed event | cell: S2CellType | | |
| onLayoutAfterHeaderLayout | Header layout structure preparation completion event | (layoutResult: [LayoutResult](/zh/docs/api/general/S2Options/#layoutresult) ) => void; | | |
| onLayoutPagination | pagination event | ({ pageSize: number; pageCount: number; total: number; current: number;} ) => void; | | |
| onLayoutCellScroll | Cell scroll event (**Deprecated, please use `onScroll` instead**) | ({position: [CellScrollPosition](#cellscrollposition)} ) => void; | | |
| onLayoutAfterCollapseRows | Event callback after collapsing row headers in tree mode | ({collapseFields: `Record<string, boolean>`, meta: [Node](/docs/api/basic-class/node) ) => void; | | |
| onBeforeRender | Event before start of render | () => void; | | |
| onAfterRender | render completed event | () => void; | | |
| onMounted | Table loading complete event, you can get the table instance [details](/docs/manual/advanced/get-instance) | (spreadsheet: [SpreadSheet](/docs/api/basic-class/spreadsheet)) => void; | | |
| onDestroy | form destruction event | () => void; | | |
| onLayoutResize | The overall changeSize event of the table | (params: [ResizeParams](#resizeparams)) => void; | | |
| onLayoutResizeSeriesWidth | Table serial number row width event | (params: [ResizeParams](#resizeparams)) => void; | | |
| onLayoutResizeRowWidth | row header cell width change event | (params: [ResizeParams](#resizeparams)) => void; | | |
| onLayoutResizeRowHeight | Row header cell height change event | (params: [ResizeParams](#resizeparams)) => void; | | |
| onLayoutResizeColWidth | Column header cell width change event | (params: [ResizeParams](#resizeparams)) => void; | | |
| onLayoutResizeColHeight | Column header cell height change event | (params: [ResizeParams](#resizeparams)) => void; | | |
| onLayoutResizeTreeWidth | The overall width change event of the tree line header | (params: [ResizeParams](#resizeparams)) => void; | | |
| onLayoutResizeMouseDown | mouse down event of resize hotspot | ( event: `MouseEvent`, resizeInfo?: [ResizeInfo](#resizeinfo)) => void; | | |
| onLayoutResizeMouseUp | mouse release event of resize hotspot | ( event: `MouseEvent`, resizeInfo?: [ResizeInfo](#resizeinfo)) => void; | | |
| onLayoutResizeMouseMove | mouse move event of resize hotspot | ( event: `MouseEvent`, resizeInfo?: [ResizeInfo](#resizeinfo)) => void; | | |
| onKeyBoardDown | keyboard down event | (event: KeyboardEvent) => void | | |
| onKeyBoardUp | keyboard release event | (event: KeyboardEvent) => void | | |
| onCopied | copy event | (data: string) => void | | |
| onActionIconHover | Line header operation icon hover event | (event: CanvasEvent) => void | | |
| onActionIconClick | Action icon click event | (event: CanvasEvent) => void | | |
| onContextMenu | Right cell click event | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| onMouseHover | table mouse hover event | (event: CanvasEvent) => void | | |
| onMouseUp | table mouse release event | (event: CanvasEvent) => void | | |
| onSelected | cell selected event | (cells: ( [Cell](/docs/api/basic-class/base-cell)[] ) => void | | |
| onReset | Interactive state reset event | (event: KeyboardEvent) => void | | |
| onLinkFieldJump | Link field jump event (cellData: @antv/s2 1.37.0 new) | (data: { key: string; cellData: [Node](/docs/api/basic-class/node); record: [Data](/docs/api/general/S2DataConfig#data) }) => void | | |
| onScroll | cell scroll event (including row header and value cells) | ({position: [CellScrollPosition](#cellscrollposition)} ) => void; | | |
| onColCellBrushSelection | Batch select the column header cells within the brush selection range. During the brush selection process, the brush selection range prompt mask will be displayed. After the brush selection is completed, a tooltip will pop up to display the brushed cell information (only supports pivot tables) | (cells: [ColCell](/docs/api/basic-class/base-cell)[]) => void; | | |
| onRowCellBrushSelection | Batch select the row header cells within the brush selection range. During the brush selection process, the brush selection range prompt mask will be displayed. After the brush selection is completed, a tooltip will pop up to display the brushed cell information (only supports pivot tables) | ( cells: [RowCell](/docs/api/basic-class/base-cell)[]) => void; | | |

## SheetComponentOptions

The `options` of React components are inherited from [S2Options](/docs/api/general/S2Options), there are two differences

- The content of tooltip has changed from `Element | string` to `ReactNode`, which can be any `jsx` element
- The paging configuration has changed from the paging configuration of S2 to the paging configuration of `antd`, that is, the api transparent transmission of the `antd` paging component is supported

```ts
import type { Pagination, S2Options } from '@antv/s2';
import type { PaginationProps as AntdPaginationProps } from 'antd';

type SheetComponentOptions = S2Options<
   React.ReactNode,
   Pagination & AntdPaginationProps
>;
```

<br/>

# Vue table component

Out-of-the-box component `<SheetComponent />` of `Vue 3.0` based on `@antv/s2` layer encapsulation

## props

Function description: The props of the Vue SheetComponent component, such as `<SheetComponent :sheetType="pivot" />`

| Parameter | Description | Type | Default | Required |
| -- | -- | -- | -- | --- |
| sheetType | Form type:<br/> 1. `pivot`: pivot table <br/> 2. `table`: detailed table | `pivot | table` | `pivot` | |
| dataCfg | pivot table data mapping configuration item | [S2DataConfig](/docs/api/general/S2DataConfig) | | ✓ |
| options | pivot table property configuration item | [SheetComponentOptions](#sheetcomponentoptions-1) | | ✓ |
| adaptive | Whether to adapt to the window size | `boolean | { width?: boolean, height?: boolean, getContainer: () => HTMLElement }` | `false` | |
| showPagination | whether to show the default pagination | boolean | | |
| themeCfg | Custom pivot table theme styles | [ThemeCfg](/docs/api/general/S2Theme) | | |
| loading | Controls the loading state of the table | `boolean` | | |
| header | header configuration items | [HeaderCfgProps](/docs/api/components/header) | | |
| onRangeSort | Callback event triggered when sorting within a group | (params: [SortParam[]](#sortparam) ) => void; | | |
| onRowCellHover | Row header mouse hover event | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| onRowCellClick | row head mouse click event | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| onRowCellDoubleClick | Mouse double-click event at row head | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| onRowCellMouseDown | row header mouse down event | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| onRowCellMouseUp | Row cell mouse release event | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| onRowCellMouseMove | Row cell mouse movement event | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| onRowCellCollapsed | Node expand/collapse event callback| ({ isCollapsed: `boolean`, collapseFields: `Record<string, boolean>`, node: [Node](/docs/api/basic-class/node) ) => void; | | |
| onRowCellAllCollapsed | Event callback for all nodes expanded/collapsed | (isCollapsed: boolean ) => void; | | |
| onRowCellScroll | row header cell scroll event | ({position: [CellScrollPosition](#cellscrollposition)} ) => void; | | |
| onColCellHover | Column header mouse hover event | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| onColCellClick | Column head mouse click event | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| onColCellDoubleClick | Mouse double-click event of column header | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| onColCellMouseDown | Column header mouse down event | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| onColCellMouseUp | Column header mouse release event | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| onColCellMouseMove | Column head mouse move event | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| onColCellExpanded | After the hidden column header is enabled (tooltip.operation.hiddenColumns = true), the event callback for column header expansion | (collapseAll: `boolean` ) => void; | | |
| onColCellHidden | After the hidden column header is enabled (tooltip.operation.hiddenColumns = true), the event callback for the hidden column header| ({data: { currentHiddenColumnsInfo:[HiddenColumnsInfo](#hiddencolumnsinfo);hiddenColumnsDetail:[HiddenColumnsInfo](#hiddencolumnsinfo);} ) => void; | | |
| onDataCellHover | mouse hover event of numeric cell | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| onDataCellClick | Mouse click event of numeric cell | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| onDataCellDoubleClick | Value cell double click event | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| onDataCellMouseDown | Mouse down event of numeric cell | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| onDataCellMouseUp | Numeric cell mouse release event | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| onDataCellMouseMove | Numeric cell mouse movement event | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| onDataCellBrushSelection | Value cell brush selection event | ( dataCells: [DataCell](/docs/api/basic-class/base-cell)[] ) => void | | |
| onDataCellSelectMove | Numerical cell keyboard direction key move event | (metas: CellMeta[]) => void | | |
| onCornerCellHover | corner mouse hover event | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| onCornerCellClick | Corner mouse click event | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| onCornerCellDoubleClick | Corner cell double click event | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| onCornerCellMouseUp | corner mouse down event | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| onCornerCellMouseUp | corner mouse release event | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| onCornerCellMouseMove | corner mouse movement event | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| onMergedCellsHover | Mouseover event of merged cells | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| onMergedCellsClick | Mouse click event of merged cells | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| onMergedCellDoubleClick | Mouse double-click event for merged cells | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| onMergedCellsMouseDown | Merged cell press event | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| onMergedCellsMouseUp | Merged cell release event | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| onMergedCellsMouseMove | merged cell move event | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| onRangeSort | A callback event is triggered when sorting within a group (for now only pivot tables are supported) | (params: [SortParam[]](#sortparam) ) => void; | | |
| onRangeSorted | A callback event is triggered when the sorting in the group ends (for now, only pivot tables are supported) | (event: CanvasEvent ) => void; | | |
| onRangeFilter | Trigger callback event when filtering | (data: { filterKey: string; filteredValues: string[] } ) => void; | | |
| onRangeFiltered | Trigger callback event after filtering | (data: DataType[] ) => void; | | |
| onLayoutCellRender | The header layout cell mount completed event | cell: S2CellType | | |
| onLayoutAfterHeaderLayout | Header layout structure preparation completion event | (layoutResult: [LayoutResult](/zh/docs/api/general/S2Options/#layoutresult) ) => void; | | |
| onLayoutPagination | pagination event | ({ pageSize: number; pageCount: number; total: number; current: number;} ) => void; | | |
| onLayoutCellScroll | Cell scroll event (**Deprecated, please use `onScroll` instead**) | ({position: [CellScrollPosition](#cellscrollposition)} ) => void; | | |
| onLayoutAfterCollapseRows | Event callback after collapsing row headers in tree mode | ({collapseFields: `Record<string, boolean>`, meta: [Node](/docs/api/basic-class/node) ) => void; | | |
| onBeforeRender | Event before start of render | () => void; | | |
| onAfterRender | render completed event | () => void; | | |
| onMounted | Table loading complete event, you can get the table instance [details](/docs/manual/advanced/get-instance) | (spreadsheet: [SpreadSheet](/docs/api/basic-class/spreadsheet)) => void; | | |
| onDestroy | form destruction event | () => void; | | |
| onLayoutResize | The overall changeSize event of the table | (params: [ResizeParams](#resizeparams)) => void; | | |
| onLayoutResizeSeriesWidth | Table serial number row width event | (params: [ResizeParams](#resizeparams)) => void; | | |
| onLayoutResizeRowWidth | row header cell width change event | (params: [ResizeParams](#resizeparams)) => void; | | |
| onLayoutResizeRowHeight | Row header cell height change event | (params: [ResizeParams](#resizeparams)) => void; | | |
| onLayoutResizeColWidth | Column header cell width change event | (params: [ResizeParams](#resizeparams)) => void; | | |
| onLayoutResizeColHeight | Column header cell height change event | (params: [ResizeParams](#resizeparams)) => void; | | |
| onLayoutResizeTreeWidth | The overall width change event of the tree line header | (params: [ResizeParams](#resizeparams)) => void; | | |
| onLayoutResizeMouseDown | mouse down event of resize hotspot | ( event: `MouseEvent`, resizeInfo?: [ResizeInfo](#resizeinfo)) => void; | | |
| onLayoutResizeMouseUp | mouse release event of resize hotspot | ( event: `MouseEvent`, resizeInfo?: [ResizeInfo](#resizeinfo)) => void; | | |
| onLayoutResizeMouseMove | mouse move event of resize hotspot | ( event: `MouseEvent`, resizeInfo?: [ResizeInfo](#resizeinfo)) => void; | | |
| onKeyBoardDown | keyboard down event | (event: KeyboardEvent) => void | | |
| onKeyBoardUp | keyboard release event | (event: KeyboardEvent) => void | | |
| onCopied | copy event | (data: string) => void | | |
| onActionIconHover | Line header operation icon hover event | (event: CanvasEvent) => void | | |
| onActionIconClick | Action icon click event | (event: CanvasEvent) => void | | |
| onContextMenu | Right cell click event | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| onMouseHover | table mouse hover event | (event: CanvasEvent) => void | | |
| onMouseUp | table mouse release event | (event: CanvasEvent) => void | | |
| onSelected | cell selected event | (cells: ( [Cell](/docs/api/basic-class/base-cell)[] ) => void | | |
| onReset | Interactive state reset event | (event: KeyboardEvent) => void | | |
| onLinkFieldJump | Link field jump event (cellData: @antv/s2 1.37.0 new) | (data: { key: string; cellData: [Node](/docs/api/basic-class/node); record: [Data](/docs/api/general/S2DataConfig#data) }) => void | | |
| onScroll | cell scroll event (including row header and value cells) | ({position: [CellScrollPosition](#cellscrollposition)} ) => void; | | |
| onColCellBrushSelection | Batch select the column header cells within the brush selection range. During the brush selection process, the brush selection range prompt mask will be displayed. After the brush selection is completed, a tooltip will pop up to display the brushed cell information (only supports pivot tables) | (cells: [ColCell](/docs/api/basic-class/base-cell)[]) => void; | | |
| onRowCellBrushSelection | Batch select the row header cells within the brush selection range. During the brush selection process, the brush selection range prompt mask will be displayed. After the brush selection is completed, a tooltip will pop up to display the brushed cell information (only supports pivot tables) | ( cells: [RowCell](/docs/api/basic-class/base-cell)[]) => void; | | |

## SheetComponentOptions

The `options` of React components are inherited from [S2Options](/docs/api/general/S2Options), there are two differences

- The content of tooltip has changed from `Element | string` to `ReactNode`, which can be any `jsx` element
- The paging configuration has changed from the paging configuration of S2 to the paging configuration of `antd`, that is, the api transparent transmission of the `antd` paging component is supported

```ts
import type { Pagination, S2Options } from '@antv/s2';
import type { PaginationProps as AntdPaginationProps } from 'antd';

type SheetComponentOptions = S2Options<
   React.ReactNode,
   Pagination & AntdPaginationProps
>;
```

<br/>

# Vue table component

Out-of-the-box component `<SheetComponent />` of `Vue 3.0` based on `@antv/s2` layer encapsulation

## props

Function description: The props of the Vue SheetComponent component, such as `<SheetComponent :sheetType="pivot" />`

| Parameter | Description | Type | Default | Required |
| -- | -- | -- | -- | --- |
| sheetType | Form type:<br/> 1. `pivot`: pivot table <br/> 2. `table`: detailed table | `pivot | table` | `pivot` | |
| dataCfg | pivot table data mapping configuration item | [S2DataConfig](/docs/api/general/S2DataConfig) | | ✓ |
| options | pivot table property configuration item | [SheetComponentOptions](#sheetcomponentoptions-1) | | ✓ |
| adaptive | Whether to adapt to the window size | `boolean | { width?: boolean, height?: boolean, getContainer: () => HTMLElement }` | `false` | |
| showPagination | Whether to display the default pagination<br> (only if the `pagination` attribute is configured in `options`) | `boolean` \| \{ <br>onShowSizeChange?: (pageSize: number) => void,< br>onChange?: (current: number) => void <br>} | `false` | |
| themeCfg | custom table theme style | [ThemeCfg](/docs/api/general/S2Theme) | | |
| loading | Controls the loading state of the table | `boolean` | | |

## events

Function description: events of Vue SheetComponent, `<SheetComponent @rowCellClick="handleRowCellClick" />`

| Parameter | Description | Type | Default | Required |
| -- | -- | -- | -- | --- |
| spreadsheet | custom table | (container: `HTMLElement \| string`, dataCfg: [S2DataConfig](/docs/api/general/S2DataConfig), options: [SheetComponentOptions](#sheetcomponentoptions-1)) => [SpreadSheet] (/docs/api/basic-class/spreadsheet) | | |
| rangeSort | Callback event triggered when sorting within a group | (params: [SortParam[]](#sortparam) ) => void; | | |
| rowCellClick | row head mouse click event | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| rowCellHover | row header mouse hover event | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| rowCellClick | row head mouse click event | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| rowCellDoubleClick | Double click event of row header | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| rowCellMouseDown | row head mouse down event | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| rowCellMouseUp | row head mouse release event | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| rowCellMouseMove | row head mouse move event | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| rowCellCollapseTreeRows | Click the row header to collapse and expand the button in the tree structure | (params: {id: `number`; isCollapsed: `boolean`; node: [Node](/docs/api/basic-class/node)}) = > void | | |
| rowCellScroll | row header cell scroll event | ({position: [CellScrollPosition](#cellscrollposition)} ) => void; | | |
| rowCellCollapsed | Node expand/collapse event callback| ({ isCollapsed: `boolean`, collapseFields: `Record<string, boolean>`, node: [Node](/docs/api/basic-class/node) ) => void; | | |
| rowCellAllCollapsed | Event callback for all expanded/collapsed nodes | (isCollapsed: boolean ) => void; | | |
| colCellHover | Column header mouse hover event | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| colCellClick | Column head mouse click event | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| colCellDoubleClick | Mouse double-click event of column header | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| colCellMouseDown | Column head mouse down event | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| colCellMouseUp | Column header mouse release event | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| colCellMouseMove | Column head mouse move event | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| colCellExpanded | After enabling hidden column headers (tooltip.operation.hiddenColumns = true), the event callback for column header expansion | ({collapseAll: boolean ) => void; | | |
| colCellHidden | After the hidden column header is enabled (tooltip.operation.hiddenColumns = true), the event callback for the hidden column header| ({data: { currentHiddenColumnsInfo:[HiddenColumnsInfo](#hiddencolumnsinfo);hiddenColumnsDetail:[HiddenColumnsInfo](#hiddencolumnsinfo);} ) => void; | | |
| dataCellHover | mouse hover event of numeric cell | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| dataCellClick | mouse click event of numeric cell | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| dataCellDoubleClick | Numerical cell double click event | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| dataCellMouseDown | mouse down event of numeric cell | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| dataCellMouseUp | Numeric cell mouse release event | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| dataCellMouseMove | Numeric cell mouse move event | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| dataCellBrushSelection | Value cell brush selection event | (brushRangeDataCells: ( [DataCell](/docs/api/basic-class/base-cell)[] ) => void | | |
| dataCellScroll | Numeric cell scroll event | ({position: [CellScrollPosition](#cellscrollposition)} ) => void; | | |
| cornerCellHover | corner mouse hover event | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| cornerCellClick | corner mouse click event | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| cornerCellDoubleClick | Corner mouse double click event | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| cornerCellMouseUp | corner mouse down event | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| cornerCellMouseUp | corner mouse release event | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| cornerCellMouseMove | corner mouse movement event | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| mergedCellsHover | merged cell mouse hover event | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| mergedCellsClick | mouse click event of merged cells | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| mergedCellDoubleClick | Mouse double click event of merged cell | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| mergedCellsMouseDown | merged cell down event | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| mergedCellsMouseUp | merged cell release event | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| mergedCellsMouseMove | merged cell move event | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| rangeSort | A callback event is triggered when sorting within a group (for now, only pivot tables are supported) | (params: [SortParam[]](#sortparam) ) => void; | | |
| rangeSorted | A callback event is triggered when the sorting in the group ends (for now, only pivot tables are supported) | (event: CanvasEvent ) => void; | | |
| rangeFilter | trigger callback event when filtering | (data: { filterKey: string; filteredValues: string[] } ) => void; | | |
| rangeFiltered | Trigger callback event after filtering | (data: DataType[] ) => void; | | |
| layoutAfterHeaderLayout | Header layout structure preparation completion event | (layoutResult: [LayoutResult](/docs/api/general/S2Options/#layoutresult) ) => void; | | |
| layoutPagination | pagination event | ({ pageSize: number; pageCount: number; total: number; current: number;} ) => void; | | |
| layoutCellScroll | Cell scroll event (**Deprecated, please use `onScroll` instead**) | ({position: [CellScrollPosition](#cellscrollposition)} ) => void; | | |
| beforeRender | event before start render | () => void; | | |
| afterRender | render completed event | () => void; | | |
| mounted | table loading complete event, you can get the table instance [details](/docs/manual/advanced/get-instance) | (spreadsheet: [SpreadSheet](/docs/api/basic-class/spreadsheet)) => void; | | |
| destroy | table destruction event | () => void; | | |
| layoutResize | changeSize event of the table | (params: [ResizeParams](#resizeparams)) => void; | | |
| layoutResizeSeriesWidth | table serial number row width event | (params: [ResizeParams](#resizeparams)) => void; | | |
| layoutResizeRowWidth | row header cell width change event | (params: [ResizeParams](#resizeparams)) => void; | | |
| layoutResizeRowHeight | row header cell height change event | (params: [ResizeParams](#resizeparams)) => void; | | |
| layoutResizeColWidth | Column header cell width change event | (params: [ResizeParams](#resizeparams)) => void; | | |
| layoutResizeColHeight | Column header cell height change event | (params: [ResizeParams](#resizeparams)) => void; | | |
| layoutResizeTreeWidth | The overall width change event of the tree line header | (params: [ResizeParams](#resizeparams)) => void; | | |
| layoutResizeMouseDown | mouse down event of resize hotspot | ( event: `MouseEvent`, resizeInfo?: [ResizeInfo](#resizeinfo)) => void; | | |
| layoutResizeMouseUp | resize hot zone mouse release event | ( event:`MouseEvent`, resizeInfo?: [ResizeInfo](#resizeinfo)) => void; | | |
| layoutResizeMouseMove | mouse move event in resize hotspot | ( event:`MouseEvent`, resizeInfo?: [ResizeInfo](#resizeinfo)) => void; | | |
| keyBoardDown | keyboard down event | (event: KeyboardEvent) => void | | |
| keyBoardUp | keyboard release event | (event: KeyboardEvent) => void | | |
| copied | copy event | (data: string) => void | | |
| actionIconHover | Hover event of the line header operation icon | (event: CanvasEvent) => void | | |
| actionIconClick | action icon click event | (event: CanvasEvent) => void | | |
| contextMenu | Right cell click event | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| mouseHover | table mouse hover event | (event: CanvasEvent) => void | | |
| mouseUp | table mouse up event | (event: CanvasEvent) => void | | |
| selected | cell selected event | ( cells: ([Cell](/docs/api/basic-class/base-cell)[] ) => void | | |
| reset | interaction state reset event | (event: KeyboardEvent) => void | | |
| linkFieldJump | Link field jump event (cellData: @antv/s2 1.37.0 new) | (data: { key: string; cellData: [Node](/docs/api/basic-class/node); record: [Data](/docs/api/general/S2DataConfig#data) }) => void | | |
| scroll | cell scroll event (including row header and value cells) | ({position: [CellScrollPosition](#cellscrollposition)} ) => void; | | |
| colCellBrushSelection | Batch select the column header cells within the brush selection range. During the brush selection process, the brush selection range prompt mask will be displayed. After the brush selection is completed, a tooltip will pop up to display the brushed cell information (only supports pivot tables) | (cells: ColCell[]) => void; | | |
| rowCellBrushSelection | Batch select the row header cells within the brush selection range. During the brush selection process, a prompt mask for the brush selection range will be displayed. After the brush selection is completed, a tooltip will pop up to display the brushed cell information (only supports pivot tables) | ( cells: RowCell[]) => void; | | |

## SheetComponentOptions

The `options` of Vue components are inherited from [S2Options](/docs/api/general/S2Options), there is a little difference

- The paging configuration has changed from the paging configuration of S2 to the paging configuration of `antd-vue`, that is, the api transparent transmission of the `antd-vue` paging component is supported

```ts
import type { Pagination, S2Options } from '@antv/s2';
import type { PaginationProps } from 'ant-design-vue';

type SheetComponentOptions = S2Options<
   Element | string,
   Pagination & PaginationProps
>;
```

# public object

## TargetCellInfo

Function description: The return information of the interactive callback function.

| Parameter | Description | Type | Default | Required |
| -- | -- | -- | -- | --- |
| target | interaction object | [S2CellType](/docs/api/basic-class/base-cell) | | |
| event | event | [Event](#) | | |
| viewMeta | current node information | [Node](/docs/api/basic-class/node) | | |

<embed src="@/docs/common/sort-param.en.md"></embed>

## CellScrollPosition

Function description: The position information of cell scrolling.

| Parameter | Description | Type | Default | Required |
| ---------- | ----------- | ----- | ----- | ---- |
| scrollX | Horizontal scroll offset (relative to the length of the scrollbar track) | `number` | | |
| scrollY | vertical scroll offset (relative to the length of the scrollbar track) | `number` | | |

## HiddenColumnsInfo

Function description: After enabling [Hide Column Header](/docs/manual/advanced/interaction/hide-columns), hide the node information of the column header

| Parameter | Description | Type | Default | Required |
| -- | -- | -- | -- | --- |
| hideColumnNodes | Currently hidden node information | [Node](/docs/api/basic-class/node)[] | | |
| displaySiblingNode | Information about neighboring nodes displayed | { prev:[Node](/docs/api/basic-class/node);next: [Node](/docs/api/basic-class/node) } | | |

## ResizeParams

Function description: table resize (drag to change cell row height and column width) and cell style information

| Parameter | Description | Type | Default | Required |
| -- | -- | -- | -- | --- |
| info | resize configuration information | [ResizeInfo](#resizeinfo) | | |
| style | style-related configuration in options | [style](/docs/api/general/S2Options#style) | | |

## ResizeInfo

Function description: Table resize (drag to change cell row height and column width) configuration information

| Parameter | Description | Type | Default | Required |
| -- | -- | -- | -- | --- |
| theme | resize hotspot configuration | [ResizeArea](/docs/api/general/S2Theme#resizearea) | | |
| type | resize direction | `Horizontal` \| `Vertical` | | |
| offsetX | horizontal offset | `number` | | |
| offsetY | vertical offset | `number` | | |
| width | drag width | `number` | | |
| height | drag | `number` | | |
| size | hot zone size | `number` | | |
| effect | The area affected by the drag change | `Field` \| `Cell` \| `Tree` \| `Series` | | |
| isResizeArea | Whether it belongs to resize hot area | `boolean` | | |
| id | field id | `string` | | |
| meta | cell node information corresponding to the resize hot zone | [Node](/docs/api/basic-class/node) | | |
| resizedWidth | Width after dragging | `number` | | |
| resizedHeight | Height after dragging | `number` | | |

<embed src="@/docs/common/view-meta.en.md"></embed>
