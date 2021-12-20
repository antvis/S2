---
title: 基础交互
order: 0
---

## 交互种类

表格的交互主要通过键盘和鼠标

- 鼠标点击 (click)
- 鼠标悬停 (hover)
- 键盘按下/弹起 (keydown / keyup)
- ...

通过这些事件，排列组合，来实现常用的交互，
以 `刷选` 为例，它由三个事件组成

- `mousedown` => `mousemove` => `mouseup`

## 内置交互

| 名称                | 事件名                                                                | 描述                                                                                                                              |
| :------------------ | :-------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------- |
| 单选                | `S2Event.GLOBAL_SELECTED`                                             | 单击单元格，弹出 tooltip, 展示对应单元格的信息，再次单击取消选中                                                                  |
| 多选                | `S2Event.GLOBAL_SELECTED`                                             | 单选单元格后，按住 `Command / Ctrl` 键，继续单选                                                                                           |
| 行/列头快捷多选     | `S2Event.GLOBAL_SELECTED`                                             | 单击行/列头，选中对应行/列头所有单元格 （含不在可视范围内的）, 再次单击取消选中                                                   |
| 行/列头手动调整宽高 | `S2Event.LAYOUT_RESIZE`                                               | 鼠标悬浮在行/列头单元格边缘，出现指示条和光标，按住鼠标左键拖动，调整宽高                                                         |
| 刷选                | `S2Event.GLOBAL_BRUSH_SELECTION` `S2Event.GLOBAL_SELECTED`            | 批量选中刷选范围内的单元格，刷选过程中，显示刷选范围提示蒙层，刷选完成后，弹出 tooltip, 展示被刷选单元格信息和数量                |
| 区间快捷多选            | `S2Event.GLOBAL_SELECTED`                                             | 单选单元格 (start), 然后按住 `Shift` 再次选中一个单元格 (end), 选中两个单元格区间所有单元格                                                                     |
| 悬停                | `S2Event.GLOBAL_HOVER`                                                | 鼠标悬停时，对应单元格高亮展示，如果是数值单元格，则默认 [十字高亮](#十字高亮） （对应行/列), 可设置 `hoverHighlight: false` 关闭 |
| 复制                | `S2Event.GLOBAL_COPIED`                                               | 复制选中的单元格数据                                                                                                              |
| 隐藏列头            | `S2Event.LAYOUT_TABLE_COL_EXPANDED` `S2Event.LAYOUT_TABLE_COL_HIDDEN` | 隐藏/展开 列头 （明细表有效）                                                                                                     |
| 链接跳转            | `S2Event.GLOBAL_LINK_FIELD_JUMP`                                      | 行头/列头 链接跳转                                                                                                                |
| 重置                | `S2Event.GLOBAL_RESET`                                                | 再次点击，点击空白处，或按下 `Esc` 取消选中的单元格                                                                               |

## 交互事件

- `global:xx`: 全局图表事件
- `layout:xx`: 布局改变事件
- `cell:xx`:  单元格级别的事件，整个表格分为不同的单元格类型，你可以对特定的单元格进行实践监听，实现自定义需求

[详情](https://github.com/antvis/S2/blob/master/packages/s2-core/src/common/constant/events/basic.ts)

<details>
<summary>点击查看所有交互事件</summary>

### 行头

| 名称         | 事件名                                | 描述                       |
| :----------- | :------------------------------------ | :------------------------- |
| 展开树状结构 | `S2Event.ROW_CELL_COLLAPSE_TREE_ROWS` | 树状结构下，行头单元格展开 |
| 点击         | `S2Event.ROW_CELL_CLICK`              | 行头单元格点击             |
| 双击         | `S2Event.ROW_CELL_DOUBLE_CLICK`       | 行头单元格双击             |
| 悬停         | `S2Event.ROW_CELL_HOVER`              | 行头单元格悬停             |
| 鼠标按下     | `S2Event.ROW_CELL_MOUSE_DOWN`         | 行头单元格鼠标按下         |
| 鼠标移动     | `S2Event.ROW_CELL_MOUSE_MOVE`         | 行头单元格鼠标移动         |
| 鼠标松开     | `S2Event.ROW_CELL_MOUSE_UP`           | 行头单元格鼠标松开         |

### 列头

| 名称     | 事件名                          | 描述               |
| :------- | :------------------------------ | :----------------- |
| 点击     | `S2Event.COL_CELL_CLICK`        | 列头单元格点击     |
| 双击     | `S2Event.COL_CELL_DOUBLE_CLICK` | 列头单元格双击     |
| 悬停     | `S2Event.COL_CELL_HOVER`        | 列头单元格悬停     |
| 鼠标按下 | `S2Event.COL_CELL_MOUSE_DOWN`   | 列头单元格鼠标按下 |
| 鼠标移动 | `S2Event.COL_CELL_MOUSE_MOVE`   | 列头单元格鼠标移动 |
| 鼠标松开 | `S2Event.COL_CELL_MOUSE_UP`     | 列头单元格鼠标松开 |

### 数值单元格

| 名称           | 事件名                               | 描述                                    |
| :------------- | :----------------------------------- | :-------------------------------------- |
| 点击           | `S2Event.DATA_CELL_CLICK`            | 数值单元格点击                          |
| 双击           | `S2Event.DATA_CELL_DOUBLE_CLICK`     | 数值单元格双击                          |
| 悬停           | `S2Event.DATA_CELL_HOVER`            | 数值单元格悬停                          |
| 鼠标按下       | `S2Event.DATA_CELL_MOUSE_DOWN`       | 数值单元格鼠标按下                      |
| 鼠标移动       | `S2Event.DATA_CELL_MOUSE_MOVE`       | 数值单元格鼠标移动                      |
| 鼠标松开       | `S2Event.DATA_CELL_MOUSE_UP`         | 数值单元格鼠标松开                      |
| 趋势 icon 点击 | `S2Event.DATA_CELL_TREND_ICON_CLICK` | 数值单元格 tooltip 里面的趋势 icon 点击 |
| 刷选           | `S2Event.DATE_CELL_BRUSH_SELECTION`  | 数值单元格刷选                          |

### 角头

| 名称     | 事件名                             | 描述               |
| :------- | :--------------------------------- | :----------------- |
| 点击     | `S2Event.CORNER_CELL_CLICK`        | 角头单元格点击     |
| 双击     | `S2Event.CORNER_CELL_DOUBLE_CLICK` | 角头单元格双击     |
| 悬停     | `S2Event.CORNER_CELL_HOVER`        | 角头单元格悬停     |
| 鼠标按下 | `S2Event.CORNER_CELL_MOUSE_DOWN`   | 角头单元格鼠标按下 |
| 鼠标移动 | `S2Event.CORNER_CELL_MOUSE_MOVE`   | 角头单元格鼠标移动 |
| 鼠标松开 | `S2Event.CORNER_CELL_MOUSE_UP`     | 角头单元格鼠标松开 |

### 布局

| 名称                     | 事件名                              | 描述                                        |
| :----------------------- | :---------------------------------- | :------------------------------------------ |
| 单元格调整               | `S2Event.LAYOUT_RESIZE`             | 单元格宽高发生改变                          |
| 调整单元格大小时鼠标按下 | `S2Event.LAYOUT_RESIZE_MOUSE_DOWN`  | 调整单元格大小鼠标按下，目前仅 行/列 头有效 |
| 调整单元格大小时鼠标移动 | `S2Event.LAYOUT_RESIZE_MOUSE_MOVE`  | 调整单元格大小鼠标移动，目前仅 行/列 头有效 |
| 调整单元格大小时鼠标松开 | `S2Event.LAYOUT_RESIZE_MOUSE_UP`    | 调整单元格大小鼠标松开，目前仅 行/列 头有效 |
| 行头宽度改变             | `S2Event.LAYOUT_RESIZE_ROW_WIDTH`   |                                             |
| 行头高度改变             | `S2Event.LAYOUT_RESIZE_ROW_HEIGHT`  |                                             |
| 列头宽度改变             | `S2Event.LAYOUT_RESIZE_COL_WIDTH`   |                                             |
| 行头宽度改变             | `S2Event.LAYOUT_RESIZE_COL_HEIGHT`  |                                             |
| 树状结构宽度改变         | `S2Event.LAYOUT_RESIZE_TREE_WIDTH`  | 树状模式下，单元格宽度发生改变时触发        |
| 列头展开                 | `S2Event.LAYOUT_TABLE_COL_EXPANDED` | 列头展开时触发，明细表有效                  |
| 列头隐藏                 | `S2Event.LAYOUT_TABLE_COL_HIDDEN`   | 列头隐藏时触发，明细表有效                  |

### 全局

| 名称      | 事件名                             | 描述                                         |
| :-------- | :--------------------------------- | :------------------------------------------- |
| 键盘按下  | `S2Event.GLOBAL_KEYBOARD_DOWN`     | 键盘按下                                     |
| 键盘松开  | `S2Event.GLOBAL_KEYBOARD_UP`       | 键盘松开                                     |
| 复制      | `S2Event.GLOBAL_COPIED`            | 对选中的单元格复制                           |
| 鼠标松开  | `S2Event.GLOBAL_MOUSE_UP`          | 鼠标松开                                     |
| 右键      | `S2Event.GLOBAL_CONTEXT_MENU`      | 图表区域按下右键                             |
| 选中      | `S2Event.GLOBAL_SELECTED`          | 选中单元格时，如：刷选，多选，单选           |
| 悬停      | `S2Event.GLOBAL_HOVER`             | 鼠标悬停在单元格                             |
| 重置      | `S2Event.GLOBAL_RESET`             | 点击空白处，按下 Esc 键 重置交互样式时     |
| 链接跳转  | `S2Event.GLOBAL_LINK_FIELD_JUMP`   | 点击行列头被编辑为链接字段的文本时           |
| icon 点击 | `S2Event.GLOBAL_ACTION_ICON_CLICK` | 单元格右侧的操作 icon 点击时，比如：排序图标 |
| icon 悬停 | `S2Event.GLOBAL_ACTION_ICON_HOVER` | 单元格右侧的操作 icon 悬停时，比如：排序图标 |

</details>

可以根据实际需要，监听所需事件，实现自定义业务

```ts
import { PivotSheet, S2Event } from '@antv/s2';
const s2 = new PivotSheet(container, s2DataConfig, s2options);

s2.on(S2Event.GLOBAL_BRUSH_SELECTION, (cells) => {
  console.log('刷选的单元格：', cells)
  ...
})

s2.on(S2Event.COL_CELL_HOVER, (event) => {
  ...
})

s2.on(S2Event.GLOBAL_KEYBOARD_DOWN, (event) => {
  ...
})
```

## 交互相关配置

```ts
const s2Options = {
  interaction: {
    ...
  }
}
```

[查看具体 API 配置详情](/zh/docs/api/basic-class/interaction#interaction)

## 交互默认样式

> 如何修改默认样式？请查看 《主题》 了解

### 选中聚光灯

<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*Omq-Ra0PO9UAAAAAAAAAAAAAARQnAQ" width="700" alt="preview" />

在选中单元格后，如果需要置灰未选中的单元格，强调需要关注的数据，默认关闭，可配置 `selectedCellsSpotlight` 开启：

```ts
const s2options = {
  interaction: {
    selectedCellsSpotlight: true, // 默认 false
  }
};
```

### 十字高亮

在鼠标悬停时，高亮对应的行列头，更直观的查看数据，默认关闭，可配置 `hoverHighlight` 开启：

<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*f1f1TqoWNdMAAAAAAAAAAAAAARQnAQ" alt="preview" width="700" />

```ts
const s2options = {
  interaction: {
    hoverHighlight: true // 默认 false
  }
};
```

### 刷选

刷选过程中，会提示预选中的单元格，并且显示半透明的刷选蒙层，默认开启，可配置 `brushSelection` 关闭：

<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*N3-cSrfpGc4AAAAAAAAAAAAAARQnAQ" alt="preview" width="700" />

```ts
const s2options = {
  interaction: {
    brushSelection: false // 默认 true
  }
};
```

### 快捷键多选

(Command/Ctrl) + click: 单个多选叠加，默认开启，可配置 `multiSelection` 关闭：

<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*Ubk0RrTI0ZsAAAAAAAAAAAAAARQnAQ" width="600" alt="preview" />

Shift + click: 区间选择（类似刷选）, 默认开启，可配置 `rangeMultiSelection` 关闭：

<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*wq-XRYpVAGMAAAAAAAAAAAAAARQnAQ" width="600" alt="preview" />

```ts
const s2options = {
  interaction: {
    multiSelection: false // 默认 true
    rangeMultiSelection: false // 默认 true
  }
};
```

### 隐藏列头 （明细表有效）

列头隐藏后，会在紧邻的兄弟单元格显示一个展示按钮，和一个隐藏提示线，鼠标单击即可展开，可配置 `hiddenColumns` 实现 `默认隐藏` 和 `交互式隐藏`. [查看具体例子](zh/examples/interaction/advanced#hide-columns)

```ts
const s2options = {
  interaction: {
    // 默认隐藏
    hiddenColumns: ['fieldA']
  },
  // 关闭手动隐藏
  tooltip: {
    operation: {
      hiddenColumns: false
    }
  }
};
```

<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*7NasR7RUHG4AAAAAAAAAAAAAARQnAQ" alt="preview" width="500" />

## 重置交互

支持重置交互的情况：

- 点击非表格空白处
- 按下 `Esc` 键
- 选中单元格后再次点击

对应事件：`GLOBAL_RESET`

```ts
s2.on(S2Event.GLOBAL_RESET, () => {
  console.log('重置')
})
```

可配置 `autoResetSheetStyle` 关闭重置交互。[查看具体例子](/zh/examples/interaction/advanced#auto-reset-sheet-style)

```ts
const s2options = {
  interaction: {
    autoResetSheetStyle: false
  }
};
```

## 自定义滚动速度

可配置 `scrollSpeedRatio` 控制滚动速率，分为 `水平` 和 `垂直` 两个方向，默认为 1。 [查看具体例子](/zh/examples/interaction/advanced#scroll-speed-ratio)

```ts
const s2options = {
  interaction: {
    scrollSpeedRatio: {
      vertical: 0.3, // 垂直
      horizontal: 1, // 水平
    },
  },
};
```

## 自定义 resize 开启范围

可配置 `resize` 控制需要开启的单元格宽高调整热区范围，分为 角头，行头，列头三个部分，默认为全部开启。可以通过设置`boolean` 类型值快捷开启或关闭所有 resize 热区，也可以通过对象类型配置各个区域的热区开启或关闭。[查看具体例子](/zh/examples/interaction/advanced#resize)

```ts
const s2options = {
  interaction: {
    resize: true
  },
};
// 等价于
// const s2options = {
//    interaction: {
//     resize: {
//       rowCellVertical:true,
//       cornerCellHorizontal:true,
//       colCellHorizontal:true,
//       colCellVertical:true
//     }
//   },
// };
```

## 调用交互方法

`S2` 内置了一些交互相关的方法，统一挂载在 `interaction` 命名空间下，你可以在拿到 `SpreadSheet` 实例后调用它们来实现你的效果，比如 `选中所有单元格`, `获取列头单元格` 等常用方法，具体请查看 [Interaction 实例类](/zh/docs/api/basic-class/interaction)

```ts
const s2 = new PivotSheet()
s2.interaction.selectAll()
```
