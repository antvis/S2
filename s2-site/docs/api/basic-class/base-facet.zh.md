---
title: BaseFacet
order: 7
---

功能描述：当前可视渲染区域。[详情](https://github.com/antvis/S2/blob/master/packages/s2-core/src/facet/base-facet.ts)

```ts
s2.facet.getRealWidth()
```

| 参数 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| spreadsheet | 表格实例 |  [SpreadSheet](/docs/api/basic-class/spreadsheet) |
| cornerBBox | 角头区域包围盒 |  [BBox](/docs/api/basic-class/spreadsheet/#bbox) |
| panelBBox | 数值区域包围盒 | [BBox](/docs/api/basic-class/spreadsheet/#bbox) |
| backgroundGroup | 背景区域 |  [Group](https://g.antv.vision/zh/docs/api/group) |
| panelGroup | 数值区域 | [Group](https://g.antv.vision/zh/docs/api/group) |
| foregroundGroup | 前景区域 |  [Group](https://g.antv.vision/zh/docs/api/group) |
| layoutResult | 布局信息 |  [LayoutResult](#layoutresult) |
| viewCellWidths | 单元格宽度信息 | `number[]` |
| hScrollBar | 数值区域水平滚动条 | () =>  [Group](https://g.antv.vision/zh/docs/api/group) |
| hRowScrollBar | 行头区域水平滚动条 | () =>  [Group](https://g.antv.vision/zh/docs/api/group) |
| vScrollBar | 数值区域垂直滚动条 | () =>  [Group](https://g.antv.vision/zh/docs/api/group) |
| rowHeader | 行头 |  [BaseHeaderConfig](#baseheaderconfig) |
| columnHeader | 列头 |  [BaseHeaderConfig](#baseheaderconfig)  |
| cornerHeader | 角头 |  [BaseHeaderConfig](#baseheaderconfig)  |
| rowIndexHeader | 序号 |  [BaseHeaderConfig](#baseheaderconfig)  |
| centerFrame | 框架 |  [Group](https://g.antv.vision/zh/docs/api/group) |
| gridInfo | 网格信息 |  [GridInfo](#gridinfo) |
| getViewCellHeights | 获取单元格高度信息 | (`layoutResult`: [LayoutResult](#layoutresult)) => [ViewCellHeights](#viewcellheights) |
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
| getHiddenColumnsInfo | 匹配当前节点是否是隐藏节点，如果是，则返回该节点隐藏信息 | (node: [Node](/docs/api/basic-class/node)) => [HiddenColumnsInfo](/docs/api/basic-class/store#hiddencolumnsinfo) \| `null`  | `1.34.1` |
| getCornerNodes | 获取角头节点 | () => [Node](/docs/api/basic-class/node)[]  | `1.40.0` |

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
  getCellMeta: GetCellMeta;
  spreadsheet: SpreadSheet;
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
