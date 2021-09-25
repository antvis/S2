---
title: 基础交互
order: 1
redirect_from:
  - /zh/docs/manual/interaction
---

## 交互种类

表格的交互主要通过键盘和鼠标

- 鼠标点击 (click)
- 鼠标悬停 (hover)
- 键盘按下/弹起 (keydown / keyup)
- ...

通过这些事件，排列组合，来实现常用的交互,
以 `刷选` 为例，它由三个事件组成

- `mousedown` => `mousemove` => `mouseup`

## 内置交互

| 名称 | 事件名 | 描述 |
| :-- | :-- | :-- |
| 单选   | `S2Event.GLOBAL_SELECTED` |  单击单元格，弹出 tooltip, 展示对应单元格的信息，再次单击取消选中   |
| 多选   | `S2Event.GLOBAL_SELECTED` |  单选单元格后，按住 `Shift` 键，继续单选   |
| 行/列头快捷多选   | `S2Event.GLOBAL_SELECTED` |  单击行/列头，选中对应行/列头所有单元格 （含不在可视范围内的）, 再次单击取消选中   |
| 行/列头手动调整宽高  | `-` |  鼠标悬浮在行/列头单元格边缘，出现指示条和光标，按住鼠标左键拖动，调整宽高  |
| 刷选   | `S2Event.GLOBAL_BRUSH_SELECTION` `S2Event.GLOBAL_SELECTED` | 批量选中刷选范围内的单元格，刷选过程中，显示刷选范围提示蒙层，刷选完成后，弹出 tooltip, 展示被刷选单元格信息和数量 |
| 悬停   | `S2Event.GLOBAL_HOVER` | 鼠标悬停时，对应单元格高亮展示，如果是数值单元格，则默认 [十字高亮](#十字高亮） （对应行/列), 可设置 `hoverHighlight: false` 关闭 |
| 复制   | `S2Event.GLOBAL_COPIED`| 复制选中的单元格数据 |
| 隐藏列头   | `S2Event.LAYOUT_TABLE_COL_EXPANDED` `S2Event.LAYOUT_TABLE_COL_HIDE`| 隐藏/展开 列头 (明细表有效) |
| 取消选中  | `S2Event.GLOBAL_RESET` | 再次点击，点击空白处，或按下 `Esc` 取消选中的单元格 |

## 交互事件

- `global:xx`: 全局图表事件
- `layout:xx`: 布局改变事件
- `cell:xx`:  单元格级别的事件，整个表格分为不同的单元格类型, 你可以对特定的单元格进行实践监听, 实现自定义需求

[所有事件](https://github.com/antvis/S2/blob/master/packages/s2-core/src/common/constant/events/basic.ts)

<details>
<summary>点击查看交互事件</summary>

```ts
export enum S2Event {
  /** ================ Row Cell ================  */
  ROW_CELL_COLLAPSE_TREE_ROWS = 'row-cell:collapsed-tree-rows',
  ROW_CELL_TEXT_CLICK = 'row-cell:text-click',
  ROW_CELL_CLICK = 'row-cell:click',
  ROW_CELL_DOUBLE_CLICK = 'row-cell:double-click',
  ROW_CELL_HOVER = 'row-cell:hover',
  ROW_CELL_MOUSE_DOWN = 'row-cell:mouse-down',
  ROW_CELL_MOUSE_UP = 'row-cell:mouse-up',
  ROW_CELL_MOUSE_MOVE = 'row-cell:mouse-move',

  /** ================ Col Cell ================  */
  COL_CELL_HOVER = 'col-cell:hover',
  COL_CELL_CLICK = 'col-cell:click',
  COL_CELL_DOUBLE_CLICK = 'col-cell:double-click',
  COL_CELL_MOUSE_DOWN = 'col-cell:mouse-down',
  COL_CELL_MOUSE_UP = 'col-cell:mouse-up',
  COL_CELL_MOUSE_MOVE = 'col-cell:mouse-move',

  /** ================ Data Cell ================  */
  DATA_CELL_HOVER = 'data-cell:hover',
  DATA_CELL_CLICK = 'data-cell:click',
  DATA_CELL_DOUBLE_CLICK = 'data-cell:double-click',
  DATA_CELL_MOUSE_UP = 'data-cell:mouse-up',
  DATA_CELL_MOUSE_DOWN = 'data-cell:mouse-down',
  DATA_CELL_MOUSE_MOVE = 'data-cell:mouse-move',
  DATA_CELL_TREND_ICON_CLICK = 'data-cell:trend-icon-click',
  DATE_CELL_BRUSH_SELECTION = 'date-cell:brush-selection',

  /** ================ Corner Cell ================  */
  CORNER_CELL_CLICK = 'corner-cell:click',
  CORNER_CELL_DOUBLE_CLICK = 'corner-cell:double-click',
  CORNER_CELL_MOUSE_UP = 'corner-cell:mouse-up',
  CORNER_CELL_MOUSE_MOVE = 'corner-cell:mouse-move',
  CORNER_CELL_HOVER = 'corner-cell:hover',
  CORNER_CELL_MOUSE_DOWN = 'corner-cell:mouse-down',

  /** ================ Merged Cell ================  */
  MERGED_CELLS_MOUSE_UP = 'merged-cells:mouse-up',
  MERGED_ELLS_MOUSE_MOVE = 'merged-cells:mouse-move',
  MERGED_CELLS_HOVER = 'merged-cells:hover',
  MERGED_CELLS_CLICK = 'merged-cells:click',
  MERGED_CELLS_DOUBLE_CLICK = 'merged-cells:double-click',
  MERGED_CELLS_MOUSE_DOWN = 'merged-cells:mouse-down',

 /** ================ Global ================  */
  GLOBAL_RESIZE_MOUSE_DOWN = 'global:resize:mouse-down',
  GLOBAL_RESIZE_MOUSE_MOVE = 'global:resize:mouse-move',
  GLOBAL_RESIZE_MOUSE_UP = 'global:resize-mouse-up',
  GLOBAL_KEYBOARD_DOWN = 'global:keyboard-down',
  GLOBAL_KEYBOARD_UP = 'global:keyboard-up',
  GLOBAL_COPIED = 'global:copied',
  GLOBAL_MOUSE_UP = 'global:mouse-up',
  GLOBAL_ACTION_ICON_CLICK = 'global:action-icon-click',
  GLOBAL_ACTION_ICON_HOVER = 'global:action-icon-hover',
  GLOBAL_CONTEXT_MENU = 'global:context-menu',
  GLOBAL_SELECTED = 'global:selected',
  GLOBAL_HOVER = 'global:hover',
  GLOBAL_RESET = 'global:reset',

  // 其他非交互事件
  ...
}

```

</details>

可以根据实际需要，监听所需事件，实现自定义业务

```ts
import { PivotSheet, S2Event } from '@antv/s2';
const s2 = new PivotSheet(container, s2DataConfig, s2options);

s2.on(S2Event.GLOBAL_BRUSH_SELECTION, (cells) => {
  console.log('刷选的单元格:', cells)
  ...
})

s2.on(S2Event.COL_CELL_HOVER, (event) => {
  ...
})

s2.on(S2Event.GLOBAL_KEYBOARD_DOWN, (event) => {
  ...
})
```

## 交互默认样式

> 如何修改默认样式? 请查看 《主题》 了解

### 选中聚光灯

![preview](https://gw.alipayobjects.com/zos/antfincdn/Z0nENy85%26/929f6638-a19f-4a6c-9ad8-a9a6ef2269c3.png)

默认情况下，我们会在选中单元格后，置灰未选中的单元格，强调需要关注的数据，可以自行关闭：

```ts
const s2options = {
  selectedCellsSpotlight: false,
};
```

### 十字高亮

默认情况下，我们会在鼠标悬停时，高亮对应的行列头，更直观的查看数据，可以自行关闭：

![preview](https://gw.alipayobjects.com/zos/antfincdn/1oWitPZ7j/802123cc-6ee6-41c7-9310-049348a016ca.png)

```ts
const s2options = {
  hoverHighlight: false
};
```

### 刷选

刷选过程中, 会提示预选中的单元格, 并且显示半透明的刷选蒙层

![preview](https://gw.alipayobjects.com/zos/antfincdn/HXv13NOg%26/02f11164-9dee-41ee-80d6-694d2e7eaf5a.png)

### 隐藏列头 (明细表有效)

列头隐藏后, 会在紧邻的兄弟单元格显示一个展示按钮, 和一个隐藏提示线, 鼠标单击即可展开

![preview](https://gw.alipayobjects.com/zos/antfincdn/PNFrjWu%261/8b9de9d4-b4be-48dd-abdb-40f98371592e.png)

## 重置交互

支持重置交互的情况:

- 点击非表格空白处
- 按下 `Esc` 键
- 选中单元格后再次点击

对应事件: `GLOBAL_RESET`

```ts
s2.on(S2Event.GLOBAL_RESET,() => {
  console.log('重置')
})
```
