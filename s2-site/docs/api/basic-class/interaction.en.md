---
title: Interaction
order: 2
tag: Updated
---

Functional description: properties and methods related to the interaction class. [details](https://github.com/antvis/S2/blob/next/packages/s2-core/src/interaction/root.ts)

```ts
s2.interaction.reset()
```

| parameter                           | illustrate                                                                                                                | type                                                                              |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| spreadsheet                         | Form example                                                                                                              | [SpreadSheet](/docs/api/basic-class/spreadsheet)                                  |
| interactions                        | currently registered interactions                                                                                         | `Map<string, BaseEvent>`                                                          |
| intercept                           | Currently intercepted interactions to prevent conflicts between different interactions                                    | `Set<Intercept>`                                                                  |
| destroy                             | Unloads all interactive instances and resets to initial state                                                             | `() => void`                                                                      |
| reset                               | reset all interactions                                                                                                    | `() => void`                                                                      |
| setState                            | set state                                                                                                                 | (data: [InteractionStateInfo](#interactionstateinfo) ) => void                    |
| getState                            | get current state                                                                                                         | `() => void`                                                                      |
| resetState                          | reset to initial state                                                                                                    | `() => void`                                                                      |
| clearState                          | Clear state and redraw                                                                                                    | `() => void`                                                                      |
| changeState                         | update status                                                                                                             | (data: [InteractionStateInfo](#interactionstateinfo) ) => void                    |
| setInteractedCells                  | Set the currently changed cell                                                                                            | (cell: [S2CellType](#s2celltype) ) => void                                        |
| getInteractedCells                  | Get the currently changed cell                                                                                            | () => [S2CellType](#s2celltype) \[]                                               |
| getCurrentStateName                 | Get the current state name                                                                                                | `() => void`                                                                      |
| isEqualStateName                    | Is it the same state name                                                                                                 | `(name: InteractionStateName) => void`                                            |
| isSelectedState                     | Is it selected                                                                                                            | `() => void`                                                                      |
| isHoverState                        | Is it a hover state                                                                                                       | `() => void`                                                                      |
| isHoverFocusState                   | Is it the hovering focus state (hovering at the cell `focusTime` : after 800ms by default)                                | `() => void`                                                                      |
| isSelectedCell                      | Is it the selected cell                                                                                                   | (cell: [S2CellType](#s2celltype) ) => void                                        |
| isActiveCell                        | is the active cell                                                                                                        | (cell: [S2CellType](#s2celltype) ) => void                                        |
| getCells                            | Get the Cells metadata list of the current interaction record, including the cells not in the viewport                    | `() => Partial<ViewMeta>[]`                                                       |
| getActiveCells                      | Get the cell instance currently in the visible area                                                                       | `() => S2CellType[]`                                                              |
| clearStyleIndependent               | clear cell styles                                                                                                         | `() => void`                                                                      |
| getPanelGroupAllUnSelectedDataCells | Get the selected value cell in the visible area                                                                           | `() => DataCell[]`                                                                |
| getPanelGroupAllDataCells           | Get all numerical cells in the visible area                                                                               | `() => DataCell[]`                                                                |
| getAllRowHeaderCells                | Get row header cell                                                                                                       | `() => RowCell[]`                                                                 |
| getAllColHeaderCells                | Get column header cell                                                                                                    | `() => ColCell[]`                                                                 |
| getRowColActiveCells                | Get the active cell of row header and column header                                                                       | `() => RowCell[] \| ColCell[]`                                                    |
| getAllCells                         | Get all cells in the visible area                                                                                         | () => [S2CellType](#s2celltype) \[]                                               |
| selectAll                           | select all cells                                                                                                          | `() => void`                                                                      |
| selectHeaderCell                    | Select the specified row and column header cell                                                                           | (selectHeaderCellInfo: [SelectHeaderCellInfo](#selectheadercellinfo) ) => boolean |
| getCellChildrenNodes                | Get all child nodes of the current cell                                                                                   | (cell: [S2CellType](#s2celltype) ) => [Node](\(/docs/api/basic-class/node\)) \[]  |
| hideColumns                         | Hidden column (when forceRender is `false` , if the hidden column is empty, the table update will no longer be triggered) | `(hiddenColumnFields: string[], forceRender?: boolean = true) => void`            |
| mergeCells                          | Merge Cells                                                                                                               | (cellsInfo?: [MergedCellInfo](#mergedcellinfo) \[], hideData?: boolean) => void   |
| unmergeCells                        | unmerge cells                                                                                                             | `(removedCells: MergedCell[]) => void`                                            |
| updatePanelGroupAllDataCells        | update all value cells                                                                                                    | `() => void`                                                                      |
| updateCells                         | Update the specified cell                                                                                                 | (cells: [S2CellType](#s2celltype) \[]) => void                                    |
| addIntercepts                       | Added interactive interception                                                                                            | (interceptTypes: [InterceptType](#intercepttype) \[]) => void                     |
| hasIntercepts                       | Whether there is an interaction specified for interception                                                                | (interceptTypes: [InterceptType](#intercepttype) \[]) => boolean                  |
| removeIntercepts                    | Remove specified interaction interception                                                                                 | (interceptTypes: [InterceptType](#intercepttype) \[]) => void                     |
| highlightNodes                      | Highlight the cell corresponding to the node                                                                              | (nodes: [Node](/docs/api/basic-class/node) \[]) => void                           |

<embed src="@/docs/common/interaction.en.md"></embed>

### Interaction Constructor

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
export enum InterceptType {
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

<embed src="@/docs/common/view-meta.en.md"></embed>
