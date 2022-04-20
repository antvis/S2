---
title: Interaction
order: 2
---

功能描述：交互类相关属性和方法。[详情](https://github.com/antvis/S2/blob/master/packages/s2-core/src/interaction/root.ts)

```ts
this.spreadsheet.interaction.xx()
```

| 参数 | 说明 | 类型 |
| --- | --- | --- |
| spreadsheet | 表格实例 | [SpreadSheet](/zh/docs/api/basic-class/spreadsheet) |
| interactions | 当前已注册的交互 | `Map<string, BaseEvent>` |
| intercept | 当前拦截的交互，防止不同交互之间冲突 | `Set<Intercept>` |
| destroy | 卸载所有交互实例，并重置为初始状态 | `() => void` |
| reset | 重置所有交互 | `() => void` |
| setState | 设置状态 | `(data: InteractionStateInfo) => void` |
| getState | 获取当前状态 | `() => void` |
| resetState | 重置为初始状态 | `() => void` |
| clearState | 清空状态，并重绘 | `() => void` |
| changeState | 更新状态 | `(data: InteractionStateInfo) => void` |
| setInteractedCells | 设置当前发生改变的单元格 | `(cell: S2CellType) => void` |
| getInteractedCells | 获取当前发生改变的单元格 | `() => S2CellType[]` |
| getCurrentStateName | 获取当前状态名 | `() => void` |
| isEqualStateName | 是否是相同的状态名 | `(name: InteractionStateName) => void` |
| isSelectedState | 是否是选中状态 | `() => void` |
| isHoverState | 是否是悬停状态 | `() => void` |
| isHoverFocusState | 是否是悬停聚焦状态 （悬停在单元格 800ms 后） | `() => void` |
| isSelectedCell | 是否是选中的单元格 | `(cell: S2CellType) => void` |
| isActiveCell | 是否是激活的单元格 | `(cell: S2CellType) => void` |
| getCells | 获取当前 interaction 记录的 Cells 元信息列表，包括不在视口内的格子 | `() => Partial<ViewMeta>[]` |
| getActiveCells | 获取当前在可视区域的单元格实例 | `() => S2CellType[]` |
| clearStyleIndependent | 清除单元格样式 | `() => void` |
| getPanelGroupAllUnSelectedDataCells | 获取可视区域内选中的数值单元格 | `() => DataCell[]` |
| getPanelGroupAllDataCells | 获取可视区域内的所有数值单元格 | `() => DataCell[]` |
| getAllRowHeaderCells | 获取行头单元格 | `() => RowCell[]` |
| getAllColHeaderCells | 获取列头单元格 | `() => ColCell[]` |
| getRowColActiveCells | 获取行头和列头激活的单元格 | `() => RowCell[] | ColCell[]` |
| getAllCells | 获取所有单元格 | `() => S2CellType[]` |
| selectAll | 选中所有单元格 | `() => void` |
| selectHeaderCell | 选中指定行列头单元格 | `(selectHeaderCellInfo: SelectHeaderCellInfo) => boolean` |
| getCellLeafNodes | 获取当前单元格的叶子节点 | `(cell: S2CellType[]) => Node[]` |
| hideColumns | 隐藏列 | `(hiddenColumnFields: string[]) => void` |
| mergeCells | 合并单元格 | `(cellsInfo?: MergedCellInfo[], hideData?: boolean) => void` |
| unmergeCells | 取消合并单元格 | `(removedCells: MergedCell) => void` |
| updatePanelGroupAllDataCells | 更新所有数值单元格 | `() => void` |
| updateCells | 更新指定单元格 | `(cells: S2CellType[]) => void` |
| addIntercepts | 新增交互拦截 | `(interceptTypes: InterceptType[]) => void` |
| hasIntercepts | 是否有指定拦截的交互 | `(interceptTypes: InterceptType[]) => boolean` |
| removeIntercepts | 移除指定交互拦截 | `(interceptTypes: InterceptType[]) => void` |

`markdown:docs/common/interaction.zh.md`

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
  BRUSH_SELECTION = 'brushSelection',
  MULTI_SELECTION = 'multiSelection',
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
  | MergedCell
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
