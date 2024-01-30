---
title: S2Event
order: 4
redirect_from:
  - /zh/docs/api
---

表格事件列表，可以根据实际需要，监听所需事件，实现自定义业务。[查看全部事件定义](https://github.com/antvis/S2/blob/next/packages/s2-core/src/common/constant/events/basic.ts), [文档](/manual/advanced/interaction/basic) 和 [示例](/examples/interaction/basic/#event)

:::info{title="提示"}
如果使用的是 `s2-react` 或 `s2-vue` 表组件，则已对事件进行封装，无需额外监听，使用其回调函数即可。 [详情](/docs/api/components/sheet-component)

```tsx | pure
<SheetComponent onRowCellClick={...} />
```

:::

```ts
import { S2Event } from '@antv/s2'

s2.on(S2Event.ROW_CELL_CLICK, (event) => {
  console.log('rowCellClick', event)
});
```

### 行头单元格 (RowCell)

| 名称         | 事件名                                | 描述                       |
| ----------- | ------------------------------------ | ------------------------- |
| 展开收起  | `S2Event.ROW_CELL_COLLAPSED` | 树状结构下，行头单元格展开/收起 |
| 全部展开/收起  | `S2Event.ROW_CELL_ALL_COLLAPSED` | 树状结构下，行头单元格全部展开/收起 |
| 点击         | `S2Event.ROW_CELL_CLICK`              | 行头单元格点击             |
| 双击         | `S2Event.ROW_CELL_DOUBLE_CLICK`       | 行头单元格双击             |
| 右键         | `S2Event.ROW_CELL_CONTEXT_MENU`       | 行头单元格右键             |
| 悬停         | `S2Event.ROW_CELL_HOVER`              | 行头单元格悬停             |
| 鼠标按下     | `S2Event.ROW_CELL_MOUSE_DOWN`         | 行头单元格鼠标按下         |
| 鼠标移动     | `S2Event.ROW_CELL_MOUSE_MOVE`         | 行头单元格鼠标移动         |
| 鼠标松开     | `S2Event.ROW_CELL_MOUSE_UP`           | 行头单元格鼠标松开         |
| 滚动         | `S2Event.ROW_CELL_SCROLL`            | 行头单元格滚动         |
| 行头刷选     | `S2Event.ROW_CELL_BRUSH_SELECTION` | 批量选中刷选范围内的行头单元格，刷选过程中，显示刷选范围提示蒙层，刷选完成后，弹出 tooltip, 展示被刷选单元格信息（仅支持透视表）    |
| 单元格渲染                 | `S2Event.ROW_CELL_RENDER`       | 行头单元格布局渲染完成事件                  |

### 列头单元格 (ColCell)

| 名称     | 事件名                          | 描述               |
| ------- | ------------------------------ | ----------------- |
| 点击     | `S2Event.COL_CELL_CLICK`        | 列头单元格点击     |
| 双击     | `S2Event.COL_CELL_DOUBLE_CLICK` | 列头单元格双击     |
| 右键     | `S2Event.COL_CELL_CONTEXT_MENU` | 列头单元格右键     |
| 悬停     | `S2Event.COL_CELL_HOVER`        | 列头单元格悬停     |
| 鼠标按下 | `S2Event.COL_CELL_MOUSE_DOWN`   | 列头单元格鼠标按下 |
| 鼠标移动 | `S2Event.COL_CELL_MOUSE_MOVE`   | 列头单元格鼠标移动 |
| 鼠标松开 | `S2Event.COL_CELL_MOUSE_UP`     | 列头单元格鼠标松开 |
| 列头刷选 | `S2Event.COL_CELL_BRUSH_SELECTION` | 批量选中刷选范围内的列头单元格，刷选过程中，显示刷选范围提示蒙层，刷选完成后，弹出 tooltip, 展示被刷选单元格信息（仅支持透视表） |
| 单元格渲染                 | `S2Event.COL_CELL_RENDER`       | 列头单元格布局渲染完成事件                  |

### 数值单元格 (DataCell)

| 名称           | 事件名                               | 描述                                    |
| ------------- | ----------------------------------- | -------------------------------------- |
| 点击           | `S2Event.DATA_CELL_CLICK`            | 数值单元格点击                          |
| 双击           | `S2Event.DATA_CELL_DOUBLE_CLICK`     | 数值单元格双击                          |
| 右键           | `S2Event.DATA_CELL_CONTEXT_MENU`      | 数值单元格右键                          |
| 悬停           | `S2Event.DATA_CELL_HOVER`            | 数值单元格悬停                          |
| 鼠标按下       | `S2Event.DATA_CELL_MOUSE_DOWN`       | 数值单元格鼠标按下                      |
| 鼠标移动       | `S2Event.DATA_CELL_MOUSE_MOVE`       | 数值单元格鼠标移动                      |
| 鼠标松开       | `S2Event.DATA_CELL_MOUSE_UP`         | 数值单元格鼠标松开                      |
| 刷选           | `S2Event.DATA_CELL_BRUSH_SELECTION`  | 数值单元格刷选                          |
| 键盘方向键移动           | `S2Event.DATA_CELL_SELECT_MOVE`  | 数值单元格键盘方向键移动                          |
| 单元格渲染                 | `S2Event.DATA_CELL_RENDER`       | 数值单元格布局渲染完成事件                  |

### 角头单元格 (CornerCell)

| 名称     | 事件名                             | 描述               |
| ------- | --------------------------------- | ----------------- |
| 点击     | `S2Event.CORNER_CELL_CLICK`        | 角头单元格点击     |
| 双击     | `S2Event.CORNER_CELL_DOUBLE_CLICK` | 角头单元格双击     |
| 右键     | `S2Event.CORNER_CELL_CONTEXT_MENU` | 角头单元格右键     |
| 悬停     | `S2Event.CORNER_CELL_HOVER`        | 角头单元格悬停     |
| 鼠标按下 | `S2Event.CORNER_CELL_MOUSE_DOWN`   | 角头单元格鼠标按下 |
| 鼠标移动 | `S2Event.CORNER_CELL_MOUSE_MOVE`   | 角头单元格鼠标移动 |
| 鼠标松开 | `S2Event.CORNER_CELL_MOUSE_UP`     | 角头单元格鼠标松开 |
| 单元格渲染                 | `S2Event.CORNER_CELL_RENDER`       | 角头单元格布局渲染完成事件                  |

### 合并单元格 (MergedCells)

| 名称     | 事件名                             | 描述               |
| ------- | --------------------------------- | ----------------- |
| 点击     | `S2Event.MERGED_CELLS_CLICK`        | 合并单元格点击     |
| 双击     | `S2Event.MERGED_CELLS_DOUBLE_CLICK` | 合并单元格双击     |
| 右键     | `S2Event.MERGED_CELLS_CONTEXT_MENU` | 合并单元格右键     |
| 悬停     | `S2Event.MERGED_CELLS_HOVER`        | 合并单元格悬停     |
| 鼠标按下 | `S2Event.MERGED_CELLS_MOUSE_DOWN`   | 合并单元格鼠标按下 |
| 鼠标移动 | `S2Event.MERGED_CELLS_MOUSE_MOVE`   | 合并单元格鼠标移动 |
| 鼠标松开 | `S2Event.MERGED_CELLS_MOUSE_UP`     | 合并单元格鼠标松开 |
| 单元格渲染                 | `S2Event.MERGED_CELLS_RENDER`       | 合并单元格布局渲染完成事件                  |

### 序号单元格 (SeriesNumberCell)

| 名称     | 事件名                             | 描述               |
| ------- | --------------------------------- | ----------------- |
| 单元格渲染                 | `S2Event.SERIES_NUMBER_CELL_RENDER`       | 序号单元格布局渲染完成事件                  |

### 宽高拖拽调整

| 名称                     | 事件名                             | 描述                                        |
| ----------------------- | --------------------------------- | ------------------------------------------ |
| 单元格调整               | `S2Event.LAYOUT_RESIZE`            | 单元格宽高发生改变                          |
| 序号列宽度改变            | `S2Event.LAYOUT_RESIZE_SERIES_WIDTH`            | 序号列宽度改变                          |
| 调整单元格大小时鼠标按下 | `S2Event.LAYOUT_RESIZE_MOUSE_DOWN` | 调整单元格大小鼠标按下，目前仅 行/列 头有效 |
| 调整单元格大小时鼠标移动 | `S2Event.LAYOUT_RESIZE_MOUSE_MOVE` | 调整单元格大小鼠标移动，目前仅 行/列 头有效 |
| 调整单元格大小时鼠标松开 | `S2Event.LAYOUT_RESIZE_MOUSE_UP`   | 调整单元格大小鼠标松开，目前仅 行/列 头有效 |
| 行头宽度改变             | `S2Event.LAYOUT_RESIZE_ROW_WIDTH`  |                                             |
| 行头高度改变             | `S2Event.LAYOUT_RESIZE_ROW_HEIGHT` |                                             |
| 列头宽度改变             | `S2Event.LAYOUT_RESIZE_COL_WIDTH`  |                                             |
| 列头高度改变             | `S2Event.LAYOUT_RESIZE_COL_HEIGHT` |                                             |
| 树状结构宽度改变         | `S2Event.LAYOUT_RESIZE_TREE_WIDTH` | 树状模式下，单元格宽度发生改变时触发        |

### 布局

| 名称                     | 事件名                             | 描述                                        |
| ----------------------- | --------------------------------- | ------------------------------------------ |
| 表头布局完成                 | `S2Event.LAYOUT_AFTER_HEADER_LAYOUT`     | 行头和列头布局完成后触发                  |
| 数值单元格布局完成                | `S2Event.LAYOUT_AFTER_REAL_DATA_CELL_RENDER`  | 当前可视范围数值单元格渲染完成后触发 |
| 分页                 | `S2Event.LAYOUT_PAGINATION`       | 分页事件           |
| 列头展开                 | `S2Event.COL_CELL_EXPANDED`     | 列头展开时触发                  |
| 列头隐藏                 | `S2Event.COL_CELL_HIDDEN`       | 列头隐藏时触发                  |
| 开始渲染                 | `S2Event.LAYOUT_BEFORE_RENDER`       | 开始 render 前的事件，即 `s2.render()`                   |
| 渲染完成                 | `S2Event.LAYOUT_AFTER_RENDER`       | render 完成的事件，即 `s2.render()`                  |
| 表格销毁                 | `S2Event.LAYOUT_DESTROY`       | 表格销毁后或 调用 `s2.destroy()` 触发                  |
| 单元格渲染                 | `S2Event.LAYOUT_CELL_RENDER`       | 单个单元格布局渲染完成事件                  |

### 全局

| 名称      | 事件名                             | 描述                                         |
| -------- | --------------------------------- | ------------------------------------------- |
| 键盘按下  | `S2Event.GLOBAL_KEYBOARD_DOWN`     | 键盘按下                                     |
| 键盘松开  | `S2Event.GLOBAL_KEYBOARD_UP`       | 键盘松开                                     |
| 复制      | `S2Event.GLOBAL_COPIED`            | 对选中的单元格复制                           |
| 鼠标松开  | `S2Event.GLOBAL_MOUSE_UP`          | 图表区域鼠标松开                             |
| 点击      | `S2Event.GLOBAL_CLICK`             | 图表区域点击                                 |
| 右键      | `S2Event.GLOBAL_CONTEXT_MENU`      | 图表区域按下右键                             |
| 选中      | `S2Event.GLOBAL_SELECTED`          | 选中单元格时，如：刷选，多选，单选           |
| 悬停      | `S2Event.GLOBAL_HOVER`             | 鼠标悬停在单元格                             |
| 重置      | `S2Event.GLOBAL_RESET`             | 点击空白处，按下 Esc 键 重置交互样式时       |
| 链接跳转  | `S2Event.GLOBAL_LINK_FIELD_JUMP`   | 点击行列头被编辑为链接字段的文本时           |
| icon 点击 | `S2Event.GLOBAL_ACTION_ICON_CLICK` | 单元格右侧的操作 icon 点击时，比如：排序图标 |
| icon 悬停 | `S2Event.GLOBAL_ACTION_ICON_HOVER` | 单元格右侧的操作 icon 悬停时，比如：排序图标 |
| 滚动      | `S2Event.GLOBAL_SCROLL`            | 表格滚动 （含数值和行头单元格） |
