---
title: BaseFacet
order: 7
---
Function description: the current visible rendering area. [details](https://github.com/antvis/S2/blob/master/packages/s2-core/src/facet/base-facet.ts)

```ts
s2.facet.xx()
```

| parameter                         | illustrate                                                | type                                                                                             |
| --------------------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| spreadsheet                       | Form example                                              | [SpreadSheet](/docs/api/basic-class/spreadsheet)                                              |
| cornerBBox                        | corner bounding box                                       | [BBox](/docs/api/basic-class/spreadsheet/#bbox)                                               |
| panelBBox                         | Value area bounding box                                   | [BBox](/docs/api/basic-class/spreadsheet/#bbox)                                               |
| backgroundGroup                   | background area                                           | [Group](https://g.antv.vision/zh/docs/api/group)                                                 |
| panelGroup                        | Numeric field                                             | [Group](https://g.antv.vision/zh/docs/api/group)                                                 |
| foregroundGroup                   | foreground area                                           | [Group](https://g.antv.vision/zh/docs/api/group)                                                 |
| layoutResult                      | layout information                                        | [LayoutResult](#layoutresult)                                                                    |
| viewCellWidths                    | Cell width information                                    | `number[]`                                                                                       |
| hScrollBar                        | Value area horizontal scroll bar                          | () => [Group](https://g.antv.vision/zh/docs/api/group)                                           |
| hRowScrollBar                     | Line header area horizontal scroll bar                    | () => [Group](https://g.antv.vision/zh/docs/api/group)                                           |
| vScrollBar                        | Value area vertical scroll bar                            | () => [Group](https://g.antv.vision/zh/docs/api/group)                                           |
| rowHeader                         | Outfit                                                    | [BaseHeaderConfig](#baseheaderconfig)                                                            |
| columnHeader                      | Header                                                    | [BaseHeaderConfig](#baseheaderconfig)                                                            |
| cornerHeader                      | Corner head                                               | [BaseHeaderConfig](#baseheaderconfig)                                                            |
| rowIndexHeader                    | serial number                                             | [BaseHeaderConfig](#baseheaderconfig)                                                            |
| centerFrame                       | frame                                                     | [Group](https://g.antv.vision/zh/docs/api/group)                                                 |
| gridInfo                          | grid information                                          | [GridInfo](#gridinfo)                                                                            |
| getViewCellHeights                | Get cell height information                               | ( `layoutResult` : [LayoutResult](#layoutresult) ) => [ViewCellHeights](#viewcellheights)        |
| scrollBarTheme                    | scroll bar theme                                          | [ScrollBarTheme](/docs/api/general/S2Theme/#scrollbartheme)                                   |
| scrollBarSize                     | scroll bar size                                           | `number`                                                                                         |
| hideScrollBar                     | hide scrollbar                                            | () => void                                                                                       |
| delayHideScrollBar                | Delay to hide the scrollbar (after 1s)                    | () => void                                                                                       |
| delayHideScrollbarOnMobile        | On the mobile side, delay hiding the scrollbar (after 1s) | () => void                                                                                       |
| showVerticalScrollBar             | show vertical scrollbar                                   | () => void                                                                                       |
| showHorizontalScrollBar           | Show horizontal scroll bar                                | () => void                                                                                       |
| render                            | rendering                                                 | () => void                                                                                       |
| getSeriesNumberWidth              | Get the serial number width                               | () => number                                                                                     |
| getContentHeight                  | Get the height of the currently rendered area             | () => number                                                                                     |
| getPaginationScrollY              | x                                                         | () => number                                                                                     |
| updateScrollOffset                | scroll                                                    | (offsetConfig: [OffsetConfig](#offsetconfig) ) => void                                           |
| scrollWithAnimation               | Scrolling (with easing animation)                         | (offsetConfig: [OffsetConfig](#offsetconfig) , duration?: number, callback?: () => void) => void |
| scroll Immediately                | scrolling (no animation)                                  | (offsetConfig: [OffsetConfig](#offsetconfig) ) => void                                           |
| destroy                           | uninstall                                                 | () => void                                                                                       |
| getScrollOffset                   | Get the current scroll offset                             | () => [ScrollOffset](#scrolloffset)                                                              |
| setScrollOffset                   | Set the current scroll offset                             | (scrollOffset: [ScrollOffset](#scrolloffset) ) => void                                           |
| emitPaginationEvent               | trigger pagination event                                  | () => void                                                                                       |
| clipPanelGroup                    | Clipping value range Group                                | () => void                                                                                       |
| getRealWidth                      | Get the actual rendered width                             | () => number                                                                                     |
| getRealHeight                     | Get the actual rendered height                            | () => number                                                                                     |
| clearAllGroup                     | Clear all groups                                          | () => void                                                                                       |
| isScrollOverThePanelArea          | Whether to scroll in the value area                       | (cellScrollOffset: [CellScrollOffset](#cellscrolloffset) ) => boolean                            |
| isScrollOverTheCornerArea         | Whether to scroll in the corner header area               | (cellScrollOffset: [CellScrollOffset](#cellscrolloffset) ) => boolean                            |
| isScrollToLeft                    | Whether to scroll to the left                             | (cellScrollOffset: [CellScrollOffset](#cellscrolloffset) ) => boolean                            |
| isScrollToRight                   | Whether to scroll to the far right                        | (cellScrollOffset: [CellScrollOffset](#cellscrolloffset) ) => boolean                            |
| isScrollToTop                     | Did you scroll to the top                                 | (deltaY: number) => boolean                                                                      |
| isScrollToBottom                  | Did you scroll to the bottom                              | (deltaY: number) => boolean                                                                      |
| isVerticalScrollOverTheViewport   | Whether to scroll vertically in the value cell area       | (deltaY: number) => boolean                                                                      |
| isHorizontalScrollOverTheViewport | Whether to scroll horizontally in the numeric cell area   | (scrollOffset: [CellScrollOffset](#cellscrolloffset) ) => boolean                                |
| isScrollOverTheViewport           | Whether to scroll in the value cell area                  | (cellScrollOffset: [CellScrollOffset](#cellscrolloffset) ) => boolean                            |
| cancelScrollFrame                 | Cancel the current scroll frame                           | () => void                                                                                       |
| clearScrollFrameIdOnMobile        | Cancel the current scrolling frame (mobile terminal)      | () => void                                                                                       |
| addCell                           | add cell                                                  | (cell: [BaseCell](/docs/api/basic-class/base-cell) ) => void                                  |
| drawGrid                          | draw grid                                                 | () => void                                                                                       |

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
