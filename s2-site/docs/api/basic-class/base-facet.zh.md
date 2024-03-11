---
title: BaseFacet
order: 7
tag: Updated
---

功能描述：当前可视渲染区域。[详情](https://github.com/antvis/S2/blob/next/packages/s2-core/src/facet/base-facet.ts)

```ts
s2.facet.getRealWidth()
```

| 参数 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| spreadsheet | 表格实例 |  [SpreadSheet](/docs/api/basic-class/spreadsheet) |
| cornerBBox | 角头区域包围盒 |  [BBox](/docs/api/basic-class/base-bbox) |
| panelBBox | 数值区域包围盒 | [BBox](/docs/api/basic-class/base-bbox) |
| backgroundGroup | 背景区域 |  [Group](https://g.antv.antgroup.com/api/basic/group) |
| panelGroup | 数值区域 | [Group](https://g.antv.antgroup.com/api/basic/group) |
| foregroundGroup | 前景区域 |  [Group](https://g.antv.antgroup.com/api/basic/group) |
| getLayoutResult | 获取布局信息 （角头，序号，行头，列头） |  () => [LayoutResult](#layoutresult) |
| viewCellWidths | 单元格宽度信息 | `number[]` |
| hScrollBar | 数值区域水平滚动条 | () =>  [Group](https://g.antv.antgroup.com/api/basic/group) |
| hRowScrollBar | 行头区域水平滚动条 | () =>  [Group](https://g.antv.antgroup.com/api/basic/group) |
| vScrollBar | 数值区域垂直滚动条 | () =>  [Group](https://g.antv.antgroup.com/api/basic/group) |
| rowHeader | 行头 |  [BaseHeaderConfig](#baseheaderconfig) |
| columnHeader | 列头 |  [BaseHeaderConfig](#baseheaderconfig)  |
| cornerHeader | 角头 |  [BaseHeaderConfig](#baseheaderconfig)  |
| seriesNumberHeader | 序号 |  [BaseHeaderConfig](#baseheaderconfig)  |
| centerFrame | 框架 |  [Group](https://g.antv.antgroup.com/api/basic/group) |
| gridInfo | 网格信息 |  [GridInfo](#gridinfo) |
| getViewCellHeights | 获取单元格高度信息 | () => [ViewCellHeights](#viewcellheights) |
| scrollBarTheme | 滚动条主题 | [ScrollBarTheme](/docs/api/general/S2Theme/#scrollbartheme) |
| scrollBarSize | 滚动条大小 | `number` |
| hideScrollBar | 隐藏滚动条 | () => void |
| delayHideScrollBar | 延迟隐藏滚动条 (1s 后） | () => void |
| delayHideScrollbarOnMobile | 移动端时，延迟隐藏滚动条 (1s 后） | () => void |
| showVerticalScrollBar | 显示垂直滚动条 | () => void |
| showHorizontalScrollBar | 显示水平滚动条 | () => void |
| render | 渲染 | () => void |
| getSeriesNumberWidth | 获取序号宽度 | () => number |
| getContentHeight | 获取当前渲染的区域高度 | () => number |
| getPaginationScrollY | x | () => number |
| updateScrollOffset | 滚动 | (offsetConfig: [OffsetConfig](#offsetconfig)) => void |
| scrollWithAnimation | 滚动 （带缓动动画） | (offsetConfig: [OffsetConfig](#offsetconfig), duration?: number, callback?: () => void) => void |
| scrollImmediately | 滚动 （无动画） | (offsetConfig: [OffsetConfig](#offsetconfig)) => void |
| destroy | 卸载 | () => void |
| getScrollOffset | 获取当前滚动偏移 | () => [ScrollOffset](#scrolloffset) |
| setScrollOffset | 设置当前滚动偏移 | (scrollOffset: [ScrollOffset](#scrolloffset)) => void |
| resetScrollOffset | 重置当前滚动偏移 | () => void |
| resetScrollX | 重置水平滚动偏移 | () => void |
| resetScrollY | 重置垂直滚动偏移 | () => void |
| resetRowScrollX | 重置行头水平滚动偏移 | () => void |
| emitPaginationEvent | 触发分页事件 | () => void |
| clipPanelGroup | 裁剪数值区域 Group | () => void |
| getRealWidth | 获取实际渲染的宽度 | () => number |
| getRealHeight | 获取实际渲染的高度 | () => number |
| clearAllGroup | 清空所有 Group | () => void |
| isScrollOverThePanelArea | 是否在数值区域滚动 | (cellScrollOffset: [CellScrollOffset](#cellscrolloffset)) => boolean |
| isScrollOverTheCornerArea | 是否在角头区域滚动 | (cellScrollOffset: [CellScrollOffset](#cellscrolloffset)) => boolean |
| isScrollToLeft | 是否滚动到了最左边 | (cellScrollOffset: [CellScrollOffset](#cellscrolloffset)) => boolean |
| isScrollToRight | 是否滚动到了最右边 | (cellScrollOffset: [CellScrollOffset](#cellscrolloffset)) => boolean |
| isScrollToTop | 是否滚动到了顶部 | (deltaY: number) => boolean |
| isScrollToBottom | 是否滚动到了底部 |  (deltaY: number) => boolean|
| isVerticalScrollOverTheViewport | 是否在数值单元格区域垂直滚动 | (deltaY: number) => boolean |
| isHorizontalScrollOverTheViewport | 是否在数值单元格区域水平滚动 | (scrollOffset: [CellScrollOffset](#cellscrolloffset)) => boolean |
| isScrollOverTheViewport | 是否在数值单元格区域滚动 | (cellScrollOffset: [CellScrollOffset](#cellscrolloffset)) => boolean |
| cancelScrollFrame | 取消当前滚动帧 | () => void |
| clearScrollFrameIdOnMobile | 取消当前滚动帧 （移动端） | () => void |
| addCell | 添加单元格 | (cell: [BaseCell](/docs/api/basic-class/base-cell)) => void |
| drawGrid | 绘制网格 | () => void |
| getCanvasSize | 获取画布宽高 | `{width: number, height: number}` |
| backgroundGroup | 背景颜色区域 group                                                                                                           | [Group](https://g.antv.antgroup.com/api/basic/group) |    |
| foregroundGroup | 背景颜色区域 group                                                                                                           |  [Group](https://g.antv.antgroup.com/api/basic/group) |    |
| panelGroup | 可视范围单元格区域 group                                                                                                        |  [Group](https://g.antv.antgroup.com/api/basic/group) |    |
| panelScrollGroup | 可视范围单元格滚动区域 group                                                                                                      |  [Group](https://g.antv.antgroup.com/api/basic/group) |    |
| frozenRowGroup | 行头冻结区域 group                                                                                                           |  [Group](https://g.antv.antgroup.com/api/basic/group) |    |
| frozenColGroup | 列头冻结区域 group                                                                                                           |  [Group](https://g.antv.antgroup.com/api/basic/group) |    |
| frozenTrailingRowGroup | 行头底部冻结区域 group                                                                                                         |  [Group](https://g.antv.antgroup.com/api/basic/group) |    |
| frozenTrailingColGroup | 列头底部冻结区域 group                                                                                                         |  [Group](https://g.antv.antgroup.com/api/basic/group) |    |
| frozenTopGroup | 顶部冻结区域 group                                                                                                           |  [Group](https://g.antv.antgroup.com/api/basic/group) |    |
| frozenBottomGroup | 底部冻结区域 group                                                                                                           |  [Group](https://g.antv.antgroup.com/api/basic/group) |    |
| getHiddenColumnsInfo | 匹配当前节点是否是隐藏节点，如果是，则返回该节点隐藏信息 | (node: [Node](/docs/api/basic-class/node)) => [HiddenColumnsInfo](/docs/api/basic-class/store#hiddencolumnsinfo) \| `null`  |  |
| getHeaderNodes | 获取表头节点 （角头，序号，行头，列头） （含可视区域） | (ids?: string[]) => [Node](/docs/api/basic-class/node)[]  |  |
| getSeriesNumberNodes | 获取序号节点 | () => [Node](/docs/api/basic-class/node)[]  |  |
| getCornerNodes | 获取角头节点 | () => [Node](/docs/api/basic-class/node)[]  | `1.40.0` |
| getRowNodes | 获取行头节点 | (level?: number) => [Node](/docs/api/basic-class/node)[]  |  |
| getRowNodeById | 根据 id 获取单个行头节点 | (id: string) => [Node](/docs/api/basic-class/node)  |  |
| getRowNodeByIndex | 根据行头索引获取指定列头节点 | (rowIndex: number) => [Node](/docs/api/basic-class/node)  |  |
| getRowNodesByField | 根据 field 获取行头节点 | (field: string) => [Node](/docs/api/basic-class/node)[]  |  |
| getRowLeafNodes | 获取行头单元格叶子节点 | () => [Node](/docs/api/basic-class/node)[]  |  |
| getRowLeafNodeByIndex | 根据行头索引获取指定列头叶子节点 | () => [Node](/docs/api/basic-class/node)[]  |  |
| getRowTotalsNodes | 获取行头汇总单元格节点 | (level?; number) => [Node](/docs/api/basic-class/node)[]  |  |
| getRowSubTotalsNodes | 获取行头小计单元格节点 | (level?; number) => [Node](/docs/api/basic-class/node)[]  |  |
| getRowGrandTotalsNodes | 获取行头总计单元格节点 | (level?: number) => [Node](/docs/api/basic-class/node)[]  |  |
| getColNodes | 获取列头节点 | (level?: number) => [Node](/docs/api/basic-class/node)[]  |  |
| getColNodeById | 根据 id 获取单个列头节点 | (id: string) => [Node](/docs/api/basic-class/node)  |  |
| getColNodeByIndex | 根据行头索引获取指定列头节点 | (colIndex: number) => [Node](/docs/api/basic-class/node)  |  |
| getColNodesByField | 根据 field 获取列节点 | (field: string) => [Node](/docs/api/basic-class/node)[]  |  |
| getColLeafNodes | 获取列头单元格叶子节点 | () => [Node](/docs/api/basic-class/node)[]  |  |
| getColLeafNodeByIndex | 根据列头索引获取指定列头叶子节点 | () => [Node](/docs/api/basic-class/node)[]  |  |
| getColTotalsNodes | 获取列头汇总单元格节点 | (level?; number) => [Node](/docs/api/basic-class/node)[]  |  |
| getColSubTotalsNodes | 获取列头小计单元格节点 | (level?; number) => [Node](/docs/api/basic-class/node)[]  |  |
| getColGrandTotalsNodes | 获取列头总计单元格节点 | (level?: number) => [Node](/docs/api/basic-class/node)[]  |  |
| getDataCells | 获取数值单元格 （不含可视区域） | () => [DataCell](/docs/api/basic-class/base-cell)[]  |  |
| getRowCells | 获取行头单元格 （不含可视区域） | () => [RowCell](/docs/api/basic-class/base-cell)[]  |  |
| getRowLeafCells | 获取行头叶子节点单元格 （不含可视区域） | () => [RowCell](/docs/api/basic-class/base-cell)[]  |  |
| getColCells | 获取列头单元格 （不含可视区域） | () => [ColCell](/docs/api/basic-class/base-cell)[]  |  |
| getColCells | 获取列头叶子节点单元格 （不含可视区域） | () => [ColCell](/docs/api/basic-class/base-cell)[]  |  |
| getMergedCells | 获取合并单元格 （不含可视区域） | () => [MergedCell](/docs/api/basic-class/base-cell)[]  |  |
| getCornerCells | 获取角头单元格 （不含可视区域） | () => [CornerCell](/docs/api/basic-class/base-cell)[]  |  |
| getSeriesNumberCells | 获取序号单元格 （不含可视区域） | () => [SeriesNumberCell](/docs/api/basic-class/base-cell)[]  |  |
| getHeaderCells | 获取表头单元格 （序号，角头，行头，列头） （不含可视区域） | (cellIds?: string[]) => [S2CellType](/docs/api/basic-class/base-cell)[]  |  |
| getCellById | 根据单元格 id 获取指定单元格 （不含可视区域） | (id: string) => [S2CellType](/docs/api/basic-class/base-cell)[]  |  |
| getCellsByField | 根据单元格 field 获取指定单元格 （不含可视区域） | (field: string) => [S2CellType](/docs/api/basic-class/base-cell)[]  |  |
| getCells | 获取所有单元格 （角头，行头，列头，数值） （不含可视区域） | (ids: string[]) => [S2CellType](/docs/api/basic-class/base-cell)[]  |  |
| getInitColLeafNodes | 获取初始化时的记录的列头叶子节点 | () => [Node](/docs/api/basic-class/node)[] |  |
| clearInitColLeafNodes | 清楚初始化时的记录的列头叶子节点 | () => void |  |

### CellScrollOffset

```ts
export interface CellScrollOffset {
  deltaX?: number;
  deltaY?: number;
  offset?: number;
  offsetX: number;
  offsetY: number;
}
```

### LayoutResult

```ts
export interface LayoutResult {
  colNodes: Node[];
  colsHierarchy: Hierarchy;
  rowNodes: Node[];
  rowsHierarchy: Hierarchy;
  rowLeafNodes: Node[];
  colLeafNodes: Node[];
}
```

### BaseHeaderConfig

```ts
export interface BaseHeaderConfig {
  scrollX?: number;
  scrollY?: number;
  width: number;
  height: number;
  originalWidth?: number;
  originalHeight?: number;
  viewportWidth: number;
  viewportHeight: number;
  position: Point;
  data: Node[];
  spreadsheet: SpreadSheet;
  sortParam?: SortParam;
}
```

### GridInfo

```ts
export interface GridInfo {
  cols: number[];
  rows: number[];
}
```

### ViewCellHeights

```ts
export interface ViewCellHeights {
  getCellOffsetY: (index: number) => number;

  getTotalHeight: () => number;

  getTotalLength: () => number;

  getIndexRange: (
    minHeight: number,
    maxHeight: number,
  ) => {
    start: number;
    end: number;
  };
}
```

### OffsetConfig

```ts
export interface OffsetConfig {
  rowHeaderOffsetX?: {
    value: number | undefined;
    animate?: boolean;
  };
  offsetX?: {
    value: number | undefined;
    animate?: boolean;
  };
  offsetY?: {
    value: number | undefined;
    animate?: boolean;
  };
}
```

### ScrollOffset

```ts
export interface ScrollOffset {
  scrollX?: number;
  scrollY?: number;
  rowHeaderScrollX?: number;
}
```
