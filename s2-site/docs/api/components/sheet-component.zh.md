---
title: 表组件
order: 0
---

## SpreadsheetProps

功能描述： 基于 `core` 层封装的 `react` 版开箱即用的组件。

| 参数 | 说明                                                                                                        | 类型 | 默认值  | 必选 |
| :--- |:----------------------------------------------------------------------------------------------------------| :--- | :--- | :---: |
| sheetType | 表格类型：<br/> 1. `pivot`: 透视表 <br/> 2. `table`: 明细表 <br> 3. `gridAnalysis`: 网格分析表 <br/> 4. `strategy`: 趋势分析表 | `pivot | table | gridAnalysis | strategy` | `pivot` | |
| spreadsheet | 自定义表                                                                                                      | (...args: [S2Constructor](/zh/docs/api/basic-class/spreadsheet#s2constructor)) => [SpreadSheet](/zh/docs/api/basic-class/spreadsheet) | |  |
| dataCfg | 透视表数据映射相关配置项                                                                                              | [S2DataConfig](/zh/docs/api/general/S2DataConfig) | | ✓ |
| options | 透视表属性配置项                                                                                                  | [S2Options](/zh/docs/api/general/S2Options) | | ✓ |
| partDrillDown | 维度下钻相关属性                                                                                                  | [PartDrillDown](/zh/docs/api/components/drill-down) | |  |
| adaptive | 是否根据窗口大小自适应                                                                                               | `boolean | { width?: boolean, height?: boolean, getContainer: () => HTMLElement }` | `false` | |
| showPagination | 是否显示默认分页<br>（只有在 `options` 配置过 `pagination`  属性才会生效）                                                      | `boolean` \| \{ <br>onShowSizeChange?: (pageSize: number) => void,<br>onChange?: (current: number) => void <br>} | `false` | |
| themeCfg | 自定义透视表主题样式                                                                                                | [ThemeCfg](/zh/docs/api/general/S2Theme) | |  |
| loading | 控制表格的加载状态                                                                                                 | `boolean` | | |
| header | 表头配置项                                                                                                     | [HeaderCfgProps](/zh/docs/api/components/header) | | |
| getSpreadSheet | 获取表实例 [详情](/zh/docs/manual/advanced/get-instance)                                                         | (spreadsheet: [SpreadSheet](/zh/docs/api/basic-class/spreadsheet)) => void; | | |
| onRangeSort | 组内排序时触发回调事件                                                                                      |  (params: [SortParams](#sortparams) ) => void; | |  |
| onRowCellClick | 行头鼠标单击事件                                                                                                  | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| onRowCellHover | 行头鼠标悬停事件                                                                                                  | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| onRowCellClick | 行头鼠标单击事件                                                                                                  | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| onRowCellDoubleClick | 行头鼠标双击事件                                                                                                  | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| onRowCellMouseDown | 行头鼠标按下事件                                                                                                  | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| onRowCellMouseUp | 行头鼠标放开事件                                                                                                  | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| onRowCellMouseMove | 行头鼠标移动事件                                                                                                  | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| onRowCellCollapseTreeRows | 树状结构下点击行头收起展开按钮                                                                                                  | (params: {id: number;isCollapsed: boolean;node: Node;}) => void | | |
| onColCellHover | 列头鼠标悬停事件                                                                                                  | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| onColCellClick | 列头鼠标单击事件                                                                                                  | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| onColCellDoubleClick | 列头鼠标双击事件                                                                                                  | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| onColCellMouseDown | 列头鼠标按下事件                                                                                                  | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| onColCellMouseUp | 列头鼠标松开事件                                                                                                  | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| onColCellMouseMove | 列头鼠标移动事件                                                                                                  | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| onDataCellHover | 数值单元格鼠标悬停事件                                                                                               | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| onDataCellClick | 数值单元格鼠标点击事件                                                                                               | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| onDataCellDoubleClick | 数值单元格双击事件                                                                                                 | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| onDataCellMouseDown | 数值单元格鼠标按下事件                                                                                                  | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| onDataCellMouseUp | 数值单元格鼠标松开事件                                                                                                  | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| onDataCellMouseMove | 数值单元格鼠标移动事件                                                                                                  | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| onDataCellTrendIconClick | 趋势图 icon 点击事件                                                                                                  | (meta: [ViewMeta](/zh/docs/api/basic-class/node)) => void | | |
| onDataCellBrushSelection | 单元格刷选事件                                                                                                  | (brushRangeDataCells: DataCell[]) => void | | |
| onCornerCellHover | 角头鼠标悬停事件                                                                                                  | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| onCornerCellClick | 角头鼠标单击事件                                                                                                  | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| onCornerCellDoubleClick | 角头鼠标双击事件                                                                                                  | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| onCornerCellMouseUp | 角头鼠标按下事件                                                                                                  | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| onCornerCellMouseUp |角头鼠标松开事件                                                                                                  | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| onCornerCellMouseMove | 角头鼠标移动事件                                                                                                  | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| onMergedCellsHoverr | 合并单元格鼠标悬停事件                                                                                               | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| onMergedCellClick | 合并单元格鼠标点击事件                                                                                               | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| onMergedCellDoubleClick | 合并单元格鼠标双击事件                                                                                               | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| onMergedCellsMouseDown | 合并单元格按下事件                                                                                                  | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| onMergedCellsMouseUp |合并单元格松开事件                                                                                                  | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| onMergedCellsMouseMove | 合并单元格移动事件                                                                                                  | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| onRangeSort | 组内排序时触发回调事件（暂只支持透视表）                                                                                      | (params: [SortParams](#sortparams) ) => void; | |  |
| onRangeSorted | 组内排序结束触发回调事件（暂只支持透视表）                                                                                      | (event: CanvasEvent ) => void; | |  |
| onRangeFilter | 筛选时触发回调事件                                                                                  | (data: { filterKey: string; filteredValues: string[] } ) => void; | | |
| onRangeFiltered | 筛选结束触发回调事件                                                                                    | (data: DataType[] ) => void; | | |
| onLayoutAfterHeaderLayout | 表头布局结构准备完成事件                                                                            | (layoutResult: [LayoutResult](#/zh/docs/api/general/S2Options#layoutresult) ) => void; | | |
| onLayoutPagination | 分页事件                                                                            | ({ pageSize: number; pageCount: number; total: number; current: number;} ) => void; | | |
| onLayoutCellScroll | 单元格滚动事件                                                                            | ({position: [CellScrollPosition](#cellscrollposition)} ) => void; | | |
| onLayoutAfterCollapseRows | 树状模式下收起行头后的事件回调                                                                           | ({collapsedRows: Record<string, boolean>, meta: [Node](/zh/docs/api/basic-class/node) ) => void; | | |
| onCollapseRowsAll | 树状模式下收起全部的事件回调                                                                           | ({hierarchyCollapse: boolean ) => void; | | |
| onLayoutColsExpanded | 开启隐藏列头（tooltip.operation.hiddenColumns = true）后，列头展开的事件回调 | ({hierarchyCollapse: boolean ) => void; | | |
| onLayoutColsHidden | 开启隐藏列头（tooltip.operation.hiddenColumns = true）后，列头隐藏的事件回调  | ({data: { currentHiddenColumnsInfo:[HiddenColumnsInfo](#hiddencolumnsinfo);hiddenColumnsDetail:[HiddenColumnsInfo](#hiddencolumnsinfo)[];} ) => void; | | |
| onBeforeRender | 开始 render 前的事件 | () => void; | | |
| onAfterRender | render 完成的事件 | () => void; | | |
| onDestroy | 表格销毁事件 | () => void; | | |
| onLayoutResize | 表格整体 changeSize 事件 | (params: [ResizeParams](#resizeparams)) => void; | | |
| onLayoutResizeSeriesWidth | 表格序号行宽事件 | (params: [ResizeParams](#resizeparams)) => void; | | |
| onLayoutResizeRowWidth | 行头单元格宽度更改事件 | (params: [ResizeParams](#resizeparams)) => void; | | |
| onLayoutResizeRowHeight | 行头单元格高度更改事件 | (params: [ResizeParams](#resizeparams)) => void; | | |
| onLayoutResizeColWidth | 列头单元格宽度更改事件 | (params: [ResizeParams](#resizeparams)) => void; | | |
| onLayoutResizeColHeight | 列头单元格高度更改事件 | (params: [ResizeParams](#resizeparams)) => void; | | |
| onLayoutResizeTreeWidth | 树状行头整体宽度更改事件 | (params: [ResizeParams](#resizeparams)) => void; | | |
| onLayoutResizeMouseDown | resize 热区鼠标按下事件 | ( event: Partial<MouseEvent>;resizeInfo?: [ResizeInfo](#resizeinfo);) => void; | | |
| onLayoutResizeMouseUp | resize 热区鼠标松开事件 | ( event: Partial<MouseEvent>;resizeInfo?: [ResizeInfo](#resizeinfo);) => void; | | |
| onLayoutResizeMouseMove | resize 热区鼠标移动事件 | ( event: Partial<MouseEvent>;resizeInfo?: [ResizeInfo](#resizeinfo);) => void; | | |
| onKeyBoardDown | 键盘按下事件 | (event: KeyboardEvent) => void | | |
| onKeyBoardUp | 键盘松开事件 | (event: KeyboardEvent) => void | | |
| onCopied | 复制事件 | (copyData: string) => void | | |
| onActionIconHover | 行头操作 icon 悬停事件 | (event: CanvasEvent) => void | | |
| onActionIconClick | 行头操作 icon 点击事件 | (event: CanvasEvent) => void | | |
| onContextMenu | 右键单元格单击事件 | (data: [TargetCellInfo](#targetcellinfo)) => void | | |
| onMouseHover | 表格鼠标悬停事件 | (event: CanvasEvent) => void | | |
| onMouseUp | 表格鼠标松开事件 | (event: CanvasEvent) => void | | |
| onSelected | 单元格选中事件 | (cells: S2Cell[]) => void | | |
| onReset | 交互状态重置事件 | (event: KeyboardEvent) => void | | |
| onLinkFieldJump | 链接字段跳转事件 | (data: { key: string; record: [Data](/zh/docs/api/general/S2DataConfig#data) }) => void | | |

### TargetCellInfo

功能描述：交互回调函数的返回信息。

| 参数 | 说明 | 类型 | 默认值  | 必选 |
| :--- | :--- | :--- | :--- | :---: |
| target | 交互作用对象 | [S2CellType](/zh/docs/api/basic-class/base-cell) | | |
| event | 事件 | [Event](#) | | |
| viewMeta | 当前节点信息 | [Node](/zh/docs/api/basic-class/node) | | |

`markdown:docs/common/sort-params.zh.md`

### CellScrollPosition

功能描述：单元格滚动的位置信息。

| 参数 | 说明 | 类型 | 默认值  | 必选 |
| :--- | :--- | :--- | :--- | :---: |
| scrollX | 滚动 x 坐标 | number | | |
| scrollY | 滚动 y 坐标 | number | | |
| thumbOffset | 滚动条偏移量 | number | | |

### HiddenColumnsInfo

功能描述： 开启 [隐藏列头](/zh/docs/manual/advanced/interaction/hide-columns) 后，隐藏列头的节点信息

| 参数 | 说明 | 类型 | 默认值  | 必选 |
| :--- | :--- | :--- | :--- | :---: |
| hideColumnNodes | 当前隐藏的节点信息 | [Node](/zh/docs/api/basic-class/node)[] | | |
| displaySiblingNode | 展示的相邻节点信息 | {prev:[Node](/zh/docs/api/basic-class/node);next: [Node](/zh/docs/api/basic-class/node);} | | |

### ResizeParams

功能描述：表格 resize（ 表体尺寸大小变化、单元格行高列宽拖动变化） 信息

| 参数 | 说明 | 类型 | 默认值  | 必选 |
| :--- | :--- | :--- | :--- | :---: |
| resizeInfo | resize 配置信息 | [ResizeInfo](#resizeinfo) | | |
| style | options 中样式相关配置 |[style](/zh/docs/api/general/S2Options#style) | | |

### ResizeInfo

功能描述：表格 resize（ 表体尺寸大小变化、单元格行高列宽拖动变化） 配置信息

| 参数 | 说明 | 类型 | 默认值  | 必选 |
| :--- | :--- | :--- | :--- | :---: |
| theme | resize 热区配置 | [ResizeArea](#resizearea) | | ✓ |
| type | resize 方向 | `Horizontal` \| `Vertical` | | ✓ |
| offsetX | 横向偏移量 | number | | ✓ |
| offsetY |  纵向偏移量 | number | | ✓ |
| offsetX | 横向偏移量 | number | | ✓ |
| width | 拖拽的宽度 | number | | ✓ |
| height | 拖拽 | number | | ✓ |
| size | 热区尺寸 | number | | ✓ |
| effect | 拖拽更改影响的区域 | `Field` \| `Cell` \| `Tree` \| `Series`  | | ✓ |
| isResizeArea | 是否属于 resize 热区 |[style](/zh/docs/api/general/S2Options#style) | | |
| id | 字段 id | | | |
