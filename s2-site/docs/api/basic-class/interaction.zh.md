---
title: Interaction
order: 2
tag: Updated
---

功能描述：交互类相关属性和方法。[详情](https://github.com/antvis/S2/blob/next/packages/s2-core/src/interaction/root.ts)

```ts
s2.interaction.reset()
```

| 参数 | 说明                                               | 类型 |
| --- |--------------------------------------------------| --- |
| spreadsheet | 表格实例                                             | [SpreadSheet](/docs/api/basic-class/spreadsheet) |
| interactions | 当前已注册的交互                                         | `Map<string, BaseEvent>` |
| intercepts | 当前拦截的交互，防止不同交互之间冲突 ([查看示例](/examples/interaction/advanced/#intercepts))                              | `Set<Intercept>` |
| eventController | 事件控制器                              | [EventController](#eventcontroller) |
| destroy | 卸载所有交互实例，并重置为初始状态                                | `() => void` |
| reset | 重置所有交互                                           | `() => void` |
| setState | 设置状态                                             | (data: [InteractionStateInfo](#interactionstateinfo)) => void |
| getState | 获取当前状态                                           | `() => void` |
| resetState | 重置为初始状态                                          | `() => void` |
| clearState | 清空状态，并重绘                                         | `() => void` |
| changeState | 更新状态                                             |  (data: [InteractionStateInfo](#interactionstateinfo)) => void |
| setInteractedCells | 设置当前发生改变的单元格                                     | (cell: [S2CellType](#s2celltype)) => void |
| getInteractedCells | 获取当前发生改变的单元格                                     | () => [S2CellType](#s2celltype)[] |
| getCurrentStateName | 获取当前状态名                                          | `() => void` |
| isEqualStateName | 是否是相同的状态名                                        | (name: [InteractionStateName](#interactionstatename)) => void |
| isSelectedState | 是否是选中状态                                          | `() => void` |
| isHoverState | 是否是悬停状态                                          | `() => void` |
| isHoverFocusState | 是否是悬停聚焦状态 （悬停在单元格 `focusTime`: 默认 800ms 后）       | `() => void` |
| isSelectedCell | 是否是选中的单元格                                        | (cell: [S2CellType](#s2celltype)) => void |
| isActiveCell | 是否是激活的单元格                                        | (cell: [S2CellType](#s2celltype)) => void |
| getCells | 获取当前 interaction 记录的 Cells 元信息列表，包括不在可视范围内的单元格      | () => Partial<[ViewMeta](#viewmeta)>[] |
| getActiveCells | 获取当前在可视区域的单元格实例                                  | `() => S2CellType[]` |
| getActiveDataCells | 获取当前在可视区域的数值单元格实例                                  | `() => S2CellType[]` |
| getActiveRowCells | 获取当前在可视区域的行头单元格实例                                  | `() => S2CellType[]` |
| getActiveColCells | 获取当前在可视区域的列头单元格实例                                  | `() => S2CellType[]` |
| clearStyleIndependent | 清除单元格样式                                          | `() => void` |
| getUnSelectedDataCells | 获取可视区域内选中的数值单元格                                  | `() => DataCell[]` |
| getAllCells | 获取所有可视区域内的单元格                                    | () => [S2CellType](#s2celltype)[] |
| selectAll | 选中所有单元格                                          | `() => void` |
| selectHeaderCell | 选中指定行列头单元格                                       | (selectHeaderCellInfo: [SelectHeaderCellInfo](#selectheadercellinfo)) => boolean |
| hideColumns | 隐藏列 (forceRender 为 `false` 时，隐藏列为空的情况下，不再触发表格更新） | `(hiddenColumnFields: string[], forceRender?: boolean = true) => void` |
| mergeCells | 合并单元格                                            | (cellsInfo?: [MergedCellInfo](#mergedcellinfo)[], hideData?: boolean) => void |
| unmergeCells | 取消合并单元格                                          | `(removedCells: MergedCell[]) => void` |
| updatePanelGroupAllDataCells | 更新所有数值单元格                                        | `() => void` |
| updateCells | 更新指定单元格                                          | (cells: [S2CellType](#s2celltype)[]) => void |
| addIntercepts | 新增交互拦截                                           | (interceptTypes: [InterceptType](#intercepttype)[]) => void |
| hasIntercepts | 是否有指定拦截的交互                                       | (interceptTypes: [InterceptType](#intercepttype)[]) => boolean |
| removeIntercepts | 移除指定交互拦截                                         | (interceptTypes: [InterceptType](#intercepttype)[]) => void |
| highlightNodes | 高亮节点对应的单元格                                       | (nodes: [Node](/docs/api/basic-class/node)[]) => void |
| updateDataCellRelevantHeaderCells | 高亮数值单元格和所对应行列单元格  | (stateName: [InteractionStateName](#interactionstatename), meta: [ViewMeta](#viewmeta)) => void |
| updateDataCellRelevantRowCells | 高亮数值单元格和所对应行头单元格  | (stateName: [InteractionStateName](#interactionstatename), meta: [ViewMeta](#viewmeta)) => void |
| updateDataCellRelevantColCells | 高亮数值单元格和所对应列头单元格  | (stateName: [InteractionStateName](#interactionstatename), meta: [ViewMeta](#viewmeta)) => void |

<embed src="@/docs/common/interaction.zh.md"></embed>

### InteractionConstructor

```ts
export type InteractionConstructor = new (
  spreadsheet: SpreadSheet,
) => BaseEvent;

```

### BaseEvent

```ts
export abstract class BaseEvent {
  public spreadsheet: SpreadSheet;

  constructor(spreadsheet: SpreadSheet) {
    this.spreadsheet = spreadsheet;
    this.bindEvents();
  }

  public abstract bindEvents(): void;
}
```

### InterceptType

```ts
enum InterceptType {
  HOVER = 'hover',
  CLICK = 'click',
  DATA_CELL_BRUSH_SELECTION = 'dataCellBrushSelection',
  ROW_CELL_BRUSH_SELECTION = 'rowCellBrushSelection',
  COL_CELL_BRUSH_SELECTION = 'colCellBrushSelection',
  MULTI_SELECTION = 'multiSelection',
  RESIZE = 'resize',
}
```

### S2CellType

```ts
type S2CellType<T extends SimpleBBox = ViewMeta> =
  | DataCell
  | HeaderCell
  | ColCell
  | CornerCell
  | RowCell
  | SeriesNumberCell
  | MergedCell
  | TableDataCell
  | TableCornerCell
  | TableSeriesNumberCell
  | BaseCell<T>;
```

### SelectHeaderCellInfo

```ts
interface SelectHeaderCellInfo {
  cell: S2CellType<ViewMeta>; // 目标单元格
  isMultiSelection?: boolean; // 是否是多选
}
```

### MergedCellInfo

```ts
interface MergedCellInfo {
  colIndex?: number;
  rowIndex?: number;
  showText?: boolean;
}
```

### CellType

```ts
enum CellType {
  DATA_CELL = 'dataCell',
  ROW_CELL = 'rowCell',
  COL_CELL = 'colCell',
  SERIES_NUMBER_CELL = 'seriesNumberCell',
  CORNER_CELL = 'cornerCell',
  MERGED_CELL = 'mergedCell',
}
```

### CellMeta

```ts
interface CellMeta {
  id: string;
  colIndex: number;
  rowIndex: number;
  type: CellType;
  rowQuery?: Record<string, any>;
  [key: string]: unknown;
}
```

### InteractionStateName

```ts
enum InteractionStateName {
  ALL_SELECTED = 'allSelected',
  SELECTED = 'selected',
  ROW_CELL_BRUSH_SELECTED = 'rowCellBrushSelected',
  COL_CELL_BRUSH_SELECTED = 'colCellBrushSelected',
  DATA_CELL_BRUSH_SELECTED = 'dataCellBrushSelected',
  UNSELECTED = 'unselected',
  HOVER = 'hover',
  HOVER_FOCUS = 'hoverFocus',
  HIGHLIGHT = 'highlight',
  SEARCH_RESULT = 'searchResult',
  PREPARE_SELECT = 'prepareSelect',
}
```

### InteractionStateInfo

```ts
interface InteractionStateInfo {
  stateName?: InteractionStateName;
  cells?: CellMeta[];
  interactedCells?: S2CellType[];
  nodes?: Node[];
  force?: boolean;
}
```

### EventController

| 参数 | 说明    | 类型 |
| --- |--------| --- |
| spreadsheet | 表格实例 | [SpreadSheet](/docs/api/basic-class/spreadsheet) |
| canvasEventHandlers | 当前已注册的交互            | [EventHandler](#eventhandler)[] |
| s2EventHandlers | 当前已注册的交互            | [S2EventHandler](#s2eventhandler)[] |
| domEventListeners | 当前已注册的交互            | [EventHandler](#eventhandler)[] |
| isCanvasEffect | 是否是图表内部引起的事件            | boolean |
| canvasMousemoveEvent | 表格鼠标移动事件            | CanvasEvent |
| isMatchElement | 是否是表格内部的元素            | (event: MouseEvent) => void |
| isMatchPoint | 是否是表格内部的坐标            | (event: MouseEvent) => void |
| bindEvents | 绑定交互事件            | `() => void`) |
| clear | 清空交互事件            | `() => void`) |
| getViewportPoint | 获取表格内的鼠标坐标 （兼容 `supportsCSSTransform`)  | `(event: MouseEvent \| PointerEvent \| WheelEvent) => PointLike` |

### EventListener

```ts
interface EventListener {
  target: EventTarget;
  type: string;
  handler: EventListenerOrEventListenerObject;
  options?: AddEventListenerOptions | boolean;
}
```

### S2EventHandler

```ts
interface S2EventHandler {
  type: keyof EmitterType;
  handler: EmitterType[keyof EmitterType];
}
```

### EventHandler

```ts
interface EventHandler {
  type: string;
  handler: (event: CanvasEvent) => void;
}
```

<embed src="@/docs/common/view-meta.zh.md"></embed>
