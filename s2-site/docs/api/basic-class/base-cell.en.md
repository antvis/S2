---
title: BaseCell
order: 4

---

Function description: cell base class. [details](https://github.com/antvis/S2/blob/next/packages/s2-core/src/cell/base-cell.ts)

```ts
cell.getActualText()
```

| parameter | illustrate | type |
| --- | --- | --- |
| getMeta | Get cell metadata | () => [`ViewMeta`](#viewmeta) |
| setMeta | Set cell metadata | (viewMeta: [`Partial<ViewMeta>`](#viewmeta)) => void |
| getIconStyle | Get cell icon style | () => [`IconTheme`](/api/general/s2-theme#icontheme) |
| getStyle | Get cell style | (name?: string) => [`DefaultCellTheme`](/api/general/s2-theme#defaultcelltheme) |
| getTextAndIconPosition | Get the position of cell text and icon | (iconCount: `number`) => [`TextAndIconPosition`](#textandiconposition) |
| cellType | Cell type | [`CellType`](#celltype) |
| initCell | Initialize cells | `() => void` |
| update | Update cell | `() => void` |
| getTextStyle | Get text style | () => [TextTheme](/api/general/s2-theme#s2theme) & [CellTextWordWrapStyle](/api/general/s2-options#celltextwordwrapstyle) |
| getCellTextWordWrapStyle | Get text wrap configuration | `() => { wordWrap: boolean, maxLines: number, textOverflow: string \| boolean }` |
| getFormattedFieldValue | Get the formatted field value | `() => { formattedValue: string, value: string }` |
| getMaxTextWidth | Get the maximum width of the text | `() => number` |
| getTextPosition | Get text coordinates | [`Point`](#point) |
| getContentArea | Get content area | `() => { x: number, y: number, width: number, height: number }` |
| updateByState | Update cell styles based on state | `(stateName: InteractionStateName, cell: S2CellType) => void` |
| hideInteractionShape | Hide interaction shape of the cell | `() => void` |
| clearUnselectedState | Clear unselected state | `() => void` |
| getTextShape | Get text shape | `() => IShape` |
| getTextShapes | Get all text shapes | `() => IShape[]` |
| addTextShape | Add a text shape | `(shape: IShape) => void` |
| getConditionIconShape | Get the condition icon shape | `() => GuiIcon` |
| getConditionIconShapes | Get all condition icon shapes | `() => GuiIcon[]` |
| addConditionIconShape | Add condition icon shape | `(shape: GuiIcon) => void` |
| isShallowRender | Whether is shallow render | `() => boolean` |
| getActualText | Get actual rendered text (with ellipsis) | `() => string` |
| getOriginalText | Get original text (without ellipsis) | `() => string \| number` |
| getActualTextWidth | Actual rendered text width, if multi-line text, get the maximum width of a line | `() => number` |
| getActualTextHeight | Actual rendered text height, if multi-line text, get the sum of each line height | `() => number` |
| getMultiLineActualTexts | Get actual rendered multi-line text (with ellipsis) | `() => string[]` |
| getMultiLineActualTextWidth | Actual rendered multi-line text width (sum of each line text width) | `() => number` |
| getMultiLineActualTextHeight | Actual rendered multi-line text height (sum of each line text height) | `() => number` |
| isTextOverflowing | Whether text is overflowing (has ellipsis) | `() => boolean` |
| isMultiLineText | Whether is multi-line text | `() => boolean` |
| getEmptyPlaceholder | Get cell empty placeholder | `() => string` |
| getTextLineBoundingRects | Get text bounding rects | `() => string` |
| getTextLineHeight | Get text line height | `() => number` |
| getFieldValue | Get cell display value | `() => string` |

<embed src="@/common/view-meta.en.md"></embed>

### Point

```ts
interface Point {
  x: number,
  y: number
}
```

### TextAndIconPosition

```ts
interface TextAndIconPosition {
  text: Point
  icon: Point
}
```

### CellType

```ts
export enum CellType {
  DATA_CELL = 'dataCell',
  ROW_CELL = 'rowCell',
  COL_CELL = 'colCell',
  CORNER_CELL = 'cornerCell',
  MERGED_CELL = 'mergedCell',
  SERIES_NUMBER_CELL = 'seriesNumberCell',
}
```

### S2CellType

```ts | pure
export type S2CellType =
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
  | BaseCell;
```
