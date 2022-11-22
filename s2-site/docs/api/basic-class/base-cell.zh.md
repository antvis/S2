---
title: BaseCell
order: 4
---

功能描述：单元格基类。[详情](https://github.com/antvis/S2/blob/master/packages/s2-core/src/cell/base-cell.ts)

```ts
cell.getActualText()
```

| 参数 | 说明 | 类型 |
| --- | --- | --- |
| getMeta | 获取单元格元数据 | () => [ViewMeta](#viewmeta) |
| setMeta | 设置单元格元数据 | (vieMeta: [ViewMeta](#viewmeta)) => void |
| getIconStyle | 获取单元格图标样式 | () => [IconTheme](/docs/api/general/S2Theme#icontheme) |
| getStyle | 获取单元格样式 | () => [DefaultCellTheme](/docs/api/general/S2Theme#defaultcelltheme) |
| getTextAndIconPosition | 获取单元格文本和图标的位置 | (iconCount: `number`) => [TextAndIconPosition](#textandiconposition) |
| getActualText | 获取绘制的文本 | `() => string` |
| cellType | 单元格类型 | [CellTypes](#celltypes) |
| initCell | 初始化单元格 | `() => void` |
| update | 更新单元格 | `() => void` |
| getTextStyle | 获取文本样式 | `() => void` |
| getFormattedFieldValue | 获取格式化后的字段值 | `() => { formattedValue: string, value: string }` |
| getMaxTextWidth | 获取文本最大宽度 | `() => number` |
| getTextPosition | 获取文本坐标 | [Point](#point) |
| getContentArea | 获取内容区域 | `() => { x: number, y: number, width: number, height: number }` |
| updateByState | 根据状态更新单元格样式 | `(stateName: InteractionStateName, cell: S2CellType) => void` |
| hideInteractionShape | 隐藏单元格的交互图层 | `() => void` |
| clearUnselectedState | 清空未选中状态 | `() => void` |

### ViewMeta

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

### CellTypes

```ts
export enum CellTypes {
  DATA_CELL = 'dataCell',
  HEADER_CELL = 'headerCell',
  ROW_CELL = 'rowCell',
  COL_CELL = 'colCell',
  CORNER_CELL = 'cornerCell',
  MERGED_CELL = 'mergedCell',
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
  | BaseCell<T>;
```
