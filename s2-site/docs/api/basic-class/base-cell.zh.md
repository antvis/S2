---
title: BaseCell
order: 4
tag: Updated
---

功能描述：单元格基类。[详情](https://github.com/antvis/S2/blob/next/packages/s2-core/src/cell/base-cell.ts)

```ts
cell.getActualText()
```

| 参数 | 说明 | 类型 |
| --- | --- | --- |
| getMeta | 获取单元格元数据 | () => [ViewMeta](#viewmeta) |
| setMeta | 设置单元格元数据 | (vieMeta: [Partial<ViewMeta>](#viewmeta)) => void |
| getIconStyle | 获取单元格图标样式 | () => [IconTheme](/docs/api/general/S2Theme#icontheme) |
| getStyle | 获取单元格样式 | () => [DefaultCellTheme](/docs/api/general/S2Theme#defaultcelltheme) |
| getTextAndIconPosition | 获取单元格文本和图标的位置 | (iconCount: `number`) => [TextAndIconPosition](#textandiconposition) |
| cellType | 单元格类型 | [CellType](#celltype) |
| initCell | 初始化单元格 | `() => void` |
| update | 更新单元格 | `() => void` |
| getTextStyle | 获取文本样式 | `() => void` |
| getCellTextWordWrapStyle | 获取文本换行配置 | `() => { wordWrap: boolean, maxLines: number, textOverflow: string \| boolean }` |
| getFormattedFieldValue | 获取格式化后的字段值 | `() => { formattedValue: string, value: string }` |
| getMaxTextWidth | 获取文本最大宽度 | `() => number` |
| getTextPosition | 获取文本坐标 | [Point](#point) |
| getContentArea | 获取内容区域 | `() => { x: number, y: number, width: number, height: number }` |
| updateByState | 根据状态更新单元格样式 | `(stateName: InteractionStateName, cell: S2CellType) => void` |
| hideInteractionShape | 隐藏单元格的交互图层 | `() => void` |
| clearUnselectedState | 清空未选中状态 | `() => void` |
| getTextShape | 获取文字图层 | `() => IShape` |
| getTextShapes | 获取所有文字图层 | `() => IShape[]` |
| addTextShape | 添加文字图层 | `(shape: IShape) => void` |
| getConditionIconShape | 获取 icon 图层 | `() => GuiIcon` |
| getConditionIconShapes | 获取所有 icon 图层 | `() => GuiIcon[]` |
| addConditionIconShape | 添加 icon 图层 | `(shape: GuiIcon) => void` |
| isShallowRender | 是否是浅渲染 | `( ) => boolean` |
| getActualText | 获取实际渲染的文本 （含省略号） | `() => string` |
| getOriginalText | 获取原始的文本 （不含省略号） | `() => string` |
| getActualTextWidth | 实际渲染的文本宽度，如果是多行文本，取最大的一行宽度 | `() => number` |
| getActualTextHeight | 实际渲染的文本宽度，如果是多行文本，取每一行文本高度的总和 | `() => number` |
| getMultiLineActualTexts | 获取实际渲染的多行文本 （含省略号） | `() => string[]` |
| getMultiLineActualTextWidth | 实际渲染的多行文本宽度 （每一行文本宽度的总和） | `() => number` |
| getMultiLineActualTextHeight | 实际渲染的多行文本高度 （每一行文本高度的总和） | `() => number` |
| isTextOverflowing | 文本是否溢出 （有省略号） | `() => boolean` |
| isMultiLineText | 是否是多行文本 | `() => boolean` |
| getEmptyPlaceholder | 获取单元格空值占位符 | `() => string` |
| getTextLineBoundingRects | 获取文本包围盒 | `() => string` |
| getFieldValue | 获取单元格展示的数值 | `() => string` |

<embed src="@/docs/common/view-meta.zh.md"></embed>

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

```ts
import type { SimpleBBox } from '@antv/g-canvas';

export type S2CellType<T extends SimpleBBox = ViewMeta> =
  | DataCell
  | HeaderCell
  | ColCell
  | CornerCell
  | RowCell
  | MergedCell
  | SeriesNumberCell
  | BaseCell<T>;
```
