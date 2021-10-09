---
title: Interaction
order: 2
---

功能描述：交互类相关属性和方法。[详情](https://github.com/antvis/S2/blob/master/packages/s2-core/src/interaction/root.ts)

```ts
this.spreadsheet.interaction.xx()
```

| 参数 | 类型 | 默认值 | 功能描述 |
| --- | --- | --- | --- |
| spreadsheet | [SpreadSheet](/zh/docs/api/basic-class/spreadsheet) |  | 表格实例 |
| interactions | `Map<string, BaseEvent>` |   | 当前已注册的交互 |
| intercept | `Set<Intercept>` |  | 当前拦截的交互，防止不同交互之间冲突 |
| destroy | `() => void` |  | 卸载所有交互实例，并重置为初始状态 |
| reset | `() => void` |   | 重置所有交互 |
| setState | `(data: InteractionStateInfo) => void` |    | 设置状态 |
| getState | `() => void` | | 获取当前状态 |
| resetState | `() => void` | | 重置为初始状态 |
| clearState | `() => void` |   | 清空状态，并重绘 |
| changeState | `(data: InteractionStateInfo) => void` |   | 更新状态 |
| setInteractedCells | `(cell: S2CellType) => void` |   | 设置当前发生改变的单元格 |
| getInteractedCells | `() => S2CellType[]` |  | 获取当前发生改变的单元格 |
| getCurrentStateName | `() => void` |   | 获取当前状态名 |
| isEqualStateName | `(name: InteractionStateName) => void` |  | 是否是相同的状态名 |
| isSelectedState | `() => void` |   | 是否是选中状态 |
| isSelectedCell | `(cell: S2CellType) => void` |    | 是否是选中的单元格 |
| isActiveCell | `(cell: S2CellType) => void` |    | 是否是激活的单元格 |
| getCells | `() => Partial<ViewMeta>[]` |   | 获取当前 interaction 记录的 Cells 元信息列表，包括不在视口内的格子 |
| getActiveCells | `() => S2CellType[]` |  | 获取当前在可视区域的单元格实例 |
| clearStyleIndependent | `() => void` |   | 清除单元格样式 |
| getPanelGroupAllUnSelectedDataCells | `() => DataCell[]` |  | 获取可视区域内选中的数值单元格 |
| getPanelGroupAllDataCells | `() => DataCell[]` |   | 获取可视区域内的所有数值单元格 |
| getAllRowHeaderCells | `() => RowCell[]` |   | 获取行头单元格 |
| getAllColHeaderCells | `() => ColCell[]` |   | 获取列头单元格 |
| getRowColActiveCells | `() => RowCell[] | ColCell[]` |    | 获取行头和列头激活的单元格 |
| getAllCells | `() => S2CellType[]` |   | 获取所有单元格 |
| selectAll | `() => void` |  | 选中所有单元格 |
| updatePanelGroupAllDataCells | `() => void` |   | 更新所有数值单元格 |
| updateCells | `(cells: S2CellType[]) => void` |   | 更新指定单元格 |
| addIntercepts | `(interceptTypes: InterceptType[]) => void` |  | 新增交互拦截 |
| hasIntercepts | `(interceptTypes: InterceptType[]) => boolean` |   | 是否有指定拦截的交互 |
| removeIntercepts | `(interceptTypes: InterceptType[]) => void` |    | 移除指定交互拦截 |

## 交互相关配置

| 参数 | 类型 | 必选  | 默认值 | 功能描述 |
| :-- | :-- | :-: | :-- | --- |
| linkFields | `string[]` |  |  | 标记字段为链接样式，用于外链跳转 |
| selectedCellsSpotlight | `boolean` |   | `true` | 是否开启选中高亮聚光灯效果 |
| hoverHighlight | `boolean` |   | `true` | 鼠标悬停时高亮当前单元格，以及所对应的行头，列头 |
| hiddenColumnFields | `string[]` |  |  | 隐藏列 （明细表有效） |
| enableCopy | `boolean` |   | `false` | 是否允许复制 |
| customInteractions | [CustomInteraction[]](#custominteraction) |   |  | 自定义交互 |

### CustomInteraction

功能描述：自定义交互，继承 baseEvent:  [具体例子](/zh/docs/manual/advanced/interaction/custom)

| 参数 | 类型 | 必选  | 默认值 | 功能描述 |
| --- | --- | :-: |  --- | --- |
| key | `string` | ✓ |   | 交互的唯一标识 |
| interaction | [InteractionConstructor](#InteractionConstructor) | ✓ |  |  | 自定义交互类 |

```ts
export type InteractionConstructor = new (
  spreadsheet: SpreadSheet,
  interaction: RootInteraction,
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
  | BaseCell<T>;
```
