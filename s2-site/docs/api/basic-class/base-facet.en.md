---
title: BaseFacet
order: 7
tag: Updated
---

Function description: the current visible rendering area. [details](https://github.com/antvis/S2/blob/next/packages/s2-core/src/facet/base-facet.ts)

```ts
s2.facet.getRealWidth()
```

| parameter                         | illustrate                                                                                        | type                                                                                                                        | Version  |
| --------------------------------- | ------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | -------- |
| spreadsheet                       | Form example                                                                                      | [SpreadSheet](/docs/api/basic-class/spreadsheet)                                                                            |          |
| cornerBBox                        | corner bounding box                                                                               | [BBox](/docs/api/basic-class/spreadsheet/#bbox)                                                                             |          |
| panelBBox                         | Value area bounding box                                                                           | [BBox](/docs/api/basic-class/spreadsheet/#bbox)                                                                             |          |
| backgroundGroup                   | background area                                                                                   | [Group](https://g.antv.vision/zh/docs/api/group)                                                                            |          |
| panelGroup                        | Numeric field                                                                                     | [Group](https://g.antv.vision/zh/docs/api/group)                                                                            |          |
| foregroundGroup                   | foreground area                                                                                   | [Group](https://g.antv.vision/zh/docs/api/group)                                                                            |          |
| layoutResult                      | layout information                                                                                | [LayoutResult](#layoutresult)                                                                                               |          |
| viewCellWidths                    | Cell width information                                                                            | `number[]`                                                                                                                  |          |
| hScrollBar                        | Value area horizontal scroll bar                                                                  | () => [Group](https://g.antv.vision/zh/docs/api/group)                                                                      |          |
| hRowScrollBar                     | Line header area horizontal scroll bar                                                            | () => [Group](https://g.antv.vision/zh/docs/api/group)                                                                      |          |
| vScrollBar                        | Value area vertical scroll bar                                                                    | () => [Group](https://g.antv.vision/zh/docs/api/group)                                                                      |          |
| rowHeader                         | Outfit                                                                                            | [BaseHeaderConfig](#baseheaderconfig)                                                                                       |          |
| columnHeader                      | Header                                                                                            | [BaseHeaderConfig](#baseheaderconfig)                                                                                       |          |
| cornerHeader                      | Corner head                                                                                       | [BaseHeaderConfig](#baseheaderconfig)                                                                                       |          |
| seriesNumberHeader                | serial number                                                                                     | [BaseHeaderConfig](#baseheaderconfig)                                                                                       |          |
| centerFrame                       | frame                                                                                             | [Group](https://g.antv.vision/zh/docs/api/group)                                                                            |          |
| gridInfo                          | grid information                                                                                  | [GridInfo](#gridinfo)                                                                                                       |          |
| getViewCellHeights                | Get cell height information                                                                       | ( `layoutResult` : [LayoutResult](#layoutresult) ) => [ViewCellHeights](#viewcellheights)                                   |          |
| scrollBarTheme                    | scroll bar theme                                                                                  | [ScrollBarTheme](/docs/api/general/S2Theme/#scrollbartheme)                                                                 |          |
| scrollBarSize                     | scroll bar size                                                                                   | `number`                                                                                                                    |          |
| hideScrollBar                     | hide scrollbar                                                                                    | () => void                                                                                                                  |          |
| delayHideScrollBar                | Delay to hide the scrollbar (after 1s)                                                            | () => void                                                                                                                  |          |
| delayHideScrollbarOnMobile        | On the mobile side, delay hiding the scrollbar (after 1s)                                         | () => void                                                                                                                  |          |
| showVerticalScrollBar             | show vertical scrollbar                                                                           | () => void                                                                                                                  |          |
| showHorizontalScrollBar           | Show horizontal scroll bar                                                                        | () => void                                                                                                                  |          |
| render                            | rendering                                                                                         | () => void                                                                                                                  |          |
| getSeriesNumberWidth              | Get the serial number width                                                                       | () => number                                                                                                                |          |
| getContentHeight                  | Get the height of the currently rendered area                                                     | () => number                                                                                                                |          |
| getPaginationScrollY              | x                                                                                                 | () => number                                                                                                                |          |
| updateScrollOffset                | scroll                                                                                            | (offsetConfig: [OffsetConfig](#offsetconfig) ) => void                                                                      |          |
| scrollWithAnimation               | Scrolling (with easing animation)                                                                 | (offsetConfig: [OffsetConfig](#offsetconfig) , duration?: number, callback?: () => void) => void                            |          |
| scroll Immediately                | scrolling (no animation)                                                                          | (offsetConfig: [OffsetConfig](#offsetconfig) ) => void                                                                      |          |
| destroy                           | uninstall                                                                                         | () => void                                                                                                                  |          |
| getScrollOffset                   | Get the current scroll offset                                                                     | () => [ScrollOffset](#scrolloffset)                                                                                         |          |
| setScrollOffset                   | Set the current scroll offset                                                                     | (scrollOffset: [ScrollOffset](#scrolloffset) ) => void                                                                      |          |
| resetScrollOffset                 | Reset the current scroll offset                                                                   | () => void                                                                                                                  |          |
| resetScrollX                      | reset horizontal scroll offset                                                                    | () => void                                                                                                                  |          |
| resetScrollY                      | reset vertical scroll offset                                                                      | () => void                                                                                                                  |          |
| resetRowScrollX                   | Reset row header horizontal scroll offset                                                         | () => void                                                                                                                  |          |
| emitPaginationEvent               | trigger pagination event                                                                          | () => void                                                                                                                  |          |
| clipPanelGroup                    | Clipping value range Group                                                                        | () => void                                                                                                                  |          |
| getRealWidth                      | Get the actual rendered width                                                                     | () => number                                                                                                                |          |
| getRealHeight                     | Get the actual rendered height                                                                    | () => number                                                                                                                |          |
| clearAllGroup                     | Clear all groups                                                                                  | () => void                                                                                                                  |          |
| isScrollOverThePanelArea          | Whether to scroll in the value area                                                               | (cellScrollOffset: [CellScrollOffset](#cellscrolloffset) ) => boolean                                                       |          |
| isScrollOverTheCornerArea         | Whether to scroll in the corner header area                                                       | (cellScrollOffset: [CellScrollOffset](#cellscrolloffset) ) => boolean                                                       |          |
| isScrollToLeft                    | Whether to scroll to the left                                                                     | (cellScrollOffset: [CellScrollOffset](#cellscrolloffset) ) => boolean                                                       |          |
| isScrollToRight                   | Whether to scroll to the far right                                                                | (cellScrollOffset: [CellScrollOffset](#cellscrolloffset) ) => boolean                                                       |          |
| isScrollToTop                     | Did you scroll to the top                                                                         | (deltaY: number) => boolean                                                                                                 |          |
| isScrollToBottom                  | Did you scroll to the bottom                                                                      | (deltaY: number) => boolean                                                                                                 |          |
| isVerticalScrollOverTheViewport   | Whether to scroll vertically in the value cell area                                               | (deltaY: number) => boolean                                                                                                 |          |
| isHorizontalScrollOverTheViewport | Whether to scroll horizontally in the numeric cell area                                           | (scrollOffset: [CellScrollOffset](#cellscrolloffset) ) => boolean                                                           |          |
| isScrollOverTheViewport           | Whether to scroll in the value cell area                                                          | (cellScrollOffset: [CellScrollOffset](#cellscrolloffset) ) => boolean                                                       |          |
| cancelScrollFrame                 | Cancel the current scroll frame                                                                   | () => void                                                                                                                  |          |
| clearScrollFrameIdOnMobile        | Cancel the current scrolling frame (mobile terminal)                                              | () => void                                                                                                                  |          |
| addCell                           | add cell                                                                                          | (cell: [BaseCell](/docs/api/basic-class/base-cell) ) => void                                                                |          |
| drawGrid                          | draw grid                                                                                         | () => void                                                                                                                  |          |
| getCanvasSize                     | Get canvas width and height                                                                       | `{width: number, height: number}`                                                                                           |          |
| backgroundGroup                   | background color area group                                                                       | [Group](https://g.antv.vision/zh/docs/api/group)                                                                            |          |
| foregroundGroup                   | background color area group                                                                       | [Group](https://g.antv.vision/zh/docs/api/group)                                                                            |          |
| panelGroup                        | Visible range cell area group                                                                     | [Group](https://g.antv.vision/zh/docs/api/group)                                                                            |          |
| panelScrollGroup                  | Visible range cell scrolling area group                                                           | [Group](https://g.antv.vision/zh/docs/api/group)                                                                            |          |
| frozenRowGroup                    | Header freeze area group                                                                          | [Group](https://g.antv.vision/zh/docs/api/group)                                                                            |          |
| frozenColGroup                    | Column header freeze area group                                                                   | [Group](https://g.antv.vision/zh/docs/api/group)                                                                            |          |
| frozenTrailingRowGroup            | Freezing area group at the bottom of the row header                                               | [Group](https://g.antv.vision/zh/docs/api/group)                                                                            |          |
| frozenTrailingColGroup            | Freeze area group at the bottom of the column header                                              | [Group](https://g.antv.vision/zh/docs/api/group)                                                                            |          |
| frozenTopGroup                    | top freeze area group                                                                             | [Group](https://g.antv.vision/zh/docs/api/group)                                                                            |          |
| frozenBottomGroup                 | Bottom freeze area group                                                                          | [Group](https://g.antv.vision/zh/docs/api/group)                                                                            |          |
| getHiddenColumnsInfo              | Match whether the current node is a hidden node, if so, return the hidden information of the node | (node: [Node](/docs/api/basic-class/node) ) => [HiddenColumnsInfo](/docs/api/basic-class/store#hiddencolumnsinfo) \| `null` | `1.34.1` |
| getCornerNodes                    | Get corner node                                                                                   | () => [Node](/docs/api/basic-class/node) \[]                                                                                | `1.40.0` |

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
