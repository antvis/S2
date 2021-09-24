---
title: 交互
order: 2
redirect_from:
  - /zh/docs/manual
---

## 1. 基础交互

### 交互种类

表格的交互主要通过键盘和鼠标

- 鼠标点击 (click)
- 鼠标悬停 (hover)
- 键盘按下/弹起 (keydown / keyup)

通过这些事件，排列组合，来实现常用的交互
以 `刷选` 为例，它由三个事件组成

- mousedown => mousemove => mouseup

### 内置交互

| 名称 | 事件名 | 描述 |
| :-- | :-- | :-- |
| 单选   | `S2Event.GLOBAL_SELECTED` |  单击单元格，弹出 tooltip, 展示对应单元格的信息，再次单击取消选中   |
| 多选   | `S2Event.GLOBAL_SELECTED` |  单选单元格后，按住 `Shift` 键，继续单选   |
| 行/列头快捷多选   | `S2Event.GLOBAL_SELECTED` |  单击行/列头，选中对应行/列头所有单元格 （含不在可视范围内的）, 再次单击取消选中   |
| 行/列头手动调整宽高  | `-` |  鼠标悬浮在行/列头单元格边缘，出现指示条和光标，按住鼠标左键拖动，调整宽高  |
| 刷选   | `S2Event.GLOBAL_BRUSH_SELECTION` `S2Event.GLOBAL_SELECTED` | 批量选中刷选范围内的单元格，刷选过程中，显示刷选范围提示蒙层，刷选完成后，弹出 tooltip, 展示被刷选单元格信息和数量 |
| 悬停   | `S2Event.GLOBAL_HOVER` | 鼠标悬停时，对应单元格高亮展示，如果是数值单元格，则默认 [十字高亮](#十字高亮） （对应行/列), 可设置 `hoverHighlight: false` 关闭 |
| 复制   | `S2Event.GLOBAL_COPIED`| 复制选中的单元格数据 |
| 取消选中  | `S2Event.GLOBAL_RESET` | 再次点击，点击空白处，或按下 `Esc` 取消选中的单元格 |

### 交互事件

- `global`: 全局或图表事件
- `cell`: 单元格级别的事件，细分到每种单元格类型

<details>
<summary>详情</summary>

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

  /** ================ Global Resize ================  */
  GLOBAL_RESIZE_MOUSE_DOWN = 'global:resize:mouse-down',
  GLOBAL_RESIZE_MOUSE_MOVE = 'global:resize:mouse-move',
  GLOBAL_RESIZE_MOUSE_UP = 'global:resize-mouse-up',

  /** ================ Global Keyboard ================  */
  GLOBAL_KEYBOARD_DOWN = 'global:keyboard-down',
  GLOBAL_KEYBOARD_UP = 'global:keyboard-up',

  /** ================ Global Keyboard ================  */
  GLOBAL_COPIED = 'global:copied',

  /** ================ Global Mouse ================  */
  GLOBAL_MOUSE_UP = 'global:mouse-up',
}

```
</details>

可以根据实际需要，监听所需事件，实现自定义业务

```ts
import { PivotSheet, S2Event } from '@antv/s2';
const s2 = new PivotSheet(container, s2DataConfig, s2options);

s2.on(S2Event.COL_CELL_HOVER, () => {
  ...
})

s2.on(S2Event.GLOBAL_KEYBOARD_DOWN, () => {
  ...
})
```

### 选中聚光灯

![selectedCellsSpotlight](https://gw.alipayobjects.com/zos/antfincdn/Z0nENy85%26/929f6638-a19f-4a6c-9ad8-a9a6ef2269c3.png)

默认情况下，我们会在选中单元格后，置灰未选中的单元格，强调需要关注的数据，可以自行关闭：

```ts
const s2options = {
  selectedCellsSpotlight: false,
};
```

### 十字高亮

默认情况下，我们会在鼠标悬停时，高亮对应的行列头，更直观的查看数据，可以自行关闭：

![hoverHighlight](https://gw.alipayobjects.com/zos/antfincdn/1oWitPZ7j/802123cc-6ee6-41c7-9310-049348a016ca.png)

```ts
const s2options = {
  hoverHighlight: false,
};
```

## 2. 自定义交互

内置交互，如果未能覆盖到你的使用场景，你可以使用 `S2Event` 里面提供的交互事件，任意排列组合，自定义交互

### 2.1 自定义交互类

```ts
import { PivotSheet, BaseEvent, S2Event } from '@antv/s2';

// 继承 BaseEvent, 可以拿到 this.spreadsheet 和 this.interaction
class HiddenInteraction extends BaseEvent {
  bindEvents() {
    this.spreadsheet.on(S2Event.COL_CELL_DOUBLE_CLICK, (event) => {
      const cell = this.spreadsheet.getCell(event.target);
      const meta = cell.getMeta();
      console.log('自定义交互-双击列头隐藏', meta);
      this.spreadsheet.hideColumns([meta.field]);
    });
    // 禁止弹出右键菜单
    this.spreadsheet.on(S2Event.GLOBAL_CONTEXT_MENU, (event) => {
      event.preventDefault();
      console.log('右键', event);
    });
  }
}

class ContextMenuInteraction extends BaseEvent {
  bindEvents() {
    // 禁止弹出右键菜单
    this.spreadsheet.on(S2Event.GLOBAL_CONTEXT_MENU, (event) => {
      event.preventDefault();
      console.log('右键', event);
    });
  }
}

```

### 2.2 注册自定义交互

```ts
  const s2options = {
    width: 600,
    height: 300,
    tooltip: {
      showTooltip: true
    },
    customInteractions: [
      {
        // 交互的唯一标识，需要保证和已有交互不冲突
        key: 'MyInteraction',
        interaction: MyInteraction,
      },
      {
        key: 'ContextMenuInteraction',
        interaction: ContextMenuInteraction,
      },
    ],
  };
  const s2 = new PivotSheet(container, s2DataConfig, s2options);

  s2.render();
```

### 2.3 效果

![](https://gw.alipayobjects.com/zos/antfincdn/niXiAVu74/5f9adba7-923c-431f-aa37-95f2d892da8c.png)
